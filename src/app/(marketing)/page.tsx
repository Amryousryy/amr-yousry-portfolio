import type { Metadata } from "next";
import HeroSection from "@/components/sections/hero";
import BrandMarquee from "@/components/ui/BrandMarquee";
import ClientDynamicSections from "./ClientDynamicSections";
import { Section } from "@/components/ui/section";
import { getFeaturedProjects } from "@/lib/projects/public-projects";
import { getPublishedHeroContent } from "@/lib/public-homepage-content";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://amr-yousry-portfolio.vercel.app",
  },
};

export const revalidate = 60;

export default async function Home() {
  const [featuredProjects, heroContent] = await Promise.all([
    getFeaturedProjects(3),
    getPublishedHeroContent(),
  ]);

  return (
    <>
      <HeroSection content={heroContent} />

      {/* Soft gradient transition: Hero → BrandMarquee */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />
      
      <Section className="py-0">
        <BrandMarquee />
      </Section>

      {/* Soft gradient transition: BrandMarquee → Projects */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />

      <ClientDynamicSections projects={featuredProjects} />
      {/* Other sections will be added here as we rebuild */}
    </>
  );
}
