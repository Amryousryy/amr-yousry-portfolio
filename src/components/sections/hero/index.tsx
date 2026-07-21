import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PixelButton } from "@/components/ui/pixel-button";

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
  return (
    <Section className="min-h-[82svh] flex items-center justify-center relative overflow-hidden px-0 py-14 sm:py-20 md:py-28" data-hero-section>

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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,8,3,0.55)_100%)] pointer-events-none z-0" />

      {/* P3: Atmospheric dust — 2 particles, barely perceptible */}
      <div className="hero-dust hero-dust--1" aria-hidden="true" />
      <div className="hero-dust hero-dust--2" aria-hidden="true" />

      {/* P3: Light sweep — reduced to near-invisible */}
      <div className="hero-sweep" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="text-center w-full max-w-[820px] min-w-0 mx-auto">
          <div className="mb-6">
            <h1
              className="hero-reveal-headline font-black text-white tracking-tighter leading-[1.05] sm:leading-[0.95] text-center text-[clamp(2.15rem,10vw,3.35rem)] md:text-[clamp(3rem,7vw,6rem)]"
              style={{ textWrap: 'balance' }}
            >
              {content.headline.split('\n').filter(Boolean).map((line, i) => (
                <span key={i} className="level-title block">{line}</span>
              ))}
            </h1>
          </div>

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
              <PixelButton
                variant="primary"
                href={content.primaryCTALink}
                className="hero-reveal-cta w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 text-xs sm:text-sm tracking-widest group"
                style={{ minHeight: '60px', minWidth: 'min(100%, 220px)' }}
              >
                <span>{content.primaryCTA}</span>
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </PixelButton>

              <PixelButton
                variant="outline"
                href={content.secondaryCTALink}
                className="hero-reveal-cta hero-reveal-cta--delay w-full sm:w-auto px-6 sm:px-10 py-4 text-xs sm:text-sm tracking-widest"
                style={{ minHeight: '56px', minWidth: 'min(100%, 180px)' }}
              >
                {content.secondaryCTA}
              </PixelButton>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
