import { useState } from "react";
import { Link } from "react-router-dom";
import ArrowUpRight from "../components/ArrowUpRight";
import ContactForm from "../components/ContactForm";
import { ActionLink } from "../components/PageParts";
import { media } from "../data/media";

function ExploreHero({ eyebrow, title, description, image, imageAlt }) {
  return <section className={`explore-hero ${image ? "explore-hero-with-image" : ""}`}><div className="explore-hero-copy"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{image && <div className="explore-hero-photo"><img src={image} alt={imageAlt} /></div>}</section>;
}

function ExploreCta({ eyebrow, title, description, primary, secondary }) {
  return <section className="explore-cta"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p><div><ActionLink to={primary[1]}>{primary[0]}</ActionLink>{secondary && <Link className="explore-secondary-link" to={secondary[1]}>{secondary[0]} <ArrowUpRight /></Link>}</div></section>;
}

const galleryItems = [
  { image: media.training, alt: "Young ItaBEES player working with the ball", category: "Training", label: "Purposeful practice" },
  { image: media.coaching, alt: "Coach mentoring young ItaBEES players", category: "Coaching", label: "Learning together" },
  { image: media.campDesktop, alt: "ItaBEES players at a training camp", category: "Camps", label: "Camp sessions" },
  { image: media.programs, alt: "Coach and player in a focused training exercise", category: "Training", label: "Individual development" },
  { image: media.coachMarcus, alt: "Coach Marcus Thorne", category: "Coaching", label: "Meet the coaches" },
  { image: media.campMobile, alt: "Players developing skills at camp", category: "Camps", label: "More touches" },
  { image: media.eventsHero, alt: "Young athletes at an ItaBEES event", category: "Events", label: "Academy moments" },
  { image: media.team, alt: "ItaBEES coaching team and academy banner", category: "Academy", label: "The ItaBEES community" },
];
const galleryFilters = ["All", "Training", "Coaching", "Camps", "Events", "Academy"];

