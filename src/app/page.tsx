import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import PortfolioPreview from "@/components/sections/PortfolioPreview";
import Experience from "@/components/sections/Experience";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <PortfolioPreview />
      <Experience />
      <About />
      <Testimonials />
      <CTA />
      <Contact />
    </>
  );
}
