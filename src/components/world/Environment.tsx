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
  const { timeline, activeTheme } = state;

  const config = useMemo(
    () => resolveRenderConfig(timeline, activeTheme),
    [timeline, activeTheme]
  );

  useWorldParallax();

  return (
    <>
      <SkyLayer config={config} />
      <StarField config={config} />
      <WorldComets config={config} />
    </>
  );
}
