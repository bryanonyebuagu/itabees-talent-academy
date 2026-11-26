import Stripe from "stripe";

export function stripeClient() {
  const { secret } = paymentConfig();
  return new Stripe(secret);
}

export function paymentConfig() {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY?.trim();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const live = /^(sk|rk)_live_/.test(secret || "") && publishableKey?.startsWith("pk_live_");
  const test = /^(sk|rk)_test_/.test(secret || "") && publishableKey?.startsWith("pk_test_");
  if (!/^(sk|rk)_(live|test)_/.test(secret || "")) throw new Error("A valid Stripe server key is required in STRIPE_SECRET_KEY.");
  if (!/^pk_(live|test)_/.test(publishableKey || "")) throw new Error("A valid publishable key is required in STRIPE_PUBLISHABLE_KEY.");
  if (!live && !test) throw new Error("Matching Stripe keys are required: both must use the same live or test mode.");
  if (!webhookSecret?.startsWith("whsec_")) throw new Error("A webhook signing secret is required in STRIPE_WEBHOOK_SECRET.");
  if (live && process.env.STRIPE_LIVE_ENABLED !== "true") throw new Error("Live Stripe payments are not enabled.");
  if (live && (!process.env.RESEND_API_KEY || !process.env.SUPPORT_FROM_EMAIL || !process.env.PUBLIC_SITE_URL)) throw new Error("Registration email must be configured before live payments are enabled.");
  return { secret, publishableKey, mode: live ? "live" : "test" };
}
export function respondError(response, error) {
  const setup = /not configured|required|not enabled|must be configured/.test(error.message || "");
  return response.status(setup ? 503 : 500).json({ error: setup ? error.message : "Payment service is temporarily unavailable." });
}
