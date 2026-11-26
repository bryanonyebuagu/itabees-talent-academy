import test from "node:test";
import assert from "node:assert/strict";
import { paymentConfig } from "../api/_lib/payments.js";

test("Stripe keys must match, and live payments need explicit activation and mail", () => {
  const names = ["STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_LIVE_ENABLED", "RESEND_API_KEY", "SUPPORT_FROM_EMAIL", "PUBLIC_SITE_URL"];
  const saved = Object.fromEntries(names.map(name => [name, process.env[name]]));
  try {
    Object.assign(process.env, { STRIPE_SECRET_KEY: "sk_test_example", STRIPE_PUBLISHABLE_KEY: "pk_test_example", STRIPE_WEBHOOK_SECRET: "whsec_example" });
    assert.equal(paymentConfig().mode, "test");
    process.env.STRIPE_SECRET_KEY = "rk_test_example";
    assert.equal(paymentConfig().mode, "test");
    process.env.STRIPE_PUBLISHABLE_KEY = "pk_live_example";
    assert.throws(paymentConfig, /Matching Stripe keys/);
    process.env.STRIPE_SECRET_KEY = "sk_live_example";
    assert.throws(paymentConfig, /not enabled/);
    process.env.STRIPE_LIVE_ENABLED = "true";
    delete process.env.RESEND_API_KEY;
    assert.throws(paymentConfig, /Registration email/);
    Object.assign(process.env, { RESEND_API_KEY: "re_test", SUPPORT_FROM_EMAIL: "support@example.com", PUBLIC_SITE_URL: "https://example.com" });
    assert.equal(paymentConfig().mode, "live");
    process.env.STRIPE_SECRET_KEY = "rk_live_example";
    assert.equal(paymentConfig().mode, "live");
    process.env.STRIPE_LIVE_ENABLED = "false";
    assert.throws(paymentConfig, /not enabled/);
    process.env.STRIPE_PUBLISHABLE_KEY = "pk_test_example";
    assert.throws(paymentConfig, /Matching Stripe keys/);
  } finally {
    for (const name of names) { if (saved[name] === undefined) delete process.env[name]; else process.env[name] = saved[name]; }
  }
});
