"use client";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PixelButton } from "@/components/ui/pixel-button";
import { heroContent } from "@/content/hero";

export default function HeroSection() {
  return (
    <Section className="min-h-[82svh] flex items-center justify-center relative overflow-hidden">
      {/* Background - performance safe CSS only */}
      <div className="absolute inset-0 game-grid-bg pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,15,0.8)_100%)]" />

      <Container className="relative z-10">
        <div className="text-center max-w-[820px] mx-auto">
          {/* Headline Group - Premium retro title */}
          <div className="mb-8">
            <h1 
              className="text-hero font-black text-white tracking-tighter leading-[0.95] text-center"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
            >
              <span className="level-title block whitespace-nowrap">MAKE IDEAS</span>
              <span className="level-title block">MATTER</span>
            </h1>
            
            {/* Pixel separator */}
            <div className="pixel-separator mt-4 mb-4">
              <div className="pixel-separator-dot" />
            </div>
            
            {/* Subtitle - Business focused, readable, neutral color */}
            <p 
              className="text-slate-300 font-normal"
              style={{ 
                fontSize: 'clamp(1.125rem, 1.6vw, 1.35rem)',
                lineHeight: '1.6',
                maxWidth: '700px',
                margin: '1rem auto 0'
              }}
            >
              {heroContent.subheadline}
            </p>
          </div>

          {/* CTA Block - Closer to subtitle */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <PixelButton 
                variant="primary" 
                href={heroContent.ctas.primary.href}
                className="px-10 py-4 text-sm tracking-widest"
                style={{ height: '56px', minWidth: '180px' }}
              >
                {heroContent.ctas.primary.text}
              </PixelButton>
              
              <PixelButton 
                variant="outline" 
                href={heroContent.ctas.secondary.href}
                className="px-10 py-4 text-sm tracking-widest"
                style={{ height: '56px', minWidth: '180px' }}
              >
                {heroContent.ctas.secondary.text}
              </PixelButton>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
