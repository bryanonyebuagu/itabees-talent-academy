import { Link } from "react-router-dom";
import { PageHero } from "../components/PageParts";
import ArrowUpRight from "../components/ArrowUpRight";
import { media } from "../data/media";
import { CHECKOUT_PROGRAMS, formatCheckoutAmount } from "../data/checkoutPrograms";

export default function Register() {
  return <main><PageHero eyebrow="REGISTER FOR TRAINING" title={<>Your Journey <span className="editorial-accent">Starts Here.</span></>} image={media.training} imageAlt="Young ItaBEES athlete training" description="Choose a training program, tell us about your player and continue to secure Stripe test checkout." /><section className="registration-programs"><p className="eyebrow">CHOOSE YOUR PATH</p><h2>Find your <span>program.</span></h2><p className="registration-disclaimer">These are demonstration programs and sample fees. Official availability and prices will be confirmed by the academy before live payments begin.</p><div className="registration-program-grid">{CHECKOUT_PROGRAMS.map(program => <article key={program.id}><h3>{program.name}</h3><p>{program.description}</p><strong>{formatCheckoutAmount(program.amountCents)} <small>sample fee</small></strong><Link className="button button-yellow" to={`/checkout?program=${program.id}`}>Register for this program <ArrowUpRight /></Link></article>)}</div></section></main>;
}
