import { randomUUID } from "node:crypto";
import { CHECKOUT_PROGRAMS } from "../../src/data/checkoutPrograms.js";
import { paymentConfig, respondError, stripeClient } from "../_lib/payments.js";
import { db } from "../_lib/firebase.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value, max = 120) => String(value || "").trim().slice(0, max);

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
    let amountCents, title, programId = "", duration = "";
    if (kind === "program") {
      const program = CHECKOUT_PROGRAMS.find(item => item.id === input.programId);
      if (!program) return response.status(400).json({ error: "Choose a valid program." });
      if (!clean(input.participantName) || !/^[+\d()\s-]{7,20}$/.test(clean(input.phone)) || !/^\d{1,2}$/.test(String(input.age || "")) || Number(input.age) < 5 || Number(input.age) > 25) return response.status(400).json({ error: "Enter the participant, phone number and age." });
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
    if (kind === "program") batch.set(database.collection("registrations").doc(intent.id), { email, guardianName: record.guardianName || name, participantName: record.participantName, age: record.age, phone: record.phone, programId, programName: title, duration, amountCents, reference, status: "payment_pending", createdAt: record.createdAt });
    await batch.commit();
    return response.status(200).json({ clientSecret: intent.client_secret, publishableKey, intentId: intent.id, accessToken, reference, amountCents, title });
  } catch (error) { return respondError(response, error); }
}
