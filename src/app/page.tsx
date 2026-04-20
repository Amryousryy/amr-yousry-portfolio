import Hero from "@/components/sections/Hero";
import ClientMarquee from "@/components/ui/Marquee";
import Services from "@/components/sections/Services";
import PortfolioPreview from "@/components/sections/PortfolioPreview";
import About from "@/components/sections/About";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <ClientMarquee />
      <Services />
      <PortfolioPreview />
      <About />
      <CTA />
    </>
  );
}
