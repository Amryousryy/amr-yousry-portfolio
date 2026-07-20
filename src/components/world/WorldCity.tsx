"use client";

import { useZoneFeature } from "./use-zone-feature";
import type { RenderConfig } from "@/types/world";

interface WorldCityProps {
  config: RenderConfig;
}

export default function WorldCity({ config }: WorldCityProps) {
  const { shouldRender, phase, onAnimationEnd } = useZoneFeature(
    config.features.city.visible
  );

  if (!shouldRender) return null;

  const { city } = config.features;

  return (
    <div
      className={`zone-feature zone-feature--${phase} world-city`}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) onAnimationEnd();
      }}
      aria-hidden="true"
      style={
        {
          "--city-building": city.building,
          "--city-window": city.window,
          "--city-window-active": city.windowActive,
        } as React.CSSProperties
      }
    >
      <div className="world-city-skyline" />
      <div className="world-city-glow" />
    </div>
  );
}
