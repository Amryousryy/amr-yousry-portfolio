"use client";

import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/ui/Marquee";

const FilmStripSection = dynamic(() => import("@/components/ui/FilmStripSection"), {
  ssr: false,
  loading: () => <div className="h-screen bg-[#050508]" />,
});

const ServicesSection = dynamic(() => import("@/components/sections/ServicesSection"), {
  ssr: false,
  loading: () => <div className="py-24 bg-[#050508]" />,
});

const TestimonialsSection = dynamic(() => import("@/components/ui/TestimonialsSection"), {
  ssr: false,
  loading: () => <div className="py-24 bg-[#050508]" />,
});

const AboutSection = dynamic(() => import("@/components/ui/AboutSection"), {
  ssr: false,
  loading: () => <div className="py-24 bg-[#050508]" />,
});

const ContactSection = dynamic(() => import("@/components/ui/ContactSection"), {
  ssr: false,
  loading: () => <div className="py-24 bg-[#050508]" />,
});

const SectionNarrator = dynamic(() => import("@/components/ui/SectionNarrator"), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  return (
    <>
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
