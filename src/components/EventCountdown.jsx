import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowUpRight from "./ArrowUpRight";

// The clinic is in Charlotte, North Carolina (EST on November 21).
const eventStart = Date.parse("2026-11-21T11:00:00-05:00");
const eventEnd = Date.parse("2026-11-21T14:00:00-05:00");

function getRemaining() {
  const now = Date.now();
  if (now >= eventEnd) return null;
  if (now >= eventStart) return { live: true };
  const seconds = Math.max(0, Math.floor((eventStart - now) / 1000));
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

const twoDigits = (value) => String(value).padStart(2, "0");

export default function EventCountdown() {
  const [remaining, setRemaining] = useState(getRemaining);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [expanded]);

  if (!remaining) return null;

  return <aside className={`event-countdown${expanded ? " is-expanded" : ""}`} aria-label="Upcoming ItaBEES clinic countdown">
    {expanded && <div className="event-countdown-panel" id="event-countdown-panel">
      <p className="event-countdown-kicker">UPCOMING EVENT</p>
      <h2>Free Soccer Clinic <span>+ BBQ</span></h2>
      <p className="event-countdown-when">Saturday, November 21, 2026<br />11:00 AM–2:00 PM</p>
      <p className="event-countdown-where">Mallard Creek Park · Charlotte, NC</p>
      <Link to="/camps-and-clinics" onClick={() => setExpanded(false)}>See the clinic details <ArrowUpRight /></Link>
    </div>}
    <button className="event-countdown-trigger" type="button" aria-expanded={expanded} aria-label={`${remaining.live ? "Happening now" : `${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes and ${remaining.seconds} seconds until`} the ItaBEES Free Soccer Clinic and BBQ. ${expanded ? "Hide" : "Show"} event details.`} onClick={() => setExpanded(value => !value)}>
      <span className="event-countdown-heading"><span className="event-countdown-dot" aria-hidden="true" /><span className="event-countdown-title">Free Soccer Clinic + BBQ</span><span className={`event-countdown-chevron${expanded ? " is-open" : ""}`} aria-hidden="true" /></span>
      <span className="event-countdown-description">Guest coaches · Saturday, November 21</span>
      {remaining.live ? <strong className="event-countdown-live">Happening now</strong> : <span className="event-countdown-timer" aria-hidden="true">{[[remaining.days,"DAYS"],[remaining.hours,"HRS"],[remaining.minutes,"MIN"],[remaining.seconds,"SEC"]].map(([value,label]) => <span className="event-countdown-unit" key={label}><strong>{twoDigits(value)}</strong><small>{label}</small></span>)}</span>}
    </button>
  </aside>;
}
