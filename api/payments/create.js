import { createHash, randomUUID } from "node:crypto";
import { CHECKOUT_PROGRAMS } from "../../src/data/checkoutPrograms.js";
import { paymentConfig, respondError, stripeClient } from "../_lib/payments.js";
import { db } from "../_lib/firebase.js";
import { PROGRAM_INTERESTS } from "../../src/data/registrationForm.js";

const ACADEMY_NAME = "ItaBEES Talent Academy";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value, max = 120) => String(value || "").trim().slice(0, max);
async function siblingPrice(database, record, program) {
  if (program.duration !== "Monthly") return program.amountCents;
  const registrations = await database.collection("registrations").where("email", "==", record.email).get();
  const otherChild = registrations.docs.some(doc => {
    const item = doc.data();
    return item.subscriptionId && item.paidAt && !["canceled", "billing_past_due"].includes(item.status) &&
      item.participantName?.trim().toLowerCase() !== record.participantName.trim().toLowerCase();
  });
  return program.amountCents - (otherChild ? (program.siblingDiscountCents || 0) : 0);
}
export function registrationAnswers(input, email, name) {
  const birthDate = clean(input.birthDate, 10);
  const date = new Date(`${birthDate}T12:00:00Z`);
  const today = new Date();
  const age = today.getUTCFullYear() - date.getUTCFullYear() - (today.getUTCMonth() < date.getUTCMonth() || today.getUTCMonth() === date.getUTCMonth() && today.getUTCDate() < date.getUTCDate() ? 1 : 0);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || Number.isNaN(date.getTime()) || age < 4 || age > 18) throw new Error("Enter a valid player birth date (ages 4 to 18).");
  if (!clean(input.participantName) || !/^[+\d()\s-]{7,20}$/.test(clean(input.phone)) || !clean(input.address) || !clean(input.city) || !clean(input.state) || !clean(input.zip, 20)) throw new Error("Complete the player and guardian contact details.");
  if (!["Boy", "Girl"].includes(input.gender) || input.waiverAccepted !== true) throw new Error("Agree to the Participation Waiver and Release before submitting.");
  const interests = Array.isArray(input.interests) ? input.interests.filter(item => PROGRAM_INTERESTS.includes(item)).slice(0, PROGRAM_INTERESTS.length) : [];
  return { guardianName: name, email, secondaryEmail: clean(input.secondaryEmail, 254), phone: clean(input.phone, 30), secondaryPhone: clean(input.secondaryPhone, 30), address: clean(input.address, 250), city: clean(input.city), state: clean(input.state), zip: clean(input.zip, 20), participantName: clean(input.participantName), birthDate, age, gender: input.gender, waiverAccepted: true, consentMethod: "checkbox", agreementDate: new Date().toISOString().slice(0,10), photoPermission: null, futureContact: null, interests, comments: clean(input.comments, 2000) };
}

