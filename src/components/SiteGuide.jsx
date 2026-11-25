import { useState } from "react";
import { Link } from "react-router-dom";
import { formatCheckoutAmount } from "../data/checkoutPrograms";
import ArrowUpRight from "./ArrowUpRight";

const topics = [
  { key: "programs", words: /program|training|academy|enroll|sign up|register|price|cost|fee/i, link: "/programs", label: "Explore programs", answer: "ItaBEES offers recreational and elite supplemental training, private sessions, mentorship, camps and international experiences. Published pricing is on the registration page; checkout is currently in test mode." },
  { key: "camp", words: /camp|clinic|summer|bbq/i, link: "/camps-and-clinics", label: "Camps & Clinics", answer: "Camps and clinics provide additional chances to train, compete and learn beyond a player's regular team. The official launch clinic details are on the Camps & Clinics page." },
  { key: "pathway", words: /pathway|college|professional|scout|scholarship/i, link: "/player-pathway", label: "Player Pathway", answer: "The Player Pathway page explains development, college, professional and international directions. ItaBEES helps families explore a path suited to each player." },
  { key: "donate", words: /donat|gift|support the academy/i, link: "/donate", label: "Donate", answer: "The Donate page lets you choose a suggested or custom one-time amount. The payment checkout is currently in Stripe test mode." },
  { key: "team", words: /coach|team|mentor/i, link: "/coaches", label: "Our Team", answer: "Meet the ItaBEES advisory council and learn about its mentorship and player pathways experience on Our Team." },
  { key: "eligibility", words: /eligible|age|u6|u19|qualif/i, link: "/eligibility", label: "Eligibility", answer: "Eligibility depends on the specific program or event. The Eligibility page lists the academy's published starting points. Contact the academy for current availability." },
  { key: "events", words: /event|schedule|when|date/i, link: "/events", label: "News & Events", answer: "Upcoming academy events and current details are listed on the Events page. Camps & Clinics also has the launch clinic details." },
  { key: "contact", words: /contact|phone|email|speak|help/i, link: "/contact", label: "Contact", answer: "Use the Contact page to reach ItaBEES. Registered members can also send a support message from their dashboard." },
  { key: "account", words: /login|log in|dashboard|password|account/i, link: "/login", label: "Member login", answer: "Sign in to see your verified program registration. If you have forgotten your password, use the reset link on the login page." },
];

function reply(question, previous) {
  const lower = question.toLowerCase();
  const direct = topics.find(topic => topic.words.test(question));
  const topic = direct || (/^(and|what about|how about|how much|where|when|tell me more|does it)/i.test(lower) ? topics.find(item => item.key === previous) : null);
  if (!topic) return { answer: "I can help you find programs, registration, pathways, camps, events, donations, your account, or contact details. What would you like to know?", link: "/faq", label: "Browse FAQs", key: previous };
  if (topic.key === "programs" && /price|cost|fee|how much/.test(lower)) return { answer: `Published supplemental training is ${formatCheckoutAmount(6900)}–${formatCheckoutAmount(13900)} per month per player, with $10 off monthly for each additional sibling. Private sessions are priced separately. Camps and trips are priced when announced.`, link: "/register", label: "View pricing", key: topic.key };
  if (topic.key === "programs" && /register|enroll|sign up/.test(lower)) return { answer: "Choose a program on the registration page. Enter the participant and guardian details, verify the guardian email, then continue to Stripe test checkout. After payment, use the emailed link to set up your login. The academy must approve the registration before dashboard access opens.", link: "/register", label: "Register for training", key: topic.key };
  return topic;
}

export default function SiteGuide() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [context, setContext] = useState("");
  const [messages, setMessages] = useState([{ role: "guide", answer: "Hi! Ask me about programs, navigating the site, registration, or your member dashboard.", link: "/programs", label: "Explore programs" }]);
  const send = event => { event.preventDefault(); const question = draft.trim(); if (!question) return; const answer = reply(question, context); setMessages(items => [...items, { role: "you", answer: question }, { role: "guide", ...answer }]); setContext(answer.key); setDraft(""); };
  return <div className="site-guide"><button className="site-guide-toggle" type="button" aria-expanded={open} aria-controls="site-guide-panel" onClick={() => setOpen(!open)}>{open ? "Close help" : "Ask ItaBEES"}</button>{open && <section className="site-guide-panel" id="site-guide-panel" aria-label="ItaBEES site guide"><header><strong>ItaBEES site guide</strong><span>Programs & navigation</span></header><div className="site-guide-messages" aria-live="polite">{messages.map((message,index) => <div className={`site-guide-message ${message.role}`} key={index}><p>{message.answer}</p>{message.link && <Link to={message.link} onClick={() => setOpen(false)}>{message.label} <ArrowUpRight /></Link>}</div>)}</div><form onSubmit={send}><label className="sr-only" htmlFor="site-guide-question">Ask a question</label><input id="site-guide-question" maxLength="300" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ask about a program…" /><button type="submit">Send</button></form><small>Answers use published site information. For personal advice, contact the academy.</small></section>}</div>;
}
