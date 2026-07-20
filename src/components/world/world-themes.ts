import type { WorldTheme } from "@/types/world";

export const WORLD_THEMES: Record<string, WorldTheme> = {
  night: {
    name: "night",
    sky: { start: "#0D0A1A", mid: "#1E1B4B", end: "#2D1B69" },
    mountains: {
      base: "rgba(45,27,105,0.3)",
      layer1: "rgba(45,27,105,0.25)",
      layer2: "rgba(35,20,85,0.2)",
      layer3: "rgba(25,15,65,0.15)",
    },
    features: {
      city: { building: "#1E1B4B", window: "rgba(34,211,238,0.3)", windowActive: "rgba(34,211,238,0.6)" },
      forest: { trunk: "#1a1a2e", leaf: "rgba(52,211,153,0.15)", leafGlow: "rgba(52,211,153,0.05)" },
      energyGrid: { line: "rgba(34,211,238,0.06)", arc: "rgba(109,40,217,0.08)", glow: "rgba(34,211,238,0.04)" },
      observatory: { dome: "#1E1B4B", telescope: "#22D3EE", starMap: "rgba(34,211,238,0.1)" },
    },
    atmosphere: {
      ambientLight: "rgba(109,40,217,0.06)",
      fog: "rgba(13,10,26,0.3)",
      glow: "rgba(109,40,217,0.08)",
      overlay: "rgba(13,10,26,0.2)",
      starColor: "#F8FAFC",
      cometColor: "#22D3EE",
      cometTrail: "rgba(109,40,217,0.3)",
      auroraColors: ["rgba(34,211,238,0.02)", "rgba(109,40,217,0.03)", "rgba(52,211,153,0.015)"],
    },
    lighting: {
      ambientOpacity: 0.06,
      glowIntensity: 0.08,
      fogDensity: 0.3,
    },
  },
};
