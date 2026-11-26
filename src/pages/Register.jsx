import { Link } from "react-router-dom";
import { PageHero } from "../components/PageParts";
import ArrowUpRight from "../components/ArrowUpRight";
import ProgramPricingCard, { ProgramName } from "../components/ProgramPricingCard";
import { media } from "../data/media";
import { CHECKOUT_PROGRAMS, PRICE_ON_REQUEST } from "../data/checkoutPrograms";

export default function Register() {
  return <main>
    <PageHero eyebrow="REGISTER FOR TRAINING" title={<>Your Journey <span className="editorial-accent">Starts Here.</span></>} image={media.training} imageAlt="Young ItaBEES athlete training" description="Choose a training program, tell us about your player and continue to secure checkout." />
    <section className="registration-programs" id="training-programs">
      <div className="application-paths"><Link className="button button-black" to="/financial-assistance">Financial Assistance</Link><a className="button button-yellow" href="#program-prices">Supplemental Training</a></div><p className="registration-disclaimer">Financial assistance applications go directly to academy review and require no payment.</p><p className="eyebrow" id="program-prices">CHOOSE YOUR TRAINING PROGRAM</p>
      <h2>Find <span className="editorial-accent">your program.</span></h2>
      <p className="registration-disclaimer">Supplemental training renews automatically each month. The second child registered by the same parent or guardian receives $10 off per month; the discounted amount appears before payment.</p>
      <div className="registration-program-grid">
        {CHECKOUT_PROGRAMS.map((program, index) => <ProgramPricingCard key={program.id} program={program} promotion={index < 2} />)}
        <article className="program-pricing-card sibling-offer-card">
          <span className="sibling-offer-tag">$10 OFF</span>
          <ProgramName name="Sibling registration offer" />
          <p className="sibling-offer-amount">$10 <span>OFF</span></p>
          <p className="program-pricing-description">Register one child and get $10 off registration for your next child.</p>
          <p className="program-pricing-detail">Eligible additional child · monthly training plans from $69 to $139 per month. The $10 monthly discount is shown before payment.</p>
          <Link className="button button-yellow program-pricing-action" to="/register#training-programs">Explore training plans <ArrowUpRight /></Link>
        </article>
        {PRICE_ON_REQUEST.map(program => <article className="program-pricing-card" key={program.name}>
          <ProgramName name={program.name} />
          <div className="program-pricing-main"><p className="program-pricing-unpriced">{program.price}</p><p className="program-pricing-description">{program.description}</p></div>
          <Link className="button button-yellow program-pricing-action" to="/contact">Ask about availability <ArrowUpRight /></Link>
        </article>)}
      </div>
    </section>
  </main>;
}
