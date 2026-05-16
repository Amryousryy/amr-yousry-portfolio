import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PixelButton } from "@/components/ui/pixel-button";
import { heroContent } from "@/content/hero";

export default function HeroSection() {
  return (
    <Section className="min-h-[82svh] flex items-center justify-center relative overflow-hidden px-0 py-14 sm:py-20 md:py-28">
      {/* Background - single subtle grid + cinematic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,15,0.55)_100%)] pointer-events-none z-0" />

      <Container className="relative z-10">
        <div className="text-center w-full max-w-[820px] min-w-0 mx-auto">
          {/* Headline Group - Premium retro title */}
          <div className="mb-8">
            <h1 
              className="font-black text-white tracking-tighter leading-[1.05] sm:leading-[0.95] text-center text-[clamp(2.15rem,10vw,3.35rem)] md:text-[clamp(3rem,7vw,6rem)]"
            >
              <span className="level-title block">MAKE IDEAS</span>
              <span className="level-title block">MATTER</span>
            </h1>
            
            {/* Pixel separator */}
            <div className="pixel-separator mt-4 mb-4">
              <div className="pixel-separator-dot" />
            </div>
            
            {/* Subtitle - Business focused, readable, neutral color */}
            <p 
              className="text-slate-300 font-normal px-2 sm:px-1"
              style={{ 
                fontSize: 'clamp(0.95rem, 4vw, 1.35rem)',
                lineHeight: '1.55',
                maxWidth: '700px',
                margin: '1rem auto 0'
              }}
            >
              {heroContent.subheadline}
            </p>
          </div>

          {/* CTA Block - Closer to subtitle */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
              <PixelButton 
                variant="primary" 
                href={heroContent.ctas.primary.href}
                className="w-full sm:w-auto px-6 sm:px-10 py-4 text-xs sm:text-sm tracking-widest group"
                style={{ minHeight: '56px', minWidth: 'min(100%, 180px)' }}
              >
                <span>{heroContent.ctas.primary.text}</span>
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </PixelButton>
              
              <PixelButton 
                variant="outline" 
                href={heroContent.ctas.secondary.href}
                className="w-full sm:w-auto px-6 sm:px-10 py-4 text-xs sm:text-sm tracking-widest"
                style={{ minHeight: '56px', minWidth: 'min(100%, 180px)' }}
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
