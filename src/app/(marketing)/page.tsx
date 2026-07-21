import type { Metadata } from "next";
import HeroSection from "@/components/sections/hero";
import { HeroAmbience } from "@/components/sections/hero/HeroAmbience";
import BrandMarquee from "@/components/ui/BrandMarquee";
import ClientDynamicSections from "./ClientDynamicSections";
import { Section } from "@/components/ui/section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getFeaturedProjects } from "@/lib/projects/public-projects";
import { getPublishedHeroContent } from "@/lib/public-homepage-content";
import { getPublishedAboutContent } from "@/lib/public-homepage-content";
import { getPublishedContactContent } from "@/lib/public-contact-content";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://amr-yousry-portfolio.vercel.app",
  },
};

export const revalidate = 60;

export default async function Home() {
  const [featuredProjects, heroContent, aboutContent, contactData] = await Promise.all([
    getFeaturedProjects(3),
    getPublishedHeroContent(),
    getPublishedAboutContent(),
    getPublishedContactContent(),
  ]);

  return (
    <ScrollReveal>
      <HeroSection content={heroContent} />
      <HeroAmbience />

      {/* Section transition: Hero → BrandMarquee */}
      <div className="h-px md:h-[2px] bg-gradient-to-r from-transparent via-slate-600/60 md:via-slate-700/40 to-transparent" />
      
      <Section className="py-0" data-reveal>
        <BrandMarquee />
      </Section>

      {/* Section transition: BrandMarquee → Projects */}
      <div className="h-px md:h-[2px] bg-gradient-to-r from-transparent via-slate-600/60 md:via-slate-700/40 to-transparent" />

      <ClientDynamicSections projects={featuredProjects} aboutData={aboutContent} contactData={contactData} />
      {/* Other sections will be added here as we rebuild */}
    </ScrollReveal>
  );
}
