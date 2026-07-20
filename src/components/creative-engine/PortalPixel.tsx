"use client";

import type { CSSProperties } from "react";

export interface PortalPixelProps {
  size?: number;
  variant?: "idle" | "preparing" | "opening" | "active" | "synchronizing" | "closing" | "static";
  style?: CSSProperties;
}

export function PortalPixel({
  size = 48,
  variant = "idle",
  style,
}: PortalPixelProps) {
  return (
    <div
      className={`ce-portal ce-portal--${variant}`}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 16 16"
        width="100%"
        height="100%"
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring — segmented circular gate */}
        {/* Top arc */}
        <rect x="5" y="0" width="1" height="1" className="ce-portal__seg ce-portal__seg--n" />
        <rect x="6" y="0" width="1" height="1" className="ce-portal__seg ce-portal__seg--n" />
        <rect x="7" y="0" width="1" height="1" className="ce-portal__seg ce-portal__seg--n" />
        <rect x="8" y="0" width="1" height="1" className="ce-portal__seg ce-portal__seg--n" />
        <rect x="9" y="0" width="1" height="1" className="ce-portal__seg ce-portal__seg--n" />
        <rect x="10" y="0" width="1" height="1" className="ce-portal__seg ce-portal__seg--n" />

        {/* Top-right corner */}
        <rect x="11" y="1" width="1" height="1" className="ce-portal__seg ce-portal__seg--ne" />
        <rect x="12" y="2" width="1" height="1" className="ce-portal__seg ce-portal__seg--ne" />

        {/* Right side */}
        <rect x="13" y="3" width="1" height="1" className="ce-portal__seg ce-portal__seg--e" />
        <rect x="13" y="4" width="1" height="1" className="ce-portal__seg ce-portal__seg--e" />
        <rect x="13" y="5" width="1" height="1" className="ce-portal__seg ce-portal__seg--e" />
        <rect x="13" y="6" width="1" height="1" className="ce-portal__seg ce-portal__seg--e" />
        <rect x="13" y="7" width="1" height="1" className="ce-portal__seg ce-portal__seg--e" />
        <rect x="13" y="8" width="1" height="1" className="ce-portal__seg ce-portal__seg--e" />
        <rect x="13" y="9" width="1" height="1" className="ce-portal__seg ce-portal__seg--e" />
        <rect x="13" y="10" width="1" height="1" className="ce-portal__seg ce-portal__seg--e" />
        <rect x="13" y="11" width="1" height="1" className="ce-portal__seg ce-portal__seg--e" />

        {/* Bottom-right corner */}
        <rect x="12" y="12" width="1" height="1" className="ce-portal__seg ce-portal__seg--se" />
        <rect x="11" y="13" width="1" height="1" className="ce-portal__seg ce-portal__seg--se" />

        {/* Bottom arc */}
        <rect x="5" y="14" width="1" height="1" className="ce-portal__seg ce-portal__seg--s" />
        <rect x="6" y="14" width="1" height="1" className="ce-portal__seg ce-portal__seg--s" />
        <rect x="7" y="14" width="1" height="1" className="ce-portal__seg ce-portal__seg--s" />
        <rect x="8" y="14" width="1" height="1" className="ce-portal__seg ce-portal__seg--s" />
        <rect x="9" y="14" width="1" height="1" className="ce-portal__seg ce-portal__seg--s" />
        <rect x="10" y="14" width="1" height="1" className="ce-portal__seg ce-portal__seg--s" />

        {/* Bottom-left corner */}
        <rect x="4" y="13" width="1" height="1" className="ce-portal__seg ce-portal__seg--sw" />
        <rect x="3" y="12" width="1" height="1" className="ce-portal__seg ce-portal__seg--sw" />

        {/* Left side */}
        <rect x="2" y="3" width="1" height="1" className="ce-portal__seg ce-portal__seg--w" />
        <rect x="2" y="4" width="1" height="1" className="ce-portal__seg ce-portal__seg--w" />
        <rect x="2" y="5" width="1" height="1" className="ce-portal__seg ce-portal__seg--w" />
        <rect x="2" y="6" width="1" height="1" className="ce-portal__seg ce-portal__seg--w" />
        <rect x="2" y="7" width="1" height="1" className="ce-portal__seg ce-portal__seg--w" />
        <rect x="2" y="8" width="1" height="1" className="ce-portal__seg ce-portal__seg--w" />
        <rect x="2" y="9" width="1" height="1" className="ce-portal__seg ce-portal__seg--w" />
        <rect x="2" y="10" width="1" height="1" className="ce-portal__seg ce-portal__seg--w" />
        <rect x="2" y="11" width="1" height="1" className="ce-portal__seg ce-portal__seg--w" />

        {/* Top-left corner */}
        <rect x="3" y="2" width="1" height="1" className="ce-portal__seg ce-portal__seg--nw" />
        <rect x="4" y="1" width="1" height="1" className="ce-portal__seg ce-portal__seg--nw" />

        {/* Inner accent — center glow */}
        <rect x="6" y="6" width="1" height="1" className="ce-portal__core" />
        <rect x="7" y="6" width="1" height="1" className="ce-portal__core" />
        <rect x="8" y="6" width="1" height="1" className="ce-portal__core" />
        <rect x="9" y="6" width="1" height="1" className="ce-portal__core" />
        <rect x="6" y="7" width="1" height="1" className="ce-portal__core" />
        <rect x="9" y="7" width="1" height="1" className="ce-portal__core" />
        <rect x="6" y="8" width="1" height="1" className="ce-portal__core" />
        <rect x="9" y="8" width="1" height="1" className="ce-portal__core" />
        <rect x="6" y="9" width="1" height="1" className="ce-portal__core" />
        <rect x="7" y="9" width="1" height="1" className="ce-portal__core" />
        <rect x="8" y="9" width="1" height="1" className="ce-portal__core" />
        <rect x="9" y="9" width="1" height="1" className="ce-portal__core" />
      </svg>
    </div>
  );
}
