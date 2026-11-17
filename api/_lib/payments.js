import Stripe from "stripe";

export function stripeClient() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret?.startsWith("sk_test_")) throw new Error("Stripe test payments are not configured.");
  return new Stripe(secret);
}

export function paymentConfig() {
  if (!process.env.STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_") || !process.env.STRIPE_WEBHOOK_SECRET?.startsWith("whsec_")) throw new Error("Stripe test keys and webhook signing secret are required.");
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) throw new Error("Payment record storage is not configured.");
  return { publishableKey: process.env.STRIPE_PUBLISHABLE_KEY };
}

export async function redis(command) {
  const response = await fetch(process.env.KV_REST_API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  const body = await response.json();
  if (!response.ok || body.error) throw new Error("Payment record storage failed.");
  return body.result;
}

export const recordKey = id => `itabees:payment:${id}`;
export function respondError(response, error) {
  const setup = /not configured|required/.test(error.message || "");
  return response.status(setup ? 503 : 500).json({ error: setup ? error.message : "Payment service is temporarily unavailable." });
}
