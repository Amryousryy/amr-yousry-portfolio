"use client";

/**
 * Maintenance Drone — Pixel Sprite Component (Phase 4.0)
 * 
 * Asset ID: ce_drone_idle_v01
 * Canvas: 24×28px native, 3× display (72×84px)
 * 
 * Pure presentational component. State driven by ecosystem.
 * No internal timelines. No auto-interact. No state machines.
 * The ecosystem decides when this component changes variant.
 */

import { CSSProperties } from "react";
import "@/styles/creative-engine/ce_drone.css";

export type DroneVariant = "idle" | "inspect" | "transfer" | "static";

export interface MaintenanceDronePixelProps {
  /** Display height in pixels (width auto-calculated from 24:28 ratio) */
  size?: number;
  /** Animation variant — driven by ecosystem state */
  variant?: DroneVariant;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Accessibility label */
  ariaLabel?: string;
}

export function MaintenanceDronePixel({
  size = 84,
  variant = "idle",
  className = "",
  style,
  ariaLabel = "Maintenance Drone",
}: MaintenanceDronePixelProps) {
  const width = Math.round(size * (24 / 28));

  return (
    <div
      className={`ce-drone-pixel ce-drone-pixel--${variant} ${className}`}
      style={{
        width,
        height: size,
        ...style,
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 24 28"
        width={width}
        height={size}
        style={{ imageRendering: "pixelated" }}
        aria-hidden="true"
      >
        {/* Antenna tip */}
        <rect className="ce-drone-antenna" x="11" y="0" width="2" height="2" fill="#22D3EE" opacity="0.8"/>
        
        {/* Antenna shaft */}
        <rect x="11" y="2" width="2" height="4" fill="#22D3EE" opacity="0.4"/>
        
        {/* Head highlight */}
        <rect x="8" y="6" width="8" height="1" fill="#F8FAFC" opacity="0.6"/>
        
        {/* Head */}
        <rect x="7" y="7" width="10" height="6" fill="#1E1B4B"/>
        
        {/* Eye */}
        <rect x="10" y="9" width="2" height="2" fill="#22D3EE"/>
        
        {/* Eye glow */}
        <rect x="9" y="8" width="1" height="1" fill="#22D3EE" opacity="0.2"/>
        <rect x="12" y="8" width="1" height="1" fill="#22D3EE" opacity="0.2"/>
        <rect x="9" y="11" width="1" height="1" fill="#22D3EE" opacity="0.2"/>
        <rect x="12" y="11" width="1" height="1" fill="#22D3EE" opacity="0.2"/>
        <rect x="9" y="9" width="1" height="2" fill="#22D3EE" opacity="0.15"/>
        <rect x="12" y="9" width="1" height="2" fill="#22D3EE" opacity="0.15"/>
        <rect x="10" y="8" width="2" height="1" fill="#22D3EE" opacity="0.15"/>
        <rect x="10" y="11" width="2" height="1" fill="#22D3EE" opacity="0.15"/>
        
        {/* Neck */}
        <rect x="9" y="13" width="6" height="1" fill="#1E1B4B"/>
        
        {/* Body */}
        <rect x="6" y="14" width="12" height="8" fill="#1E1B4B"/>
        <rect x="7" y="22" width="10" height="1" fill="#1E1B4B"/>
        <rect x="8" y="23" width="8" height="1" fill="#1E1B4B"/>
        <rect x="9" y="24" width="6" height="1" fill="#1E1B4B"/>
        
        {/* Core */}
        <rect x="11" y="17" width="2" height="2" fill="#6D28D9"/>
        
        {/* Core glow */}
        <rect x="10" y="16" width="1" height="1" fill="#6D28D9" opacity="0.3"/>
        <rect x="13" y="16" width="1" height="1" fill="#6D28D9" opacity="0.3"/>
        <rect x="10" y="19" width="1" height="1" fill="#6D28D9" opacity="0.3"/>
        <rect x="13" y="19" width="1" height="1" fill="#6D28D9" opacity="0.3"/>
        <rect x="10" y="17" width="1" height="2" fill="#6D28D9" opacity="0.2"/>
        <rect x="13" y="17" width="1" height="2" fill="#6D28D9" opacity="0.2"/>
        
        {/* Left wing */}
        <rect className="ce-drone-wing ce-drone-wing--l" x="2" y="16" width="4" height="3" fill="#22D3EE" opacity="0.25"/>
        
        {/* Right wing */}
        <rect className="ce-drone-wing ce-drone-wing--r" x="18" y="16" width="4" height="3" fill="#22D3EE" opacity="0.25"/>
      </svg>
    </div>
  );
}
