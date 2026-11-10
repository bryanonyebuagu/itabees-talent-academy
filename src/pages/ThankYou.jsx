import { ActionLink } from "../components/PageParts";

export default function ThankYou() {
  return <main className="thank-you-page"><p className="eyebrow">ITABEES TALENT ACADEMY</p><h1>Developing Players. Building Character. Inspiring Excellence.</h1><div className="section-actions"><ActionLink to="/register">REGISTER</ActionLink><ActionLink to="/donate" black>SUPPORT OUR MISSION</ActionLink></div></main>;
}
