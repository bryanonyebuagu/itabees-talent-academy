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
import Donate from "./pages/Donate";
import PaymentCheckout from "./pages/PaymentCheckout";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import ThankYou from "./pages/ThankYou";
import { Eligibility, FAQ, Gallery, GetInvolved } from "./pages/ExplorePages";
import { ToastProvider } from "./portal/ToastProvider";
import AccessPage from "./portal/AccessPage";
import { LiveOverview, LivePortalLayout, LiveRegistrations, LiveSupport } from "./portal/LivePortal";
import NavigationLoader from "./components/NavigationLoader";

export default function App() {
  return <BrowserRouter><NavigationLoader /><ToastProvider><Routes>
    <Route path="admin/login" element={<AccessPage kind="admin" />} />
    <Route path="login" element={<AccessPage kind="member" />} />
    <Route path="setup-login" element={<AccessPage kind="setup" />} />
    <Route path="forgot-password" element={<AccessPage kind="forgot" />} />
    <Route path="admin" element={<LivePortalLayout mode="admin" />}>
      <Route index element={<LiveOverview />} />
      <Route path="players" element={<LiveRegistrations />} />
      <Route path="support" element={<LiveSupport />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Route>
    <Route path="dashboard" element={<LivePortalLayout mode="member" />}>
      <Route index element={<LiveOverview />} />
      <Route path="my-programmes" element={<LiveRegistrations />} />
      <Route path="support" element={<LiveSupport />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>
    <Route element={<SiteLayout />}>
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
    <Route path="checkout" element={<PaymentCheckout />} />
    <Route path="payment/confirmation" element={<PaymentConfirmation />} />
    <Route path="programs" element={<Programs />} />
    <Route path="mentorship" element={<Mentorship />} />
    <Route path="gallery" element={<Gallery />} />
    <Route path="faq" element={<FAQ />} />
    <Route path="eligibility" element={<Eligibility />} />
    <Route path="get-involved" element={<GetInvolved />} />
    <Route path="donate" element={<Donate />} />
    <Route path="donate/checkout" element={<PaymentCheckout donation />} />
    <Route path="donate/return" element={<Navigate to="/donate" replace />} />
    <Route path="thank-you" element={<ThankYou />} />
    <Route path="about-us" element={<Navigate to="/about" replace />} />
    <Route path="book-online" element={<Navigate to="/programs" replace />} />
    <Route path="event-list" element={<Navigate to="/events" replace />} />
    <Route path="donate-page" element={<Navigate to="/donate" replace />} />
    <Route path="thank-you-page" element={<Navigate to="/thank-you" replace />} />
    <Route path="thank-you-page-2" element={<Navigate to="/thank-you" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route></Routes></ToastProvider></BrowserRouter>;
}
