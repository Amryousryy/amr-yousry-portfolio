import HeroSection from "@/components/sections/hero";
import ProjectsSection from "@/components/sections/projects";
import AboutSection from "@/components/sections/about";
import ContactSection from "@/components/sections/contact";
import BrandMarquee from "@/components/ui/BrandMarquee";
import { Section } from "@/components/ui/section";

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Soft gradient transition: Hero → BrandMarquee */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />
      
      <Section className="py-0">
        <BrandMarquee />
      </Section>

      {/* Soft gradient transition: BrandMarquee → Projects */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />

      <ProjectsSection />
      <AboutSection />
      <ContactSection />
      {/* Other sections will be added here as we rebuild */}
    </>
  );
}
