import { ActionLink, ContentSection, PageHero } from "../components/PageParts";
import { media } from "../data/media";

export default function CommunityImpact() {
  return <main><PageHero className="community-impact-hero" eyebrow="COMMUNITY IMPACT" title={<>Building Players.<br /><span>Creating Opportunities.</span></>} image={media.coaching} imageAlt="ItaBEES coach with young players" description="We want to develop confident young people prepared to succeed wherever their journey takes them." />
    <section className="impact-section"><p className="eyebrow">ITABEES IN THE COMMUNITY</p><div className="stats-grid">{[["1,200+","Players Reached"],["1,500+","Training Hours"],["150+","Community Clinics"],["25+","Scholarships"]].map(([v,l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div></section>
    <ContentSection eyebrow="GET INVOLVED" title="Support the next generation." tone="light"><p>ItaBEES Talent Academy was created around a simple belief: talented and motivated young players deserve access to quality development, strong mentorship and opportunities to see what is possible.</p><ActionLink to="/donate" black>Support ItaBEES</ActionLink></ContentSection></main>;
}
