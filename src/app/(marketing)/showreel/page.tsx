import type { Metadata } from "next";
import { showreelConfig } from "@/data/showreel";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PixelButton } from "@/components/ui/pixel-button";
import Image from "next/image";
import Link from "next/link";
import ShowreelTracker from "@/components/analytics/ShowreelTracker";

export const metadata: Metadata = {
  title: "Showreel",
  description:
    "A curated selection of cinematic video work and creative direction. New showreel in progress — browse project case studies in the meantime.",
  openGraph: {
    title: "Showreel | Amr Yousry",
    description:
      "A curated selection of cinematic video work and creative direction. New showreel in progress — browse project case studies in the meantime.",
    url: "https://amr-yousry-portfolio.vercel.app/showreel",
    siteName: "Amr Yousry Portfolio",
    images: [
      {
        url: "/images/meta/og-preview-v6.jpg",
        width: 1200,
        height: 630,
        alt: "Showreel | Amr Yousry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Showreel | Amr Yousry",
    description:
      "A curated selection of cinematic video work and creative direction. New showreel in progress — browse project case studies in the meantime.",
    images: ["/images/meta/og-preview-v6.jpg"],
  },
};

export default function ShowreelPage() {
  const isYouTube = showreelConfig.type === "youtube";
  const isVimeo = showreelConfig.type === "vimeo";
  const isLocal = showreelConfig.type === "local";
  const isVideo = isLocal || isYouTube || isVimeo;

  return (
    <>
      <ShowreelTracker />
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
              <p className="font-modern text-text-dim text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
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
                playsInline
                className="w-full h-full object-contain"
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
              <div className="relative w-full h-full flex flex-col items-center justify-center gap-6 px-6 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900/80">
                {/* Game grid background */}
                <div className="absolute inset-0 game-grid-bg opacity-20 pointer-events-none" />
                {/* Cinematic corner accents */}
                <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-brand-cyan/40 shadow-[0_0_12px_-2px_rgba(34,211,238,0.15)]" />
                <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-brand-cyan/40 shadow-[0_0_12px_-2px_rgba(34,211,238,0.15)]" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-brand-cyan/40 shadow-[0_0_12px_-2px_rgba(34,211,238,0.15)]" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-brand-cyan/40 shadow-[0_0_12px_-2px_rgba(34,211,238,0.15)]" />
                {/* Scanline overlay */}
                <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="w-16 h-16 border-2 border-brand-cyan/30 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-brand-cyan/60 rounded-full animate-pulse" />
                  </div>
                  <p className="font-pixel text-text-dim text-sm text-center max-w-md leading-relaxed">
                    Showreel is being curated. For selected work, explore the projects archive.
                  </p>
                  <Link
                    href="/projects"
                    className="font-pixel text-brand-cyan text-[10px] tracking-widest uppercase border-2 border-brand-cyan px-6 py-3 hover:bg-brand-cyan hover:text-brand-blue transition-colors"
                  >
                    Browse Projects
                  </Link>
                </div>
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
    </>
  );
}
