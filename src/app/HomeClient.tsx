"use client";

import React from "react";
import dynamic from "next/dynamic";

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

const Marquee = dynamic(() => import("@/components/ui/Marquee"), {
  ssr: false,
  loading: () => <div className="h-16 bg-[#050508]" />,
});

const SectionNarrator = dynamic(() => import("@/components/ui/SectionNarrator"), {
  ssr: false,
  loading: () => null,
});

function HeroFallback() {
  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl text-white mb-4">Amr Yousry</div>
        <div className="text-[#00ffcc] text-xl">Creative Strategist & Video Editor</div>
        <div className="mt-8 flex gap-4">
          <a href="#projects" className="px-6 py-3 bg-[#00ffcc] text-black font-bold">View Projects</a>
          <a href="#contact" className="px-6 py-3 border border-[#00ffcc] text-[#00ffcc] font-bold">Contact</a>
        </div>
      </div>
    </div>
  );
}

const HeroSection = dynamic(() => import("@/components/ui/HeroSection"), {
  ssr: false,
  loading: () => <HeroFallback />,
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