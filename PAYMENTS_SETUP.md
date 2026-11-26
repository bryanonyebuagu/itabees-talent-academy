# Stripe payment setup

Training and donation checkout use Stripe Payment Element. Matching test keys (`sk_test_` and `pk_test_`) run without real charges. Matching live keys (`sk_live_` and `pk_live_`) require `STRIPE_LIVE_ENABLED=true` and working registration email settings. Never combine test and live keys.

## Firebase account setup

Create a Firebase project, enable Email/Password under Authentication, and create a Firestore database. Register the website domain as an authorized Authentication domain. Use the Firebase web-app values for `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, and `VITE_FIREBASE_PROJECT_ID`; keep the Firebase service-account project ID, client email, and private key only in server environment variables. Deploy `firestore.rules` so browser clients cannot read personal records directly.

Create the administrator account in Firebase Authentication with a private password of at least eight characters and verify the email, set `ADMIN_EMAIL` to that address, then run `node --env-file=.env.local scripts/grant-admin.js` with the Firebase service-account variables in `.env.local`. Sign out and back in so the admin claim refreshes. The same verified account can inspect the member view without a paid program. No shared or hardcoded password is installed. Firebase does not accept a four-character password.

For local visual review before Firebase is connected, start `npm run dev`. At `/admin/login` or `/login`, use the `VITE_PREVIEW_EMAIL` and `VITE_PREVIEW_PASSWORD` values from your ignored `.env.local` for a development-only preview. Preview data is fictional and exists only in development. No public deployment grants this bypass or accepts that password.

Set `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` as **server-side** environment variables in Vercel. Set the three `VITE_FIREBASE_*` values from the Firebase web app configuration. Enable Email/Password sign-in and create a Firestore database. Never commit the actual service-account private key. Keep `STRIPE_LIVE_ENABLED=false` until the full test flow and email delivery have been verified.

Create a Stripe webhook for `https://www.itabeestalentacademy.com/api/payments/webhook`. Subscribe to `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`, `invoice.paid`, `invoice.payment_failed`, and `customer.subscription.deleted`. Copy its signing secret into `STRIPE_WEBHOOK_SECRET`. Test and live webhooks have different signing secrets. Enable Stripe email receipts as needed. The site shows a paid confirmation only after the signed success webhook updates its payment record. A new parent or guardian can set up their login after payment. An administrator still approves program access in Admin → Registrations.

The registration page shows the published USD prices from the academy pricing sheet. Monthly supplemental plans create Stripe subscriptions and renew automatically. A second child under the same verified guardian email receives $10 off the monthly price, shown before payment; later additional children also receive the sibling discount. One-on-one training and mentorship are one-time payments. Camps and international trips show pricing when announced. Donation checkout supports one-time USD gifts only. In the Stripe Dashboard, configure the customer portal to let families update payment methods and cancel subscriptions.

The five-step registration includes a participation waiver adapted from the clinic form. Have the final wording reviewed by a qualified North Carolina attorney before accepting live registrations. The photo and future-contact choices are recorded separately and do not prevent participation when declined.

For local end-to-end testing, run the site with Vercel's local development server and forward Stripe test webhooks to `/api/payments/webhook`. Use Stripe's published test cards to check successful and declined payments, renewal invoices, a second-child discount, and cancellation through the customer portal. An unsigned request, wrong amount, or duplicate webhook must never mark a payment paid. A returned browser URL by itself never marks a payment paid. Before live activation, configure a separate live webhook, replace all three Stripe values with their live counterparts, verify the Resend sender domain, then set `STRIPE_LIVE_ENABLED=true` and redeploy.

## Support mail

To email support requests to the academy and admin replies to members, verify a sending domain with Resend and set `RESEND_API_KEY`, `SUPPORT_FROM_EMAIL`, and `SUPPORT_TO_EMAIL`. Without these settings, member requests remain saved in the admin support inbox; the site does not claim an email was sent. The site guide is a free, local answer-and-link tool using published website information, not a paid AI service.

## Program registration email

Set `PUBLIC_SITE_URL` to the website origin for the environment that processes Stripe webhooks, and configure `RESEND_API_KEY` and `SUPPORT_FROM_EMAIL` with a verified sender. Enable Firestore TTL on the `expiresAt` field for the `registrationDrafts` and `registrationEmailLimits` collection groups to remove expired drafts and delivery limits.

In a test deployment, submit a registration using an inbox you control. Follow the verification link to resume checkout, complete a Stripe test payment, and use the emailed setup link. Confirm that the verified address is locked and the new password works on the login page. Sign in with an existing account after a second registration and confirm that donations still complete without creating a login.
