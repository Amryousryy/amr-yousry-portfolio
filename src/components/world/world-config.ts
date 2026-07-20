import type { WorldZone, WorldZoneConfig, WorldTimeline, WorldTheme, RenderCapabilities, RenderConfig } from "@/types/world";
import { WORLD_THEMES } from "./world-themes";

export const WORLD_ZONES: Record<WorldZone, WorldZoneConfig> = {
  entrance: {
    sky: { gradientDirection: "180deg", gradientStops: [{ position: 0 }, { position: 50 }, { position: 100 }] },
    mountains: { visible: true, layers: 3, silhouette: "mountains-entrance" },
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
    mountains: { visible: true, layers: 3, silhouette: "mountains-forest" },
    features: {
      city: { visible: false, density: 0 },
      forest: { visible: true, density: 0.6 },
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
    mountains: { visible: true, layers: 3, silhouette: "mountains-city" },
    features: {
      city: { visible: true, density: 0.8 },
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
    mountains: { visible: true, layers: 3, silhouette: "mountains-energy" },
    features: {
      city: { visible: false, density: 0 },
      forest: { visible: false, density: 0 },
      energyGrid: { visible: true, intensity: 0.7 },
      observatory: { visible: false, active: false },
    },
    atmosphere: {
      starDensity: 0.4,
      ambientParticles: true,
      cometFrequency: 20000,
      aurora: true,
    },
  },
  observatory: {
    sky: { gradientDirection: "180deg", gradientStops: [{ position: 0 }, { position: 50 }, { position: 100 }] },
    mountains: { visible: true, layers: 3, silhouette: "mountains-observatory" },
    features: {
      city: { visible: false, density: 0 },
      forest: { visible: false, density: 0 },
      energyGrid: { visible: false, intensity: 0 },
      observatory: { visible: true, active: true },
    },
    atmosphere: {
      starDensity: 1.0,
      ambientParticles: true,
      cometFrequency: 25000,
      aurora: false,
    },
  },
};

export function computeCapabilities(zone: WorldZoneConfig, theme: WorldTheme): RenderCapabilities {
  return {
    stars: zone.atmosphere.starDensity > 0,
    moon: true,
    mountains: zone.mountains.visible,
    city: zone.features.city.visible,
    cityLights: zone.features.city.visible && zone.features.city.density > 0,
    forest: zone.features.forest.visible,
    forestMist: zone.features.forest.visible && theme.name === "night",
    energyGrid: zone.features.energyGrid.visible,
    observatory: zone.features.observatory.visible,
    comets: zone.atmosphere.cometFrequency > 0,
    aurora: zone.atmosphere.aurora,
    fog: zone.atmosphere.ambientParticles,
    ambientParticles: zone.atmosphere.ambientParticles,
  };
}

export function resolveRenderConfig(timeline: WorldTimeline, themeName: string): RenderConfig {
  const zone = WORLD_ZONES[timeline.currentZone];
  const theme = WORLD_THEMES[themeName] || WORLD_THEMES.night;
  const capabilities = computeCapabilities(zone, theme);

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
