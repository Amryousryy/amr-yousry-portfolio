"use client";

import { useMemo } from "react";
import { useWorld } from "./WorldContext";
import { resolveRenderConfig } from "./world-config";
import { useWorldParallax } from "./use-world-parallax";
import SkyLayer from "./SkyLayer";
import StarField from "./StarField";
import WorldComets from "./WorldComets";

export default function Environment() {
  const { state } = useWorld();
  const { timeline } = state;

  const config = useMemo(
    () => resolveRenderConfig(timeline),
    [timeline]
  );

  useWorldParallax();

  return (
    <>
      <SkyLayer />
      <StarField config={config} />
      <WorldComets config={config} />
    </>
  );
}
