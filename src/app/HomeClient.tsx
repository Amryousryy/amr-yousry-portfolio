"use client";

import dynamic from "next/dynamic";
import SectionNarrator from "@/components/ui/SectionNarrator";

const FilmStripSection = dynamic(() => import("@/components/ui/FilmStripSection"), {
  ssr: false,
});

const ServicesSection = dynamic(() => import("@/components/ui/ServicesSection"), {
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

export default function Home() {
  return (
    <>
      <SectionNarrator sections={["hero", "projects", "services", "testimonials", "about", "contact"]} />
      <div className="min-h-screen flex items-center justify-center bg-background">
        <h1 className="text-4xl font-bold text-white">Hero Section Placeholder</h1>
      </div>
      <Marquee />
      <FilmStripSection />
      <ServicesSection />
      <TestimonialsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}