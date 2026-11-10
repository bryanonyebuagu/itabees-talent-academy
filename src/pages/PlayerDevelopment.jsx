import { ActionLink, ContentSection, PageHero } from "../components/PageParts";
import { media } from "../data/media";

const developmentValues = [
  ["TECHNICAL DEVELOPMENT", "Build confidence on the ball through focused training in passing, dribbling, ball control and finishing."],
  ["TACTICAL UNDERSTANDING", "Develop game intelligence, decision-making and a better understanding of how to play as part of a team."],
  ["MENTAL STRENGTH", "Build discipline, resilience, confidence and the mindset needed to keep improving."],
  ["PERSONAL GROWTH", "Encourage leadership, respect, teamwork and the personal qualities that matter beyond football."],
];

export default function PlayerDevelopment() {
  return <main><PageHero eyebrow="PLAYER DEVELOPMENT" title="Develop the Player. Build the Person." image={media.training} imageAlt="Young ItaBEES player in training" description="Great players are built through consistent, purposeful development." dark />
    <section className="content-section supplemental-training">
      <picture className="supplemental-training-background" aria-hidden="true">
        <source media="(max-width: 700px)" srcSet={media.assessmentMobile} />
        <img src={media.assessmentDesktop} alt="" />
      </picture>
      <div className="content-section-copy"><p className="eyebrow">SUPPLEMENTAL TRAINING</p><h2>More touches. More challenges. More growth.</h2><p>Our Player Development Program provides supplemental training focused on technical mastery, tactical understanding, decision-making, confidence and individual growth.</p><p>Players train in an environment that challenges them while meeting them where they are in their development.</p><p>Whether your child is beginning their soccer journey or already competing at an advanced level, ItaBEES provides the additional training needed to keep progressing.</p><p className="detail-line">Ages 6–18 | Small Group Training | Individual Training | Player Assessments</p><ActionLink to="/programs">Find your program</ActionLink></div>
    </section>
    <ContentSection eyebrow="GROW WITH PURPOSE" title="More than the game." tone="dark"><p>The best development happens when we look at the whole player. Our approach combines football training with the qualities that help young people thrive.</p><div className="page-card-grid training-values">{developmentValues.map(([title, body]) => <div className="training-value-float" key={title}><article className="page-card"><h3>{title}</h3><p>{body}</p></article></div>)}</div></ContentSection>
  </main>;
}
