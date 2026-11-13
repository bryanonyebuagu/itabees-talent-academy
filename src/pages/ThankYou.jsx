import { ActionLink } from "../components/PageParts";

export default function ThankYou() {
  return <main className="thank-you-page"><p className="eyebrow">ITABEES TALENT ACADEMY</p><h1>Developing Players. Building Character. <span>Inspiring Excellence.</span></h1><div className="section-actions"><ActionLink to="/register">REGISTER</ActionLink><ActionLink to="/donate" black>SUPPORT OUR MISSION</ActionLink></div></main>;
}
