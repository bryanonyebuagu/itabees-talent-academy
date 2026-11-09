# ItaBEES Talent Academy website

Desktop-first React and Vite website for ItaBEES Talent Academy. The project includes the homepage, academy and program pages, contact and registration forms, and a donation checkout interface.

## Run locally

```bash
npm install
npm run dev
```

Build and check the project with `npm run build` and `npm run lint`.

## Dashboard previews

The app also includes separate admin and member interfaces. Open `/admin/login` or `/login`, then use the labelled demo access button. `/signup` and `/forgot-password` are frontend previews. No credentials are verified, no account is created, and no messages are sent.

The admin area includes enquiries, player and guardian records, programmes, training, a timetable builder, events, coaches, donations, messages, staff and settings. The member area shows programme and training information filtered to the selected demo player. Changes to programmes, sessions, events and statuses live only in React state and reset on reload. All names and figures in these areas are fictional demonstration data.

## Integrations

Donation amounts are shown in USD and visitors can enter their own amount. Card payments require a secure Paystack backend. Set `VITE_PAYSTACK_SESSION_ENDPOINT` to an endpoint that starts a transaction and returns `authorization_url`; set `VITE_PAYSTACK_VERIFY_ENDPOINT` to an endpoint that accepts a `reference` query parameter and returns `{ "status": "success" }` only after server-side verification. Keep the Paystack secret key on the backend, never in a `VITE_` variable. Until those endpoints are configured, checkout explains that payments are unavailable.

Set `VITE_CONTACT_FORM_ENDPOINT` to receive contact and registration submissions. Without it, the forms show a direct email option rather than claiming a submission was sent.

## Design assets

Photographs and the official academy logo live in `src/assets`. Generated photographs are illustrative scenes. The four ItaBEES Way cards use a slow, staggered floating animation that stops when a visitor prefers reduced motion.
