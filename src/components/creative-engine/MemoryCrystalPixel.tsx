"use client";

/**
 * Memory Crystal — Pixel Sprite Component (Phase 4.0)
 * 
 * Asset ID: ce_crystal_idle_v01
 * Canvas: 16×16px native, 3× display (48×48px)
 * 
 * State-driven component. Reads variant from ecosystem.
 * No internal timers. The ecosystem decides when it resonates.
 */

import { CSSProperties, useRef } from "react";
import { useEcosystem } from "@/lib/creative-engine/context";
import "@/styles/creative-engine/ce_crystal.css";

export interface MemoryCrystalPixelProps {
  /** Display size in pixels (default: 48) */
  size?: number;
  /** Override variant — if omitted, reads from ecosystem */
  variant?: "idle" | "pulse" | "activate" | "static";
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Accessibility label */
  ariaLabel?: string;
}

export function MemoryCrystalPixel({
  size = 48,
  variant,
  className = "",
  style,
  ariaLabel = "Memory Crystal",
}: MemoryCrystalPixelProps) {
  const ref = useRef<HTMLDivElement>(null);

  let resolvedVariant: "idle" | "pulse" | "activate" | "static";

  try {
    const eco = useEcosystem();
    resolvedVariant = variant ?? eco.crystalVariant;
  } catch {
    resolvedVariant = variant ?? "idle";
  }

  return (
    <div
      ref={ref}
      className={`ce-crystal-pixel ce-crystal-pixel--${resolvedVariant} ${className}`}
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
