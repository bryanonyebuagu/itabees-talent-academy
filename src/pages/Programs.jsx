import BrandText from "../components/BrandText";
import { ActionLink, ContentSection, PageHero } from "../components/PageParts";
import { media } from "../data/media";

export default function Programs() {
  return <BrandText><main><PageHero eyebrow="PROGRAMS" title="Find Your Program." image={media.programs} imageAlt="Coach guiding youth players through a soccer training session" description="Supplemental soccer development that works alongside a player's existing team environment." /><ContentSection eyebrow="BOOK ONLINE" title="Training with purpose."><p>Nothing to book right now. Check back soon.</p><ActionLink to="/contact" black>Ask about training</ActionLink></ContentSection></main></BrandText>;
}
