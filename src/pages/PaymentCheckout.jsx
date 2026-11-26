import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ArrowUpRight from "../components/ArrowUpRight";
import { ProgramName } from "../components/ProgramPricingCard";
import { media } from "../data/media";
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
  return <form className="checkout-form stripe-payment-form" onSubmit={pay}><div className="checkout-step"><span>02</span><div><h2>Secure payment</h2><p>Stripe collects your card and billing details securely. This site never stores card numbers.</p></div></div><PaymentElement options={{ layout: "tabs" }} />{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-yellow checkout-submit" disabled={!stripe || busy} type="submit">{busy ? "Processing…" : `Pay ${formatCheckoutAmount(setup.amountCents)}${setup.mode === "test" ? " in test mode" : ""}`} <ArrowUpRight /></button><p className="payment-test-note">{setup.mode === "test" ? "Test mode only. No real charge will be made." : setup.recurring ? "This payment starts an automatic monthly subscription at the amount shown. You can manage or cancel your subscription after registration." : "The amount shown will be charged to your payment method."}</p>{kind === "donation" && <p>Your gift helps make youth football development and training opportunities more accessible.</p>}</form>;
}

export default function PaymentCheckout({ donation = false, assistance = false }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [applicationType, setApplicationType] = useState(assistance ? "financial-assistance" : "supplemental-training");
  const { hash } = useLocation();
  const resumeToken = new URLSearchParams(hash.slice(1)).get("token");
  const kind = donation ? "donation" : "program";
  const program = CHECKOUT_PROGRAMS.find(item => item.id === params.get("program"));
  const donationAmount = Number(params.get("amount"));
  const [fields, setFields] = useState({ name: "", participantName: "", guardianName: "", email: "", phone: "", age: "", anonymous: false });
  const [setup, setSetup] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const amountCents = setup?.amountCents ?? (donation ? Math.round(donationAmount * 100) : program?.amountCents ?? 0);
  const validAmount = Number.isSafeInteger(amountCents) && amountCents >= 200 && amountCents <= 100000000;
  const update = key => event => setFields(current => ({ ...current, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  const continuePayment = async submitted => {
    if (!submitted.name.trim() || !emailPattern.test(submitted.email.trim())) { setError("Complete the required details before continuing."); return; }
    if (submitted.applicationType !== "financial-assistance" && !validAmount) { setError("Choose a valid amount."); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch(submitted.applicationType === "financial-assistance" ? "/api/assistance" : "/api/payments/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, programId: program?.id, amountCents, ...submitted }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Payment could not be started.");
      if (data.submitted) { navigate("/financial-assistance/requested"); return; }
      if (data.verificationSent) setVerificationSent(true);
      else setSetup(data);
    } catch (caught) { setError(caught.message); } finally { setBusy(false); }
  };
  const resumePayment = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/payments/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resumeToken }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not resume your registration.");
      if (data.programId !== program.id) throw new Error("Open the original registration link from your email.");
      if (data.paid) {
        window.location.assign(`/payment/confirmation?id=${encodeURIComponent(data.intentId)}&token=${encodeURIComponent(data.accessToken)}`);
        return;
      }
      setSetup(data);
    } catch (caught) { setError(caught.message); } finally { setBusy(false); }
  };
  if (!donation && !program && !assistance) return <main className="checkout-missing"><p className="eyebrow">PROGRAM REGISTRATION</p><h1>Choose your program first.</h1><Link className="button button-yellow" to="/register">View programs <ArrowUpRight /></Link></main>;
  return <main className="checkout-page stripe-checkout-page"><div className="checkout-heading"><p className="eyebrow">{donation ? "SUPPORT YOUNG ATHLETES" : assistance ? "FINANCIAL ASSISTANCE" : "PROGRAM REGISTRATION"}</p><h1>{donation ? <>Complete <span>your gift.</span></> : assistance ? <>Apply for <span>financial assistance.</span></> : <>Train <span>with purpose.</span></>}</h1><p>{donation ? "Your support helps young players access training and new opportunities." : assistance ? "Submit your application directly to the academy for review. No payment is required." : "Register a player for the selected program and complete a secure payment."}</p></div><div className="checkout-grid"><div>
    {!setup && !donation && resumeToken ? <section className="checkout-form"><h2>Verify your email and continue to payment</h2><p>Your registration is saved.</p>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-yellow" type="button" disabled={busy} onClick={resumePayment}>{busy ? "Preparing payment…" : "Verify email and continue"}</button></section> : !setup && verificationSent ? <section className="checkout-form" role="status"><h2>Check your email</h2><p>Open the verification link to return to your saved registration and pay. Check your spam folder if the message hasn’t arrived.</p><button type="button" className="button button-black" onClick={() => setVerificationSent(false)}>Start a new registration</button></section> : !setup && !donation ? <RegistrationWizard initialType={applicationType} onTypeChange={type => { if (type === "supplemental-training" && !program) navigate("/register#training-programs"); else setApplicationType(type); }} onComplete={continuePayment} busy={busy} error={error} /> : !setup ? <form className="checkout-form" onSubmit={event => { event.preventDefault(); continuePayment(fields); }}><div className="checkout-step"><span>01</span><div><h2>{donation ? "Your details" : "Participant details"}</h2><p>Fields marked * are required.</p></div></div><div className="checkout-fields">
      <label>{donation ? "Your full name" : "Parent or guardian full name"} *<input required autoComplete="name" value={fields.name} onChange={update("name")} /></label>
      {!donation && <><label>Participant full name *<input required value={fields.participantName} onChange={update("participantName")} /></label><label>Guardian name, if different<input value={fields.guardianName} onChange={update("guardianName")} /></label><label>Participant age *<input required type="number" min="5" max="25" inputMode="numeric" value={fields.age} onChange={update("age")} /></label></>}
      <label>Email address *<input required type="email" autoComplete="email" value={fields.email} onChange={update("email")} /></label><label>Phone number {donation ? "" : "*"}<input required={!donation} type="tel" autoComplete="tel" value={fields.phone} onChange={update("phone")} /></label>
      {donation && <label className="checkout-anonymous"><input type="checkbox" checked={fields.anonymous} onChange={update("anonymous")} /> Keep my name anonymous in public acknowledgements</label>}
    </div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-yellow checkout-submit" disabled={busy || !validAmount} type="submit">{busy ? "Preparing payment…" : "Continue to secure payment"} <ArrowUpRight /></button><p className="payment-test-note">Review the amount and billing terms before paying. Monthly training renews automatically; a second child registered by the same guardian receives $10 off each month.</p></form> : <Elements stripe={getStripe(setup.publishableKey)} options={{ clientSecret: setup.clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#080808", colorText: "#080808", borderRadius: "10px" } } }}><SecurePayment setup={setup} kind={kind} /></Elements>}
  </div>{applicationType !== "financial-assistance" && <aside className={`checkout-summary${donation ? "" : " checkout-summary--program"}`}>
    {!donation && <img className="application-sidebar-image" src={media.training} alt="ItaBEES player development" />}
    <p className="eyebrow">{donation ? "YOUR DONATION" : "SELECTED PROGRAM"}</p>
    {donation ? <h2>Support the next generation</h2> : <ProgramName name={program.name} as="h2" />}
    {!donation && <p className="checkout-summary-price"><strong>{formatCheckoutAmount(amountCents)}</strong><small>{program.duration === "Monthly" ? "/ month per player" : "/ session"}</small></p>}
    <p>{donation ? "Help young athletes train, grow and access opportunities beyond the field." : program.description}</p>
    <div className="checkout-total"><span>{donation ? "Donation today" : "Total today"}</span><strong>{validAmount ? formatCheckoutAmount(amountCents) : "—"}</strong></div>
    {setup?.recurring && <p>Renews monthly at {formatCheckoutAmount(setup.amountCents)} until canceled.</p>}
    <Link className={donation ? "" : "button button-yellow checkout-change-program"} to={donation ? "/donate" : "/register#training-programs"}>Change {donation ? "donation" : "program"}{!donation && <ArrowUpRight />}</Link>
  </aside>}</div></main>;
}
