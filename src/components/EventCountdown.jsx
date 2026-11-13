import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowUpRight from "./ArrowUpRight";

// Add future events here using their local start time and UTC offset.
const upcomingEvents = [
  {
    title: "Free Soccer Clinic",
    accent: "+ BBQ",
    startsAt: "2026-11-21T11:00:00-05:00", // Charlotte, EST
    detailsPath: "/camps-and-clinics",
  },
];

function getCountdown() {
  const now = Date.now();
  const event = upcomingEvents
    .map(item => ({ ...item, timestamp: Date.parse(item.startsAt) }))
    .filter(item => Number.isFinite(item.timestamp) && item.timestamp > now)
    .sort((a, b) => a.timestamp - b.timestamp)[0];
  if (!event) return null;

  const seconds = Math.max(0, Math.ceil((event.timestamp - now) / 1000));
  return {
    event,
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

const twoDigits = value => String(value).padStart(2, "0");

export default function EventCountdown() {
  const [countdown, setCountdown] = useState(getCountdown);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const update = () => setCountdown(getCountdown());
    const timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const closeOnEscape = event => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [expanded]);

  if (!countdown) return null;
  const { event, days, hours, minutes, seconds } = countdown;

  return <aside className={`event-countdown${expanded ? " is-expanded" : ""}`} aria-label="Upcoming event countdown">
    <div className="event-countdown-header">
      <span className="event-countdown-dot" aria-hidden="true" />
      <span className="event-countdown-kicker">Upcoming Event</span>
      <button className="event-countdown-toggle" type="button" aria-label={expanded ? "Collapse event countdown" : "Expand event countdown"} aria-expanded={expanded} aria-controls="event-countdown-extra" onClick={() => setExpanded(value => !value)}><span className="event-countdown-chevron" aria-hidden="true" /></button>
    </div>
    <strong className="event-countdown-title">{event.title} {event.accent && <span>{event.accent}</span>}</strong>
    <div className="event-countdown-timer" role="timer" aria-label={`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`}>
      {[[days,"Days"],[hours,"Hours"],[minutes,"Minutes"],[seconds,"Seconds"]].map(([value,label], index) => <span className="event-countdown-unit" key={label}>{index > 0 && <span className="event-countdown-separator" aria-hidden="true">:</span>}<span><strong>{index === 0 ? value : twoDigits(value)}</strong><small>{label}</small></span></span>)}
    </div>
    <div className="event-countdown-extra" id="event-countdown-extra" aria-hidden={!expanded}>
      <div><Link to={event.detailsPath} tabIndex={expanded ? 0 : -1} onClick={() => setExpanded(false)}>View More Details <ArrowUpRight /></Link></div>
    </div>
  </aside>;
}
