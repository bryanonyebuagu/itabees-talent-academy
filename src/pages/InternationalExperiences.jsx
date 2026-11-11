import { ActionLink, ContentSection, PageHero } from "../components/PageParts";
import { media } from "../data/media";

export default function InternationalExperiences() {
  return <main className="international-page"><PageHero eyebrow="INTERNATIONAL EXPERIENCES" title={<>The Game Is Global. <span className="editorial-accent">Your Perspective Should Be Too.</span></>} image={media.team} imageAlt="ItaBEES coaches and academy banner" description="Soccer can introduce young players to people, cultures and opportunities far beyond their local community." />
    <ContentSection eyebrow="OPEN UP THE POSSIBILITIES" title="Learn. Compete. Be evaluated." tone="light"><p>Through strategic relationships and international experiences, ItaBEES aims to expose players to different training environments, coaching philosophies and levels of competition.</p><p>These experiences aren't shortcuts or guarantees. They are opportunities to learn, compete, be evaluated and better understand what higher levels of the game demand.</p><ActionLink to="/contact" black>Ask about opportunities</ActionLink></ContentSection></main>;
}
