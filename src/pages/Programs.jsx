import { ActionLink, ContentSection, PageHero } from "../components/PageParts";
import { media } from "../data/media";

const galleryAssets = import.meta.glob("../assets/gallery folder/*", { eager: true, query: "?url", import: "default" });
const photo = (name) => galleryAssets[`../assets/gallery folder/${name}`];

const programs = [
  {
    title: "Player Development",
    accent: "Academy",
    description: "Our core year-round supplemental training program, designed to complement players’ existing club or recreational soccer commitments. Focus areas include technical skills, game intelligence, physical development, and positional awareness.",
    image: photo("IMG_7400.jpg"),
    alt: "Coach speaking with a small group of young players",
  },
  {
    title: "Individual & Small Group",
    accent: "Training",
    description: "Personalized training sessions designed to address individual development needs, improve technical ability, and build confidence. Available through one-on-one coaching and small-group sessions.",
    image: photo("IMG_7396 (1).jpg"),
    alt: "Young players developing their skills on the training field",
  },
  {
    title: "Soccer Camps &",
    accent: "Clinics",
    description: "Seasonal camps, specialized clinics, and development experiences led by experienced coaches, including guest coaches with professional playing backgrounds. Open to players seeking additional training and exposure to different coaching methods.",
    image: photo("IMG_7398 (1).jpg"),
    alt: "Players and coaches taking part in a group training session",
  },
  {
    title: "Leadership & Character",
    accent: "Development",
    description: "We prepare players for success beyond soccer by equipping them with the character, leadership skills, life skills, and a growth mindset needed to thrive on and off the field. Through mentorship from coaches, former professional and college players, educators, business professionals, and community leaders, players learn to lead with confidence, make sound decisions, overcome adversity, and positively impact their teams, schools, and communities, as well as understanding the demands of higher-level soccer.",
    image: photo("IMG_7402 (1).jpg"),
    alt: "Young athletes and mentors gathered at an ItaBEES academy event",
  },
  {
    title: "International Development &",
    accent: "Exposure",
    description: "Opportunities to participate in international training camps, tournaments, and development experiences through academy partnerships. Designed to introduce players to different playing environments, coaching philosophies, and potential development pathways.",
    image: media.internationalHomeDesktop,
    alt: "Young players and mentors at an international soccer event",
  },
];

export default function Programs() {
  return <main className="programs-page">
    <PageHero eyebrow="OUR PROGRAMS" title={<>Find your <span className="editorial-accent">program.</span></>} image={media.programs} imageAlt="Coach guiding youth players through a soccer training session" description="Supplemental soccer development that works alongside a player's existing team environment." />
    <section className="programs-list" aria-labelledby="programs-list-title">
      <div className="programs-list-intro"><p className="eyebrow">ALL PROGRAMS</p><h2 id="programs-list-title">Development with <span>purpose.</span></h2></div>
      {programs.map((program) => <article className="program-feature" key={program.title}>
        <div className="program-feature-copy"><h3>{program.title} <span>{program.accent}</span></h3><p>{program.description}</p></div>
        <div className="program-feature-image"><img src={program.image} alt={program.alt} loading="lazy" /></div>
      </article>)}
    </section>
    <ContentSection eyebrow="BOOK ONLINE" title={<>Training with <span className="editorial-accent">purpose.</span></>}><p>Nothing to book right now. Check back soon.</p><ActionLink to="/contact" black>Ask about training</ActionLink></ContentSection>
  </main>;
}
