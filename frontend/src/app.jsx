
import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollProgress from "./components/ui/ScrollProgress";
import BackToTop from "./components/ui/BackToTop";

import Hero from "./components/sections/Hero";
import TrustStats from "./components/sections/TrustStats";
import About from "./components/sections/About.jsx";
import Services from "./components/sections/Services.jsx";
import WhyChoose from "./components/sections/WhyChoose";
import GlobalReach from "./components/sections/GlobalReach";
import Projects from "./components/sections/Projects";
import Testimonials from "./components/sections/Testimonials";
import LifeAtISM from "./components/sections/LifeAtISM";
import CTA from "./components/sections/CTA";

import AboutPage from "./pages/AboutPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import WorkPage from "./pages/WorkPage.jsx";
import LifeAtISMPage from "./pages/LifeAtISMPage.jsx";

import CareersPage from "./app/careers/page.jsx";
import ContactPage from "./app/contact/page.jsx";
import JobDetailsPage from "./pages/JobDetailsPage.jsx";
import CareersApplyPage from "./pages/CareersApplyPage.jsx";

// Admin
import AdminLogin from "./components/admin/AdminLogin.jsx";
import AdminGuard from "./components/admin/AdminGuard.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AdminOverview from "./components/admin/AdminOverview.jsx";
import JobManagement from "./components/admin/JobManagement.jsx";
import ApplicationManagement from "./components/admin/ApplicationManagement.jsx";
import LifeAtISMManagement from "./components/admin/LifeAtISMManagement.jsx";

/* Scroll to top on every route change (unless hash-navigating to a section) */
function ScrollRestorer() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      const id = hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 80);
    }
  }, [pathname, hash]);
  return null;
}

function HomePage() {
  return (
    <main>
      <Hero />
      <TrustStats />
      <About />
      <Services />
      <WhyChoose />
      <GlobalReach />
      <Projects />
      <Testimonials />
      <LifeAtISM />
      <CTA />
    </main>
  );
}

/**
 * Wraps any admin sub-page: verifies the session then renders the
 * sidebar shell around the page content.
 */
function ProtectedAdminLayout({ children }) {
  return (
    <AdminGuard>
      <AdminDashboard>{children}</AdminDashboard>
    </AdminGuard>
  );
}

function App() {
  const { pathname } = useLocation();

  // Admin routes use their own full-screen layout — skip the public
  // Navbar / Footer / ScrollProgress / BackToTop chrome.
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <MotionConfig reducedMotion="user">
      {!isAdminRoute && <ScrollProgress />}
      {!isAdminRoute && <Navbar />}
      <ScrollRestorer />

      <Routes>
        {/* ── Public routes ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/life-at-ism" element={<LifeAtISMPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/apply" element={<CareersApplyPage />} />
        <Route path="/careers/:id" element={<JobDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* ── Admin: login (unauthenticated) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Admin: /admin root → overview (guard handles unauthed redirect) ── */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminLayout>
              <AdminOverview />
            </ProtectedAdminLayout>
          }
        />

        {/* ── Admin: protected sub-pages ── */}
        <Route
          path="/admin/careers"
          element={
            <ProtectedAdminLayout>
              <AdminOverview />
            </ProtectedAdminLayout>
          }
        />
        <Route
          path="/admin/careers/jobs"
          element={
            <ProtectedAdminLayout>
              <JobManagement />
            </ProtectedAdminLayout>
          }
        />
        <Route
          path="/admin/careers/applications"
          element={
            <ProtectedAdminLayout>
              <ApplicationManagement />
            </ProtectedAdminLayout>
          }
        />
        <Route
          path="/admin/careers/life-at-ism"
          element={
            <ProtectedAdminLayout>
              <LifeAtISMManagement />
            </ProtectedAdminLayout>
          }
        />
      </Routes>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <BackToTop />}
    </MotionConfig>
  );
}

export default App;
