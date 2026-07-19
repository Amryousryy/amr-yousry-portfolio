"use client";

/**
 * Memory Crystal — Pixel Sprite Component
 * 
 * Asset ID: ce_crystal_idle_v01
 * Canvas: 16×16px native, 3× display (48×48px)
 * 
 * A pixel art representation of the Memory Crystal —
 * the Engine's memory banks, storing creative decisions.
 * 
 * Usage:
 *   <MemoryCrystalPixel size={48} variant="idle" />
 *   <MemoryCrystalPixel size={96} variant="pulse" />
 *   <MemoryCrystalPixel size={48} variant="activate" />
 */

import { CSSProperties, useEffect, useRef, useState } from "react";

export interface MemoryCrystalPixelProps {
  /** Display size in pixels (default: 48) */
  size?: number;
  /** Animation variant */
  variant?: "idle" | "pulse" | "activate" | "static";
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Accessibility label */
  ariaLabel?: string;
  /** Auto-play pulse on interval (ms). 0 = disabled. Default: 15000 */
  pulseInterval?: number;
  /** Trigger activate animation on scroll intersection */
  activateOnScroll?: boolean;
}

export function MemoryCrystalPixel({
  size = 48,
  variant = "idle",
  className = "",
  style,
  ariaLabel = "Memory Crystal",
  pulseInterval = 15000,
  activateOnScroll = false,
}: MemoryCrystalPixelProps) {
  const [currentVariant, setCurrentVariant] = useState(variant);
  const [isActive, setIsActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Scroll intersection trigger
  useEffect(() => {
    if (!activateOnScroll || variant !== "idle") return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isActive) {
          setIsActive(true);
          setCurrentVariant("activate");
          setTimeout(() => setCurrentVariant("idle"), 600);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [activateOnScroll, variant, isActive]);

  // Random pulse trigger
  useEffect(() => {
    if (variant !== "idle" || pulseInterval <= 0) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setCurrentVariant("pulse");
        setTimeout(() => setCurrentVariant("idle"), 900);
      }
    }, pulseInterval);

    return () => clearInterval(interval);
  }, [variant, pulseInterval]);

  return (
    <div
      ref={ref}
      className={`ce-crystal-pixel ce-crystal-pixel--${currentVariant} ${className}`}
      style={{
        width: size,
        height: size,
        ...style,
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        style={{ imageRendering: "pixelated" }}
        aria-hidden="true"
      >
        {/* Glow border */}
        <rect x="7" y="0" width="2" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="5" y="1" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="10" y="1" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="4" y="2" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="11" y="2" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="3" y="3" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="12" y="3" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="2" y="4" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="13" y="4" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="1" y="5" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="14" y="5" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="1" y="6" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="14" y="6" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="1" y="7" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="14" y="7" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="1" y="8" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="14" y="8" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="1" y="9" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="14" y="9" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="2" y="10" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="13" y="10" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="3" y="11" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="12" y="11" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="4" y="12" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="11" y="12" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="5" y="13" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="10" y="13" width="1" height="1" fill="#A78BFA" opacity="0.3" />
        <rect x="7" y="14" width="2" height="1" fill="#A78BFA" opacity="0.3" />

        {/* Top accent (Electric Cyan — 2px) */}
        <rect x="7" y="1" width="2" height="1" fill="#22D3EE" />

        {/* Upper highlight (Light Purple) */}
        <rect x="5" y="2" width="1" height="1" fill="#A78BFA" />
        <rect x="6" y="2" width="1" height="1" fill="#A78BFA" />
        <rect x="9" y="2" width="1" height="1" fill="#A78BFA" />
        <rect x="10" y="2" width="1" height="1" fill="#A78BFA" />
        <rect x="4" y="3" width="1" height="1" fill="#A78BFA" />
        <rect x="5" y="3" width="1" height="1" fill="#A78BFA" />
        <rect x="10" y="3" width="1" height="1" fill="#A78BFA" />
        <rect x="11" y="3" width="1" height="1" fill="#A78BFA" />
        <rect x="3" y="4" width="1" height="1" fill="#A78BFA" />
        <rect x="4" y="4" width="1" height="1" fill="#A78BFA" />
        <rect x="11" y="4" width="1" height="1" fill="#A78BFA" />
        <rect x="12" y="4" width="1" height="1" fill="#A78BFA" />
        <rect x="2" y="5" width="1" height="1" fill="#A78BFA" />
        <rect x="3" y="5" width="1" height="1" fill="#A78BFA" />
        <rect x="12" y="5" width="1" height="1" fill="#A78BFA" />
        <rect x="13" y="5" width="1" height="1" fill="#A78BFA" />

        {/* Crystal body (Deep Purple — dominant) */}
        <rect x="7" y="2" width="2" height="1" fill="#6D28D9" />
        <rect x="7" y="3" width="2" height="1" fill="#6D28D9" />
        <rect x="8" y="3" width="2" height="1" fill="#6D28D9" />
        <rect x="6" y="3" width="1" height="1" fill="#6D28D9" />
        <rect x="9" y="3" width="1" height="1" fill="#6D28D9" />
        <rect x="5" y="4" width="6" height="1" fill="#6D28D9" />
        <rect x="4" y="5" width="9" height="1" fill="#6D28D9" />
        <rect x="3" y="6" width="10" height="1" fill="#6D28D9" />
        <rect x="3" y="7" width="10" height="1" fill="#6D28D9" />
        <rect x="3" y="8" width="10" height="1" fill="#6D28D9" />
        <rect x="2" y="9" width="12" height="1" fill="#6D28D9" />
        <rect x="3" y="10" width="10" height="1" fill="#6D28D9" />
        <rect x="4" y="11" width="8" height="1" fill="#6D28D9" />
        <rect x="5" y="12" width="6" height="1" fill="#6D28D9" />
        <rect x="6" y="13" width="4" height="1" fill="#6D28D9" />

        {/* Core glow (Light Purple — 60% opacity) */}
        <rect x="6" y="6" width="1" height="1" fill="#A78BFA" opacity="0.6" />
        <rect x="9" y="6" width="1" height="1" fill="#A78BFA" opacity="0.6" />
        <rect x="5" y="7" width="1" height="1" fill="#A78BFA" opacity="0.6" />
        <rect x="10" y="7" width="1" height="1" fill="#A78BFA" opacity="0.6" />
        <rect x="6" y="8" width="1" height="1" fill="#A78BFA" opacity="0.6" />
        <rect x="9" y="8" width="1" height="1" fill="#A78BFA" opacity="0.6" />
        <rect x="7" y="7" width="2" height="1" fill="#A78BFA" opacity="0.6" />

        {/* Lower shadow (Dark Indigo) */}
        <rect x="2" y="9" width="1" height="1" fill="#1E1B4B" />
        <rect x="13" y="9" width="1" height="1" fill="#1E1B4B" />
        <rect x="3" y="10" width="1" height="1" fill="#1E1B4B" />
        <rect x="12" y="10" width="1" height="1" fill="#1E1B4B" />
        <rect x="4" y="11" width="1" height="1" fill="#1E1B4B" />
        <rect x="11" y="11" width="1" height="1" fill="#1E1B4B" />
        <rect x="5" y="12" width="1" height="1" fill="#1E1B4B" />
        <rect x="10" y="12" width="1" height="1" fill="#1E1B4B" />
        <rect x="6" y="13" width="1" height="1" fill="#1E1B4B" />
        <rect x="9" y="13" width="1" height="1" fill="#1E1B4B" />
        <rect x="7" y="13" width="1" height="1" fill="#1E1B4B" opacity="0.8" />
        <rect x="8" y="13" width="1" height="1" fill="#1E1B4B" opacity="0.8" />
      </svg>
    </div>
  );
}
