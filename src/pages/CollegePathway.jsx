import { ActionLink, ContentSection, PageHero } from "../components/PageParts";
import { media } from "../data/media";

export default function CollegePathway() {
  return <main><PageHero eyebrow="COLLEGE PATHWAY" title="Preparing Student-Athletes for More Than the Next Game." image={media.education} imageAlt="Soccer ball and books" description="Playing college soccer requires more than talent." />
    <ContentSection eyebrow="ATHLETICS & EDUCATION" title="A fit for the whole student."><p>Student-athletes must understand academics, recruiting, communication, eligibility, exposure and how to identify programs that fit both their athletic and educational goals.</p><p>ItaBEES helps families navigate that journey with greater clarity while preparing players to confidently present themselves as both students and athletes.</p><ActionLink to="/mentorship" black>Explore mentorship</ActionLink></ContentSection></main>;
}
