import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ArrowUpRight from "./ArrowUpRight";
import logo from "../assets/logo.jpeg";

const groups = [
  { label: "Programs", links: [["Training Sessions", "/player-development"], ["Camps & Clinics", "/camps-and-clinics"], ["All Programs", "/programs"]] },
  { label: "About", links: [["About Us", "/about"], ["Our Team", "/coaches"], ["Our Impact", "/community-impact"], ["Gallery", "/gallery"]] },
  { label: "Resources", links: [["FAQ", "/faq"], ["News & Events", "/events"], ["Eligibility", "/eligibility"]] },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const isDesktop = () => window.matchMedia("(min-width: 1101px)").matches;
  const closeMenu = () => { setOpen(false); setActiveGroup(null); setRegisterOpen(false); };
  return <header className="site-header">
    <Link className="brand" to="/" onClick={closeMenu} aria-label="ItaBEES Talent Academy home"><span className="brand-logo"><img src={logo} alt="" /></span><span className="brand-wordmark"><strong><span className="brand-ita">Ita</span><span className="brand-bees">BEES</span></strong><small>TALENT ACADEMY</small></span></Link>
    <nav className={`navigation ${open ? "is-open" : ""}`} id="main-navigation" aria-label="Main navigation">
      <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
      {groups.map(({ label, links }) => <div className={`nav-group ${activeGroup === label ? "is-active" : ""}`} key={label} onMouseEnter={() => { if (isDesktop()) setActiveGroup(label); }} onMouseLeave={() => { if (isDesktop()) setActiveGroup(null); }} onFocus={() => { if (isDesktop()) setActiveGroup(label); }} onBlur={event => { if (isDesktop() && !event.currentTarget.contains(event.relatedTarget)) setActiveGroup(null); }}><button className="nav-group-trigger" type="button" aria-expanded={activeGroup === label} aria-controls={`nav-panel-${label.toLowerCase()}`} onClick={() => { setRegisterOpen(false); setActiveGroup(current => isDesktop() ? label : current === label ? null : label); }}>{label}<span className="nav-group-chevron" aria-hidden="true" /></button><div className="nav-group-panel" id={`nav-panel-${label.toLowerCase()}`}><span className="nav-group-kicker">EXPLORE {label.toUpperCase()}</span>{links.map(([name, to]) => <NavLink key={to} to={to} onClick={closeMenu}>{name}<ArrowUpRight /></NavLink>)}</div></div>)}
      <NavLink to="/player-pathway" onClick={closeMenu}>Player Pathway</NavLink>
      <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
      <NavLink to="/get-involved" onClick={closeMenu}>Get Involved</NavLink>
      <NavLink to="/register" onClick={closeMenu}>Apply Now</NavLink>
      <div className={`nav-register ${registerOpen ? "is-open" : ""}`}>
        <NavLink to="/dashboard" className="nav-register-link" onClick={closeMenu}>Register<span className="nav-group-chevron" aria-hidden="true" /></NavLink>
        <button className="nav-register-trigger" type="button" aria-expanded={registerOpen} aria-controls="nav-register-popover" onClick={() => { setActiveGroup(null); setRegisterOpen(current => !current); }}>Register<span className="nav-group-chevron" aria-hidden="true" /></button>
        <div className="nav-register-popover" id="nav-register-popover" aria-label="Account options">
          <span className="nav-register-kicker">YOUR ITABEES SPACE</span>
          <Link className="nav-register-dashboard-link" to="/dashboard" onClick={closeMenu}>Dashboard <ArrowUpRight /></Link>
          <Link to="/login" onClick={closeMenu}>Login <ArrowUpRight /></Link>
          <Link to="/signup" onClick={closeMenu}>Sign up <ArrowUpRight /></Link>
          <Link to="/admin" onClick={closeMenu}>Login as admin <ArrowUpRight /></Link>
        </div>
      </div>
    </nav>
    <div className="header-actions">
      <Link className="nav-cta" to="/donate" onClick={closeMenu}>DONATE <span aria-hidden="true"><ArrowUpRight /></span></Link>
      <button className={`menu-toggle ${open ? "is-open" : ""}`} type="button" aria-label="Toggle navigation" aria-expanded={open} aria-controls="main-navigation" onClick={() => { setOpen(!open); setActiveGroup(null); setRegisterOpen(false); }}><span /><span /></button>
    </div>
  </header>;
}
