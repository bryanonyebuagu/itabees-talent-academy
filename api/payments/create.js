import { createHash, randomUUID } from "node:crypto";
import { CHECKOUT_PROGRAMS } from "../../src/data/checkoutPrograms.js";
import { paymentConfig, respondError, stripeClient } from "../_lib/payments.js";
import { db } from "../_lib/firebase.js";
import { registrationLink, sendSupportEmail } from "../_lib/mail.js";
import { PROGRAM_INTERESTS } from "../../src/data/registrationForm.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value, max = 120) => String(value || "").trim().slice(0, max);
function registrationAnswers(input, email, name) {
  const birthDate = clean(input.birthDate, 10);
  const date = new Date(`${birthDate}T12:00:00Z`);
  const today = new Date();
  const age = today.getUTCFullYear() - date.getUTCFullYear() - (today.getUTCMonth() < date.getUTCMonth() || today.getUTCMonth() === date.getUTCMonth() && today.getUTCDate() < date.getUTCDate() ? 1 : 0);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || Number.isNaN(date.getTime()) || age !== Number(input.age) || age < 4 || age > 18) throw new Error("Enter a valid player birth date and age.");
  if (!clean(input.participantName) || !/^[+\d()\s-]{7,20}$/.test(clean(input.phone)) || !clean(input.address) || !clean(input.city) || !clean(input.state) || !clean(input.zip, 20)) throw new Error("Complete the player and guardian contact details.");
  if (!["Boy", "Girl"].includes(input.gender) || input.waiverAccepted !== true || clean(input.signature).toLowerCase() !== name.toLowerCase() || !/^\d{4}-\d{2}-\d{2}$/.test(clean(input.agreementDate, 10))) throw new Error("Complete the participation waiver and signature.");
  if (!["yes", "no"].includes(input.photoPermission) || !["Yes", "No"].includes(input.futureContact)) throw new Error("Choose your photo and communication preferences.");
  const interests = Array.isArray(input.interests) ? input.interests.filter(item => PROGRAM_INTERESTS.includes(item)).slice(0, PROGRAM_INTERESTS.length) : [];
  return { guardianName: name, email, secondaryEmail: clean(input.secondaryEmail, 254), phone: clean(input.phone, 30), secondaryPhone: clean(input.secondaryPhone, 30), address: clean(input.address, 250), city: clean(input.city), state: clean(input.state), zip: clean(input.zip, 20), participantName: clean(input.participantName), birthDate, age, gender: input.gender, waiverAccepted: true, signature: clean(input.signature), agreementDate: clean(input.agreementDate, 10), photoPermission: input.photoPermission, futureContact: input.futureContact, interests, comments: clean(input.comments, 2000) };
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  try {
    const { publishableKey } = paymentConfig();
    const stripe = stripeClient();
    const input = request.body || {};
    const database = db();
    if (input.resumeToken) {
      if (!/^[0-9a-f-]{36}$/.test(input.resumeToken)) return response.status(400).json({ error: "Invalid registration link." });
      const draftRef = database.collection("registrationDrafts").doc(createHash("sha256").update(input.resumeToken).digest("hex"));
      const draft = (await draftRef.get()).data();
      if (!draft || draft.expiresAt.toMillis() < Date.now()) return response.status(410).json({ error: "This registration link has expired. Start a new registration or contact ItaBEES if you already paid." });
      const { record, registration } = draft;
      const intent = await stripe.paymentIntents.create({ amount: record.amountCents, currency: record.currency, automatic_payment_methods: { enabled: true }, receipt_email: record.email, description: record.title, metadata: { reference: record.reference, kind: record.kind, programId: record.programId } }, { idempotencyKey: record.reference });
      await database.runTransaction(async transaction => {
        const paymentRef = database.collection("payments").doc(intent.id);
        if ((await transaction.get(paymentRef)).exists) return;
        transaction.create(paymentRef, { ...record, intentId: intent.id });
        transaction.create(database.collection("registrations").doc(intent.id), { ...registration, programId: record.programId, programName: record.title, duration: record.duration, amountCents: record.amountCents, reference: record.reference, status: "payment_pending", createdAt: record.createdAt });
      });
      return response.status(200).json({ clientSecret: intent.client_secret, publishableKey, intentId: intent.id, accessToken: record.accessToken, reference: record.reference, amountCents: record.amountCents, programId: record.programId, paid: intent.status === "succeeded" || intent.status === "processing" });
    }
    const kind = input.kind === "donation" ? "donation" : input.kind === "program" ? "program" : null;
    const email = clean(input.email, 254).toLowerCase();
    const name = clean(input.name);
    if (!kind || !name || !emailPattern.test(email)) return response.status(400).json({ error: "Enter a name and valid email address." });
    let amountCents, title, programId = "", duration = "", registration = null;
    if (kind === "program") {
      const program = CHECKOUT_PROGRAMS.find(item => item.id === input.programId);
      if (!program) return response.status(400).json({ error: "Choose a valid program." });
      try { registration = registrationAnswers(input, email, name); } catch (error) { return response.status(400).json({ error: error.message }); }
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
    const record = { reference, accessToken, kind, title, programId, duration, amountCents, currency: "usd", email, name, participantName: kind === "program" ? clean(input.participantName) : "", guardianName: kind === "program" ? clean(input.guardianName) : "", age: kind === "program" ? Number(input.age) : null, phone: clean(input.phone, 30), anonymous: kind === "donation" && input.anonymous === true, status: "pending", createdAt: new Date().toISOString() };
    if (kind === "program") {
      const token = randomUUID();
      record.setupToken = randomUUID();
      const link = registrationLink("/checkout", { program: programId }, token);
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
      if (!allowed) return response.status(429).json({ error: "Wait a minute before requesting another registration email." });
      await sendSupportEmail({ to: email, subject: "Verify your ItaBEES registration email", text: `Verify your email and continue to payment for ${title}: ${link}`, idempotencyKey: `registration-${reference}` });
      return response.status(202).json({ verificationSent: true });
    }
    const intent = await stripe.paymentIntents.create({ amount: amountCents, currency: "usd", automatic_payment_methods: { enabled: true }, receipt_email: email, description: title, metadata: { reference, kind, programId } }, { idempotencyKey: reference });
    record.intentId = intent.id;
    await database.collection("payments").doc(intent.id).set(record);
    return response.status(200).json({ clientSecret: intent.client_secret, publishableKey, intentId: intent.id, accessToken, reference, amountCents, title });
  } catch (error) { return respondError(response, error); }
}
