"use client";

import dynamic from "next/dynamic";
import HeroText from "@/components/ui/HeroText";

const FilmStripSection = dynamic(() => import("@/components/ui/FilmStripSection"), {
  ssr: false,
});

const ServicesSection = dynamic(() => import("@/components/ui/ServicesSection"), {
  ssr: false,
});

const AboutSection = dynamic(() => import("@/components/ui/AboutSection"), {
  ssr: false,
});

const ContactSection = dynamic(() => import("@/components/ui/ContactSection"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <HeroText />
      <ServicesSection />
      <FilmStripSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}