import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import { InstagramIcon, TikTokIcon } from "./SocialIcons";
import ArrowUpRight from "./ArrowUpRight";
import useToast from "../portal/useToast";

const quickLinks = [
  ["About Us", "/about"],
  ["Programs", "/programs"],
  ["Player Pathway", "/player-pathway"],
  ["Education & Mentorship", "/mentorship"],
  ["Coaches", "/coaches"],
  ["Clinics & Events", "/camps-and-clinics"],
  ["Community Impact", "/community-impact"],
  ["Get Involved", "/get-involved"],
  ["Contact", "/contact"],
  ["Gallery", "/gallery"],
  ["FAQ", "/faq"],
  ["Eligibility", "/eligibility"],
];

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const notify = useToast();
  const requestSubscription = async (event) => {
    event.preventDefault();
    if (subscribing) return;
    setSubscribing(true);
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newsletterEmail.trim() }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Please try again later.");
      notify(result.status === "pending"
        ? { title: "Check your inbox", description: "Confirm your email to join the ItaBEES newsletter." }
        : { title: "Subscribed to our newsletter", description: "You're on the ItaBEES email list." });
      setNewsletterEmail("");
    } catch (error) {
      notify({ title: "Subscription could not be completed", description: error.message, type: "error" });
    } finally {
      setSubscribing(false);
    }
  };
  return <footer className="site-footer">
    <section className="footer-newsletter" aria-labelledby="footer-newsletter-title"><div><p className="footer-newsletter-kicker">STAY IN THE LOOP</p><h2 id="footer-newsletter-title">Subscribe to our <em>newsletter.</em></h2><p>Get ItaBEES updates on training, events and player opportunities.</p></div><form onSubmit={requestSubscription}><label htmlFor="footer-newsletter-email">Email address</label><input id="footer-newsletter-email" type="email" autoComplete="email" required placeholder="you@example.com" value={newsletterEmail} onChange={event => setNewsletterEmail(event.target.value)} /><button type="submit" disabled={subscribing}>{subscribing ? "Subscribing…" : "Subscribe"} <ArrowUpRight /></button></form></section>
    <div className="footer-identity"><Link className="brand footer-brand" to="/" aria-label="ItaBEES Talent Academy home"><img src={logo} alt="" /></Link><strong><span className="brand-ita">Ita</span><span className="brand-bees">BEES</span></strong><p>Developing Players. Building Character. Inspiring Excellence.</p></div>
    <div className="footer-location"><h3>Location</h3><p>Charlotte, North Carolina<br />Serving athletes in the Charlotte area</p></div>
    <div className="footer-quick"><h3>Quick Links</h3><div className="footer-links">{quickLinks.map(([label,to]) => <Link key={label} to={to}>{label}</Link>)}</div></div>
    <div className="footer-connect"><h3>Connect</h3><a href="https://www.instagram.com/itabeestalentacademy?rpxt=NWtnczhiOGxhc3Jl" target="_blank" rel="noreferrer"><InstagramIcon /><span>Instagram<small>@itabeestalentacademy</small></span></a><div><TikTokIcon /><span>TikTok<small>@itabeestalentacademy</small></span></div></div>
    <div className="footer-nonprofit"><h3>Nonprofit Status</h3><p>ItaBEES Talent Academy is a tax-exempt 501(c)(3) nonprofit. Donations are 100% tax deductible, subject to applicable tax rules.</p><strong>EIN: 41-4932186</strong></div>
    <span className="copyright">© {new Date().getFullYear()} ITABEES Talent Academy. All Rights Reserved.</span>
  </footer>;
}
