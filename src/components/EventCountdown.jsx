import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowUpRight from "./ArrowUpRight";

// The clinic is in Charlotte, North Carolina (EST on November 21).
const eventStart = Date.parse("2026-11-21T11:00:00-05:00");
const eventEnd = Date.parse("2026-11-21T14:00:00-05:00");

function getRemaining() {
  const now = Date.now();
  if (now >= eventEnd) return null;
  if (now >= eventStart) return "Happening now";
  const minutes = Math.ceil((eventStart - now) / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h left`;
  return `${minutes}m left`;
}

export default function EventCountdown() {
  const [remaining, setRemaining] = useState(getRemaining);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining()), 60000);
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
    <button className="event-countdown-trigger" type="button" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>
      <span className="event-countdown-dot" aria-hidden="true" />
      <span className="event-countdown-title">Free Soccer Clinic</span>
      <strong>{remaining}</strong>
      <span className={`event-countdown-chevron${expanded ? " is-open" : ""}`} aria-hidden="true" />
    </button>
  </aside>;
}
