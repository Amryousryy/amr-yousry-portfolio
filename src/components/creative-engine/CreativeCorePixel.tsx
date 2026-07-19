/**
 * Creative Core — Pixel Emblem
 * 
 * Asset ID: ce_core_focal_v01
 * Canvas: 16×16px native, 3× display (48×48px)
 * 
 * A pixel art representation of the Creative Core —
 * the Engine's heart, the brightest ambient element.
 * 
 * Usage:
 *   <CreativeCorePixel size={48} variant="idle" />
 *   <CreativeCorePixel size={96} variant="pulse" />
 */

import { CSSProperties } from "react";
import "@/styles/creative-engine/ce_core_focal.css";

export interface CreativeCorePixelProps {
  /** Display size in pixels (default: 48) */
  size?: number;
  /** Animation variant */
  variant?: "idle" | "pulse" | "static";
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Accessibility label */
  ariaLabel?: string;
}

export function CreativeCorePixel({
  size = 48,
  variant = "idle",
  className = "",
  style,
  ariaLabel = "Creative Core",
}: CreativeCorePixelProps) {
  return (
    <div
      className={`ce-core-pixel ce-core-pixel--${variant} ${className}`}
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
        {/* Ring glow (outermost) */}
        <rect x="7" y="0" width="2" height="1" fill="#22D3EE" opacity="0.4" />
        <rect x="5" y="1" width="1" height="1" fill="#22D3EE" opacity="0.4" />
        <rect x="10" y="1" width="1" height="1" fill="#22D3EE" opacity="0.4" />
        <rect x="4" y="2" width="1" height="1" fill="#22D3EE" opacity="0.4" />
        <rect x="11" y="2" width="1" height="1" fill="#22D3EE" opacity="0.4" />
        <rect x="3" y="3" width="1" height="1" fill="#22D3EE" opacity="0.4" />
        <rect x="12" y="3" width="1" height="1" fill="#22D3EE" opacity="0.4" />
        <rect x="1" y="7" width="1" height="2" fill="#22D3EE" opacity="0.4" />
        <rect x="14" y="7" width="1" height="2" fill="#22D3EE" opacity="0.4" />
        <rect x="3" y="12" width="1" height="1" fill="#22D3EE" opacity="0.4" />
        <rect x="12" y="12" width="1" height="1" fill="#22D3EE" opacity="0.4" />
        <rect x="4" y="13" width="1" height="1" fill="#22D3EE" opacity="0.4" />
        <rect x="11" y="13" width="1" height="1" fill="#22D3EE" opacity="0.4" />
        <rect x="5" y="14" width="1" height="1" fill="#22D3EE" opacity="0.4" />
        <rect x="10" y="14" width="1" height="1" fill="#22D3EE" opacity="0.4" />

        {/* Containment ring */}
        <rect x="7" y="1" width="2" height="1" fill="#22D3EE" />
        <rect x="5" y="2" width="1" height="1" fill="#22D3EE" />
        <rect x="10" y="2" width="1" height="1" fill="#22D3EE" />
        <rect x="4" y="3" width="1" height="1" fill="#22D3EE" />
        <rect x="11" y="3" width="1" height="1" fill="#22D3EE" />
        <rect x="3" y="4" width="1" height="1" fill="#22D3EE" />
        <rect x="12" y="4" width="1" height="1" fill="#22D3EE" />
        <rect x="2" y="5" width="1" height="1" fill="#22D3EE" />
        <rect x="13" y="5" width="1" height="1" fill="#22D3EE" />
        <rect x="2" y="6" width="1" height="1" fill="#22D3EE" />
        <rect x="13" y="6" width="1" height="1" fill="#22D3EE" />
        <rect x="2" y="7" width="1" height="2" fill="#22D3EE" />
        <rect x="13" y="7" width="1" height="2" fill="#22D3EE" />
        <rect x="2" y="9" width="1" height="1" fill="#22D3EE" />
        <rect x="13" y="9" width="1" height="1" fill="#22D3EE" />
        <rect x="2" y="10" width="1" height="1" fill="#22D3EE" />
        <rect x="13" y="10" width="1" height="1" fill="#22D3EE" />
        <rect x="3" y="11" width="1" height="1" fill="#22D3EE" />
        <rect x="12" y="11" width="1" height="1" fill="#22D3EE" />
        <rect x="4" y="12" width="1" height="1" fill="#22D3EE" />
        <rect x="11" y="12" width="1" height="1" fill="#22D3EE" />
        <rect x="5" y="13" width="1" height="1" fill="#22D3EE" />
        <rect x="10" y="13" width="1" height="1" fill="#22D3EE" />
        <rect x="7" y="14" width="2" height="1" fill="#22D3EE" />

        {/* Core edge (Dark Orange) */}
        <rect x="5" y="4" width="6" height="1" fill="#9A3412" />
        <rect x="4" y="5" width="1" height="6" fill="#9A3412" />
        <rect x="11" y="5" width="1" height="6" fill="#9A3412" />
        <rect x="5" y="11" width="6" height="1" fill="#9A3412" />

        {/* Core mid (Deep Amber) */}
        <rect x="6" y="4" width="4" height="1" fill="#EA580C" />
        <rect x="5" y="5" width="1" height="6" fill="#EA580C" />
        <rect x="10" y="5" width="1" height="6" fill="#EA580C" />
        <rect x="6" y="11" width="4" height="1" fill="#EA580C" />
        <rect x="5" y="5" width="6" height="1" fill="#EA580C" />
        <rect x="5" y="10" width="6" height="1" fill="#EA580C" />

        {/* Core center (Warm Orange) */}
        <rect x="6" y="5" width="4" height="1" fill="#FB923C" />
        <rect x="5" y="6" width="1" height="4" fill="#FB923C" />
        <rect x="10" y="6" width="1" height="4" fill="#FB923C" />
        <rect x="6" y="10" width="4" height="1" fill="#FB923C" />
        <rect x="6" y="6" width="4" height="4" fill="#FB923C" />
      </svg>
    </div>
  );
}
