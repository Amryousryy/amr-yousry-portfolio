import HeroSection from "@/components/sections/hero";
import ProjectsSection from "@/components/sections/projects";
import AboutSection from "@/components/sections/about";
import ContactSection from "@/components/sections/contact";
import BrandMarquee from "@/components/ui/BrandMarquee";
import { Section } from "@/components/ui/section";
import { getFeaturedProjects } from "@/lib/projects/public-projects";

export default async function Home() {
  const featuredProjects = await getFeaturedProjects(3);

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

      <ProjectsSection projects={featuredProjects} />
      <AboutSection />
      <ContactSection />
      {/* Other sections will be added here as we rebuild */}
    </>
  );
}
