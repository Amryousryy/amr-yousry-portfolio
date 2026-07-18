import type { Metadata } from "next";
import HeroSection from "@/components/sections/hero";
import BrandMarquee from "@/components/ui/BrandMarquee";
import { HeroEntrance } from "@/components/ui/HeroEntrance";
import ClientDynamicSections from "./ClientDynamicSections";
import { Section } from "@/components/ui/section";
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
    <>
      <HeroEntrance>
        <HeroSection content={heroContent} />
      </HeroEntrance>

      {/* Soft gradient transition: Hero → BrandMarquee */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />
      
      <Section className="py-0">
        <BrandMarquee />
      </Section>

      {/* Soft gradient transition: BrandMarquee → Projects */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />

      <ClientDynamicSections projects={featuredProjects} aboutData={aboutContent} contactData={contactData} />
      {/* Other sections will be added here as we rebuild */}
    </>
  );
}
