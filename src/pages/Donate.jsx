import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ArrowUpRight from "../components/ArrowUpRight";
import { media } from "../data/media";
import { DONATION_CURRENCY, formatDonation, FREQUENCIES, SUGGESTED_AMOUNTS, validDonation } from "../data/donation";
import { InstagramIcon, TikTokIcon } from "../components/SocialIcons";

const supportAreas = ["Training access", "Coaching", "Player equipment", "Assessments", "Mentorship", "Development opportunities"];
const partnershipOptions = ["Player development", "Team support", "Camps and clinics", "Equipment", "Mentorship", "Community events", "Educational support", "In-kind support"];

function DonationCheck() {
  return <svg className="donation-commitment-check" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" /><path d="m9 16 4.5 4.5L23 11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Donate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialFrequency = FREQUENCIES.includes(params.get("frequency")) ? params.get("frequency") : "one-time";
  const initialAmount = Number(params.get("amount"));
  const [frequency, setFrequency] = useState(initialFrequency);
  const [amount, setAmount] = useState(validDonation(initialAmount, initialFrequency) ? initialAmount : 50);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState("");
  const [inquiry, setInquiry] = useState({ name: "", organization: "", email: "", consent: false });
  const selected = custom !== "" ? Number(custom) : amount;
  const chooseAmount = (value) => { setAmount(value); setCustom(""); setError(""); };
  const continueToCheckout = (event) => {
    event.preventDefault();
    if (!validDonation(selected, frequency)) { setError("Enter an amount of at least $2."); return; }
    const query = new URLSearchParams({ amount: String(selected), frequency });
    navigate(`/donate/checkout?${query}`, { state: { amount: selected, frequency } });
  };
  const sendInquiry = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`ItaBEES partnership inquiry from ${inquiry.organization}`);
    const body = encodeURIComponent(`Name: ${inquiry.name}\nOrganization: ${inquiry.organization}\nEmail: ${inquiry.email}\n\nI would like to discuss supporting ItaBEES Talent Academy.`);
    window.location.href = `mailto:info@itabeestalentacademy.com?subject=${subject}&body=${body}`;
  };
  return <main className="donation-page donation-refresh">
    <section className="donation-campaign-hero"><p className="eyebrow">GIVE WITH PURPOSE</p><h1>Fuel the <em>future.</em></h1><a href="#partner" className="donation-hero-link">Partner with ItaBEES <ArrowUpRight /></a></section>
    <div className="donation-commitments" aria-label="ItaBEES donation facts"><div><DonationCheck /><p><strong>501(c)(3)</strong> Registered</p></div><div><DonationCheck /><p><strong>100%</strong> Tax Deductible</p></div><div><DonationCheck /><p>EIN: <strong>41-4932186</strong></p></div><div><DonationCheck /><p><strong>100%</strong> Direct to Athletes</p></div></div>
    <section className="donation-giving" id="give"><article className="donation-impact-card"><img src={media.coaching} alt="Coach mentoring young ItaBEES players" /><div><p className="eyebrow">YOUR IMPACT</p><h2>Help young players <em>keep moving.</em></h2><p>Your donation helps make a real impact by supporting young players, their development and the opportunities that help shape their future. Soccer is the vehicle. Developing young people is the purpose.</p><p className="donation-area-label">AREAS YOUR GIFT CAN SUPPORT</p><div className="donation-area-grid">{supportAreas.map((area, index) => <span key={area}><b>{String(index + 1).padStart(2, "0")}</b>{area}</span>)}</div></div></article>
      <form className="donation-panel" id="donate-form" onSubmit={continueToCheckout}><div className="donation-panel-heading"><span>YOUR DONATION</span><h2>Choose how to give.</h2><p>Give in {DONATION_CURRENCY}. Choose an amount or enter your own.</p></div><fieldset><legend>Donation frequency</legend><div className="donation-options frequency-options">{FREQUENCIES.map(value => <button type="button" key={value} className={frequency === value ? "selected" : ""} aria-pressed={frequency === value} onClick={() => setFrequency(value)}>{value === "one-time" ? "One-time" : value[0].toUpperCase()+value.slice(1)}</button>)}</div></fieldset><fieldset><legend>Donation amount</legend><div className="donation-options amount-options">{SUGGESTED_AMOUNTS.map(value => <button type="button" key={value} className={custom === "" && amount === value ? "selected" : ""} aria-pressed={custom === "" && amount === value} onClick={() => chooseAmount(value)}>{formatDonation(value)}</button>)}</div><label className="custom-amount-label" htmlFor="custom-amount">Or enter your own amount</label><div className="custom-amount"><span>$</span><input id="custom-amount" type="number" min="2" max="1000000" step="0.01" value={custom} onChange={event => { setCustom(event.target.value); setError(""); }} placeholder="Custom amount" inputMode="decimal" /></div></fieldset><div className="donation-summary"><span>Donation summary</span><strong>{formatDonation(selected)} {frequency}</strong></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-yellow donation-submit" type="submit">Donate {formatDonation(selected)} <span><ArrowUpRight /></span></button><p className="donation-note">Review your details on the next page. Payment is completed through a secure provider once the academy's Paystack account is connected.</p></form>
    </section>
    <section className="donation-partners" id="partner"><div className="donation-partner-heading"><div><p className="eyebrow">PARTNER WITH US</p><h2>Make room for <em>more potential.</em></h2></div><p>Work with ItaBEES to support purposeful training, strong mentorship and opportunities for young players.</p></div><div className="donation-partner-grid"><div className="donation-partner-aside"><article><p className="eyebrow">WHY PARTNER WITH US?</p><h3>Developing better players and better people.</h3><p>ItaBEES Talent Academy was created around a simple belief: talented and motivated young players deserve access to quality development, strong mentorship and opportunities to see what is possible.</p></article><article><p className="eyebrow">QUESTIONS?</p><h3>Let's talk about the right fit.</h3><a href="mailto:info@itabeestalentacademy.com">info@itabeestalentacademy.com <ArrowUpRight /></a></article></div><div className="donation-partner-main"><p className="donation-area-label">WAYS TO SUPPORT</p><div className="donation-partner-options">{partnershipOptions.map((option, index) => <div key={option}><span>{String(index + 1).padStart(2, "0")}</span><strong>{option}</strong><ArrowUpRight /></div>)}</div><form className="donation-inquiry" onSubmit={sendInquiry}><p className="eyebrow">PARTNERSHIP INQUIRY</p><h3>Start a conversation.</h3><div className="donation-inquiry-fields"><label><span>Contact name <b className="required-mark">*</b></span><input required autoComplete="name" value={inquiry.name} onChange={event => setInquiry({ ...inquiry, name: event.target.value })} placeholder="Your full name" /></label><label><span>Organization <b className="required-mark">*</b></span><input required autoComplete="organization" value={inquiry.organization} onChange={event => setInquiry({ ...inquiry, organization: event.target.value })} placeholder="Company or organization" /></label><label><span>Email <b className="required-mark">*</b></span><input required type="email" autoComplete="email" value={inquiry.email} onChange={event => setInquiry({ ...inquiry, email: event.target.value })} placeholder="you@company.com" /></label></div><label className="donation-consent"><input required type="checkbox" checked={inquiry.consent} onChange={event => setInquiry({ ...inquiry, consent: event.target.checked })} /><span>I consent to ItaBEES Talent Academy contacting me about this inquiry. <b className="required-mark">*</b></span></label><button className="button button-black" type="submit">Prepare email <ArrowUpRight /></button><p className="donation-mail-note">Opens your email app with your details ready to send.</p></form></div></div></section>
    <section className="donation-final"><p className="eyebrow">EVERY GIFT COUNTS</p><h2>Give a young player <em>room to grow.</em></h2><p>Your support helps develop confident young people prepared to succeed wherever their journey takes them.</p><div><a className="button button-yellow" href="#donate-form">Donate now <ArrowUpRight /></a><Link className="button button-black" to="/contact">Get in touch <ArrowUpRight /></Link></div></section>
    <section className="donate-social-section"><p className="eyebrow">CONNECT WITH ITABEES</p><h2>FOLLOW THE <span>JOURNEY.</span></h2><div className="donate-socials"><a href="https://www.instagram.com/itabeestalentacademy?rpxt=NWtnczhiOGxhc3Jl" target="_blank" rel="noreferrer"><InstagramIcon /><strong>Instagram</strong><span>@itabeestalentacademy</span></a><div><TikTokIcon /><strong>TikTok</strong><span>@itabeestalentacademy</span></div></div></section>
  </main>;
}
