import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import Stripe from "stripe";
import webhook from "../api/payments/webhook.js";
import status from "../api/payments/status.js";
import { CHECKOUT_PROGRAMS } from "../src/data/checkoutPrograms.js";

const stripe = new Stripe("sk_test_example");
const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

function response() {
  return { code: 200, payload: null, status(code) { this.code = code; return this; }, json(payload) { this.payload = payload; return this; }, end() { return this; }, setHeader() {} };
}

test("signed success is recorded once; invalid signatures and unmatched amounts are rejected", async () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_example";
  process.env.STRIPE_PUBLISHABLE_KEY = "pk_test_example";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_example";
  process.env.KV_REST_API_URL = "https://example.invalid";
  process.env.KV_REST_API_TOKEN = "test";
  const store = new Map();
  const intentId = "pi_test123";
  const token = "12345678-1234-1234-1234-123456789abc";
  const record = { intentId, accessToken: token, reference: "ref-test", kind: "program", title: CHECKOUT_PROGRAMS[0].name, amountCents: CHECKOUT_PROGRAMS[0].amountCents, currency: "usd", email: "parent@example.com", participantName: "Player Test", status: "pending" };
  store.set(`itabees:payment:${intentId}`, JSON.stringify(record));
  globalThis.fetch = async (_url, options) => {
    const [command, key, value] = JSON.parse(options.body);
    if (command === "GET") return { ok: true, json: async () => ({ result: store.get(key) ?? null }) };
    if (command === "SET") { if (JSON.parse(options.body).includes("NX") && store.has(key)) return { ok: true, json: async () => ({ result: null }) }; store.set(key, value); return { ok: true, json: async () => ({ result: "OK" }) }; }
    if (command === "DEL") { store.delete(key); return { ok: true, json: async () => ({ result: 1 }) }; }
    throw new Error(`Unexpected Redis command: ${command}`);
  };
  const event = (id, amount, type = "payment_intent.succeeded") => JSON.stringify({ id, object: "event", type, data: { object: { id: intentId, object: "payment_intent", amount, currency: "usd", metadata: { reference: "ref-test" } } } });
  const send = async (body, signature) => { const req = Readable.from([Buffer.from(body)]); req.method = "POST"; req.headers = { "stripe-signature": signature }; const res = response(); await webhook(req, res); return res; };
  try {
    let body = event("evt_bad", record.amountCents);
    assert.equal((await send(body, "bad-signature")).code, 400);
    assert.equal(JSON.parse(store.get(`itabees:payment:${intentId}`)).status, "pending");
    body = event("evt_wrong_amount", record.amountCents - 100);
    let signature = stripe.webhooks.generateTestHeaderString({ payload: body, secret: process.env.STRIPE_WEBHOOK_SECRET });
    assert.equal((await send(body, signature)).code, 400);
    body = event("evt_failed", record.amountCents, "payment_intent.payment_failed");
    signature = stripe.webhooks.generateTestHeaderString({ payload: body, secret: process.env.STRIPE_WEBHOOK_SECRET });
    assert.equal((await send(body, signature)).code, 200);
    assert.equal(JSON.parse(store.get(`itabees:payment:${intentId}`)).status, "failed");
    body = event("evt_success", record.amountCents);
    signature = stripe.webhooks.generateTestHeaderString({ payload: body, secret: process.env.STRIPE_WEBHOOK_SECRET });
    assert.equal((await send(body, signature)).code, 200);
    assert.equal((await send(body, signature)).code, 200);
    assert.equal(JSON.parse(store.get(`itabees:payment:${intentId}`)).status, "paid");
    body = event("evt_late_failure", record.amountCents, "payment_intent.payment_failed");
    signature = stripe.webhooks.generateTestHeaderString({ payload: body, secret: process.env.STRIPE_WEBHOOK_SECRET });
    assert.equal((await send(body, signature)).code, 200);
    assert.equal(JSON.parse(store.get(`itabees:payment:${intentId}`)).status, "paid");
    const unauthorized = response(); await status({ method: "GET", query: { id: intentId, token: "00000000-0000-0000-0000-000000000000" } }, unauthorized);
    assert.equal(unauthorized.code, 403);
    const authorized = response(); await status({ method: "GET", query: { id: intentId, token } }, authorized);
    assert.equal(authorized.payload.status, "paid");
    assert.equal(authorized.payload.accessToken, undefined);
  } finally { globalThis.fetch = originalFetch; process.env = originalEnv; }
});
