import ContactForm from "../components/ContactForm";
import { PageHero } from "../components/PageParts";
import { media } from "../data/media";
import PhoneIcon from "../components/PhoneIcon";

export default function Contact() {
  return <main><PageHero className="contact-story-hero" eyebrow="GET IN TOUCH" title={<>Let's start a <span className="editorial-accent">conversation.</span></>} image={media.aboutStory} imageAlt="ItaBEES Talent Academy poster with bee crest and academy values" description="Whether you have questions about our academy programs, player pathway, or partnership opportunities, our team is ready to assist you." /><section className="contact-page-grid"><div><p className="eyebrow">ITABEES TALENT ACADEMY</p><h2>Here to help you take the <span>next step.</span></h2><div className="contact-detail"><span>LOCATION</span><strong>Charlotte, North Carolina</strong></div><div className="contact-detail"><span>EMAIL</span><a href="mailto:info@itabeestalentacademy.com">info@itabeestalentacademy.com</a></div><div className="contact-detail"><span>PHONE</span><a className="contact-phone" href="tel:+15028074444"><PhoneIcon />502-807-4444</a></div></div><ContactForm /></section></main>;
}
