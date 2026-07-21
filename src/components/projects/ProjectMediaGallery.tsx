"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
  ImageIcon,
  Film,
  Link,
  AlertTriangle,
} from "lucide-react";
import type { ProjectMediaItem } from "@/types/project-static";
import { getVideoThumbnailUrl, getPlayableVideoSources, isTrustedCloudinaryMp4 } from "@/lib/media/config";

interface ProjectMediaGalleryProps {
  items: ProjectMediaItem[];
  title?: string;
}

function MediaTypeBadge({ kind, provider }: { kind: string; provider?: string | null }) {
  const label =
    kind === "video" ? "Video"
    : kind === "embed" ? "Embed"
    : kind === "external" ? "External"
    : kind === "image" ? "Image"
    : "Media";

  const icon =
    kind === "video" ? <Film size={10} />
    : kind === "external" ? <ExternalLink size={10} />
    : kind === "embed" ? <Link size={10} />
    : <ImageIcon size={10} />;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-background/80 border border-primary/20 text-[9px] font-bold uppercase tracking-wider text-foreground/60">
      {icon}
      {provider || label}
    </span>
  );
}

function MediaErrorFallback({ item }: { item: ProjectMediaItem }) {
  const thumbUrl = getVideoThumbnailUrl(item.src);
  const isVideo = item.kind === "video";

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full gap-3 p-6 bg-primary/5 overflow-hidden">
      {thumbUrl && (
        <Image
          src={thumbUrl}
          alt=""
          fill
          className="object-contain opacity-20"
          sizes="(max-width: 768px) 100vw, 900px"
        />
      )}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <AlertTriangle size={28} className="text-foreground/30" />
        <span className="text-[10px] text-foreground/30 uppercase tracking-wider text-center">
          {isVideo ? "Video cannot be previewed right now." : "Media unavailable"}
        </span>
        {isVideo && (
          <span className="text-[9px] text-foreground/20 uppercase tracking-wider text-center">
            Try again shortly or open the video directly.
          </span>
        )}
        {item.provider && (
          <a
            href={item.src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[9px] text-accent hover:text-accent/80 uppercase tracking-wider underline"
          >
            <ExternalLink size={10} />
            Open video
          </a>
        )}
      </div>
    </div>
  );
}

