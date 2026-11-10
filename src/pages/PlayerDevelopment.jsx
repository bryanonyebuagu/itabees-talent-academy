import { Link } from "react-router-dom";
import ArrowUpRight from "../components/ArrowUpRight";
import { ActionLink } from "../components/PageParts";
import { media } from "../data/media";

const developmentValues = [
  ["TECHNICAL DEVELOPMENT", "Build confidence on the ball through focused training in passing, dribbling, ball control and finishing."],
  ["TACTICAL UNDERSTANDING", "Develop game intelligence, decision-making and a better understanding of how to play as part of a team."],
  ["MENTAL STRENGTH", "Build discipline, resilience, confidence and the mindset needed to keep improving."],
  ["PERSONAL GROWTH", "Encourage leadership, respect, teamwork and the personal qualities that matter beyond football."],
];

export default function PlayerDevelopment() {
  return <main className="training-page">
    <section className="training-hero">
      <div className="training-hero-copy"><Link className="training-back" to="/programs">All programs <ArrowUpRight /></Link><p className="eyebrow">PLAYER DEVELOPMENT</p><h1>Develop the Player.<br /><span>Build the Person.</span></h1><p>Great players are built through consistent, purposeful development.</p><ActionLink to="/register">Get started</ActionLink></div>
      <div className="training-hero-gallery"><img src={media.training} alt="Young ItaBEES player advancing with the ball" /><img src={media.coaching} alt="Coach mentoring young players" /><img src={media.programs} alt="Players taking part in soccer training" /></div>
    </section>
    <div className="training-quickfacts"><span>AGES 6–18</span><span>SMALL GROUP TRAINING</span><span>INDIVIDUAL TRAINING</span><span>PLAYER ASSESSMENTS</span></div>
    <section className="training-register-band"><div><p className="eyebrow">COME TRAIN. COME LEARN. COME GROW.</p><h2>Ready for the next session?</h2><p>Nothing is available to book online right now. Send an inquiry and the team can help with your next step.</p></div><ActionLink to="/register">Ask about training</ActionLink></section>
    <section className="training-overview"><div className="training-overview-images"><img src={media.coaching} alt="ItaBEES coach guiding players" /><img src={media.programs} alt="Youth players practicing together" /></div><div className="training-overview-copy"><p className="eyebrow">PROGRAM INCLUDES</p><h2>More than <em>the game.</em></h2><p>The best development happens when we look at the whole player. Our approach combines football training with the qualities that help young people thrive.</p><div className="training-includes">{developmentValues.map(([title, body]) => <article key={title}><span aria-hidden="true">✦</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></div></section>
    <section className="content-section supplemental-training training-supplemental"><picture className="supplemental-training-background" aria-hidden="true"><source media="(max-width: 700px)" srcSet={media.assessmentMobile} /><img src={media.assessmentDesktop} alt="" /></picture><div className="content-section-copy"><p className="eyebrow">SUPPLEMENTAL TRAINING</p><h2>More touches. More challenges. <em>More growth.</em></h2><p>Our Player Development Program provides supplemental training focused on technical mastery, tactical understanding, decision-making, confidence and individual growth.</p><p>Players train in an environment that challenges them while meeting them where they are in their development.</p><p>Whether your child is beginning their soccer journey or already competing at an advanced level, ItaBEES provides the additional training needed to keep progressing.</p><ActionLink to="/programs">Find your program</ActionLink></div></section>
    <section className="training-close"><p className="eyebrow">THE ITABEES APPROACH</p><h2>Every player has <em>room to grow.</em></h2><p>Purposeful training meets each player where they are and helps them keep progressing.</p><div><ActionLink to="/register">Start your journey</ActionLink><Link className="training-text-link" to="/contact">Talk to our team <ArrowUpRight /></Link></div></section>
  </main>;
}
