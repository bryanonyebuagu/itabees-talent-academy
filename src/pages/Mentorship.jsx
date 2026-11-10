import BrandText from "../components/BrandText";
import { ActionLink, CardGrid, ContentSection, PageHero } from "../components/PageParts";
import { media } from "../data/media";

const areas = [
  ["Academic Expectations","Our players are held to high standards of academic achievement. We emphasize the importance of time management, discipline, and maintaining a strong GPA to ensure a balanced development."],
  ["Life Skills Mentorship","We provide mentorship that goes beyond the classroom. Our coaches and staff work with students to build resilience, responsibility, and the confidence to pursue their dreams."],
  ["Leadership Workshops","Through interactive workshops, we cultivate leadership skills, communication, and emotional intelligence. These sessions are designed to prepare young people for future success in any field."],
  ["College Awareness","We guide athletes through the college application process, helping them understand how to leverage their athletic and academic achievements to open doors to higher education."],
];

export default function Mentorship() {
  return <BrandText><main><PageHero eyebrow="EDUCATION & MENTORSHIP" title="Academic Excellence." image={media.education} imageAlt="Soccer ball on books" description="We believe that success extends beyond the pitch. Our academy integrates rigorous academic support with character development to prepare students for life beyond soccer." />
    <ContentSection eyebrow="LIFE SKILLS & COLLEGE AWARENESS" title="The journey extends far beyond the field." tone="light"><p>At ITABEES Talent Academy, we believe the journey extends far beyond the field. Our mentorship program is designed to equip young athletes with the academic knowledge, leadership skills, and college awareness necessary to thrive in life and beyond.</p><p>We integrate academic expectations into every training session, ensuring students maintain high grades while building their athletic careers.</p><CardGrid items={areas} /></ContentSection>
    <ContentSection eyebrow="GROW AS A PERSON" title="Leadership. Mentorship. Character." image={media.coaching} imageAlt="Coach mentoring young players"><p>Developing leadership skills is a core part of our academy. We provide opportunities for students to lead teams and take initiative.</p><p>Our coaches serve as mentors, guiding young athletes through personal development and helping them navigate their future goals.</p><p>We emphasize integrity, responsibility, and sportsmanship, teaching young people that character is the foundation of any success.</p><p>Access to workshops and resources designed to prepare young people for the challenges of college life and professional careers.</p><ActionLink to="/about" black>Learn more about ItaBEES</ActionLink></ContentSection></main></BrandText>;
}