export function Gallery() {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? galleryItems : galleryItems.filter(item => item.category === filter);
  return <main className="explore-page"><ExploreHero eyebrow="INSIDE ITABEES" title={<>The academy <em>in action.</em></>} description="A closer look at the training, coaching, camps and community that shape the ItaBEES experience." image={media.team} imageAlt="ItaBEES coaching team" /><section className="explore-gallery-section"><div className="explore-section-heading"><p className="eyebrow">PHOTO GALLERY</p><h2>Every session tells <em>a story.</em></h2></div><div className="explore-filters" role="group" aria-label="Filter gallery photos">{galleryFilters.map(item => <button key={item} type="button" className={filter === item ? "is-selected" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="explore-gallery-grid">{visible.map(item => <figure key={item.label}><img src={item.image} alt={item.alt} loading="lazy" /><figcaption><span>{item.category}</span><strong>{item.label}</strong></figcaption></figure>)}</div></section><ExploreCta eyebrow="BE PART OF IT" title={<>See where your player <em>can grow.</em></>} description="Explore our programs and find a place to begin." primary={["Explore programs", "/programs"]} secondary={["About ItaBEES", "/about"]} /></main>;
}

const faqGroups = [
  { title: "Players & families", questions: [
    ["Who is the Player Development Program for?", "The Player Development Program serves ages 6–18, from players beginning their soccer journey to those already competing at an advanced level."],
    ["Does ItaBEES replace my player's current team?", "ItaBEES provides supplemental training that works alongside a player's existing team environment."],
    ["What kinds of training are available?", "The program includes small group training, individual training and player assessments. Camps and clinics provide additional opportunities to train and learn."],
    ["Can I book a session online now?", "Nothing is available to book online right now. Send an inquiry and the team can help with the next step."],
  ] },
  { title: "Pathways & opportunities", questions: [
    ["How does the player pathway work?", "ItaBEES helps families understand where a player is today, identify areas for development and explore opportunities appropriate for their ability, age and ambitions."],
    ["Are college or international opportunities guaranteed?", "No. These are opportunities to learn, prepare, compete and be evaluated. They are not shortcuts or guarantees."],
  ] },
  { title: "Support & contact", questions: [
    ["How can I support ItaBEES?", "You can donate, discuss a partnership, volunteer your time or share relevant expertise. Visit Get Involved to choose a starting point."],
    ["How do I ask another question?", "Use the contact page or email info@itabeestalentacademy.com. The academy can help direct your inquiry."],
  ] },
];

export function FAQ() {
  return <main className="explore-page"><ExploreHero eyebrow="HERE TO HELP" title={<>Frequently asked <em>questions.</em></>} description="Clear answers about training, pathways and getting involved with ItaBEES Talent Academy." /><div className="explore-quick-links"><Link to="/eligibility">Eligibility <ArrowUpRight /></Link><Link to="/player-development">Training Sessions <ArrowUpRight /></Link><Link to="/register">Apply Now <ArrowUpRight /></Link><Link to="/contact">Contact <ArrowUpRight /></Link></div><section className="explore-faq-section">{faqGroups.map(group => <div className="explore-faq-group" key={group.title}><h2>{group.title}</h2><div>{group.questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div>)}</section><ExploreCta eyebrow="STILL HAVE A QUESTION?" title={<>Let's <em>talk.</em></>} description="Tell us what you would like to know and we will point you toward the right next step." primary={["Contact the academy", "/contact"]} /></main>;
}

const eligibilityCards = [
  ["Player development", "Ages 6–18. Training is designed for players at different stages, with support matched to where each player is in their development."],
  ["Existing team", "ItaBEES is supplemental. Players can continue training and competing in their current soccer environment."],
  ["Family conversation", "Families can share their player's goals and ask about programs, assessments or upcoming opportunities before taking the next step."],
];
const standards = [
  ["Character", "Integrity, discipline, resilience, respect, responsibility and leadership."],
  ["Excellence", "A commitment to continually learn, improve and give your best."],
  ["Education", "Academic achievement alongside athletic development."],
  ["Soccer", "Purposeful training, game understanding and a lifelong love for the sport."],
];

export function Eligibility() {
  return <main className="explore-page"><ExploreHero eyebrow="BEFORE YOU BEGIN" title={<>Find your <em>starting point.</em></>} description="ItaBEES meets players where they are and helps families explore development that fits their age, ability and ambitions." image={media.training} imageAlt="Young ItaBEES player in training" /><section className="explore-eligibility-section"><div className="explore-section-heading"><p className="eyebrow">WHO CAN START?</p><h2>A place to <em>keep growing.</em></h2><p>These are the published starting points for ItaBEES Player Development. For a specific program or event, ask the academy about current availability.</p></div><div className="explore-info-grid">{eligibilityCards.map(([title, body], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section><section className="explore-standards"><div><p className="eyebrow">THE ITABEES WAY</p><h2>Growth goes <em>beyond the field.</em></h2></div><div>{standards.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></section><ExploreCta eyebrow="READY TO EXPLORE?" title={<>Tell us about <em>your player.</em></>} description="Send an inquiry and the team can help with a suitable next step." primary={["Apply now", "/register"]} secondary={["Ask a question", "/contact"]} /></main>;
}

const waysToHelp = [
  ["Volunteer", "Offer your time and skills to support academy activities and young players.", "/contact"],
  ["Mentor", "Help young athletes develop confidence, leadership and personal qualities beyond football.", "/mentorship"],
  ["Partner", "Discuss support for training, equipment, camps, mentorship or community events.", "/donate#partner"],
  ["Give", "Support young players, their development and the opportunities that help shape their future.", "/donate"],
];

export function GetInvolved() {
  return <main className="explore-page"><ExploreHero eyebrow="JOIN THE JOURNEY" title={<>Help create <em>opportunity.</em></>} description="ItaBEES grows through people who share their time, knowledge and support. Find a way to contribute to young players' development." image={media.coaching} imageAlt="Coach working with young ItaBEES players" /><section className="explore-involved-section"><div className="explore-section-heading"><p className="eyebrow">WAYS TO GET INVOLVED</p><h2>Find your <em>role.</em></h2></div><div className="explore-info-grid">{waysToHelp.map(([title, body, to], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p><Link to={to}>Explore this way <ArrowUpRight /></Link></article>)}</div></section><section className="explore-contact-section"><div><p className="eyebrow">TELL US HOW YOU CAN HELP</p><h2>Start a <em>conversation.</em></h2><p>Share your interests or experience with the academy. You can also email <a href="mailto:info@itabeestalentacademy.com">info@itabeestalentacademy.com</a>.</p></div><ContactForm defaultInquiry="Volunteer" /></section></main>;
}
