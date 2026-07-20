"use client";

import type { RenderConfig } from "@/types/world";

interface MountainRangeProps {
  config: RenderConfig;
}

export default function MountainRange({ config }: MountainRangeProps) {
  if (!config.capabilities.mountains) return null;

  const layers = config.mountains.layers;
  const layerClasses = ["world-mountains--near", "world-mountains--mid", "world-mountains--far"];

  return (
    <>
      {Array.from({ length: layers }, (_, i) => (
        <div
          key={i}
          className={`world-mountains ${layerClasses[i] || "world-mountains--far"}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
