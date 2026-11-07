import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ArrowUpRight from "./ArrowUpRight";
import logo from "../assets/logo.jpeg";

const links = [
  ["Home", "/"],
  ["Training", "/player-development"],
  ["Player Pathway", "/player-pathway"],
  ["About Us", "/about"],
  ["Coaches", "/coaches"],
  ["Events", "/events"],
  ["Register", "/register"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <Link className="brand" to="/" onClick={() => setOpen(false)} aria-label="ItaBEES Talent Academy home"><span className="brand-logo"><img src={logo} alt="" /></span><span className="brand-wordmark">ITABEES<small>TALENT ACADEMY</small></span></Link>
    <nav className={`navigation ${open ? "is-open" : ""}`} id="main-navigation" aria-label="Main navigation">
      {links.map(([label, to]) => <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>{label}</NavLink>)}
    </nav>
    <div className="header-actions">
      <Link className="nav-cta" to="/donate" onClick={() => setOpen(false)}>DONATE <span aria-hidden="true"><ArrowUpRight /></span></Link>
      <button className={`menu-toggle ${open ? "is-open" : ""}`} type="button" aria-label="Toggle navigation" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}><span /><span /></button>
    </div>
  </header>;
}
