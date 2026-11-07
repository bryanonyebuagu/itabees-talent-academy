import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { media } from "../data/media";
import { DONATION_CURRENCY, formatDonation, FREQUENCIES, SUGGESTED_AMOUNTS, validDonation } from "../data/donation";
import { InstagramIcon, TikTokIcon } from "../components/SocialIcons";

export default function Donate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialFrequency = FREQUENCIES.includes(params.get("frequency")) ? params.get("frequency") : "one-time";
  const initialAmount = Number(params.get("amount"));
  const [frequency, setFrequency] = useState(initialFrequency);
  const [amount, setAmount] = useState(validDonation(initialAmount, initialFrequency) ? initialAmount : 50);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState("");
  const selected = custom !== "" ? Number(custom) : amount;
  const chooseAmount = (value) => { setAmount(value); setCustom(""); setError(""); };
  const continueToCheckout = (event) => {
    event.preventDefault();
    if (!validDonation(selected, frequency)) { setError("Enter an amount of at least $2."); return; }
    const params = new URLSearchParams({ amount: String(selected), frequency });
    navigate(`/donate/checkout?${params}`, { state: { amount: selected, frequency } });
  };
  return <main className="donation-page"><section className="donation-intro"><div className="donation-intro-copy"><p className="eyebrow">SUPPORT ITABEES TALENT ACADEMY</p><h1>MAKE A DIFFERENCE.<br/><span>CHANGE STARTS WITH PEOPLE LIKE YOU.</span></h1><p>Your donation helps make a real impact by supporting young players, their development and the opportunities that help shape their future.</p><div className="donation-trust"><strong>Developing Players.</strong><strong>Building Character.</strong><strong>Inspiring Excellence.</strong></div></div><div className="donation-intro-image"><img src={media.donation} alt="Hands sharing a heart" /></div></section>
    <section className="donation-main"><div className="donation-purpose"><p className="eyebrow">THE ITABEES WAY</p><h2>Developing better players and better people.</h2><p>Soccer is the vehicle. Developing young people is the purpose.</p><p>ItaBEES Talent Academy was created around a simple belief: talented and motivated young players deserve access to quality development, strong mentorship and opportunities to see what is possible.</p><img src={media.coaching} alt="Coach mentoring young ItaBEES players" /></div>
      <form className="donation-panel" onSubmit={continueToCheckout}><div className="donation-panel-heading"><span>01 / YOUR DONATION</span><h2>Choose how to give.</h2><p>Currency: {DONATION_CURRENCY}</p></div><fieldset><legend>Donation frequency</legend><div className="donation-options frequency-options">{FREQUENCIES.map(value => <button type="button" key={value} className={frequency === value ? "selected" : ""} aria-pressed={frequency === value} onClick={() => setFrequency(value)}>{value === "one-time" ? "One-time" : value[0].toUpperCase()+value.slice(1)}</button>)}</div></fieldset><fieldset><legend>Donation amount</legend><div className="donation-options amount-options">{SUGGESTED_AMOUNTS.map(value => <button type="button" key={value} className={custom === "" && amount === value ? "selected" : ""} aria-pressed={custom === "" && amount === value} onClick={() => chooseAmount(value)}>{formatDonation(value)}</button>)}</div><label className="custom-amount-label" htmlFor="custom-amount">Or enter your own amount</label><div className="custom-amount"><span>$</span><input id="custom-amount" type="number" min="2" max="1000000" step="0.01" value={custom} onChange={event => { setCustom(event.target.value); setError(""); }} placeholder="Custom amount" inputMode="decimal" /></div></fieldset><div className="donation-summary"><span>Donation summary</span><strong>{formatDonation(selected)} {frequency}</strong></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-yellow donation-submit" type="submit">Donate {formatDonation(selected)} <span>↗</span></button><p className="donation-note">You will review your details on the next page. Payment is completed through a secure provider once the academy's Paystack account is connected.</p></form></section>
    <section className="donate-social-section"><p className="eyebrow">CONNECT WITH ITABEES</p><h2>FOLLOW THE <span>JOURNEY.</span></h2><div className="donate-socials"><a href="https://www.instagram.com/itabeestalentacademy?rpxt=NWtnczhiOGxhc3Jl" target="_blank" rel="noreferrer"><InstagramIcon /><strong>Instagram</strong><span>@itabeestalentacademy</span></a><div><TikTokIcon /><strong>TikTok</strong><span>@itabeestalentacademy</span></div></div></section>
  </main>;
}
