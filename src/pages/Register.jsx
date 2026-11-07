import ContactForm from "../components/ContactForm";
import { PageHero } from "../components/PageParts";
import { media } from "../data/media";

export default function Register() {
  return <main><PageHero eyebrow="REGISTER" title="Your Journey Starts Here." image={media.training} imageAlt="Young ItaBEES athlete training" description="Whether your player wants to build confidence, sharpen technical skills, prepare for a more competitive environment or explore opportunities beyond their current team, there is a place to begin at ItaBEES." /><section className="contact-page-grid"><div><p className="eyebrow">COME TRAIN. COME LEARN. COME GROW.</p><h2>Tell us about your player.</h2><p>Nothing is available to book online right now. Send an inquiry and the team can help with your next step.</p></div><ContactForm defaultInquiry="Parent" /></section></main>;
}
