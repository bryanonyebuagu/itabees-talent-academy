# Stripe test payment setup

The training and donation checkout uses Stripe Payment Element. It only accepts `sk_test_` and `pk_test_` keys. Live keys are intentionally rejected.

## Firebase account setup

Create a Firebase project, enable Email/Password under Authentication, and create a Firestore database. Register the website domain as an authorized Authentication domain. Use the Firebase web-app values for `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, and `VITE_FIREBASE_PROJECT_ID`; keep the Firebase service-account project ID, client email, and private key only in server environment variables. Deploy `firestore.rules` so browser clients cannot read personal records directly.

Sign up with the intended administrator email using a private password of at least eight characters, verify the email, set `ADMIN_EMAIL` to that address, then run `node --env-file=.env.local scripts/grant-admin.js` with the Firebase service-account variables in `.env.local`. Sign out and back in so the admin claim refreshes. The same verified account can inspect the member view without a paid program. No shared or hardcoded password is installed. Firebase does not accept a four-character password.

For local visual review before Firebase is connected, start `npm run dev`. At `/admin/login` or `/login`, use the `VITE_PREVIEW_EMAIL` and `VITE_PREVIEW_PASSWORD` values from your ignored `.env.local` for a development-only preview. Preview data is fictional and exists only in development. No public deployment grants this bypass or accepts that password.

Set `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` as **server-side** environment variables in Vercel. Set the three `VITE_FIREBASE_*` values from the Firebase web app configuration. Enable Email/Password sign-in and create a Firestore database. Never commit the actual service-account private key.

Create a Stripe webhook for `https://<your-domain>/api/payments/webhook`. Subscribe to `payment_intent.succeeded`, `payment_intent.payment_failed`, and `payment_intent.canceled`. Copy its signing secret into `STRIPE_WEBHOOK_SECRET`. Enable Stripe email receipts in the test account if receipt email testing is required. The site shows a paid confirmation only after the signed success webhook updates its payment record. A program registration then waits for an administrator to confirm the payment in Admin → Registrations; only approved registrations open member access.

The registration fees and durations in `src/data/checkoutPrograms.js` are samples. Confirm actual offerings, fees, durations, eligibility, currency, and availability before accepting real payments. Donation checkout supports one-time USD gifts only. No subscription billing or custom promo codes are configured.

For local end-to-end testing, run the site with Vercel's local development server and forward Stripe test webhooks to `/api/payments/webhook`. Use Stripe's published test cards to check successful and declined payments. An unsigned request, wrong amount, or duplicate webhook must never mark a payment paid. A returned browser URL by itself never marks a payment paid.

## Support mail

To email support requests to the academy and admin replies to members, verify a sending domain with Resend and set `RESEND_API_KEY`, `SUPPORT_FROM_EMAIL`, and `SUPPORT_TO_EMAIL`. Without these settings, member requests remain saved in the admin support inbox; the site does not claim an email was sent. The site guide is a free, local answer-and-link tool using published website information, not a paid AI service.
