import BrandText from "../components/BrandText";
import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import ArrowUpRight from "../components/ArrowUpRight";
import { DONATION_CURRENCY, formatDonation, validDonation } from "../data/donation";
import { initializeDonation } from "../services/paystack";

const emptyDonor = { firstName: "", lastName: "", email: "", phone: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(donor) {
  const errors = {};
  if (!donor.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!donor.lastName.trim()) errors.lastName = "Enter your last name.";
  if (!emailPattern.test(donor.email.trim())) errors.email = "Enter a valid email address.";
  if (!/^[+\d()\s-]{7,20}$/.test(donor.phone.trim())) errors.phone = "Enter a valid phone number.";
  return errors;
}

export default function DonationCheckout() {
  const [params] = useSearchParams();
  const location = useLocation();
  const amount = Number(location.state?.amount ?? params.get("amount"));
  const frequency = location.state?.frequency ?? params.get("frequency");
  const [donor, setDonor] = useState(emptyDonor);
  const [errors, setErrors] = useState({});
  const [promo, setPromo] = useState("");
  const [promoFeedback, setPromoFeedback] = useState("");
  const [status, setStatus] = useState("idle");
  const [paymentError, setPaymentError] = useState("");

  if (!validDonation(amount, frequency)) return <BrandText><main className="checkout-missing"><p className="eyebrow">DONATION CHECKOUT</p><h1>Choose your donation first.</h1><p>Your checkout summary needs an amount and frequency.</p><Link className="button button-yellow" to="/donate">Choose a donation <span><ArrowUpRight /></span></Link></main></BrandText>;

  const update = (field) => (event) => { setDonor({ ...donor, [field]: event.target.value }); setErrors({ ...errors, [field]: "" }); };
  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(donor);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setStatus("loading");
    setPaymentError("");
    try {
      const authorizationUrl = await initializeDonation({ amount, currency: DONATION_CURRENCY, frequency, donor: { firstName: donor.firstName.trim(), lastName: donor.lastName.trim(), email: donor.email.trim(), phone: donor.phone.trim() } });
      window.location.assign(authorizationUrl);
    } catch (error) {
      setPaymentError(error.message || "Payment could not be started.");
      setStatus("failed");
    }
  };

  return <BrandText><main className="checkout-page"><div className="checkout-heading"><p className="eyebrow">SECURE DONATION CHECKOUT</p><h1>Complete your support.</h1><p>Review your gift and add your details. Card payment is handled by Paystack once the academy has enabled its account and backend.</p></div><div className="checkout-grid">
    <form className="checkout-form" onSubmit={submit} noValidate><div className="checkout-step"><span>01</span><div><h2>Donor information</h2><p>No account is required to fill out this checkout.</p></div></div><div className="checkout-fields">
      {[["firstName","First name","given-name"],["lastName","Last name","family-name"],["email","Email address","email"],["phone","Phone number","tel"]].map(([key,label,auto]) => <label key={key}>{label}<input type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} autoComplete={auto} value={donor[key]} onChange={update(key)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${key}-error` : undefined} />{errors[key] && <small className="form-error" id={`${key}-error`}>{errors[key]}</small>}</label>)}
    </div><div className="checkout-step"><span>02</span><div><h2>Promo code</h2><p>Only codes issued by ItaBEES can be applied.</p></div></div><div className="promo-row"><input aria-label="Promo code" value={promo} onChange={event => { setPromo(event.target.value); setPromoFeedback(""); }} placeholder="Enter a code" /><button type="button" onClick={() => setPromoFeedback(promo.trim() ? "Promo code validation is not available yet; no discount has been applied." : "Enter a promo code first.")}>Apply</button></div>{promoFeedback && <p className="promo-feedback" role="status">{promoFeedback}</p>}
      <div className="checkout-step"><span>03</span><div><h2>Payment method</h2><p>Your card details are never entered or stored on this website.</p></div></div><div className="payment-method"><strong>Card payment via Paystack</strong><span>Secure hosted checkout will open when the payment connection is active.</span></div>{paymentError && <div className="payment-error" role="alert"><strong>Payment could not start</strong><p>{paymentError}</p></div>}<button className="button button-yellow checkout-submit" type="submit" disabled={status === "loading"}>{status === "loading" ? "Starting secure payment…" : `Complete Donation — ${formatDonation(amount)}`} <span><ArrowUpRight /></span></button>
    </form><aside className="checkout-summary"><p className="eyebrow">YOUR DONATION</p><h2>Order summary</h2><div><span>Donation amount</span><strong>{formatDonation(amount)}</strong></div><div><span>Frequency</span><strong>{frequency === "one-time" ? "One-time" : frequency[0].toUpperCase()+frequency.slice(1)}</strong></div><div className="checkout-total"><span>Total today</span><strong>{formatDonation(amount)}</strong></div><p>{frequency === "one-time" ? "This is a one-time donation." : `You selected a ${frequency} donation. Recurring payments require an enabled Paystack plan.`}</p><Link to={`/donate?amount=${amount}&frequency=${frequency}`}>← Change donation</Link></aside>
  </div></main></BrandText>;
}
