import { ActionLink, ContentSection, PageHero } from "../components/PageParts";
import { media } from "../data/media";

const stages = [
  ["01", "LOCAL DEVELOPMENT", "Build the technical foundation, confidence and habits required for long-term growth."],
  ["02", "COMPETITIVE DEVELOPMENT", "Prepare for increasingly challenging environments through advanced training, player assessments and higher-level developmental opportunities."],
  ["03", "COLLEGE EXPOSURE", "Help aspiring student-athletes better understand the college soccer pathway through education, preparation, exposure opportunities and connections."],
  ["04", "INTERNATIONAL EXPERIENCES", "Provide selected players with opportunities to experience different soccer cultures through camps, training experiences, scouting events and international partnerships."],
  ["05", "PROFESSIONAL OPPORTUNITIES", "For players who demonstrate the ability, commitment and readiness, ItaBEES seeks to create access to credible environments where they can be evaluated and continue pursuing higher levels of the game."],
];
export default function PlayerPathway() {
  return <main className="player-pathway-page"><PageHero eyebrow="THE PLAYER PATHWAY" title={<>From Where You Are to <span className="editorial-accent">Where You Want to Go.</span></>} image={media.pathway} imageAlt="ItaBEES player walking toward a guided training session" description="Every player's journey is different. That's why ItaBEES doesn't believe in a one-size-fits-all pathway." dark />
    <ContentSection eyebrow="YOUR JOURNEY" title={<>A direction built <span className="editorial-accent">around you.</span></>}><p>We help families understand where their player is today, identify areas for development and explore opportunities appropriate for their ability, age and ambitions.</p><div className="page-stage-list">{stages.map(([n,title,copy]) => <article key={n}><span>{n}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div><p className="detail-line">Your pathway doesn't have to look like everyone else's. It just needs a direction.</p><ActionLink to="/assessments" black>Explore assessments</ActionLink></ContentSection></main>;
}
