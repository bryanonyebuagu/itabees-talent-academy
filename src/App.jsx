import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import PlayerDevelopment from "./pages/PlayerDevelopment";
import CampsAndClinics from "./pages/CampsAndClinics";
import PlayerPathway from "./pages/PlayerPathway";
import Assessments from "./pages/Assessments";
import Coaches from "./pages/Coaches";
import InternationalExperiences from "./pages/InternationalExperiences";
import CollegePathway from "./pages/CollegePathway";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Programs from "./pages/Programs";
import Mentorship from "./pages/Mentorship";
import CommunityImpact from "./pages/CommunityImpact";
import Donate from "./pages/Donate";
import DonationCheckout from "./pages/DonationCheckout";
import DonationReturn from "./pages/DonationReturn";
import ThankYou from "./pages/ThankYou";

export default function App() {
  return <BrowserRouter><Routes><Route element={<SiteLayout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="player-development" element={<PlayerDevelopment />} />
    <Route path="camps-and-clinics" element={<CampsAndClinics />} />
    <Route path="player-pathway" element={<PlayerPathway />} />
    <Route path="assessments" element={<Assessments />} />
    <Route path="coaches" element={<Coaches />} />
    <Route path="international-experiences" element={<InternationalExperiences />} />
    <Route path="college-pathway" element={<CollegePathway />} />
    <Route path="events" element={<Events />} />
    <Route path="contact" element={<Contact />} />
    <Route path="register" element={<Register />} />
    <Route path="programs" element={<Programs />} />
    <Route path="mentorship" element={<Mentorship />} />
    <Route path="community-impact" element={<CommunityImpact />} />
    <Route path="donate" element={<Donate />} />
    <Route path="donate/checkout" element={<DonationCheckout />} />
    <Route path="donate/return" element={<DonationReturn />} />
    <Route path="thank-you" element={<ThankYou />} />
    <Route path="about-us" element={<Navigate to="/about" replace />} />
    <Route path="book-online" element={<Navigate to="/programs" replace />} />
    <Route path="event-list" element={<Navigate to="/events" replace />} />
    <Route path="donate-page" element={<Navigate to="/donate" replace />} />
    <Route path="thank-you-page" element={<Navigate to="/thank-you" replace />} />
    <Route path="thank-you-page-2" element={<Navigate to="/thank-you" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route></Routes></BrowserRouter>;
}
