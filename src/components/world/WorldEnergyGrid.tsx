"use client";

import { useZoneFeature } from "./use-zone-feature";
import type { RenderConfig } from "@/types/world";

interface WorldEnergyGridProps {
  config: RenderConfig;
}

const NODE_POSITIONS = [
  { cx: 25, cy: 88, delay: 0 },
  { cx: 55, cy: 88, delay: 0.3 },
  { cx: 85, cy: 88, delay: 0.6 },
  { cx: 115, cy: 88, delay: 0.9 },
  { cx: 145, cy: 88, delay: 1.2 },
  { cx: 175, cy: 88, delay: 1.5 },
  { cx: 25, cy: 70, delay: 0.5 },
  { cx: 55, cy: 70, delay: 0.8 },
  { cx: 85, cy: 70, delay: 1.1 },
  { cx: 115, cy: 70, delay: 1.4 },
  { cx: 145, cy: 70, delay: 1.7 },
  { cx: 175, cy: 70, delay: 2.0 },
  { cx: 55, cy: 52, delay: 0.7 },
  { cx: 85, cy: 52, delay: 1.0 },
  { cx: 115, cy: 52, delay: 1.3 },
  { cx: 145, cy: 52, delay: 1.6 },
];

export default function WorldEnergyGrid({ config }: WorldEnergyGridProps) {
  const { shouldRender, phase, onAnimationEnd } = useZoneFeature(
    config.features.energyGrid.visible
  );

  if (!shouldRender) return null;

  const { energyGrid } = config.features;

  return (
    <div
      className={`zone-feature zone-feature--${phase} world-energy-grid`}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) onAnimationEnd();
      }}
      aria-hidden="true"
      style={
        {
          "--energy-line": energyGrid.line,
          "--energy-arc": energyGrid.arc,
          "--energy-glow": energyGrid.glow,
          "--energy-intensity": energyGrid.intensity,
        } as React.CSSProperties
      }
    >
      <svg
        className="world-energy-grid-conduits"
        viewBox="0 0 200 100"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden="true"
      >
        {/* Main conduit (bottom) */}
        <path className="world-energy-conduit" d="M5,88 L195,88" />
        <path className="world-energy-flow" d="M5,88 L195,88" style={{ animationDelay: "0s" }} />

        {/* Distribution line (mid) */}
        <path className="world-energy-conduit" d="M15,70 L185,70" />
        <path className="world-energy-flow" d="M15,70 L185,70" style={{ animationDelay: "0.8s" }} />

        {/* Upper network */}
        <path className="world-energy-conduit" d="M40,52 L160,52" />
        <path className="world-energy-flow" d="M40,52 L160,52" style={{ animationDelay: "1.6s" }} />

        {/* Vertical connectors */}
        <path className="world-energy-conduit" d="M25,88 L25,70" />
        <path className="world-energy-flow" d="M25,88 L25,70" style={{ animationDelay: "0.4s" }} />

        <path className="world-energy-conduit" d="M55,88 L55,52" />
        <path className="world-energy-flow" d="M55,88 L55,52" style={{ animationDelay: "1.2s" }} />

        <path className="world-energy-conduit" d="M85,88 L85,52" />
        <path className="world-energy-flow" d="M85,88 L85,52" style={{ animationDelay: "0.6s" }} />

        <path className="world-energy-conduit" d="M115,88 L115,52" />
        <path className="world-energy-flow" d="M115,88 L115,52" style={{ animationDelay: "1.4s" }} />

        <path className="world-energy-conduit" d="M145,88 L145,52" />
        <path className="world-energy-flow" d="M145,88 L145,52" style={{ animationDelay: "0.2s" }} />

        <path className="world-energy-conduit" d="M175,88 L175,70" />
        <path className="world-energy-flow" d="M175,88 L175,70" style={{ animationDelay: "1.0s" }} />

        {/* Angled entrance connectors */}
        <path className="world-energy-conduit" d="M5,88 L15,70" />
        <path className="world-energy-flow" d="M5,88 L15,70" style={{ animationDelay: "0.3s" }} />

        <path className="world-energy-conduit" d="M195,88 L185,70" />
        <path className="world-energy-flow" d="M195,88 L185,70" style={{ animationDelay: "1.8s" }} />

        <path className="world-energy-conduit" d="M15,70 L40,52" />
        <path className="world-energy-flow" d="M15,70 L40,52" style={{ animationDelay: "0.9s" }} />

        <path className="world-energy-conduit" d="M185,70 L160,52" />
        <path className="world-energy-flow" d="M185,70 L160,52" style={{ animationDelay: "1.1s" }} />

        {/* Energy nodes at intersections */}
        {NODE_POSITIONS.map((n, i) => (
          <g key={i}>
            <circle className="world-energy-node" cx={n.cx} cy={n.cy} r="1.5" />
            <circle
              className="world-energy-node--pulse"
              cx={n.cx}
              cy={n.cy}
              r="2"
              style={{ animationDelay: `${n.delay}s` }}
            />
          </g>
        ))}
      </svg>

      <div className="world-energy-grid-glow" />
    </div>
  );
}
