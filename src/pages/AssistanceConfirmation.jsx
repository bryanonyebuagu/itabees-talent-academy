import { ASSISTANCE_RECEIVED } from "../data/applicationForms";
import { Link, useLocation } from "react-router-dom";
export default function AssistanceConfirmation() {
  const { state } = useLocation();
  return <main className="assistance-confirmation"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4"/><path d="m18 32 10 10 19-22" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></svg><h1>Financial assistance <span className="editorial-accent">requested.</span></h1><p>{ASSISTANCE_RECEIVED}</p>{state?.emailSent === false && <p>Your application is saved. The confirmation email could not be delivered yet; contact us below if you need help.</p>}<p>Questions? <a href="mailto:info@itabeestalentacademy.com">info@itabeestalentacademy.com</a><br/><a href="tel:+15028074444">Call Coach Ita: 502-807-4444</a></p><Link className="button button-yellow" to="/">Back to homepage</Link></main>;
}
