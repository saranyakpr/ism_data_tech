import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import Hero from "@/components/sections/Hero";
import TrustStats from "@/components/sections/TrustStats";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import WhyChoose from "@/components/sections/WhyChoose";
import GlobalReach from "@/components/sections/GlobalReach";
import Projects from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
import LifeAtISM from "@/components/sections/LifeAtISM";
import CTA from "@/components/sections/CTA";
export default function HomePage() {
    return (<>
      <ScrollProgress />
      <Navbar />
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
      <Footer />
      <BackToTop />
    </>);
}
