import { ActionLink, ContentSection, PageHero } from "../components/PageParts";
import { media } from "../data/media";
import { coachingTeam } from "../data/coachingTeam";
import CoachPraise from "../components/CoachPraise";

export default function Coaches() {
  return <main><PageHero eyebrow="OUR COACHES" title={<>MEET OUR <span className="editorial-accent">ESTEEMED COACHES.</span></>} image={media.coaching} mobileImage={media.coachingMobile} imageAlt="Coach guiding ItaBEES players" description="Great coaching is about more than running drills." />
    <ContentSection eyebrow="DEVELOPMENT THROUGH MENTORSHIP" title={<>The person behind <span className="editorial-accent">the player.</span></>}><p>ItaBEES coaches are committed to teaching the game, challenging players appropriately and creating an environment where young athletes feel confident enough to learn, make mistakes and grow.</p><p>We expect our coaches to develop the player while never losing sight of the person behind the player.</p><div className="page-card-grid coach-card-grid">{coachingTeam.map(({ name, role, image, praise }) => <article className="page-card coach-card" key={name}><div className="coach-card-photo"><img src={image} alt={`${name}, ${role}`} loading="lazy" /><div className="coach-card-label"><h3>{name}</h3><p>{role}</p></div><p className="coach-card-praise"><CoachPraise text={praise} /></p></div></article>)}</div><ActionLink to="/contact" black>Contact the academy</ActionLink></ContentSection></main>;
}