function FeaturedMedia({ item, title }: { item: ProjectMediaItem; title?: string }) {
  const [mediaError, setMediaError] = useState(false);
  const [videoSourceIndex, setVideoSourceIndex] = useState(0);
  const currentKeyRef = useRef<string | null>(null);
  const loadedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLoadTimer = useCallback(() => {
    if (loadedTimerRef.current !== null) {
      clearTimeout(loadedTimerRef.current);
      loadedTimerRef.current = null;
    }
  }, []);

  const tryNextVideoSource = useCallback((maxSources: number, fromKey: string) => {
    if (currentKeyRef.current !== fromKey) return;
    clearLoadTimer();
    setVideoSourceIndex((prev) => {
      const next = prev + 1;
      if (next >= maxSources) {
        setMediaError(true);
        return prev;
      }
      return next;
    });
  }, [clearLoadTimer]);

  if (item.kind === "video" && isTrustedCloudinaryMp4(item.src)) {
    return (
      <video
        key={item.src}
        src={item.src}
        controls
        playsInline
        preload="auto"
        poster={getVideoThumbnailUrl(item.src) || undefined}
        className="w-full h-full object-contain"
      >
        <p className="text-foreground/40 text-xs p-4">
          Your browser does not support the video tag.{item.provider ? ` Open in ${item.provider} instead.` : ""}
        </p>
      </video>
    );
  }

  if (mediaError) return <MediaErrorFallback item={item} />;

  switch (item.kind) {
    case "video": {
      const playableSources = getPlayableVideoSources(item.src);
      const currentSrc = playableSources[Math.min(videoSourceIndex, playableSources.length - 1)];

      return (
        <video
          key={currentSrc}
          src={currentSrc}
          controls
          playsInline
          preload="metadata"
          poster={getVideoThumbnailUrl(item.src) || undefined}
          className="w-full h-full object-contain"
          onLoadStart={() => {
            currentKeyRef.current = currentSrc;
            clearLoadTimer();
            loadedTimerRef.current = setTimeout(() => {
              if (currentKeyRef.current === currentSrc) {
                tryNextVideoSource(playableSources.length, currentSrc);
              }
            }, 20000);
          }}
          onLoadedMetadata={() => { clearLoadTimer(); setMediaError(false); }}
          onDurationChange={(e) => {
            const dur = e.currentTarget.duration;
            if (dur && Number.isFinite(dur) && dur > 0) {
              clearLoadTimer();
              setMediaError(false);
            }
          }}
          onCanPlay={(e) => {
            const dur = e.currentTarget.duration;
            if (dur && Number.isFinite(dur) && dur > 0) {
              clearLoadTimer();
              setMediaError(false);
            }
          }}
          onError={(e) => {
            tryNextVideoSource(playableSources.length, e.currentTarget.currentSrc || currentSrc);
          }}
        >
          <p className="text-foreground/40 text-xs p-4">
            Your browser does not support the video tag.{item.provider ? ` Open in ${item.provider} instead.` : ""}
          </p>
        </video>
      );
    }
    case "embed":
      return item.embedUrl ? (
        <iframe
          key={item.embedUrl}
          src={item.embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={item.alt || title || "Embedded media"}
        />
      ) : (
        <ExternalVideoCard item={item} />
      );
    case "external":
      return <ExternalVideoCard item={item} />;
    case "image":
      return (
        <Image
          key={item.src}
          src={item.src}
          alt={item.alt || title || "Project media"}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 900px"
          onError={() => setMediaError(true)}
        />
      );
    default:
      return <MediaErrorFallback item={item} />;
  }
}

export default function ProjectMediaGallery({ items, title }: ProjectMediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedContext, setExpandedContext] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, items.length - 1)));
    setExpandedContext(false);
  }, [items.length]);

  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  useEffect(() => {
    if (!railRef.current) return;
    const thumb = railRef.current.children[activeIndex] as HTMLElement;
    if (thumb) {
      thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [activeIndex]);

  if (!items || items.length === 0) return null;

  const safeIndex = Math.min(activeIndex, items.length - 1);
  const active = items[safeIndex];
  const hasMultiple = items.length > 1;
  const hasContext = !!(active.title || active.description);

  const renderThumbnail = (item: ProjectMediaItem, index: number) => {
    const isActive = index === safeIndex;
    return (
      <button
        key={`${item.src}-${index}`}
        type="button"
        onClick={() => goTo(index)}
        aria-label={`View media ${index + 1}${item.caption ? `: ${item.caption}` : ""}`}
        aria-current={isActive ? "true" : undefined}
        className={`relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 overflow-hidden border focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          isActive
            ? "border-accent/80 shadow-[0_0_12px_rgba(0,255,255,0.15)]"
            : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.2)] opacity-70 hover:opacity-100 transition-all duration-300"
        }`}
      >
        {item.kind === "image" && item.src ? (
          <Image src={item.src} alt="" fill className="object-cover" sizes="96px" />
        ) : item.kind === "video" && item.src ? (
          <>
            <VideoThumbnailImage src={item.src} />
            <span className="absolute inset-0 flex items-center justify-center bg-background/40">
              <Play size={16} className="text-accent" />
            </span>
          </>
        ) : item.kind === "embed" && item.embedUrl ? (
          <>
            <iframe
              src={item.embedUrl}
              className="w-full h-full pointer-events-none"
              title=""
            />
            <span className="absolute inset-0 flex items-center justify-center bg-background/20">
              <Play size={16} className="text-accent" />
            </span>
          </>
        ) : (
          <span className="absolute inset-0 flex items-center justify-center bg-primary/10">
            {item.kind === "external" ? (
              <ExternalLink size={14} className="text-accent/60" />
            ) : (
              <Film size={14} className="text-accent/60" />
            )}
          </span>
        )}
        {item.provider && (
          <span className="absolute bottom-0 left-0 right-0 bg-background/80 text-[8px] text-foreground/50 text-center uppercase leading-tight py-0.5 truncate px-1">
            {item.provider}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.06)] pb-3">
        <span className="font-pixel text-[9px] text-foreground/40 tracking-[0.2em] uppercase">
          Project Gallery
        </span>
        {hasMultiple && (
          <span className="font-pixel text-[9px] text-foreground/25 tracking-wider ml-auto">
            {String(safeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* Featured Media Stage */}
      <div className="relative w-full bg-[rgba(8,10,20,0.45)] border border-[rgba(255,255,255,0.05)] overflow-hidden">
        <div className="aspect-[16/9] md:aspect-[16/9] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={safeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <FeaturedMedia item={active} title={title} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav arrows */}
        {hasMultiple && (
          <>
              <button
                type="button"
                onClick={goPrev}
                disabled={safeIndex === 0}
                aria-label="Previous media"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-background/90 border border-[rgba(255,255,255,0.06)] text-foreground/50 hover:text-foreground/80 hover:border-[rgba(255,255,255,0.15)] transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.95]"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={safeIndex === items.length - 1}
                aria-label="Next media"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-background/90 border border-[rgba(255,255,255,0.06)] text-foreground/50 hover:text-foreground/80 hover:border-[rgba(255,255,255,0.15)] transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.95]"
              >
                <ChevronRight size={18} />
              </button>
          </>
        )}

        {/* Caption overlay */}
        {active.caption && !hasContext && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent p-4 sm:p-5 pointer-events-none">
            <p className="text-[10px] sm:text-xs text-foreground/60 font-modern leading-relaxed max-w-[75%] pointer-events-auto">
              {active.caption}
            </p>
          </div>
        )}

        {/* Type badge top-right */}
        <div className="absolute top-3 right-3">
          <MediaTypeBadge kind={active.kind} provider={active.provider} />
        </div>
      </div>

      {/* Media Context Panel */}
      {hasContext && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[rgba(8,10,20,0.45)] border border-[rgba(255,255,255,0.05)] backdrop-blur-[12px] p-6 sm:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {active.title && (
                <h3 className="font-display text-base sm:text-lg text-white uppercase tracking-tight leading-tight mb-2">
                  {active.title}
                </h3>
              )}
              {active.description && (
                <p className="font-modern text-sm text-foreground/60 leading-relaxed">
                  {active.description}
                </p>
              )}
            </div>
            {active.caption && (
              <button
                type="button"
                onClick={() => setExpandedContext(!expandedContext)}
                aria-label={expandedContext ? "Hide details" : "Show details"}
                className="shrink-0 px-2 py-1 text-[9px] font-pixel uppercase tracking-wider text-foreground/40 hover:text-foreground/70 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] transition-all duration-200 active:scale-[0.95]"
              >
                {expandedContext ? "Close" : "Details"}
              </button>
            )}
          </div>
          {expandedContext && active.caption && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="font-modern text-xs text-foreground/50 leading-relaxed mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]"
            >
              {active.caption}
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Thumbnail Rail */}
      {hasMultiple && (
        <div
          ref={railRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
        >
          {items.map((item, index) => renderThumbnail(item, index))}
        </div>
      )}
    </div>
  );
}

function VideoThumbnailImage({ src }: { src: string }) {
  const thumbUrl = getVideoThumbnailUrl(src);
  if (thumbUrl) {
    return <Image src={thumbUrl} alt="" fill className="object-cover" sizes="96px" />;
  }
  return <video src={src} className="w-full h-full object-cover" muted preload="metadata" />;
}

function ExternalVideoCard({ item }: { item: ProjectMediaItem }) {
  return (
    <a
      href={item.src}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center w-full h-full gap-4 bg-primary/5 hover:bg-accent/5 transition-colors group"
    >
      <ExternalLink size={32} className="text-accent/60 group-hover:text-accent transition-colors" />
      <span className="text-xs font-bold uppercase tracking-widest text-accent">
        Open {item.provider || "external video"}
      </span>
      {item.alt && (
        <span className="text-[10px] text-foreground/40 text-center px-4 line-clamp-2 max-w-xs">
          {item.alt}
        </span>
      )}
      {item.caption && (
        <span className="text-[9px] text-foreground/30 text-center px-4 line-clamp-1 max-w-xs">
          {item.caption}
        </span>
      )}
    </a>
  );
}
