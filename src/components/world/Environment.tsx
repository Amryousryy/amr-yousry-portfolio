"use client";

import { useMemo } from "react";
import { useWorld } from "./WorldContext";
import { resolveRenderConfig } from "./world-config";
import { useWorldParallax } from "./use-world-parallax";
import SkyLayer from "./SkyLayer";
import MountainRange from "./MountainRange";
import StarField from "./StarField";
import WorldComets from "./WorldComets";
import WorldForest from "./WorldForest";
import WorldCity from "./WorldCity";
import WorldCityLights from "./WorldCityLights";
import WorldEnergyGrid from "./WorldEnergyGrid";
import WorldObservatory from "./WorldObservatory";

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
      {/* horizon features render before MountainRange so they show through mountain mask gaps */}
      <WorldCity config={config} />
      <WorldCityLights config={config} />
      <WorldObservatory config={config} />
      <MountainRange config={config} />
      {/* foreground features render after MountainRange */}
      <WorldForest config={config} />
      <WorldEnergyGrid config={config} />
    </>
  );
}
