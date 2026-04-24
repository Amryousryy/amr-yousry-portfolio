"use client";

import dynamic from "next/dynamic";
import SectionNarrator from "@/components/ui/SectionNarrator";
import HeroSection from "@/components/ui/HeroSection";

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

export default function Home() {
  return (
    <>
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