"use client";

import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import SectionNarrator from "@/components/ui/SectionNarrator";
import Hero from "@/components/sections/Hero";
import { PreviewBanner, isPreviewMode } from "@/components/admin/PreviewBanner";
import { SettingsService } from "@/lib/api-client";

const FilmStripSection = dynamic(() => import("@/components/ui/FilmStripSection"), {
  ssr: false,
});

const ServicesSection = dynamic(() => import("@/components/sections/ServicesSection"), {
  ssr: false,
});

const TestimonialsSection = dynamic(() => import("@/components/ui/TestimonialsSection"), {
  ssr: false,
});

const AboutSection = dynamic(() => import("@/components/ui/AboutSection"), {
  ssr: false,
});

const ContactSection = dynamic(() => import("@/components/ui/ContactSection"), {
  ssr: false,
});

const Marquee = dynamic(() => import("@/components/ui/Marquee"), {
  ssr: false,
});

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  const { data: contentData } = useQuery({
    queryKey: ["site-content-preview"],
    queryFn: () => SettingsService.getContentPreview(),
    enabled: isPreview,
  });

  const { data: heroData } = useQuery({
    queryKey: ["hero-preview"],
    queryFn: () => SettingsService.getHero(true),
    enabled: isPreview,
  });

  const showContentPreview = isPreviewMode(contentData?.data);
  const showHeroPreview = isPreviewMode(heroData?.data);
  const showPreviewBanner = showContentPreview || showHeroPreview;

  return (
    <>
      {showPreviewBanner && <PreviewBanner message="Preview Mode - Unpublished Changes" />}
      <SectionNarrator sections={["hero", "projects", "services", "testimonials", "about", "contact"]} />
      <Hero />
      <Marquee />
      <FilmStripSection />
      <ServicesSection />
      <TestimonialsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}