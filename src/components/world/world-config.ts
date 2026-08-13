import type { WorldZone, WorldZoneConfig, WorldTimeline, RenderCapabilities, RenderConfig } from "@/types/world";
import { NIGHT_WORLD } from "./world-themes";

export const WORLD_ZONES: Record<WorldZone, WorldZoneConfig> = {
  entrance: {
    sky: { gradientDirection: "180deg", gradientStops: [{ position: 0 }, { position: 50 }, { position: 100 }] },
    mountains: { visible: false, layers: 0, silhouette: "mountains-entrance" },
    features: {
      city: { visible: false, density: 0 },
      forest: { visible: false, density: 0 },
      energyGrid: { visible: false, intensity: 0 },
      observatory: { visible: false, active: false },
    },
    atmosphere: {
      starDensity: 1.0,
      ambientParticles: true,
      cometFrequency: 25000,
      aurora: false,
    },
  },
  forest: {
    sky: { gradientDirection: "180deg", gradientStops: [{ position: 0 }, { position: 50 }, { position: 100 }] },
    mountains: { visible: false, layers: 0, silhouette: "" },
    features: {
      city: { visible: false, density: 0 },
      forest: { visible: false, density: 0 },
      energyGrid: { visible: false, intensity: 0 },
      observatory: { visible: false, active: false },
    },
    atmosphere: {
      starDensity: 0.8,
      ambientParticles: true,
      cometFrequency: 30000,
      aurora: false,
    },
  },
  city: {
    sky: { gradientDirection: "180deg", gradientStops: [{ position: 0 }, { position: 50 }, { position: 100 }] },
    mountains: { visible: false, layers: 0, silhouette: "" },
    features: {
      city: { visible: false, density: 0 },
      forest: { visible: false, density: 0 },
      energyGrid: { visible: false, intensity: 0 },
      observatory: { visible: false, active: false },
    },
    atmosphere: {
      starDensity: 0.6,
      ambientParticles: true,
      cometFrequency: 30000,
      aurora: false,
    },
  },
  energy: {
    sky: { gradientDirection: "180deg", gradientStops: [{ position: 0 }, { position: 50 }, { position: 100 }] },
    mountains: { visible: false, layers: 0, silhouette: "" },
    features: {
      city: { visible: false, density: 0 },
      forest: { visible: false, density: 0 },
      energyGrid: { visible: false, intensity: 0 },
      observatory: { visible: false, active: false },
    },
    atmosphere: {
      starDensity: 0.4,
      ambientParticles: true,
      cometFrequency: 20000,
      aurora: false,
    },
  },
  observatory: {
    sky: { gradientDirection: "180deg", gradientStops: [{ position: 0 }, { position: 50 }, { position: 100 }] },
    mountains: { visible: false, layers: 0, silhouette: "" },
    features: {
      city: { visible: false, density: 0 },
      forest: { visible: false, density: 0 },
      energyGrid: { visible: false, intensity: 0 },
      observatory: { visible: false, active: false },
    },
    atmosphere: {
      starDensity: 1.0,
      ambientParticles: true,
      cometFrequency: 25000,
      aurora: false,
    },
  },
};

export function computeCapabilities(zone: WorldZoneConfig): RenderCapabilities {
  return {
    stars: zone.atmosphere.starDensity > 0,
    mountains: zone.mountains.visible,
    city: zone.features.city.visible,
    cityLights: zone.features.city.visible && zone.features.city.density > 0,
    forest: zone.features.forest.visible,
    forestMist: zone.features.forest.visible,
    energyGrid: zone.features.energyGrid.visible,
    observatory: zone.features.observatory.visible,
    comets: zone.atmosphere.cometFrequency > 0,
    aurora: zone.atmosphere.aurora,
    fog: zone.atmosphere.ambientParticles,
    ambientParticles: zone.atmosphere.ambientParticles,
  };
}

export function resolveRenderConfig(timeline: WorldTimeline): RenderConfig {
  const zone = WORLD_ZONES[timeline.currentZone];
  const theme = NIGHT_WORLD;
  const capabilities = computeCapabilities(zone);

  return {
    sky: { ...zone.sky, ...theme.sky },
    mountains: { ...zone.mountains, ...theme.mountains },
    features: {
      city: { ...zone.features.city, ...theme.features.city },
      forest: { ...zone.features.forest, ...theme.features.forest },
      energyGrid: { ...zone.features.energyGrid, ...theme.features.energyGrid },
      observatory: { ...zone.features.observatory, ...theme.features.observatory },
    },
    atmosphere: { ...zone.atmosphere, ...theme.atmosphere },
    capabilities,
  };
}
