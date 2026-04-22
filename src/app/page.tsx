import ShowreelHero from "@/components/sections/ShowreelHero";
import ClientMarquee from "@/components/ui/Marquee";
import Services from "@/components/sections/Services";
import PortfolioPreview from "@/components/sections/PortfolioPreview";
import About from "@/components/sections/About";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <ShowreelHero />
      <ClientMarquee />
      <Services />
      <PortfolioPreview />
      <About />
      <CTA />
    </>
  );
}
