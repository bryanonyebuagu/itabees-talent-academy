import BrandText from "../components/BrandText";
import ContactForm from "../components/ContactForm";
import { PageHero } from "../components/PageParts";
import { media } from "../data/media";

export default function Contact() {
  return <BrandText><main><PageHero eyebrow="GET IN TOUCH" title="Let's start a conversation." image={media.team} imageAlt="ItaBEES coaches and academy banner" description="Whether you have questions about our academy programs, player pathway, or partnership opportunities, our team is ready to assist you." /><section className="contact-page-grid"><div><p className="eyebrow">ITABEES TALENT ACADEMY</p><h2>Here to help you take the next step.</h2><div className="contact-detail"><span>LOCATION</span><strong>Charlotte, North Carolina</strong></div><div className="contact-detail"><span>EMAIL</span><a href="mailto:info@itabeestalentacademy.com">info@itabeestalentacademy.com</a></div></div><ContactForm /></section></main></BrandText>;
}
