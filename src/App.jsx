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
import DonationCheckout from "./pages/DonationCheckout";
import DonationReturn from "./pages/DonationReturn";
import ThankYou from "./pages/ThankYou";
import { Eligibility, FAQ, Gallery, GetInvolved } from "./pages/ExplorePages";
import DemoProvider from "./portal/DemoProvider";
import { ToastProvider } from "./portal/ToastProvider";
import PortalLayout from "./portal/PortalLayout";
import AccessPage from "./portal/AccessPage";
import AdminOverview from "./portal/AdminOverview";
import { AdminEnquiries, AdminPlayers, AdminPlayerDetail, AdminParents } from "./portal/AdminPeople";
import { AdminProgrammes, AdminProgrammeDetail, AdminTraining, AdminTimetable, AdminEvents, AdminCoaches } from "./portal/AdminOperations";
import { AdminDonations, AdminMessages, AdminStaff, AdminSettings } from "./portal/AdminBackOffice";
import { MemberOverview, MemberProgrammes, MemberProgrammeDetail, MemberSchedule, MemberEvents, MemberProfile, MemberAttendance, MemberNotifications } from "./portal/MemberPages";
import NavigationLoader from "./components/NavigationLoader";

export default function App() {
  return <BrowserRouter><NavigationLoader /><ToastProvider><DemoProvider><Routes>
    <Route path="admin/login" element={<AccessPage kind="admin" />} />
    <Route path="login" element={<AccessPage kind="member" />} />
    <Route path="signup" element={<AccessPage kind="signup" />} />
    <Route path="forgot-password" element={<AccessPage kind="forgot" />} />
    <Route path="admin" element={<PortalLayout mode="admin" />}>
      <Route index element={<AdminOverview />} />
      <Route path="enquiries" element={<AdminEnquiries />} />
      <Route path="players" element={<AdminPlayers />} />
      <Route path="players/:playerId" element={<AdminPlayerDetail />} />
      <Route path="parents" element={<AdminParents />} />
      <Route path="programmes" element={<AdminProgrammes />} />
      <Route path="programmes/:programmeId" element={<AdminProgrammeDetail />} />
      <Route path="training" element={<AdminTraining />} />
      <Route path="timetable" element={<AdminTimetable />} />
      <Route path="events" element={<AdminEvents />} />
      <Route path="coaches" element={<AdminCoaches />} />
      <Route path="donations" element={<AdminDonations />} />
      <Route path="messages" element={<AdminMessages />} />
      <Route path="staff" element={<AdminStaff />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>
    <Route path="dashboard" element={<PortalLayout mode="member" />}>
      <Route index element={<MemberOverview />} />
      <Route path="my-programmes" element={<MemberProgrammes />} />
      <Route path="my-programmes/:programmeId" element={<MemberProgrammeDetail />} />
      <Route path="schedule" element={<MemberSchedule />} />
      <Route path="events" element={<MemberEvents />} />
      <Route path="attendance" element={<MemberAttendance />} />
      <Route path="profile" element={<MemberProfile />} />
      <Route path="notifications" element={<MemberNotifications />} />
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
    <Route path="programs" element={<Programs />} />
    <Route path="mentorship" element={<Mentorship />} />
    <Route path="gallery" element={<Gallery />} />
    <Route path="faq" element={<FAQ />} />
    <Route path="eligibility" element={<Eligibility />} />
    <Route path="get-involved" element={<GetInvolved />} />
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
  </Route></Routes></DemoProvider></ToastProvider></BrowserRouter>;
}
