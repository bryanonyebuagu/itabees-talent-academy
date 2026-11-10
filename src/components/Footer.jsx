import { Link } from "react-router-dom";
import logo from "../assets/logo-brand.png";
import { InstagramIcon, TikTokIcon } from "./SocialIcons";
import BrandText from "./BrandText";

const quickLinks = [
  ["About Us", "/about"],
  ["Programs", "/programs"],
  ["Player Pathway", "/player-pathway"],
  ["Education & Mentorship", "/mentorship"],
  ["Coaches", "/coaches"],
  ["Clinics & Events", "/camps-and-clinics"],
  ["Community Impact", "/community-impact"],
  ["Get Involved", "/donate"],
  ["Contact", "/contact"],
];

export default function Footer() {
  return <footer className="site-footer">
    <div className="footer-identity"><Link className="brand footer-brand" to="/" aria-label="ItaBEES Talent Academy home"><img src={logo} alt="" /></Link><strong><BrandText>ITABEES</BrandText></strong><p>Developing Players. Building Character. Inspiring Excellence.</p></div>
    <div className="footer-location"><h3>Location</h3><p>Charlotte, North Carolina<br />Serving athletes in the Charlotte area</p></div>
    <div className="footer-quick"><h3>Quick Links</h3><div className="footer-links">{quickLinks.map(([label,to]) => <Link key={label} to={to}>{label}</Link>)}</div></div>
    <div className="footer-connect"><h3>Connect</h3><a href="https://www.instagram.com/itabeestalentacademy?rpxt=NWtnczhiOGxhc3Jl" target="_blank" rel="noreferrer"><InstagramIcon /><span>Instagram<small>@itabeestalentacademy</small></span></a><div><TikTokIcon /><span>TikTok<small>@itabeestalentacademy</small></span></div></div>
    <span className="copyright">© {new Date().getFullYear()} <BrandText>ITABEES</BrandText> Talent Academy. All Rights Reserved.</span>
  </footer>;
}
