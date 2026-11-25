import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ArrowUpRight from "../components/ArrowUpRight";
import RegistrationWizard from "../components/RegistrationWizard";
import { CHECKOUT_PROGRAMS, formatCheckoutAmount } from "../data/checkoutPrograms";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const stripeCache = new Map();
function getStripe(key) { if (!stripeCache.has(key)) stripeCache.set(key, loadStripe(key)); return stripeCache.get(key); }

function SecurePayment({ setup, kind }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pay = async event => {
    event.preventDefault();
    if (!stripe || !elements || busy) return;
    setBusy(true); setError("");
    const result = await stripe.confirmPayment({ elements, confirmParams: { return_url: `${window.location.origin}/payment/confirmation?id=${encodeURIComponent(setup.intentId)}&token=${encodeURIComponent(setup.accessToken)}` }, redirect: "if_required" });
    if (result.error) { setError(result.error.message || "The payment could not be completed."); setBusy(false); return; }
    window.location.assign(`/payment/confirmation?id=${encodeURIComponent(setup.intentId)}&token=${encodeURIComponent(setup.accessToken)}`);
  };
  return <form className="checkout-form stripe-payment-form" onSubmit={pay}><div className="checkout-step"><span>02</span><div><h2>Secure payment</h2><p>Stripe collects your card and billing details securely. This site never stores card numbers.</p></div></div><PaymentElement options={{ layout: "tabs" }} />{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-yellow checkout-submit" disabled={!stripe || busy} type="submit">{busy ? "Processing…" : `Pay ${formatCheckoutAmount(setup.amountCents)} in test mode`} <ArrowUpRight /></button><p className="payment-test-note">Test mode only. No real charge will be made.</p>{kind === "donation" && <p>Your gift helps make youth football development and training opportunities more accessible.</p>}</form>;
}

export default function PaymentCheckout({ donation = false }) {
  const [params] = useSearchParams();
  const kind = donation ? "donation" : "program";
  const program = CHECKOUT_PROGRAMS.find(item => item.id === params.get("program"));
  const donationAmount = Number(params.get("amount"));
  const [fields, setFields] = useState({ name: "", participantName: "", guardianName: "", email: "", phone: "", age: "", anonymous: false });
  const [setup, setSetup] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const amountCents = donation ? Math.round(donationAmount * 100) : program?.amountCents ?? 0;
  const validAmount = Number.isSafeInteger(amountCents) && amountCents >= 200 && amountCents <= 100000000;
  const update = key => event => setFields(current => ({ ...current, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  const continuePayment = async submitted => {
    if (!submitted.name.trim() || !emailPattern.test(submitted.email.trim())) { setError("Complete the required details before continuing."); return; }
    if (!validAmount) { setError("Choose a valid amount."); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/payments/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, programId: program?.id, amountCents, ...submitted }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Payment could not be started.");
      setSetup(data);
    } catch (caught) { setError(caught.message); } finally { setBusy(false); }
  };
  if (!donation && !program) return <main className="checkout-missing"><p className="eyebrow">PROGRAM REGISTRATION</p><h1>Choose your program first.</h1><Link className="button button-yellow" to="/register">View programs <ArrowUpRight /></Link></main>;
  return <main className="checkout-page stripe-checkout-page"><div className="checkout-heading"><p className="eyebrow">{donation ? "SUPPORT YOUNG ATHLETES" : "PROGRAM REGISTRATION"}</p><h1>{donation ? <>Complete <span>your gift.</span></> : <>Train with <span>purpose.</span></>}</h1><p>{donation ? "Your support helps young players access training and new opportunities." : "Register a player for the selected program and complete a secure test payment."}</p></div><div className="checkout-grid"><div>
    {!setup && !donation ? <RegistrationWizard onComplete={continuePayment} busy={busy} error={error} /> : !setup ? <form className="checkout-form" onSubmit={event => { event.preventDefault(); continuePayment(fields); }}><div className="checkout-step"><span>01</span><div><h2>{donation ? "Your details" : "Participant details"}</h2><p>Fields marked * are required.</p></div></div><div className="checkout-fields">
      <label>{donation ? "Your full name" : "Parent or guardian full name"} *<input required autoComplete="name" value={fields.name} onChange={update("name")} /></label>
      {!donation && <><label>Participant full name *<input required value={fields.participantName} onChange={update("participantName")} /></label><label>Guardian name, if different<input value={fields.guardianName} onChange={update("guardianName")} /></label><label>Participant age *<input required type="number" min="5" max="25" inputMode="numeric" value={fields.age} onChange={update("age")} /></label></>}
      <label>Email address *<input required type="email" autoComplete="email" value={fields.email} onChange={update("email")} /></label><label>Phone number {donation ? "" : "*"}<input required={!donation} type="tel" autoComplete="tel" value={fields.phone} onChange={update("phone")} /></label>
      {donation && <label className="checkout-anonymous"><input type="checkbox" checked={fields.anonymous} onChange={update("anonymous")} /> Keep my name anonymous in public acknowledgements</label>}
    </div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-yellow checkout-submit" disabled={busy || !validAmount} type="submit">{busy ? "Preparing payment…" : "Continue to secure payment"} <ArrowUpRight /></button><p className="payment-test-note">Published program price shown. Stripe test mode only: no real payment or recurring subscription is created.</p></form> : <Elements stripe={getStripe(setup.publishableKey)} options={{ clientSecret: setup.clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#080808", colorText: "#080808", borderRadius: "10px" } } }}><SecurePayment setup={setup} kind={kind} /></Elements>}
  </div><aside className="checkout-summary"><p className="eyebrow">{donation ? "YOUR DONATION" : "SELECTED PROGRAM"}</p><h2>{donation ? "Support the next generation" : program.name}</h2><p>{donation ? "Help young athletes train, grow and access opportunities beyond the field." : program.description}</p><div><span>{donation ? "Donation" : "Program price"}</span><strong>{validAmount ? formatCheckoutAmount(amountCents) : "Choose an amount"}</strong></div><div className="checkout-total"><span>Total today</span><strong>{validAmount ? formatCheckoutAmount(amountCents) : "—"}</strong></div><Link to={donation ? "/donate" : "/programs"}>Change {donation ? "donation" : "program"}</Link></aside></div></main>;
}
