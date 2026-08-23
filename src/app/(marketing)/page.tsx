import type { Metadata } from "next";
import HeroSection from "@/components/sections/hero";
import { HeroAmbience } from "@/components/sections/hero/HeroAmbience";
import BrandMarquee from "@/components/ui/BrandMarquee";
import ProjectsSection from "@/components/sections/projects";
import AboutSection from "@/components/sections/about";
import ContactSection from "@/components/sections/contact";
import { Section } from "@/components/ui/section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getFeaturedProjects } from "@/lib/projects/public-projects";
import { getPublishedHeroContent } from "@/lib/public-homepage-content";
import { getPublishedAboutContent } from "@/lib/public-homepage-content";
import { getPublishedContactContent } from "@/lib/public-contact-content";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://amryousry.com",
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
      <div className="h-px md:h-[2px] bg-gradient-to-r from-transparent via-line-faint to-transparent" />

      <Section className="py-0" data-reveal>
        <BrandMarquee />
      </Section>

      {/* Section transition: BrandMarquee → Projects */}
      <div className="h-px md:h-[2px] bg-gradient-to-r from-transparent via-line-faint to-transparent" />

      <div data-reveal><ProjectsSection projects={featuredProjects} /></div>
      <div data-reveal><AboutSection aboutData={aboutContent} /></div>
      <div data-reveal><ContactSection contactData={contactData} /></div>
    </ScrollReveal>
  );
}
