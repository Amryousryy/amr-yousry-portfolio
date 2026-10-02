"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PixelButton } from "@/components/ui/pixel-button";
import { HeroFrameSequence } from "@/components/sections/hero/HeroFrameSequence";
import { event } from "@/lib/analytics";

export interface HeroContent {
  headline: string;
  subheadline: string;
  primaryCTA: string;
  primaryCTALink: string;
  secondaryCTA: string;
  secondaryCTALink: string;
}

const DEFAULT_CONTENT: HeroContent = {
  headline: "MAKE IDEAS\nMATTER",
  subheadline: "Creative Direction and High-Impact Video Production for brands that need content built for attention, trust, and conversion.",
  primaryCTA: "Start a Project",
  primaryCTALink: "/#contact",
  secondaryCTA: "View Missions",
  secondaryCTALink: "/projects",
};

export default function HeroSection({ content = DEFAULT_CONTENT }: { content?: HeroContent }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={trackRef} className="hero-scroll-track">
      <div ref={stageRef} className="hero-scroll-stage">
        <Section className="h-full min-h-0 flex items-center justify-center relative overflow-hidden px-0 py-14 sm:py-20 md:py-28" data-hero-section>

          {/* P1: Focal light — single warm anchor behind headline */}
          <div className="hero-focal" aria-hidden="true" />

          {/* P2: Layer 1 — Background (large, blurry, very slow) */}
          <div className="hero-layer-bg hero-layer-bg--warm" aria-hidden="true" />
          <div className="hero-layer-bg hero-layer-bg--cool" aria-hidden="true" />

          {/* P2: Layer 2 — Mid (moderate blur, moderate speed) */}
          <div className="hero-layer-mid hero-layer-mid--a" aria-hidden="true" />
          <div className="hero-layer-mid hero-layer-mid--b" aria-hidden="true" />

          {/* P2: Layer 3 — Foreground (smaller, faster, barely visible) */}
          <div className="hero-layer-fg hero-layer-fg--a" aria-hidden="true" />
          <div className="hero-layer-fg hero-layer-fg--b" aria-hidden="true" />

          {/* Vignette — warm dark edges, focus center */}
          <div className="hero-vignette absolute inset-0 pointer-events-none z-0" />

          {/* P3: Atmospheric dust — 2 particles, barely perceptible */}
          <div className="hero-dust hero-dust--1" aria-hidden="true" />
          <div className="hero-dust hero-dust--2" aria-hidden="true" />

          {/* P3: Light sweep — reduced to near-invisible */}
          <div className="hero-sweep" aria-hidden="true" />

          <Container className="hero-composition relative z-10 h-full min-h-0 w-full">
            <div className="hero-headline-block mb-4 sm:mb-5 shrink-0">
              <h1
                className="hero-reveal-headline font-black text-strong tracking-tighter leading-[1.05] sm:leading-[0.95] text-center text-[clamp(2.15rem,10vw,3.35rem)] md:text-[clamp(2.75rem,4.9vw,4.6rem)]"
                style={{ textWrap: 'balance' }}
              >
                {content.headline.split('\n').filter(Boolean).map((line, i) => (
                  <span key={i} className="level-title block">{line}</span>
                ))}
              </h1>
            </div>

            <HeroFrameSequence trackRef={trackRef} stageRef={stageRef} />

            <div className="hero-cta-block mt-6 sm:mt-7 shrink-0">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
                <PixelButton
                  variant="primary"
                  href={content.primaryCTALink}
                  className="hero-reveal-cta w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 text-xs sm:text-sm tracking-widest group"
                  style={{ minHeight: '60px', minWidth: 'min(100%, 220px)' }}
                  onClick={() => event("hero_cta_click", { cta_label: content.primaryCTA, cta_destination: content.primaryCTALink })}
                >
                  <span>{content.primaryCTA}</span>
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </PixelButton>

                <PixelButton
                  variant="outline"
                  href={content.secondaryCTALink}
                  className="hero-reveal-cta hero-reveal-cta--delay w-full sm:w-auto px-6 sm:px-10 py-4 text-xs sm:text-sm tracking-widest"
                  style={{ minHeight: '56px', minWidth: 'min(100%, 180px)' }}
                  onClick={() => event("hero_cta_click", { cta_label: content.secondaryCTA, cta_destination: content.secondaryCTALink })}
                >
                  {content.secondaryCTA}
                </PixelButton>
              </div>
            </div>
          </Container>
        </Section>
      </div>
    </div>
  );
}
