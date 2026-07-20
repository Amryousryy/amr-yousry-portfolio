"use client";

/**
 * Signal Beacon — Pixel Sprite Component (Phase 5.0)
 * 
 * Asset ID: ce_beacon_idle_v01, ce_beacon_active_v01
 * Canvas: 16×16px native, 3× display (48×48px)
 * 
 * Pure presentational component. State driven by ecosystem.
 * No internal timers. The ecosystem decides when it broadcasts.
 */

import { CSSProperties } from "react";
import { useEcosystem } from "@/lib/creative-engine/context";
import "@/styles/creative-engine/ce_beacon.css";

export interface SignalBeaconPixelProps {
  /** Display size in pixels (default: 48) */
  size?: number;
  /** Override variant — if omitted, reads from ecosystem */
  variant?: "idle" | "active" | "static";
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Accessibility label */
  ariaLabel?: string;
}

export function SignalBeaconPixel({
  size = 48,
  variant,
  className = "",
  style,
  ariaLabel = "Signal Beacon",
}: SignalBeaconPixelProps) {
  let resolvedVariant: "idle" | "active" | "static";

  try {
    const eco = useEcosystem();
    resolvedVariant = variant ?? eco.beaconVariant;
  } catch {
    resolvedVariant = variant ?? "idle";
  }

  return (
    <div
      className={`ce-beacon-pixel ce-beacon-pixel--${resolvedVariant} ${className}`}
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
        {/* Signal rings (active state) */}
        <rect className="ce-beacon-ring ce-beacon-ring--1" x="5" y="0" width="1" height="1" fill="#22D3EE" opacity="0.3"/>
        <rect className="ce-beacon-ring ce-beacon-ring--1" x="10" y="0" width="1" height="1" fill="#22D3EE" opacity="0.3"/>
        <rect className="ce-beacon-ring ce-beacon-ring--2" x="3" y="1" width="1" height="1" fill="#22D3EE" opacity="0.2"/>
        <rect className="ce-beacon-ring ce-beacon-ring--2" x="12" y="1" width="1" height="1" fill="#22D3EE" opacity="0.2"/>
        <rect className="ce-beacon-ring ce-beacon-ring--3" x="2" y="3" width="1" height="1" fill="#22D3EE" opacity="0.15"/>
        <rect className="ce-beacon-ring ce-beacon-ring--3" x="13" y="3" width="1" height="1" fill="#22D3EE" opacity="0.15"/>

        {/* Antenna tip */}
        <rect className="ce-beacon-tip" x="7" y="0" width="2" height="1" fill="#22D3EE"/>

        {/* Antenna shaft */}
        <rect x="7" y="1" width="2" height="2" fill="#22D3EE" opacity="0.6"/>

        {/* Antenna base */}
        <rect x="6" y="3" width="4" height="1" fill="#1E1B4B"/>

        {/* Mast */}
        <rect x="7" y="4" width="2" height="3" fill="#1E1B4B"/>

        {/* Body top */}
        <rect x="5" y="7" width="6" height="1" fill="#6D28D9"/>

        {/* Body */}
        <rect x="4" y="8" width="8" height="3" fill="#6D28D9"/>

        {/* Core glow */}
        <rect className="ce-beacon-core" x="6" y="8" width="1" height="2" fill="#22D3EE" opacity="0.5"/>
        <rect className="ce-beacon-core" x="9" y="8" width="1" height="2" fill="#22D3EE" opacity="0.5"/>
        <rect className="ce-beacon-core" x="7" y="9" width="2" height="1" fill="#22D3EE" opacity="0.6"/>

        {/* Body bottom */}
        <rect x="5" y="11" width="6" height="1" fill="#6D28D9"/>

        {/* Base */}
        <rect x="7" y="12" width="2" height="1" fill="#1E1B4B"/>
        <rect x="5" y="13" width="6" height="1" fill="#1E1B4B"/>
        <rect x="4" y="14" width="8" height="1" fill="#1E1B4B"/>
        <rect x="3" y="15" width="10" height="1" fill="#1E1B4B"/>
      </svg>
    </div>
  );
}
