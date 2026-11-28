import { Link } from "react-router-dom";
import ArrowUpRight from "./ArrowUpRight";
import { formTypeForProgram } from "../data/applicationForms";
import { formatCheckoutAmount } from "../data/checkoutPrograms";

export function ProgramName({ name, as: Heading = "h3" }) {
  const words = name.trim().split(/\s+/);
  const ending = words.slice(-2).join(" ");
  const opening = words.slice(0, -2).join(" ");
  return <Heading className="program-pricing-title">{opening && <>{opening} </>}<span>{ending}</span></Heading>;
}

export default function ProgramPricingCard({ program, promotion = false }) {
  const verifiedRegular = promotion && Number.isSafeInteger(program.regularPriceCents) && program.regularPriceCents > program.amountCents && program.amountCents * 5 === program.regularPriceCents * 4;
  return <article className="program-pricing-card">
    <ProgramName name={program.name} />
    <div className="program-pricing-main">
      {verifiedRegular && <div className="program-pricing-promotion"><del>{formatCheckoutAmount(program.regularPriceCents)}</del><span>20% OFF</span></div>}
      <p className="program-pricing-amount"><strong>{formatCheckoutAmount(program.amountCents)}</strong><small>{program.duration === "Monthly" ? "/ month per player" : "/ session"}</small></p>
      <p className="program-pricing-description">{program.description}</p>
      {program.duration === "Monthly" ? <p className="program-pricing-detail">Automatic monthly training · $10/month off for an eligible additional child</p> : <p className="program-pricing-detail">Request only. No payment is collected until arrangements are confirmed.</p>}
    </div>
    <Link className="button button-yellow program-pricing-action" to={program.duration === "Monthly" ? `/checkout?program=${program.id}` : `/apply/${formTypeForProgram(program)}?program=${program.id}`}>{program.duration === "Monthly" ? "Register for this program" : program.id === "player-mentorship" ? "Apply for Mentorship" : "Request Private Training"} <ArrowUpRight /></Link>
    {program.name.includes("Supplemental") && <Link className="training-assistance-link" to={`/financial-assistance?program=${program.id}`}>Do you need financial assistance?</Link>}
  </article>;
}