export function createPaymentHandler({ databaseProvider = db, configProvider = paymentConfig, stripeProvider = stripeClient } = {}) { return async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  try {
    const { publishableKey, mode } = configProvider();
    const stripe = stripeProvider();
    const input = request.body || {};
    if (input.applicationType === "financial-assistance") return response.status(400).json({ error: "Submit financial assistance through the assistance application form. Payment is not required." });
    const database = databaseProvider();
    if (input.resumeToken) {
      if (!/^[0-9a-f-]{36}$/.test(input.resumeToken)) return response.status(400).json({ error: "Invalid registration link." });
      const draftRef = database.collection("registrationDrafts").doc(createHash("sha256").update(input.resumeToken).digest("hex"));
      const draft = (await draftRef.get()).data();
      if (!draft || draft.expiresAt.toMillis() < Date.now()) return response.status(410).json({ error: "This registration link has expired. Start a new registration or contact ItaBEES if you already paid." });
      const { record, registration } = draft;
      const program = CHECKOUT_PROGRAMS.find(item => item.id === record.programId);
      const amountCents = draft.checkoutAmountCents ?? await siblingPrice(database, record, program);
      if (draft.checkoutAmountCents === undefined) await draftRef.update({ checkoutAmountCents: amountCents });
      record.amountCents = amountCents;
      let intent, clientSecret;
      if (program.duration === "Monthly") {
        const emailHash = createHash("sha256").update(record.email).digest("hex");
        const customerRef = database.collection("stripeCustomers").doc(`${mode}-${emailHash}`);
        const existingCustomer = await customerRef.get();
        const customer = existingCustomer.exists ? { id: existingCustomer.data().id } : await stripe.customers.create({ email: record.email }, { idempotencyKey: `guardian-${emailHash}` });
        if (!existingCustomer.exists) await customerRef.create({ id: customer.id, email: record.email });
        const productRef = database.collection("stripeProducts").doc(`${mode}-${program.id}`);
        const existingProduct = await productRef.get();
        const product = existingProduct.exists ? await stripe.products.update(existingProduct.data().id, { name: `${ACADEMY_NAME} · ${program.name} · ${program.description}` }) : await stripe.products.create({ name: `${ACADEMY_NAME} · ${program.name} · ${program.description}`, metadata: { programId: program.id } }, { idempotencyKey: `program-${program.id}` });
        if (!existingProduct.exists) await productRef.create({ id: product.id, programId: program.id });
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          description: `${ACADEMY_NAME} · ${record.title}`,
          items: [{ price_data: { currency: "usd", product: product.id, unit_amount: amountCents, recurring: { interval: "month" } } }],
          payment_behavior: "default_incomplete",
          payment_settings: { save_default_payment_method: "on_subscription", payment_method_types: ["card"] },
          metadata: { reference: record.reference, programId: program.id, participantName: record.participantName },
          expand: ["latest_invoice.confirmation_secret"],
        }, { idempotencyKey: record.reference });
        const invoice = subscription.latest_invoice;
        clientSecret = invoice?.confirmation_secret?.client_secret;
        const intentId = clientSecret?.split("_secret_")[0];
        if (!clientSecret || !/^pi_[A-Za-z0-9]+$/.test(intentId)) throw new Error("Subscription payment could not be prepared.");
        intent = { id: intentId, status: "requires_payment_method" };
        record.subscriptionId = subscription.id;
        record.customerId = customer.id;
      } else {
        intent = await stripe.paymentIntents.create({ amount: amountCents, currency: record.currency, automatic_payment_methods: { enabled: true }, receipt_email: record.email, description: `${ACADEMY_NAME} · ${record.title}`, metadata: { reference: record.reference, kind: record.kind, programId: record.programId } }, { idempotencyKey: record.reference });
        clientSecret = intent.client_secret;
      }
      await database.runTransaction(async transaction => {
        const paymentRef = database.collection("payments").doc(intent.id);
        if ((await transaction.get(paymentRef)).exists) return;
        transaction.create(paymentRef, { ...record, intentId: intent.id });
        transaction.create(database.collection("registrations").doc(intent.id), { ...registration, programId: record.programId, programName: record.title, duration: record.duration, amountCents, reference: record.reference, subscriptionId: record.subscriptionId || null, status: "payment_pending", createdAt: record.createdAt });
      });
      return response.status(200).json({ clientSecret, publishableKey, mode, intentId: intent.id, accessToken: record.accessToken, reference: record.reference, amountCents, recurring: Boolean(record.subscriptionId), programId: record.programId, paid: intent.status === "succeeded" || intent.status === "processing" });
    }
    const kind = input.kind === "donation" ? "donation" : input.kind === "program" ? "program" : null;
    const email = clean(input.email, 254).toLowerCase();
    const name = clean(input.name);
    if (!kind || !name || !emailPattern.test(email)) return response.status(400).json({ error: "Enter a name and valid email address." });
    let amountCents, title, programId = "", duration = "", registration = null;
    if (kind === "program") {
      const program = CHECKOUT_PROGRAMS.find(item => item.id === input.programId);
      if (!program) return response.status(400).json({ error: "Choose a valid program." });
      try {
        registration = registrationAnswers(input, email, name);
        if (input.applicationType) {
          if (!["financial-assistance", "supplemental-training"].includes(input.applicationType)) throw new Error("Choose a valid application type.");
          const application = {};
          const fields = ["club", "jerseySize", "existingParticipant", "emergencyName", "emergencyRelationship", "emergencyPhone", "medicalConditions", "medications", "allergies", "goals"];
          for (const key of fields) application[key] = clean(input[key], 2000);
          if (["emergencyName", "emergencyRelationship", "emergencyPhone"].some(key => !application[key])) throw new Error("Complete the emergency contact information.");
          if (!["Youth XS", "Youth S", "Youth M", "Youth L", "Youth XL", "Adult S", "Adult M", "Adult L", "Adult XL", "Adult XXL"].includes(application.jerseySize) || !["Yes", "No"].includes(application.existingParticipant)) throw new Error("Select a jersey size and existing participant status.");
          registration.applicationType = input.applicationType;
          registration.application = application;
        }
      } catch (error) { return response.status(400).json({ error: error.message }); }
      amountCents = program.amountCents;
      title = program.name;
      programId = program.id;
      duration = program.duration;
    } else {
      // Require exact cents and apply an independent server-side range check.
      const amount = Number(input.amountCents);
      if (!Number.isSafeInteger(amount) || amount < 200 || amount > 100000000) return response.status(400).json({ error: "Enter a donation between $2 and $1,000,000." });
      amountCents = amount;
      title = "ItaBEES Talent Academy donation";
    }
    const reference = randomUUID();
    const accessToken = randomUUID();
    const record = { reference, accessToken, kind, title, programId, duration, amountCents, currency: "usd", email, name, participantName: kind === "program" ? clean(input.participantName) : "", guardianName: kind === "program" ? clean(input.guardianName) : "", age: kind === "program" ? registration.age : null, phone: clean(input.phone, 30), anonymous: kind === "donation" && input.anonymous === true, status: "pending", createdAt: new Date().toISOString() };
    if (kind === "program") {
      const token = randomUUID();
      record.setupToken = randomUUID();
      const draftRef = database.collection("registrationDrafts").doc(createHash("sha256").update(token).digest("hex"));
      const deliveryRef = database.collection("registrationEmailLimits").doc(createHash("sha256").update(email).digest("hex"));
      const allowed = await database.runTransaction(async transaction => {
        const now = Date.now();
        const lastDelivery = (await transaction.get(deliveryRef)).data();
        if (lastDelivery && lastDelivery.expiresAt.toMillis() > now) return false;
        transaction.set(deliveryRef, { expiresAt: new Date(now + 60_000) });
        transaction.create(draftRef, { record, registration, expiresAt: new Date(now + 23 * 60 * 60 * 1000) });
        return true;
      });
      if (!allowed) return response.status(429).json({ error: "Please wait a minute before starting another registration." });
      // Prepare checkout immediately; retain draft tokens for safe retries and older email links.
      return handler({ ...request, body: { resumeToken: token }, method: "POST" }, response);
    }
    const intent = await stripe.paymentIntents.create({ amount: amountCents, currency: "usd", automatic_payment_methods: { enabled: true }, receipt_email: email, description: title.includes(ACADEMY_NAME) ? title : `${ACADEMY_NAME} · ${title}`, metadata: { reference, kind, programId } }, { idempotencyKey: reference });
    record.intentId = intent.id;
    await database.collection("payments").doc(intent.id).set(record);
    return response.status(200).json({ clientSecret: intent.client_secret, publishableKey, mode, intentId: intent.id, accessToken, reference, amountCents, title });
  } catch (error) { return respondError(response, error); }
}; }
export default createPaymentHandler();
