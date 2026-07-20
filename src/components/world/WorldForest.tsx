"use client";

import { useZoneFeature } from "./use-zone-feature";
import type { RenderConfig } from "@/types/world";

interface WorldForestProps {
  config: RenderConfig;
}

export default function WorldForest({ config }: WorldForestProps) {
  const { shouldRender, phase, onAnimationEnd } = useZoneFeature(
    config.features.forest.visible
  );

  if (!shouldRender) return null;

  const { forest } = config.features;

  return (
    <div
      className={`zone-feature zone-feature--${phase} world-forest`}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) onAnimationEnd();
      }}
      aria-hidden="true"
      style={
        {
          "--forest-trunk": forest.trunk,
          "--forest-leaf": forest.leaf,
          "--forest-glow": forest.leafGlow,
        } as React.CSSProperties
      }
    >
      <div className="world-forest-tree world-forest-tree--left" />
      <div className="world-forest-tree world-forest-tree--right" />
      <div className="world-forest-tree world-forest-tree--far" />
      <div className="world-forest-mist" />
    </div>
  );
}
