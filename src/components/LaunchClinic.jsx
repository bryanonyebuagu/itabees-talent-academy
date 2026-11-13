import flyer from "../assets/upcoming event.jpg";
import eyong from "../assets/the team/Eyong Enoh Tarkang.jpg";
import eric from "../assets/the team/Eric Djemba Djemba.jpg";
import tiyiselani from "../assets/the team/Tiyiselani Shipalane.jpg";
import PhoneIcon from "./PhoneIcon";
import ArrowUpRight from "./ArrowUpRight";

const registrationUrl = "https://forms.gle/X6y8Qz4MdEweUfTTA";
const guests = [
  { name: "Eyong Enoh", image: eyong },
  { name: "Eric Djemba Djemba", image: eric },
  { name: "Tiyiselani Shipalane", image: tiyiselani },
];

function DriveIcon() {
  return <svg className="clinic-drive-icon" viewBox="0 0 48 48" aria-hidden="true"><path fill="#00875a" d="M17 5h10L9 37H0z" /><path fill="#ffba00" d="M9 37h31l-5 8H4z" /><path fill="#4285f4" d="M27 5 48 37h-9L17 5z" /><path fill="#00ac47" d="M17 5h10l18 32H35z" /></svg>;
}

export default function LaunchClinic() {
  return <section className="launch-clinic" aria-labelledby="launch-clinic-title">
    <div className="launch-clinic-intro"><p className="eyebrow">ITABEES TALENT ACADEMY OFFICIAL LAUNCH</p><h2 id="launch-clinic-title">A new chapter <span>starts here.</span></h2><p>We are excited to officially introduce ItaBEES Talent Academy, a supplemental youth soccer development program built on a vision that goes far beyond the game, designed to meet every child’s needs. Whether your child is beginning their soccer journey or already competing at an advanced level, we provide the additional training needed to keep getting better, while staying with their current club.</p><p>At ItaBEES Talent Academy, every player has a place, every player has a pathway, and every player belongs.</p></div>
    <div className="launch-clinic-feature"><div className="launch-clinic-flyer"><img src={flyer} alt="Free Soccer Clinic and BBQ flyer with guest coaches, date, location and registration QR code" loading="lazy" /></div><div className="launch-clinic-copy"><p className="eyebrow">OUR OFFICIAL LAUNCH EVENT</p><h3>Free Soccer Clinic <span>+ BBQ.</span></h3><p>We’re kicking things off with something special. Join us for a free soccer clinic and BBQ featuring former professional players Eyong Enoh, Eric Djemba Djemba and Tiyiselani Shipalane, alongside licensed coaches from Europe.</p><div className="launch-clinic-details"><div><span>DATE</span><strong>Saturday, November 21, 2026</strong></div><div><span>TIME</span><strong>11:00 AM–2:00 PM</strong></div><div><span>LOCATION</span><strong>Mallard Creek Park, Fields 1 &amp; 2</strong><small>3001 Johston Oehler Rd<br />Charlotte, NC 28269</small></div><div><span>AGES</span><strong>U6–U19</strong></div></div><p className="launch-clinic-availability">Registration is required. Spaces are limited. Use the form link below or scan the QR code on the flyer.</p><a className="clinic-registration" href={registrationUrl} target="_blank" rel="noreferrer"><DriveIcon /><span><strong>Register for the free clinic</strong><small>Google Form</small></span><ArrowUpRight /></a><a className="clinic-call" href="tel:+15028074444"><PhoneIcon /><span>Questions? Call Coach Ita: <strong>502-807-4444</strong></span></a></div></div>
    <div className="launch-clinic-guests"><h3>Meet the <span>guest coaches.</span></h3><div>{guests.map(guest => <figure key={guest.name}><img src={guest.image} alt={guest.name} loading="lazy" /><figcaption>{guest.name}</figcaption></figure>)}</div></div>
    <p className="launch-clinic-close">The journey starts here. <span>Welcome to the Hive!</span></p>
  </section>;
}
