import { ActionLink, ContentSection, PageHero } from "../components/PageParts";
import { media } from "../data/media";

const pathways = [
  { title: "Player Development", accent: "Pathway", paragraphs: ["Building technically skilled, confident, intelligent players through supplemental training, mentorship, and character development."] },
  { title: "College Soccer", accent: "Pathway", paragraphs: ["Preparing student-athletes for collegiate soccer through recruitment guidance, academic awareness, mentorship, and exposure to scholarship opportunities."] },
  { title: "Professional Soccer", accent: "Pathway", paragraphs: ["Supporting aspiring professionals through advanced player development, mentorship from experienced professionals, and connections within the soccer industry. We create access to credible environments where they can be evaluated and continue pursuing higher levels of the game."] },
  { title: "International", accent: "Pathway", paragraphs: ["Connecting players to global soccer experiences through international camps, tournaments, partner-club visits, professional mentorship, and potential scouting opportunities.", "Designed to expose players to different soccer cultures, coaching philosophies, and potential scouting and player evaluation opportunities."] },
];
export default function PlayerPathway() {
  return <main className="player-pathway-page"><PageHero eyebrow="OUR PLAYER PATHWAYS" title={<>EVERY PLAYER HAS A PATH. <span className="editorial-accent">WE HELP THEM PREPARE FOR IT.</span></>} image={media.pathway} imageAlt="ItaBEES player walking toward a guided training session" description="Every player's journey is different. That's why ItaBEES doesn't believe in a one-size-fits-all pathway." dark />
    <ContentSection eyebrow="OUR PLAYER PATHWAYS" title={<>A direction built <span className="editorial-accent">around you.</span></>}><p>We help families understand where their player is today, identify areas for development and explore opportunities appropriate for their ability, age and ambitions.</p><div className="pathway-program-list">{pathways.map(({ title, accent, paragraphs }) => <article key={title}><h3>{title} <span>{accent}</span></h3>{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</article>)}</div><p className="detail-line">Your pathway doesn't have to look like everyone else's. It just needs a direction.</p><ActionLink to="/assessments" black>Explore the Player Pathway</ActionLink></ContentSection></main>;
}
