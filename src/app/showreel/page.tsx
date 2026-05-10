import { showreelConfig } from "@/data/showreel";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PixelButton } from "@/components/ui/pixel-button";
import Image from "next/image";

export default function ShowreelPage() {
  const isYouTube = showreelConfig.type === "youtube";
  const isVimeo = showreelConfig.type === "vimeo";
  const isLocal = showreelConfig.type === "local";
  const isVideo = isLocal || isYouTube || isVimeo;

  return (
    <Section className="min-h-screen py-24 md:py-32 bg-background overflow-hidden">
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 md:mb-12 text-center">
            <span className="font-pixel text-brand-cyan text-[10px] tracking-[0.3em] uppercase block mb-4">
              Showreel
            </span>
            <h1 className="text-[clamp(2rem,9vw,3.75rem)] md:text-6xl font-pixel uppercase tracking-tighter mb-6 break-words leading-tight">
              {showreelConfig.title}
            </h1>
            {showreelConfig.description && (
              <p className="font-modern text-text-dim text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {showreelConfig.description}
              </p>
            )}
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-slate-900 border-2 border-slate-800 overflow-hidden mb-12">
            {isYouTube && (
              <iframe
                src={showreelConfig.src.replace("watch?v=", "embed/")}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={showreelConfig.title}
              />
            )}

            {isVimeo && (
              <iframe
                src={showreelConfig.src.replace("vimeo.com", "player.vimeo.com/video")}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={showreelConfig.title}
              />
            )}

            {isLocal && (
              <video
                src={showreelConfig.src}
                controls
                className="w-full h-full object-cover"
                poster={showreelConfig.thumbnail}
              >
                Your browser does not support video playback.
              </video>
            )}

            {!isVideo && showreelConfig.thumbnail && (
              <Image
                src={showreelConfig.thumbnail}
                alt={showreelConfig.title}
                fill
                className="object-cover"
              />
            )}

            {!isVideo && !showreelConfig.thumbnail && (
              <div className="flex items-center justify-center h-full">
                <p className="font-pixel text-text-dim text-sm">
                  Configure showreel in /src/data/showreel.ts
                </p>
              </div>
            )}
          </div>

          {/* Duration + Back CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
            {showreelConfig.duration && (
              <span className="font-pixel text-text-dim text-[10px] tracking-widest">
                Duration: {showreelConfig.duration}
              </span>
            )}
            <PixelButton
              variant="outline"
              href="/"
              className="w-full sm:w-auto px-8 py-4 text-xs tracking-widest"
            >
              ← Back to Home
            </PixelButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}
