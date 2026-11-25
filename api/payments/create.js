import { randomUUID } from "node:crypto";
import { CHECKOUT_PROGRAMS } from "../../src/data/checkoutPrograms.js";
import { paymentConfig, respondError, stripeClient } from "../_lib/payments.js";
import { db } from "../_lib/firebase.js";
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
    const database = db();
    const intent = await stripe.paymentIntents.create({ amount: amountCents, currency: "usd", automatic_payment_methods: { enabled: true }, receipt_email: email, description: title, metadata: { reference, kind, programId } }, { idempotencyKey: reference });
    record.intentId = intent.id;
    const batch = database.batch();
    batch.set(database.collection("payments").doc(intent.id), record);
    if (kind === "program") batch.set(database.collection("registrations").doc(intent.id), { ...registration, programId, programName: title, duration, amountCents, reference, status: "payment_pending", createdAt: record.createdAt });
    await batch.commit();
    return response.status(200).json({ clientSecret: intent.client_secret, publishableKey, intentId: intent.id, accessToken, reference, amountCents, title });
  } catch (error) { return respondError(response, error); }
}
