"use client";

import { useMemo } from "react";
import { useZoneFeature } from "./use-zone-feature";
import type { RenderConfig } from "@/types/world";
import { mulberry32 } from "@/lib/seeded-random";

interface WorldCityLightsProps {
  config: RenderConfig;
}

interface WindowData {
  left: number;
  top: number;
  pulse: boolean;
  duration: number;
  delay: number;
}

function generateWindows(density: number, rng: () => number): WindowData[] {
  const cols = 20;
  const rows = 8;
  const positions: WindowData[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rng() > density) continue;
      positions.push({
        left: (c / cols) * 96 + 2,
        top: (r / rows) * 55 + 25,
        pulse: rng() < 0.3,
        duration: 5 + rng() * 5,
        delay: rng() * 8,
      });
    }
  }

  return positions;
}

function computeSeed(config: RenderConfig): number {
  return Math.round(config.features.city.density * 10000) + 9000;
}

export default function WorldCityLights({ config }: WorldCityLightsProps) {
  const { shouldRender, phase, onAnimationEnd } = useZoneFeature(
    config.features.city.visible
  );

  const windows = useMemo(
    () => generateWindows(config.features.city.density, mulberry32(computeSeed(config))),
    [config]
  );

  if (!shouldRender) return null;

  const { city } = config.features;

  return (
    <div
      className={`zone-feature zone-feature--${phase} world-city-lights`}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) onAnimationEnd();
      }}
      aria-hidden="true"
      style={
        {
          "--city-window": city.window,
          "--city-window-active": city.windowActive,
        } as React.CSSProperties
      }
    >
      {windows.map((w, i) => (
        <div
          key={i}
          className={`world-city-light${w.pulse ? " world-city-light--pulse" : ""}`}
          style={{
            left: `${w.left}%`,
            top: `${w.top}%`,
            "--pulse-duration": `${w.duration}s`,
            "--pulse-delay": `${w.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
