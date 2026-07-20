"use client";

import { useZoneFeature } from "./use-zone-feature";
import type { RenderConfig } from "@/types/world";

interface WorldObservatoryProps {
  config: RenderConfig;
}

const CONSTELLATION_STARS = [
  { cx: 50, cy: 30, delay: 0 },
  { cx: 65, cy: 20, delay: 4 },
  { cx: 80, cy: 25, delay: 8 },
  { cx: 55, cy: 40, delay: 12 },
  { cx: 70, cy: 45, delay: 16 },
  { cx: 90, cy: 38, delay: 20 },
];

const CONSTELLATION_LINES = [
  { x1: 50, y1: 30, x2: 65, y2: 20, delay: 0 },
  { x1: 65, y1: 20, x2: 80, y2: 25, delay: 3 },
  { x1: 80, y1: 25, x2: 90, y2: 38, delay: 6 },
  { x1: 50, y1: 30, x2: 55, y2: 40, delay: 9 },
  { x1: 55, y1: 40, x2: 70, y2: 45, delay: 12 },
  { x1: 70, y1: 45, x2: 90, y2: 38, delay: 15 },
  { x1: 65, y1: 20, x2: 70, y2: 45, delay: 18 },
];

export default function WorldObservatory({ config }: WorldObservatoryProps) {
  const { shouldRender, phase, onAnimationEnd } = useZoneFeature(
    config.features.observatory.visible
  );

  if (!shouldRender) return null;

  const { observatory } = config.features;

  return (
    <div
      className={`zone-feature zone-feature--${phase} world-observatory`}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) onAnimationEnd();
      }}
      aria-hidden="true"
      style={
        {
          "--observatory-dome": observatory.dome,
          "--observatory-telescope": observatory.telescope,
          "--observatory-star-map": observatory.starMap,
        } as React.CSSProperties
      }
    >
      <div className="world-observatory-silhouette" />

      <svg
        className="world-observatory-starmap"
        viewBox="0 0 200 100"
        preserveAspectRatio="xMidYMin slice"
        aria-hidden="true"
      >
        {CONSTELLATION_LINES.map((l, i) => (
          <line
            key={`l${i}`}
            className="world-observatory-constellation-line"
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            style={{ animationDelay: `${l.delay}s` }}
          />
        ))}
        {CONSTELLATION_STARS.map((s, i) => (
          <circle
            key={`s${i}`}
            className="world-observatory-constellation-star"
            cx={s.cx}
            cy={s.cy}
            r="1"
            style={{ animationDelay: `${s.delay}s` }}
          />
        ))}
      </svg>

      <div className="world-observatory-glow" />
    </div>
  );
}
