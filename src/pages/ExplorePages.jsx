import { useState } from "react";
import { Link } from "react-router-dom";
import ArrowUpRight from "../components/ArrowUpRight";
import ContactForm from "../components/ContactForm";
import { ActionLink } from "../components/PageParts";
import { media } from "../data/media";

function ExploreHero({ eyebrow, title, description, image, mobileImage, imageAlt }) {
  return <section className={`explore-hero ${image ? "explore-hero-with-image" : ""}`}><div className="explore-hero-copy"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>{image && <div className="explore-hero-photo"><picture>{mobileImage && <source media="(max-width: 700px)" srcSet={mobileImage} />}<img src={image} alt={imageAlt} /></picture></div>}</section>;
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
  return <main className="explore-page gallery-page"><ExploreHero eyebrow="INSIDE ITABEES" title={<>The academy <em>in action.</em></>} description="A closer look at the training, coaching, camps and community that shape the ItaBEES experience." image={media.team} imageAlt="ItaBEES coaching team" /><section className="explore-gallery-section"><div className="explore-section-heading"><p className="eyebrow">PHOTO GALLERY</p><h2>Every session tells <em>a story.</em></h2></div><div className="explore-filters" role="group" aria-label="Filter gallery photos">{galleryFilters.map(item => <button key={item} type="button" className={filter === item ? "is-selected" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="explore-gallery-grid">{visible.map(item => <figure key={item.label}><img src={item.image} alt={item.alt} loading="lazy" /><figcaption><span>{item.category}</span><strong>{item.label}</strong></figcaption></figure>)}</div></section><ExploreCta eyebrow="BE PART OF IT" title={<>See where your player <em>can grow.</em></>} description="Explore our programs and find a place to begin." primary={["Explore programs", "/programs"]} secondary={["About ItaBEES", "/about"]} /></main>;
}

const faqGroups = [
  { title: "Players &", accent: "Families", questions: [
    ["Who is the Player Development Program for?", "The published Player Development Program serves ages 6–18. It is designed for players who are starting their soccer journey as well as players already competing at an advanced level. Training meets each player where they are and gives them purposeful challenges for their stage of development."],
    ["Does ItaBEES replace my player's current team?", "No. ItaBEES provides supplemental development alongside a player's existing soccer environment. The aim is to give players more focused practice and individual guidance while they continue participating with their current team."],
    ["What does training focus on?", "Sessions work on technical mastery, tactical understanding, decision-making, confidence and individual growth. That can include ball control, passing, dribbling and finishing, as well as learning how to read the game and play with others. Character, leadership and resilience are part of the wider development approach."],
    ["What training formats are available?", "The Player Development page lists small group training, individual training and player assessments. Camps and clinics add opportunities to train, compete and learn outside a player's regular team environment. Ask the academy which options are currently available for your player."],
    ["Where and when do training sessions take place?", "ItaBEES serves athletes in the Charlotte area. Current session times, locations and availability are not published in the online booking page, so contact the academy for the latest details before making plans."],
    ["Is there a published training price?", "The website does not currently list a training rate. Costs may depend on the program or session being discussed. Send an inquiry and ask the academy to confirm the current details before enrolling."],
  ] },
  { title: "Pathways &", accent: "Opportunities", questions: [
    ["What happens in a player assessment?", "ItaBEES uses assessments to help identify a player's strengths, developmental priorities and areas of opportunity. The purpose is to give players and families a clearer picture of what to work on next, then use that understanding to guide continued development."],
    ["How does the player pathway work?", "A player's pathway is built around where they are now, their age, ability and ambitions. ItaBEES helps families understand the current stage, identify areas to improve and explore opportunities that may be appropriate as the player develops. It does not have to look identical for every player."],
    ["Does ItaBEES help with college soccer preparation?", "The College Pathway focuses on understanding academics, recruiting, communication, eligibility, exposure and how to identify programs that fit a student's athletic and educational goals. ItaBEES aims to help families navigate those topics with greater clarity while players develop on and off the field."],
    ["What are international experiences?", "International experiences may introduce selected players to different training environments, coaching philosophies and levels of competition. They are intended as chances to learn, compete, be evaluated and better understand the demands of higher levels of the game. Ask the academy about any current opportunities and who they are appropriate for."],
    ["Are college, international or professional opportunities guaranteed?", "No. Development and exposure can help a player prepare, but they do not guarantee selection, placement or a professional outcome. ItaBEES describes these as opportunities to explore and pursue when a player demonstrates the relevant ability, commitment and readiness."],
  ] },
  { title: "Camps, Events &", accent: "Mentorship", questions: [
    ["What happens at camps and clinics?", "Camps and clinics give players additional opportunities to train, compete and learn outside their regular team environment. The site describes school-break and summer camps, position-specific clinics and special guest coaching events as examples. Each experience is designed with a developmental purpose rather than simply adding more playing time."],
    ["How can I find upcoming camps or events?", "Visit the Events page for published opportunities. If no event is listed, use the contact page to ask what is being planned. Dates, places and registration details should be confirmed with the academy before attending."],
    ["What role does mentorship play?", "ItaBEES coaches aim to develop the person behind the player. Mentorship supports qualities such as confidence, responsibility, respect, leadership and resilience, alongside soccer training. The academy also encourages players to value education and prepare for life beyond the pitch."],
    ["Who are the coaches?", "The Coaches page introduces Marcus Thorne, Elena Rodriguez and David Chen, including their roles and approach to player development. Visit that page to see their profiles and learn more about the people guiding academy sessions."],
  ] },
  { title: "Support &", accent: "Contact", questions: [
    ["How do I get started with ItaBEES?", "Start with the Player Development, Programs or Eligibility page to understand the options. Then use Apply Now to tell the academy about your player and their goals. Nothing is available to book online right now, so the team can help identify a suitable next step through an inquiry."],
    ["Is there a formal eligibility checklist?", "The site publishes ages 6–18 for Player Development and explains that training is adapted to different stages. It does not publish a universal set of admission requirements for every camp, event or pathway. Contact ItaBEES about a specific opportunity so the team can explain its current fit and availability."],
    ["How can I support the academy?", "You can explore donating, volunteering, mentoring or discussing a partnership. The Get Involved page brings these starting points together, while the Donate page explains the development areas a gift may support. You can also share relevant skills or ask the academy where help is needed."],
    ["How do I ask a question that is not answered here?", "Use the Contact page or email info@itabeestalentacademy.com. Include the player's age and the program or opportunity you are asking about when relevant, so the academy can direct your question to the right place."],
  ] },
];

export function FAQ() {
  return <main className="explore-page"><ExploreHero eyebrow="HERE TO HELP" title={<>Frequently asked <em>questions.</em></>} description="Clear answers about training, pathways and getting involved with ItaBEES Talent Academy." /><div className="explore-quick-links"><Link to="/eligibility">Eligibility <ArrowUpRight /></Link><Link to="/player-development">Training Sessions <ArrowUpRight /></Link><Link to="/register">Apply Now <ArrowUpRight /></Link><Link to="/contact">Contact <ArrowUpRight /></Link></div><section className="explore-faq-section">{faqGroups.map(group => <div className="explore-faq-group" key={group.title}><h2>{group.title} <span className="editorial-accent">{group.accent}</span></h2><div>{group.questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div>)}</section><ExploreCta eyebrow="STILL HAVE A QUESTION?" title={<>Let's <em>talk.</em></>} description="Tell us what you would like to know and we will point you toward the right next step." primary={["Contact the academy", "/contact"]} /></main>;
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
  return <main className="explore-page eligibility-page"><ExploreHero eyebrow="BEFORE YOU BEGIN" title={<>Find your <em>starting point.</em></>} description="ItaBEES meets players where they are and helps families explore development that fits their age, ability and ambitions." image={media.eligibilityDesktop} mobileImage={media.eligibilityMobile} imageAlt="ItaBEES football academy team and coaches lined up for a group portrait" /><section className="explore-eligibility-section"><div className="explore-section-heading"><p className="eyebrow">WHO CAN START?</p><h2>A place to <em>keep growing.</em></h2><p>These are the published starting points for ItaBEES Player Development. For a specific program or event, ask the academy about current availability.</p></div><div className="explore-info-grid">{eligibilityCards.map(([title, body], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section><section className="explore-standards"><div><p className="eyebrow">THE ITABEES WAY</p><h2>Growth goes <em>beyond the field.</em></h2></div><div>{standards.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></section><ExploreCta eyebrow="READY TO EXPLORE?" title={<>Tell us about <em>your player.</em></>} description="Send an inquiry and the team can help with a suitable next step." primary={["Apply now", "/register"]} secondary={["Ask a question", "/contact"]} /></main>;
}

const waysToHelp = [
  ["Volunteer", "Offer your time and skills to support academy activities and young players.", "/contact"],
  ["Mentor", "Help young athletes develop confidence, leadership and personal qualities beyond football.", "/mentorship"],
  ["Partner", "Discuss support for training, equipment, camps, mentorship or community events.", "/donate#partner"],
  ["Give", "Support young players, their development and the opportunities that help shape their future.", "/donate"],
];

export function GetInvolved() {
  return <main className="explore-page get-involved-page"><ExploreHero eyebrow="JOIN THE JOURNEY" title={<>Help create <em>opportunity.</em></>} description="ItaBEES grows through people who share their time, knowledge and support. Find a way to contribute to young players' development." image={media.coaching} imageAlt="Coach working with young ItaBEES players" /><section className="explore-involved-section"><div className="explore-section-heading"><p className="eyebrow">WAYS TO GET INVOLVED</p><h2>Find your <em>role.</em></h2></div><div className="explore-info-grid">{waysToHelp.map(([title, body, to], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p><Link to={to}>Explore this way <ArrowUpRight /></Link></article>)}</div></section><section className="explore-contact-section"><div><p className="eyebrow">TELL US HOW YOU CAN HELP</p><h2>Start a <em>conversation.</em></h2><p>Share your interests or experience with the academy. You can also email <a href="mailto:info@itabeestalentacademy.com">info@itabeestalentacademy.com</a>.</p></div><ContactForm defaultInquiry="Volunteer" /></section></main>;
}
