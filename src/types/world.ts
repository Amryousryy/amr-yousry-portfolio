export type WorldZone = "entrance" | "forest" | "city" | "energy" | "observatory";

export interface WorldTimeline {
  currentZone: WorldZone;
  normalizedProgress?: number;
  timeOfDay?: "night" | "dawn" | "day" | "dusk";
  season?: "spring" | "summer" | "autumn" | "winter";
  worldClock?: number;
  rareEventTiming?: RareEvent[];
}

export interface RareEvent {
  id: string;
  triggerAt: number;
  duration: number;
  type: string;
}

export interface WorldState {
  timeline: WorldTimeline;
  reducedMotion: boolean;
  pageHidden: boolean;
  activeTheme: string;
}

export interface WorldContextValue {
  state: WorldState;
  updateZone: (zone: WorldZone) => void;
}

export interface WorldZoneConfig {
  sky: { gradientDirection: string; gradientStops: { position: number }[] };
  mountains: { visible: boolean; layers: number; silhouette: string };
  features: {
    city: { visible: boolean; density: number };
    forest: { visible: boolean; density: number };
    energyGrid: { visible: boolean; intensity: number };
    observatory: { visible: boolean; active: boolean };
  };
  atmosphere: {
    starDensity: number;
    ambientParticles: boolean;
    cometFrequency: number;
    aurora: boolean;
  };
}

export interface WorldTheme {
  name: string;
  sky: { start: string; mid: string; end: string };
  mountains: {
    base: string; layer1: string; layer2: string; layer3: string;
  };
  features: {
    city: { building: string; window: string; windowActive: string };
    forest: { trunk: string; leaf: string; leafGlow: string };
    energyGrid: { line: string; arc: string; glow: string };
    observatory: { dome: string; telescope: string; starMap: string };
  };
  atmosphere: {
    ambientLight: string;
    fog: string;
    glow: string;
    overlay: string;
    starColor: string;
    cometColor: string;
    cometTrail: string;
    auroraColors: string[];
  };
  lighting: {
    ambientOpacity: number;
    glowIntensity: number;
    fogDensity: number;
  };
}

export interface RenderCapabilities {
  stars: boolean;
  moon: boolean;
  mountains: boolean;
  city: boolean;
  cityLights: boolean;
  forest: boolean;
  forestMist: boolean;
  energyGrid: boolean;
  observatory: boolean;
  comets: boolean;
  aurora: boolean;
  fog: boolean;
  ambientParticles: boolean;
}

export interface RenderConfig {
  sky: { gradientDirection: string; gradientStops: { position: number }[] } & { start: string; mid: string; end: string };
  mountains: { visible: boolean; layers: number; silhouette: string } & { base: string; layer1: string; layer2: string; layer3: string };
  features: {
    city: { visible: boolean; density: number; building: string; window: string; windowActive: string };
    forest: { visible: boolean; density: number; trunk: string; leaf: string; leafGlow: string };
    energyGrid: { visible: boolean; intensity: number; line: string; arc: string; glow: string };
    observatory: { visible: boolean; active: boolean; dome: string; telescope: string; starMap: string };
  };
  atmosphere: {
    starDensity: number; ambientParticles: boolean; cometFrequency: number; aurora: boolean;
    ambientLight: string; fog: string; glow: string; overlay: string;
    starColor: string; cometColor: string; cometTrail: string; auroraColors: string[];
  };
  capabilities: RenderCapabilities;
}
