import { PageHero } from "../components/PageParts";
import { media } from "../data/media";

const teamImages = import.meta.glob("../assets/the team/*", { eager: true, query: "?url", import: "default" });
const teamPhoto = (name) => teamImages[`../assets/the team/${name}`];

const council = [
  {
    name: "Eyong Enoh",
    role: "Former Professional Soccer Player & Cameroon International",
    image: teamPhoto("Eyong Enoh Tarkang.jpg"),
    bio: "Eyong Enoh is a former professional footballer who represented Cameroon on the international stage, including at the FIFA World Cup. He enjoyed a distinguished career in European football, playing for clubs such as Ajax Amsterdam, Fulham FC, and Standard Liège. He brings valuable international experience, professional insight, and a passion for mentoring the next generation of soccer talent.",
  },
  {
    name: "Eric Djemba Djemba",
    role: "Former Professional Soccer Player & Cameroon International",
    image: teamPhoto("Eric Djemba Djemba.jpg"),
    bio: "Eric Djemba Djemba is a former Manchester United midfielder and Cameroon international with FIFA World Cup experience, bringing his elite-level expertise and global soccer experience to ItaBEES Talent Academy to mentor and inspire the next generation of players.",
  },
  {
    name: "Augustine Simo",
    role: "Former Professional Soccer Player & Cameroon International",
    image: teamPhoto("Augustine Simo.jpg"),
    bio: "Augustine Simo is a former Cameroon international, professional footballer, and Cameroon National Team Assistant Coach, bringing his elite coaching experience and international expertise to ItaBEES Talent Academy to mentor and develop aspiring soccer players.",
  },
  {
    name: "Tiyiselani Shipalane",
    role: "Former College and Professional Soccer Player",
    image: teamPhoto("Tiyiselani Shipalane.jpg"),
    bio: "Tiyiselani Shipalane brings experience from college and professional soccer to the council's player mentorship and development work.",
  },
];

export default function Coaches() {
  return <main className="team-page"><PageHero eyebrow="OUR TEAM" title={<>The people behind <span className="editorial-accent">the pathway.</span></>} image={media.coaching} mobileImage={media.coachingMobile} imageAlt="Coach guiding ItaBEES players" description="Great coaching is about more than running drills." />
    <section className="team-council" aria-labelledby="team-council-title">
      <div className="team-council-intro"><p className="eyebrow">OUR PEOPLE</p><h2 id="team-council-title">Technical & Player Pathways <span>Advisory Council.</span></h2><p>The ItaBEES Talent Academy Technical & Player Pathways Advisory Council brings together experienced current and former professional footballers and college soccer experts to support the academy's technical development, player mentorship, coaching excellence, and college and professional pathways.</p><p>Working in collaboration with the Academy Director, the council provides strategic guidance, industry expertise, and access to valuable networks to help prepare young athletes for opportunities in collegiate and professional soccer.</p></div>
      <article className="team-feature"><div className="team-feature-photo"><img src={council[0].image} alt={council[0].name} loading="lazy" /></div><div className="team-feature-copy"><p className="eyebrow">TECHNICAL & PLAYER PATHWAYS ADVISORY COUNCIL</p><h3>{council[0].name}</h3><strong>{council[0].role}</strong><p>{council[0].bio}</p></div></article>
      <div className="team-council-grid">{council.slice(1).map((member) => <article className="team-member" key={member.name}><div className="team-member-photo"><img src={member.image} alt={member.name} loading="lazy" /></div><div className="team-member-copy"><p className="eyebrow">ADVISORY COUNCIL</p><h3>{member.name}</h3><strong>{member.role}</strong><p>{member.bio}</p></div></article>)}</div>
    </section>
  </main>;
}
