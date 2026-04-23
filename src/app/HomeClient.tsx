"use client";

import dynamic from "next/dynamic";
import ClientMarquee from "@/components/ui/Marquee";
import Services from "@/components/sections/Services";
import PortfolioPreview from "@/components/sections/PortfolioPreview";
import About from "@/components/sections/About";
import CTA from "@/components/sections/CTA";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
});

const FilmStripSection = dynamic(() => import("@/components/three/FilmStripSection"), {
  ssr: false,
});

const ClapperboardReveal = dynamic(() => import("@/components/three/ClapperboardReveal"), {
  ssr: false,
});

const FilmReelAbout = dynamic(() => import("@/components/three/FilmReelAbout"), {
  ssr: false,
});

export default function HomeClient() {
  return (
    <>
      <HeroScene />
      <ClientMarquee />
      <Services />
      <PortfolioPreview />
      <FilmStripSection />
      <ClapperboardReveal />
      <FilmReelAbout />
      <About />
      <CTA />
    </>
  );
}