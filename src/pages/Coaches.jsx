import { ActionLink, ContentSection, PageHero } from "../components/PageParts";
import { media } from "../data/media";

export default function Coaches() {
  return <main><PageHero eyebrow="OUR COACHES" title="Coaches. Mentors. Developers." image={media.coaching} mobileImage={media.coachingMobile} imageAlt="Coach guiding ItaBEES players" description="Great coaching is about more than running drills." />
    <ContentSection eyebrow="DEVELOPMENT THROUGH MENTORSHIP" title="The person behind the player."><p>ItaBEES coaches are committed to teaching the game, challenging players appropriately and creating an environment where young athletes feel confident enough to learn, make mistakes and grow.</p><p>We expect our coaches to develop the player while never losing sight of the person behind the player.</p><div className="page-card-grid">{[["Marcus Thorne","Head Coach"],["Elena Rodriguez","Assistant Coach"],["David Chen","Coach"]].map(([name,role]) => <article className="page-card" key={name}><h3>{name}</h3><p>{role}</p></article>)}</div><ActionLink to="/contact" black>Contact the academy</ActionLink></ContentSection></main>;
}
