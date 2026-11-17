# Stripe test payment setup

The training and donation checkout uses Stripe Payment Element. It only accepts `sk_test_` and `pk_test_` keys. Live keys are intentionally rejected.

Set `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `KV_REST_API_URL`, and `KV_REST_API_TOKEN` as **server-side** environment variables in Vercel. The KV variables must point to a persistent Upstash Redis-compatible REST database. Do not prefix them with `VITE_` or commit actual values.

Create a Stripe webhook for `https://<your-domain>/api/payments/webhook`. Subscribe to `payment_intent.succeeded`, `payment_intent.payment_failed`, and `payment_intent.canceled`. Copy its signing secret into `STRIPE_WEBHOOK_SECRET`. Enable Stripe email receipts in the test account if receipt email testing is required. The site shows a paid confirmation only after the signed success webhook updates its payment record.

The five registration fees in `src/data/checkoutPrograms.js` are sample USD amounts. Confirm actual offerings, fees, eligibility, currency, and availability before accepting real payments. Donation checkout supports one-time USD gifts only. No subscription billing or custom promo codes are configured.

For local end-to-end testing, run the site with Vercel's local development server and forward Stripe test webhooks to `/api/payments/webhook`. Use Stripe's published test cards to check successful and declined payments. An unsigned request, wrong amount, or duplicate webhook must never mark a payment paid. A returned browser URL by itself never marks a payment paid.
