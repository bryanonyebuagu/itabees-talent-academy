import Stripe from "stripe";

export function stripeClient() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret?.startsWith("sk_test_")) throw new Error("Stripe test payments are not configured.");
  return new Stripe(secret);
}

export function paymentConfig() {
  if (!process.env.STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_") || !process.env.STRIPE_WEBHOOK_SECRET?.startsWith("whsec_")) throw new Error("Stripe test keys and webhook signing secret are required.");
  return { publishableKey: process.env.STRIPE_PUBLISHABLE_KEY };
}
export function respondError(response, error) {
  const setup = /not configured|required/.test(error.message || "");
  return response.status(setup ? 503 : 500).json({ error: setup ? error.message : "Payment service is temporarily unavailable." });
}
