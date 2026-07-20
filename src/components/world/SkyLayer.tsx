"use client";

import type { RenderConfig } from "@/types/world";

interface SkyLayerProps {
  config: RenderConfig;
}

export default function SkyLayer({ config }: SkyLayerProps) {
  return (
    <>
      <div className="world-sky" aria-hidden="true" />
      {config.capabilities.moon && <div className="world-moon" aria-hidden="true" />}
    </>
  );
}
