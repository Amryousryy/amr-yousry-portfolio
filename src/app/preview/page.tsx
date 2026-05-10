// @ts-nocheck
"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import SectionNarrator from "@/components/ui/SectionNarrator";
import HeroSection from "@/components/sections/hero";
import { PreviewBanner, isPreviewMode } from "@/components/admin/PreviewBanner";
import { SettingsService } from "@/lib/api-client";

const FilmStripSection = dynamic(() => import("@/components/ui/FilmStripSection"), { ssr: false });
const ServicesSection = dynamic(() => import("@/components/sections/Services"), { ssr: false });
const TestimonialsSection = dynamic(() => import("@/components/ui/TestimonialsSection"), { ssr: false });
const AboutSection = dynamic(() => import("@/components/sections/about"), { ssr: false });
const ContactSection = dynamic(() => import("@/components/sections/contact"), { ssr: false });
const Marquee = dynamic(() => import("@/components/ui/Marquee"), { ssr: false });

function PreviewContent() {
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
      <HeroSection />
      <Marquee />
      <FilmStripSection />
      <ServicesSection />
      <TestimonialsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center px-4 text-center">Loading...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
