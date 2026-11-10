import BrandText from "../components/BrandText";
import { ActionLink, ContentSection, PageHero } from "../components/PageParts";
import { media } from "../data/media";

export default function Assessments() {
  return <BrandText><main><PageHero eyebrow="PLAYER ASSESSMENTS" title="Know Where You Are. Understand What's Next." image={media.training} imageAlt="Young player training on the pitch" description="Development becomes more meaningful when players understand what they're working toward." />
    <ContentSection eyebrow="ASSESS. DEVELOP. REASSESS. PROGRESS." title="Clarity for every next step." tone="light"><p>ItaBEES Player Assessments help identify strengths, developmental priorities and areas of opportunity.</p><p>Our goal isn't simply to tell a player how they're performing. It's to give players and families a clearer picture of what to work on next.</p><ActionLink to="/contact" black>Ask about an assessment</ActionLink></ContentSection></main></BrandText>;
}
