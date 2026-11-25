import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { applyPaymentEvent } from "../api/_lib/paymentEvent.js";
import webhook from "../api/payments/webhook.js";

function fakeDatabase(seed) {
  const collections = { payments: new Map([["pi_test123", seed]]), stripeEvents: new Map(), registrations: new Map() };
  const database = { collection(name) { return { doc(id) { return { name, id }; } }; }, async runTransaction(callback) { const transaction = { async get(ref) { return { exists: collections[ref.name].has(ref.id), data: () => collections[ref.name].get(ref.id) }; }, update(ref, changes) { collections[ref.name].set(ref.id, { ...collections[ref.name].get(ref.id), ...changes }); }, set(ref, value) { collections[ref.name].set(ref.id, value); }, create(ref, value) { if (collections[ref.name].has(ref.id)) throw new Error("duplicate"); collections[ref.name].set(ref.id, value); } }; return callback(transaction); } };
  return { database, collections };
}

const payment = { reference: "ref-test", kind: "program", title: "Player Development Academy", programId: "player-development", duration: "12 weeks (sample)", amountCents: 4500, currency: "usd", email: "parent@example.com", name: "Parent Test", participantName: "Player Test", age: 12, phone: "5028074444", status: "pending" };
const event = (id, type, amount = 4500) => ({ id, type, data: { object: { id: "pi_test123", amount, currency: "usd", metadata: { reference: "ref-test" } } } });

test("webhook processing rejects wrong amounts and handles failure, success, duplicates, and late failure", async () => {
  const { database, collections } = fakeDatabase(payment);
  await assert.rejects(applyPaymentEvent(database, event("bad", "payment_intent.succeeded", 4400)), /mismatch/);
  assert.equal(collections.payments.get("pi_test123").status, "pending");
  assert.equal(await applyPaymentEvent(database, event("failed", "payment_intent.payment_failed")), "failed");
  assert.equal(collections.payments.get("pi_test123").status, "failed");
  assert.equal(await applyPaymentEvent(database, event("success", "payment_intent.succeeded")), "paid");
  assert.equal(collections.payments.get("pi_test123").status, "paid");
  assert.equal(collections.registrations.get("pi_test123").status, "awaiting_admin");
  assert.equal(collections.registrations.get("pi_test123").duration, "12 weeks (sample)");
  assert.equal(await applyPaymentEvent(database, event("success", "payment_intent.succeeded")), "duplicate");
  await applyPaymentEvent(database, event("late", "payment_intent.payment_failed"));
  assert.equal(collections.payments.get("pi_test123").status, "paid");
});

test("unsigned webhook request is rejected before database access", async () => {
  const previous = { secret: process.env.STRIPE_SECRET_KEY, publishable: process.env.STRIPE_PUBLISHABLE_KEY, webhook: process.env.STRIPE_WEBHOOK_SECRET };
  process.env.STRIPE_SECRET_KEY = "sk_test_example";
  process.env.STRIPE_PUBLISHABLE_KEY = "pk_test_example";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_example";
  const request = Readable.from([Buffer.from(JSON.stringify(event("unsigned", "payment_intent.succeeded")))]);
  request.method = "POST";
  request.headers = { "stripe-signature": "bad" };
  const response = { code: 200, status(value) { this.code = value; return this; }, json() { return this; }, end() { return this; } };
  try { await webhook(request, response); assert.equal(response.code, 400); }
  finally { if (previous.secret === undefined) delete process.env.STRIPE_SECRET_KEY; else process.env.STRIPE_SECRET_KEY = previous.secret; if (previous.publishable === undefined) delete process.env.STRIPE_PUBLISHABLE_KEY; else process.env.STRIPE_PUBLISHABLE_KEY = previous.publishable; if (previous.webhook === undefined) delete process.env.STRIPE_WEBHOOK_SECRET; else process.env.STRIPE_WEBHOOK_SECRET = previous.webhook; }
});

test("a repeated success event preserves an already approved registration", async () => {
  const { database, collections } = fakeDatabase(payment);
  await applyPaymentEvent(database, event("first", "payment_intent.succeeded"));
  collections.registrations.get("pi_test123").status = "active";
  await applyPaymentEvent(database, event("second", "payment_intent.succeeded"));
  assert.equal(collections.registrations.get("pi_test123").status, "active");
});
