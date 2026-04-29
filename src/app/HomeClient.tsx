"use client";

import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import TestimonialsSection from "@/components/ui/TestimonialsSection";
import AboutSection from "@/components/sections/AboutSection";
import ProcessSection from "@/components/sections/ProcessSection";
import TechStackSection from "@/components/sections/TechStackSection";
import Marquee from "@/components/ui/Marquee";

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
      <SectionNarrator sections={["hero", "projects", "services", "about", "process", "tech", "testimonials", "contact"]} />
      <Hero />
      <Marquee />
      <ProjectsSection />
      <ServicesSection />
      <AboutSection />
      <ProcessSection />
      <TechStackSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
