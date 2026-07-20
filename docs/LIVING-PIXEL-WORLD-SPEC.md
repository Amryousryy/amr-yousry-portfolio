# Living Pixel World — Master Environment System Specification

> **Design Philosophy:** A continuous pixel-art universe that exists *behind* the portfolio.  
> Content is always the hero. The world is the stage — never the show.  
> Every pixel, every animation, every transition serves a single purpose:  
> **make the portfolio feel alive without ever demanding attention.**

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [File & Folder Structure](#2-file--folder-structure)
3. [React Component Hierarchy](#3-react-component-hierarchy)
4. [CSS Architecture](#4-css-architecture)
5. [Layer System](#5-layer-system)
6. [Background Rendering Strategy](#6-background-rendering-strategy)
7. [Animation System](#7-animation-system)
8. [Parallax Architecture](#8-parallax-architecture)
9. [Star System Design](#9-star-system-design)
10. [Energy Comet Manager](#10-energy-comet-manager)
11. [Aurora Manager](#11-aurora-manager)
12. [Cursor Trail System](#12-cursor-trail-system)
13. [Section Evolution Strategy](#13-section-evolution-strategy)
14. [Performance Strategy](#14-performance-strategy)
15. [Accessibility Considerations](#15-accessibility-considerations)
16. [Reduced-Motion Behavior](#16-reduced-motion-behavior)
17. [State Management](#17-state-management)
18. [Z-Index Strategy](#18-z-index-strategy)
19. [Responsive Behavior](#19-responsive-behavior)
20. [Build Order (Sprints)](#20-build-order-sprints)

---

## 1. Architecture Overview

### Core Concept

A single, continuous pixel-art world layer rendered as a `position: fixed` element behind all portfolio content. The world is its own rendering engine — the portfolio simply exists inside it. As the user scrolls through sections, the world's visual state transitions smoothly between zone-specific configurations. The world never resets, never loops, never restarts.

### World Zone System (Abstract)

The world is defined by abstract **zones**, not page sections. Zones exist independently of any page structure.

```typescript
type WorldZone = "entrance" | "forest" | "city" | "energy" | "observatory";
```

Page sections **map to** these zones via a separate mapping:

```typescript
const SECTION_ZONE_MAP: Record<string, WorldZone> = {
  "data-hero-section": "entrance",
  "about": "forest",
  "projects": "city",
  // "skills" → "energy" (added when Skills section exists)
  "contact": "observatory",
};
```

This decoupling means future pages — Blog, Case Studies, Playground, Labs — can reuse existing zones or add new ones without changing the environment architecture.

### WorldTimeline — Single Source of Temporal Information

A `WorldTimeline` layer sits above `Environment` and becomes the single source of all temporal world state. In Sprint 1 it simply exposes `currentZone`. Future versions evolve to include normalized progress, time of day, seasons, rare event timing, and a world clock.

```typescript
interface WorldTimeline {
  // Sprint 1 — zone-based
  currentZone: WorldZone;

  // Future — continuous world evolution
  normalizedProgress?: number;        // 0–1, replaces IntersectionObserver
  timeOfDay?: "night" | "dawn" | "day" | "dusk";
  season?: "spring" | "summer" | "autumn" | "winter";
  worldClock?: number;                // ms since page load
  rareEventTiming?: RareEvent[];      // pending rare event schedules
}
```

`WorldTimeline` is owned by `WorldRoot` and provided via `WorldContext`. `Environment` consumes `WorldTimeline` rather than depending directly on section detection.

### WORLD_ZONES — Structural Only

`WORLD_ZONES` describes only the world's structural properties — what exists and how much of it. All visual styling (colors, gradients, glow, fog) has been removed into a separate `WORLD_THEME` system.

```typescript
interface WorldZoneConfig {
  // Structural properties only — no colors
  sky: { gradientDirection: string; gradientStops: { position: number }[] };
  mountains: { visible: boolean; layers: number; silhouette: string };
  features: {
    city: { visible: boolean; density: number };
    forest: { visible: boolean; density: number };
    energyGrid: { visible: boolean; intensity: number };
    observatory: { visible: boolean; active: boolean };
  };
  atmosphere: {
    starDensity: number;           // 0–1 multiplier
    ambientParticles: boolean;
    cometFrequency: number;        // ms between spawns (0 = disabled)
    aurora: boolean;
  };
}

const WORLD_ZONES: Record<WorldZone, WorldZoneConfig> = {
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
  // ... forest, city, energy, observatory follow same shape
};
```

### WORLD_THEME — Reusable Visual Identity

`WORLD_THEME` contains all visual styling — colors, gradients, lighting, glow, fog, and atmosphere. Themes can be swapped (night, dawn, day, dusk, seasonal, special events) without modifying any zone definitions.

```typescript
interface WorldTheme {
  name: string;                      // "night", "dawn", "autumn", etc.
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

const WORLD_THEMES: Record<string, WorldTheme> = {
  night: {
    name: "night",
    sky: { start: "#0D0A1A", mid: "#1E1B4B", end: "#2D1B69" },
    mountains: {
      base: "rgba(45,27,105,0.3)",
      layer1: "rgba(45,27,105,0.25)",
      layer2: "rgba(35,20,85,0.2)",
      layer3: "rgba(25,15,65,0.15)",
    },
    // ...
  },
  // future: dawn, day, dusk, autumn, winter, special_event
};
```

### RenderCapabilities — What May Render

`RenderCapabilities` is a third independent layer that describes what the world is currently capable of rendering. It is derived from both zone and theme, but rendering components only see capabilities — never zone or theme directly.

```typescript
interface RenderCapabilities {
  // Celestial
  stars: boolean;
  moon: boolean;

  // Terrain
  mountains: boolean;

  // Features — which zone-specific structures are visible
  city: boolean;
  cityLights: boolean;
  forest: boolean;
  forestMist: boolean;
  energyGrid: boolean;
  observatory: boolean;

  // Atmosphere
  comets: boolean;
  aurora: boolean;
  fog: boolean;
  ambientParticles: boolean;

  // Future
  // weather?: boolean;
  // snow?: boolean;
  // rain?: boolean;
  // lightning?: boolean;
  // seasonalDecorations?: boolean;
  // holidayEvents?: boolean;
  // dynamicLighting?: boolean;
  // timeOfDayVariations?: boolean;
  // reflections?: boolean;
}
```

Capabilities are computed from zone + theme at resolution time. For example, `aurora` may require both `zone.atmosphere.aurora === true` AND `theme.name` compatible with aurora effects. This logic lives in the resolver only — no renderer performs capability calculations.

### Resolver — Zone + Theme + Capabilities → RenderConfig

All three layers are merged at resolution time into a single `RenderConfig` that rendering components consume:

```typescript
function resolveRenderConfig(timeline: WorldTimeline, themeName?: string): RenderConfig {
  const zone = WORLD_ZONES[timeline.currentZone];
  const theme = WORLD_THEMES[themeName || "night"];
  const capabilities = computeCapabilities(zone, theme, timeline);

  return {
    sky: mergeSky(zone.sky, theme.sky),
    mountains: mergeMountains(zone.mountains, theme.mountains),
    features: mergeFeatures(zone.features, theme.features),
    atmosphere: mergeAtmosphere(zone.atmosphere, theme.atmosphere),
    capabilities,
  };
}

function computeCapabilities(zone: WorldZoneConfig, theme: WorldTheme, timeline: WorldTimeline): RenderCapabilities {
  return {
    stars: zone.atmosphere.starDensity > 0,
    moon: true,                                    // always present
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
```

`RenderConfig` is the final immutable object containing everything a rendering subsystem needs — flat data, capabilities, no references to zones, themes, or timeline.

### Environment API — Single Orchestrator

Visual subsystems never read `currentZone`, `WorldTimeline`, zone config, or theme config directly. Instead, `Environment`:

1. Reads `WorldTimeline` from `WorldContext`
2. Resolves `WORLD_ZONES[timeline.currentZone]` (or interpolates via `normalizedProgress`)
3. Computes `RenderCapabilities` from zone + theme + timeline
4. Merges zone, theme, and capabilities into `RenderConfig`
5. Passes resolved config slices to each visual subsystem

```
WorldRoot
└── WorldTimeline              ← single temporal source
    └── Environment            ← orchestrator: resolves complete RenderConfig
        ├── SkyLayer           ← receives config.sky
        ├── StarField          ← receives config.capabilities.stars + config.atmosphere
        ├── Moon               ← receives config.capabilities.moon
        ├── MountainRange      ← receives config.capabilities.mountains + config.mountains
        ├── FeatureLayer       ← receives config.features + config.capabilities.{city, forest, ...}
        ├── AtmosphereLayer    ← receives config.capabilities.{comets, aurora, fog} + config.atmosphere
        └── ForegroundLayer    ← receives config.capabilities.ambientParticles
```

Every layer receives normalized render data and capabilities flags. No layer branches on zone identity, theme name, or timeline mode.

### Full Responsibility Hierarchy

```
WorldTimeline
    │
    │  Determines WHEN the world changes
    │  (currentZone, normalizedProgress, timeOfDay, season, worldClock)
    ▼
WORLD_ZONES
    │
    │  Determines WHAT exists
    │  (structural properties: visibility, density, layers, gradient direction)
    ▼
WORLD_THEMES
    │
    │  Determines HOW it looks
    │  (colors, gradients, glow, fog, lighting)
    ▼
RenderCapabilities
    │
    │  Determines WHAT may render
    │  (boolean flags derived from zone + theme)
    ▼
RenderConfig
    │
    │  Combines all data into one immutable rendering object
    ▼
Environment
    │
    │  Distributes rendering data to subsystems
    ▼
Renderers (SkyLayer, StarField, MountainRange, FeatureLayer, etc.)
    │
    │  Render only what they receive
    │  No renderer performs business logic
    ▼
Viewport
```

This five-layer pipeline (Timeline → Zones → Themes → Capabilities → RenderConfig) becomes the permanent rendering architecture for all future versions of the Living Pixel World.

### Immutable Render Pipeline

The rendering pipeline is governed by a single immutable flow. Each stage receives data, transforms it, and produces a new immutable output. No stage mutates data received from a previous stage.

```
WorldTimeline
    │  Owns temporal evolution only (currentZone, progress, time, season)
    │  Never decides how something looks
    ▼
WORLD_ZONES
    │  Defines structure only (visibility, density, layers)
    │  Never colors, never lighting
    ▼
WORLD_THEMES
    │  Defines appearance only (colors, gradients, glow, fog)
    │  Never world structure, never rendering decisions
    ▼
RenderCapabilities
    │  Answers only: "What is currently allowed to render?"
    │  Never knows page, section, scroll, theme logic, or renderer implementation
    ▼
RenderConfig
    │  Final immutable contract
    │  After creation, no layer may modify it
    ▼
Environment
    │  Orchestration layer only
    │  Distributes RenderConfig, owns no business logic
    ▼
Renderers
    │  Visual endpoints only
    │  Completely stateless — never calculate world logic, resolve themes, or modify config
    ▼
Viewport
```

**Pure transformations**: Every resolver (`resolveZone`, `resolveTheme`, `computeCapabilities`, `mergeAll`) is deterministic. Each receives input, returns a new object, never modifies shared state, never mutates previous objects, and produces no side effects.

**One-way data flow**: Every dependency flows in one direction. No layer reaches backward. No renderer reaches upward. If a `RenderConfig` needs to change, a completely new one is created — the existing one is never mutated.

**Permanent architectural law**: This immutable pipeline is not an implementation detail. It is the governing design rule of the Living Pixel World. Every future system — stars, comets, parallax, aurora, cursor, seasonal events, audio — must flow through this pipeline without exception.

### Core Principles

1. **Fixed position, never scrolled** — The world layer attaches to the viewport, not the document. Content scrolls *over* it. This eliminates scroll jank, compositing issues, and re-layout.
2. **WorldTimeline as sole temporal source** — All time-based decisions (zone, progress, time of day, season, rare events) flow through `WorldTimeline`. Section detection via `IntersectionObserver` is one input to the timeline, not a direct driver of rendering.
3. **Zone/Theme separation** — `WORLD_ZONES` define structural properties (what exists). `WORLD_THEME` defines visual identity (how it looks). Themes can be swapped without touching zone definitions.
4. **Capabilities-driven rendering** — Every visual subsystem receives `RenderConfig` containing flat data and `capabilities` flags. No `if (zone === "city")`, `if (theme === "night")`, or any world logic in rendering components. Renderers render; the resolver decides.
5. **CSS-driven visuals** — All world elements are pure CSS/HTML. No canvas, no WebGL, no heavy JS rendering. SVGs for pixel art, CSS gradients for skies, CSS keyframes for animation. Architecture supports replacing individual renderers (Canvas, WebGL, Three.js) later.
6. **Smooth crossfade only** — Zone transitions use `opacity` crossfades on background gradients and feature layers. No instant cuts, no scroll-linked animations, no timeline-driven state.
7. **Progressive enhancement** — Full detail on desktop, reduced detail on tablet, minimal on mobile. All motion respects `prefers-reduced-motion`.

### Integration with Existing Architecture

```
MarketingLayout
├── EcosystemRoot (existing, unchanged)
│   ├── CreativeEngineLoader (existing, unchanged)
│   │   ├── JsonLd, PageViewTracker
│   │   ├── Navbar (z-50)
│   │   ├── WorldRoot ← NEW: fixed layer, owns WorldTimeline + WorldContext
│   │   │   ├── WorldTimeline       ← NEW: single temporal source (zone, progress, time, season)
│   │   │   └── Environment         ← NEW: resolves timeline → RenderConfig, distributes to subsystems
│   │   │       ├── SkyLayer
│   │   │       ├── StarFieldRenderer
│   │   │       ├── MoonRenderer
│   │   │       ├── MountainRange
│   │   │       ├── FeatureLayer
│   │   │       ├── AtmosphereLayer
│   │   │       └── ForegroundLayer
│   │   ├── <main> (z-10, content scrolls over world)
│   │   │   ├── HeroSection
│   │   │   ├── BrandMarquee
│   │   │   ├── ProjectsSection
│   │   │   ├── AboutSection
│   │   │   ├── ContactSection
│   │   │   └── Footer
│   │   └── Footer
│   └── (EcosystemProvider internals, unchanged)
```

### What Changes, What Stays

| File | Action |
|---|---|
| `src/app/(marketing)/layout.tsx` | Add `<WorldRoot>` inside `<EcosystemRoot>` but outside `<main>` |
| `src/styles/globals.css` | Import `@import "./world/world.css"` |
| `src/styles/tokens/foundation.css` | Add 3 new z-index tokens for world layers |
| `src/components/world/Environment.tsx` | **NEW** — single orchestrator, consumes WorldTimeline, resolves RenderConfig |
| `src/components/world/WorldTimeline.tsx` | **NEW** — single temporal source; Sprint 1 exposes currentZone, future adds progress/time/season |
| `src/components/world/world-config.ts` | **NEW** — `WORLD_ZONES` config object (structural only) + `resolveRenderConfig()` |
| `src/components/world/world-themes.ts` | **NEW** — `WORLD_THEMES` visual identity palette (colors, gradients, glow, fog) |
| `src/components/world/section-zone-map.ts` | **NEW** — page section → WorldZone mapping (separate concern) |
| All section `.tsx` files | Remove `bg-brand-blue/95` classes. Sections become transparent. |
| Creative Engine files | **No changes** — ecosystem stays independent |

---

## 2. File & Folder Structure

### New Files

```
src/
  components/
    world/
      WorldRoot.tsx                 -- Fixed layer wrapper, owns WorldTimeline + WorldContext
      WorldTimeline.tsx             -- Single temporal source; Sprint 1 exposes currentZone, future adds progress/time/season/worldClock
      WorldContext.tsx              -- World state context + hook
      Environment.tsx               -- Consumes WorldTimeline, resolves WORLD_ZONES + WORLD_THEMES → RenderConfig, distributes to subsystems
      world-config.ts               -- WORLD_ZONES config (structural only) + resolveRenderConfig() zone+theme resolver
      world-themes.ts               -- WORLD_THEMES visual identity palette (colors, gradients, glow, fog)
      section-zone-map.ts           -- Page section → WorldZone mapping (separate concern)
      use-world-section.ts          -- IntersectionObserver hook
      use-world-parallax.ts         -- Mouse-based parallax hook (Sprint 4)
      SkyLayer.tsx                  -- CSS gradient sky, receives sky config
      renderers/
        StarField.tsx               -- Star renderer, instantiates DOMStarRenderer by default (Sprint 2)
        StarRenderer.ts             -- StarRenderer interface + DOMStarRenderer class
        Moon.tsx                    -- SVG pixel moon, receives config (Sprint 2)
        MoonRenderer.ts             -- MoonRenderer interface + DOMMoon class
      features/
        FeatureLayer.tsx            -- Orchestrates feature visibility from config opacities
        CityFeature.tsx             -- Pixel cityscape for city zone
        CityLightsFeature.tsx       -- Twinkling window lights
        ForestFeature.tsx           -- Tree silhouettes for forest zone
        ForestLeavesFeature.tsx     -- Floating leaf particles
        EnergyGridFeature.tsx       -- Grid lines + plasma arcs for energy zone
        ObservatoryFeature.tsx      -- Telescope + star map for observatory zone
      atmosphere/
        AtmosphereLayer.tsx         -- Orchestrates atmospheric effects from config
        WorldComets.tsx             -- Energy comet spawner (Sprint 3)
        WorldAurora.tsx             -- Rare aurora effect (Sprint 7)
        WorldForeground.tsx         -- Ambient floating particles
      WorldPixelCursor.tsx          -- Cursor trail particles (Sprint 8)
      WorldEasterEggs.tsx           -- Time-based easter egg triggers (Sprint 7)
      WorldAtmosphereAudio.tsx      -- Optional audio toggle button (Sprint 8)
  hooks/
    useWorldSection.ts              -- Re-export from world/use-world-section
    useWorldParallax.ts             -- Re-export from world/use-world-parallax
  styles/
    world/
      world.css                     -- Barrel import for all world CSS files
      world-root.css                -- Fixed layer base, z-index, reduced-motion base
      sky.css                       -- Sky gradient transitions uses CSS custom properties set by config
      stars.css                     -- Star twinkle keyframes, star placement
      moon.css                      -- Moon position, phase animation
      mountains.css                 -- Mountain shape pseudo-elements + parallax
      city.css                      -- Building shapes, window lights flicker
      forest.css                    -- Tree shapes, leaf drift animation
      energy-grid.css               -- Grid lines, plasma pulse
      observatory.css               -- Observatory elements
      foreground.css                -- Ambient particle drift
      comets.css                    -- Comet path/trail keyframes (Sprint 3)
      aurora.css                    -- Aurora shimmer keyframes (Sprint 7)
      cursor.css                    -- Cursor trail particles (Sprint 8)
      world-responsive.css          -- Responsive breakpoint overrides
      world-reduced-motion.css      -- prefers-reduced-motion overrides
  types/
    world.ts                        -- World types (WorldZone, WorldState, WorldZoneConfig, etc.)
```

### Modified Files

| File | Change |
|---|---|
| `src/styles/globals.css` | Add `@import "./world/world.css"` after creative-engine import |
| `src/styles/tokens/foundation.css` | Add `--z-world-sky: 0`, `--z-world-features: 5`, `--z-world-foreground: 8` |
| `src/app/(marketing)/layout.tsx` | Add `<WorldRoot>` before `<main>` |
| `src/components/sections/hero/index.tsx` | Remove `bg-brand-blue/95` (only if section bg classes exist) |
| `src/components/sections/projects/index.tsx` | Remove `bg-brand-blue/95` class |
| `src/components/sections/about/index.tsx` | Remove `bg-brand-blue/95` class |
| `src/components/sections/contact/index.tsx` | Remove `bg-brand-blue/95` class |

---

## 3. React Component Hierarchy

### WorldTimeline Layer

`WorldTimeline` sits between `WorldRoot` and `Environment`. It is the single source of all temporal world state. `Environment` consumes `WorldTimeline` rather than depending on section detection directly.

In Sprint 1, `WorldTimeline` simply exposes `currentZone`. Its interface is designed to expand to `normalizedProgress`, `timeOfDay`, `season`, and `worldClock` in future sprints — all without changing `Environment`'s consumption pattern.

```
WorldRoot
├── WorldTimeline          ← owns: currentZone, (future: progress, timeOfDay, season, worldClock)
└── WorldContext.Provider  ← provides: WorldTimeline
    └── Environment        ← consumes WorldTimeline, resolves RenderConfig
```

### Environment (Client Component)

`Environment` is the single orchestrator. It reads `WorldTimeline` from context, resolves zone config + theme into `RenderConfig`, and distributes config slices to each visual subsystem. No subsystem reads `WorldTimeline` or `currentZone` directly.

```
WorldRoot (position:fixed, inset:0, z-index:0, pointer-events:none, contain:layout style paint)
└── WorldContext.Provider
    └── Environment                          ← orchestrator: timeline → RenderConfig
        ├── SkyLayer                         ← receives config.sky + config.capabilities
        │   └── <div> with CSS gradient background
        ├── StarFieldRenderer                ← receives config.atmosphere + config.capabilities.stars
        │   └── DOMStarField                 ← DOM implementation (Sprint 2)
        ├── MoonRenderer                     ← receives config.capabilities.moon
        │   └── DOMMoon                      ← DOM implementation (Sprint 2)
        ├── MountainRange                    ← receives config.mountains + config.capabilities.mountains
        │   ├── Layer 1 (far, parallax factor 0.2)
        │   ├── Layer 2 (mid, parallax factor 0.5)
        │   └── Layer 3 (near, parallax factor 0.8)
        ├── FeatureLayer                     ← receives config.features + config.capabilities.{city,forest,energyGrid,observatory}
        │   ├── CityFeature                  ← checks capabilities.city
        │   ├── ForestFeature                ← checks capabilities.forest
        │   ├── EnergyGridFeature            ← checks capabilities.energyGrid
        │   └── ObservatoryFeature           ← checks capabilities.observatory
        ├── AtmosphereLayer                  ← receives config.atmosphere + config.capabilities.{comets,aurora,fog}
        │   ├── WorldComets                  ← checks capabilities.comets
        │   └── WorldAurora                  ← checks capabilities.aurora
        └── ForegroundLayer                  ← receives config.capabilities.ambientParticles
            ├── WorldForeground
            └── WorldPixelCursor             (Sprint 8)
```

### Data Flow

```
use-world-section.ts (IntersectionObserver)
    │
    ▼
WorldTimeline.currentZone        ← single temporal source
    │
    ▼
Environment.resolveRenderConfig(timeline, theme = "night")
    │  ┌──────────────────────┐
    │  │ WORLD_ZONES          │  ← structural (what exists)
    │  │ WORLD_THEMES         │  ← visual (how it looks)
    │  │ computeCapabilities  │  ← derived flags (what may render)
    │  └──────────────────────┘
    │  mergeAll(zone, theme, capabilities) → RenderConfig
    ▼
┌───────────────────┬───────────────────┬───────────────────┐
SkyLayer(config)   StarField(config)   MountainRange(config)   FeatureLayer(config)
  + capabilities     + cap.stars         + cap.mountains         + cap.{city,forest,...}
```

### WorldContext

```typescript
// src/types/world.ts
export type WorldZone = "entrance" | "forest" | "city" | "energy" | "observatory";

export interface WorldState {
  currentZone: WorldZone;
  normalizedProgress?: number;       // 0–1, for future continuous mode
  reducedMotion: boolean;
  pageHidden: boolean;
}

export interface WorldContextValue {
  state: WorldState;
}
```

The context value is read-only. No component mutates it directly — `WorldRoot` owns all state. Visual subsystems read config through `Environment`, not context.

### WorldZoneConfig (Data Model)

```typescript
// src/types/world.ts
export interface WorldZoneConfig {
  sky: { start: string; mid: string; end: string };
  mountains: { visible: boolean; layers: number; color: string };
  features: {
    city: { opacity: number; density: number };
    forest: { opacity: number; density: number };
    energyGrid: { opacity: number; intensity: number };
    observatory: { opacity: number; active: boolean };
  };
  atmosphere: {
    starDensity: number;
    ambientLight: string;
    cometFrequency: number;
    aurora: boolean;
  };
}
```

---

## 4. CSS Architecture

### File Organization

```
world.css (barrel)
├── @import "./world-root.css"
├── @import "./sky.css"
├── @import "./stars.css"
├── @import "./moon.css"
├── @import "./mountains.css"
├── @import "./city.css"
├── @import "./forest.css"
├── @import "./energy-grid.css"
├── @import "./observatory.css"
├── @import "./foreground.css"
├── @import "./comets.css"         (Sprint 3)
├── @import "./aurora.css"         (Sprint 7)
├── @import "./cursor.css"         (Sprint 8)
├── @import "./world-responsive.css"
└── @import "./world-reduced-motion.css"
```

### World-Root CSS

```css
/* world-root.css */
.world-root {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  contain: layout style paint;
  transform: translateZ(0);
  will-change: transform; /* GPU layer */
}
```

### CSS Custom Properties for Theming

All **visual colors** are controlled via a `data-theme` attribute on `.world-root`. When the theme changes (e.g., night → dawn), JS updates `data-theme`, and CSS transitions handle the crossfade. Zone-specific structural properties (visibility, density) are handled by JS config, not CSS selectors.

```css
/* Theme colors — applied via data-theme attribute */
.world-root[data-theme="night"] {
  --world-sky-start: #0D0A1A;
  --world-sky-mid: #1E1B4B;
  --world-sky-end: #2D1B69;
  --world-mountain-base: rgba(45, 27, 105, 0.3);
  --world-mountain-layer1: rgba(45, 27, 105, 0.25);
  --world-mountain-layer2: rgba(35, 20, 85, 0.2);
  --world-mountain-layer3: rgba(25, 15, 65, 0.15);
  --world-accent-glow: rgba(109, 40, 217, 0.08);
  --world-ambient-light: rgba(109, 40, 217, 0.06);
  --world-fog: rgba(13, 10, 26, 0.3);
}

/* future themes: data-theme="dawn", data-theme="day", data-theme="dusk", data-theme="autumn", etc. */
```

### Sky Transition

```css
.world-sky {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    var(--world-sky-start) 0%,
    var(--world-sky-mid) 50%,
    var(--world-sky-end) 100%
  );
  transition: background 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

The `transition: background` handles the gradient crossfade between themes. This is one of the very few places where `background` transition is acceptable (it's the root sky). When the theme changes, all custom properties update simultaneously, triggering a uniform visual transition across sky, mountains, and features.

---

## 5. Layer System

### Within the World (z-index in `.world-root`)

```
z: auto (default)  SkyLayer — CSS gradient background
z: 1               StarField, Moon — above sky
z: 2               MountainLayer3 (near mountains)
z: 3               MountainLayer2 (mid mountains)
z: 4               MountainLayer1 (far mountains)
z: 5               WorldCity / WorldForest / WorldEnergyGrid / WorldObservatory
z: 6               WorldComets (Sprint 3)
z: 7               WorldAurora (Sprint 7)
z: 8               WorldForeground — dust, particles, cursor trail
```

### Full Document Z-Index Map

```
z: -1    Pixel grid (::before pseudo-element, fixed)
z: 0     WorldRoot (fixed, behind everything)
  z: auto   SkyLayer
  z: 1      Stars, Moon
  z: 2-4    Mountains
  z: 5      Section features
  z: 6      Comets
  z: 7      Aurora
  z: 8      Foreground, cursor
z: 10    Sections, main, header, footer (globals.css @layer components)
z: 20    h1-h6, p text (globals.css @layer components)
z: 50    Navbar (fixed)
z: 9997  Film grain overlay
z: 9998  Scanlines
z: 99999 Boot overlay, skip link
```

### Why z: 0 for the World

The existing pixel grid (`.pixel-grid::before`) uses `z-index: -1` and is `position: fixed`. The world layer at `z: 0` sits above the grid but below all content at `z: 10`. This means:
- The cyan pixel grid remains visible *above* the world (it's at `-1`, below world)
- Wait — actually `z-index: -1` on the `::before` would be behind the world at `z: 0`. 

**Decision**: The pixel grid should remain visible as a subtle overlay. We have two options:
1. Move the pixel grid to `z: 9` (above world, below content) — but this would mean editing globals.css
2. Let the pixel grid stay at `z: -1` — the world at `z: 0` covers it

**Resolution**: Keep the pixel grid at `z: -1`. The world sits at `z: 0` as a solid background layer. The pixel grid was a subtle cyan overlay on the `bg-brand-blue` sections, but now the sections will be transparent. To preserve the pixel grid aesthetic, we'll add a subtle pixel grid overlay within the world itself at `z: 9` (above features, below foreground) with very low opacity (0.02-0.03).

---

## 6. Background Rendering Strategy

### Sky Layer

The sky is a full-screen CSS `linear-gradient(180deg, ...)` that transitions between zone color palettes using `transition: background 1.5s ease`.

**Implementation:**
```tsx
// SkyLayer.tsx — renders a single div with .world-sky class
// The data-zone attribute on WorldRoot drives the CSS custom properties
<div className="world-sky" aria-hidden="true" />
```

**No JavaScript animation.** The `data-zone` attribute changes trigger CSS transitions.

### Mountain Silhouettes

Three layers of CSS-only mountain silhouettes using `::before` and `::after` pseudo-elements with `clip-path` polygons or border-radius arcs:

```css
.world-mountains--far {
  position: absolute;
  inset: auto 0 0 0;
  height: 35vh;
  background: var(--world-mountain-color);
  mask-image: url("data:image/svg+xml,..."); /* pixel mountain silhouette */
  mask-size: 100% 100%;
  transition: background 1.5s ease;
}
```

Each layer uses a different SVG silhouette for variety. The SVG silhouettes are inline data URIs to avoid extra network requests.

### Conditional Feature Layers

Each zone-specific feature (City, Forest, Energy Grid, Observatory) is always in the DOM but toggles opacity:

```tsx
<div 
  className="world-feature"
  style={{ 
    opacity: currentZone === 'city' ? 1 : 0,
    transition: 'opacity 1.5s ease',
    pointerEvents: 'none'
  }}
>
  <WorldCity />
</div>
```

This ensures zero layout shift on zone changes — the elements are always present, just invisible.

---

## 7. Animation System

### CSS Keyframe Rules

All animations use only `transform` and `opacity`. No `filter`, `box-shadow`, `top`, `left`, `width`, `height`.

| Animation | Properties | Duration | Type |
|---|---|---|---|
| Star twinkle | `opacity` | 2-5s (random via CSS custom prop) | Ease-in-out infinite |
| Moon glow | `opacity` | 6s | Ease-in-out infinite |
| Mountain parallax (mouse) | `transform: translate3d` | — | JS-driven (Sprint 4) |
| City window lights | `opacity` | 1.5-4s (random stagger) | Ease-in-out infinite |
| Forest leaf drift | `transform: translate3d, opacity` | 12-20s | Linear infinite |
| Energy grid pulse | `opacity` | 3s | Ease-in-out infinite |
| Comet trail | `transform: translate3d, opacity` | 3-6s | Linear one-shot (Sprint 3) |
| Aurora shimmer | `opacity` | 8-15s | Ease-in-out rare (Sprint 7) |
| Cursor particle | `transform: translate3d, opacity` | 0.6s | Ease-out one-shot (Sprint 8) |
| Foreground dust | `transform: translate3d, opacity` | 20-40s | Ease-in-out infinite |

### Animation Discovery Pattern

Use IntersectionObserver (at the document level, not per-animation) plus `document.hidden` to pause all world animations:

```typescript
// In WorldRoot
useEffect(() => {
  const handleVisibility = () => {
    document.documentElement.dataset.pageHidden = String(document.hidden);
  };
  document.addEventListener('visibilitychange', handleVisibility);
  return () => document.removeEventListener('visibilitychange', handleVisibility);
}, []);
```

```css
/* Pause all world animations when page is hidden */
[data-page-hidden="true"] .world-root * {
  animation-play-state: paused !important;
}
```

### Animation Stagger

- City lights: stagger via `--i` CSS custom property set on each light element
- Stars: stagger via `--star-duration` and `--star-delay` CSS custom properties
- Leaves: stagger via random `animation-delay` in CSS

---

## 8. Parallax Architecture

### Design

Maximum **8px** offset in any direction. Subtle enough to be felt, not seen.

### Implementation (Sprint 4)

```typescript
// use-world-parallax.ts
export function useWorldParallax(maxOffset: number = 8) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let rafId: number;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      target.x = x * maxOffset;
      target.y = y * maxOffset;
    };

    const animate = () => {
      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;
      setOffset({ x: current.x, y: current.y });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouse, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(rafId);
    };
  }, [maxOffset, reducedMotion]);

  return offset;
}
```

### Layered Parallax by Depth

- **Layer 1 (Far mountains)**: `offset * 0.2` (1.6px max)
- **Layer 2 (Mid mountains)**: `offset * 0.5` (4px max)
- **Layer 3 (Near mountains)**: `offset * 0.8` (6.4px max)
- **Stars**: `offset * 0.1` (0.8px max — barely perceptible)
- **Foreground**: `offset * 1.0` (8px max)

---

## 9. Star System Design

### Renderer Abstraction

Stars are designed behind an abstract renderer interface. Sprint 2 may use DOM nodes, but the architecture allows replacing the renderer later with Canvas, SVG Pattern, or WebGL without changing spawning logic or timing.

```typescript
// StarRenderer — abstract interface
interface StarRenderer {
  render(stars: StarConfig[]): void;
  updateDensity(factor: number): void;
  destroy(): void;
}

interface StarConfig {
  x: number; y: number;        // normalized 0–1 position
  size: number;                 // px
  baseOpacity: number;
  twinkleDuration: number;      // ms
  twinkleDelay: number;         // ms
  color: string;
}
```

```typescript
// DOM implementation (Sprint 2)
class DOMStarRenderer implements StarRenderer {
  private container: HTMLElement;
  private elements: HTMLElement[] = [];

  render(stars: StarConfig[]): void { /* create divs, append to container */ }
  updateDensity(factor: number): void { /* show/hide elements */ }
  destroy(): void { /* remove elements */ }
}
```

Future implementations:

```typescript
// Canvas implementation (future)
class CanvasStarRenderer implements StarRenderer { /* ... */ }
// WebGL implementation (future)
class WebGLStarRenderer implements StarRenderer { /* ... */ }
```

The `StarField` component instantiates a renderer but doesn't care which one:

```typescript
function StarField({ config }: { config: WorldZoneConfig }) {
  const rendererRef = useRef<StarRenderer | null>(null);
  // Creates DOMStarRenderer by default. Future: swap via prop or feature detection.
}
```

### Star Generation

```typescript
const STARS_COUNT = {
  desktop: 60,
  tablet: 30,
  mobile: 15,
};
```

Stars are generated at build-time with random positions and animation parameters:

```tsx
{Array.from({ length: starCount }, (_, i) => (
  <div
    key={i}
    className="world-star"
    style={{
      left: `${randomPositions[i].x}%`,
      top: `${randomPositions[i].y}%`,
      width: `${sizes[i]}px`,
      height: `${sizes[i]}px`,
      animationDuration: `${2 + Math.random() * 3}s`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: 0.3 + Math.random() * 0.4,
    }}
  />
))}
```

```css
.world-star {
  position: absolute;
  border-radius: 50%;
  background: #F8FAFC;
  pointer-events: none;
  animation: worldStarTwinkle var(--star-duration, 3s) ease-in-out infinite;
  animation-delay: var(--star-delay, 0s);
}

@keyframes worldStarTwinkle {
  0%, 100% { opacity: var(--star-base-opacity, 0.5); }
  50% { opacity: 0.1; }
}
```

### Star Distribution

- **Upper 60% of viewport** — stars concentrated in upper portion of sky
- **Small (1px)**: 70% of stars
- **Medium (1.5px)**: 20% of stars
- **Large (2px)**: 10% of stars
- **Color**: White (70%), Cyan-tinted (20%), Purple-tinted (10%) — reflecting brand colors
- **Density scaling**: `config.atmosphere.starDensity` (0–1) multiplies the visible star count

### Moon (Abstract Renderer)

Same abstraction pattern — `MoonRenderer` interface with `DOMMoon` implementation. The moon is an inline SVG pixel moon (16×16 native, ~48×48px displayed) in the upper-right quadrant. Always present, subtle glow animation.

---

## 10. Energy Comet Manager

> **Sprint 3**

### Design

A CSS-keyframe-driven meteor/comet that spawns occasionally, travels across the upper sky, and fades out. Comets represent Creative Engine energy signals.

### Behavior

- **Spawn interval**: 12-35 seconds (randomized)
- **Max simultaneous**: 2
- **Direction**: Diagonal, upper-right to lower-left (or variations)
- **Duration**: 3-6 seconds per comet
- **Trail**: Gradient that fades from cyan core to purple tail

### CSS Comet Path

```css
@keyframes worldCometPath {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translate3d(-60vw, 40vh, 0);
    opacity: 0;
  }
}

.world-comet {
  position: absolute;
  top: 15%;
  right: -10%;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #22D3EE, #6D28D9, transparent);
  animation: worldCometPath var(--comet-duration, 4s) ease-out forwards;
  pointer-events: none;
}
```

### JS Spawner

```typescript
// WorldComets.tsx — timer-based spawner
useEffect(() => {
  if (reducedMotion || pageHidden) return;

  const schedule = () => {
    const delay = 12000 + Math.random() * 23000; // 12-35s
    return setTimeout(() => {
      spawnComet();
      currentTimer = schedule();
    }, delay);
  };

  let currentTimer = schedule();
  return () => clearTimeout(currentTimer);
}, [reducedMotion, pageHidden]);
```

---

## 11. Aurora Manager

> **Sprint 7**

### Design

A very rare, very subtle aurora effect using CSS gradient animations. Appears in the upper sky with <5% opacity, lasts 10-20 seconds.

### Behavior

- **Spawn interval**: 60-120 seconds (very rare)
- **Max simultaneous**: 1
- **Opacity**: 2-5% (barely perceptible)
- **Duration**: 8-15 seconds
- **Colors**: Cyan-green-purple gradient

### CSS Aurora

```css
.world-aurora {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(
    180deg,
    rgba(34, 211, 238, 0.02) 0%,
    rgba(109, 40, 217, 0.03) 30%,
    rgba(52, 211, 153, 0.015) 60%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 2s ease;
  pointer-events: none;
}

.world-aurora--visible {
  opacity: var(--world-aurora-opacity, 0.04);
  animation: worldAuroraWave 10s ease-in-out infinite;
}

@keyframes worldAuroraWave {
  0%, 100% { transform: translateX(0) scaleY(1); }
  25% { transform: translateX(-2%) scaleY(1.05); }
  50% { transform: translateX(1%) scaleY(0.95); }
  75% { transform: translateX(-1%) scaleY(1.02); }
}
```

---

## 12. Cursor Trail System

> **Sprint 8**

### Design

A minimal pixel cursor trail. Maximum 3 particles. Each particle is a 4×4px colored square that fades and drifts away from cursor position.

### Implementation

```typescript
interface CursorParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  createdAt: number;
}
```

- Max 3 particles (queue-based — oldest removed)
- Each particle lives 600ms
- Colors cycle: cyan → purple → orange
- Particles move +2px in a random direction over their lifetime
- Uses `requestAnimationFrame` for position updates
- Respects `prefers-reduced-motion` (hidden entirely)

### Performance

- Particles use `transform: translate3d()` only
- Position updates via JS, rendered via React state
- No DOM manipulation outside React's lifecycle

---

## 13. Section Evolution Strategy

### Dual-Mode Architecture

The world state source supports two modes. Mode A is used in Sprint 1; Mode B is prepared for future cinematic transitions. Both resolve to the same `WorldZoneConfig`, so rendering components never change.

```
                    ┌─ Mode A: currentZone ──┐
WorldRoot ──> Resolver ──> WorldZoneConfig ──> Environment ──> Visual Subsystems
                    └─ Mode B: normalizedProgress (0→1) ──┘
```

### Mode A — Zone-Based (Sprint 1)

`IntersectionObserver` watches page sections and maps them to zones via an external mapping:

```typescript
// section-zone-map.ts — decoupled from world logic
export const SECTION_ZONE_MAP: Record<string, WorldZone> = {
  "data-hero-section": "entrance",
  "projects": "city",
  "about": "forest",
  "contact": "observatory",
};
```

```typescript
// use-world-section.ts
import { SECTION_ZONE_MAP } from "./section-zone-map";

export function useWorldSections(): WorldZone {
  const [activeZone, setActiveZone] = useState<WorldZone>("entrance");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let maxEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            maxEntry = entry;
          }
        }
        if (maxEntry && maxRatio > 0.3) {
          const id = maxEntry.target.id || maxEntry.target.dataset.section || "";
          if (SECTION_ZONE_MAP[id]) setActiveZone(SECTION_ZONE_MAP[id]);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    for (const id of Object.keys(SECTION_ZONE_MAP)) {
      const el = document.getElementById(id) || document.querySelector(`[data-section="${id}"]`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return activeZone;
}
```

### Mode B — Continuous Progress (Future)

The world can evolve through normalized progress (0→1) instead of discrete zones:

```
0%        20%        45%        70%        100%
entrance  forest     city       energy     observatory
```

```typescript
function resolveZoneConfigFromProgress(progress: number): WorldZoneConfig {
  // Find the two bracketing zone milestones
  const milestones = [
    { at: 0.0, zone: "entrance" },
    { at: 0.2, zone: "forest" },
    { at: 0.45, zone: "city" },
    { at: 0.7, zone: "energy" },
    { at: 1.0, zone: "observatory" },
  ];

  // Find lower and upper bracket
  let lower = milestones[0], upper = milestones[milestones.length - 1];
  for (let i = 0; i < milestones.length - 1; i++) {
    if (progress >= milestones[i].at && progress <= milestones[i + 1].at) {
      lower = milestones[i];
      upper = milestones[i + 1];
      break;
    }
  }

  // Interpolate all numeric fields between lower and upper configs
  const t = (progress - lower.at) / (upper.at - lower.at);
  const lowerConfig = WORLD_ZONES[lower.zone];
  const upperConfig = WORLD_ZONES[upper.zone];

  return interpolateConfigs(lowerConfig, upperConfig, t);
}
```

### Resolver — Zone + Theme → RenderConfig

```typescript
// world-config.ts
export function resolveRenderConfig(timeline: WorldTimeline, themeName: string): RenderConfig {
  // Resolve zone (structural)
  let zone: WorldZoneConfig;
  if (timeline.normalizedProgress !== undefined) {
    zone = resolveZoneConfigFromProgress(timeline.normalizedProgress);
  } else {
    zone = WORLD_ZONES[timeline.currentZone];
  }

  // Resolve theme (visual)
  const theme = WORLD_THEMES[themeName] || WORLD_THEMES.night;

  // Compute capabilities (what may render)
  const capabilities = computeCapabilities(zone, theme, timeline);

  // Merge into flat render config
  return mergeAll(zone, theme, capabilities);
}
```

### Sprint 1 Transition Flow

1. User scrolls from Hero (entrance) toward Projects
2. When Projects section reaches >30% visibility: `use-world-section.ts` calls `updateZone("city")`
3. `WorldRoot` updates `WorldTimeline.currentZone` to `"city"`
4. `Environment` reads updated timeline, calls `resolveRenderConfig(timeline, activeTheme)`
5. `Environment` receives `RenderConfig` and distributes slices to `SkyLayer`, `MountainRange`, `FeatureLayer`
6. CSS `transition: background 1.5s` handles sky gradient crossfade
7. `FeatureLayer` applies opacity transitions from config values
8. All subsystems receive colors from the active theme — no theme switching logic in any component

### Observation Targets

| Element Selector | World Zone |
|---|---|
| `[data-hero-section]` | `entrance` |
| `#projects` | `city` |
| `#about` | `forest` |
| `#contact` | `observatory` |

The Skills section doesn't exist yet on the homepage — when added, one new entry goes in `SECTION_ZONE_MAP` and one new entry goes in `WORLD_ZONES`. No architecture changes needed.

---

## 14. Performance Strategy

### Non-Negotiable Rules

1. **Only `transform` and `opacity`** for all CSS animations
2. **`will-change: transform, opacity`** on animated elements (max 10 elements)
3. **`transform: translateZ(0)`** on `.world-root` for GPU compositing
4. **`contain: layout style paint`** on `.world-root` to isolate from document
5. **No `filter` or `box-shadow` CSS animations** (causes paint)
6. **No `top`/`left`/`right`/`bottom` CSS animations** (causes layout)
7. **Pause all animations when `document.hidden`** via `animation-play-state: paused`
8. **`requestAnimationFrame`** for JS-driven animations (parallax, cursor)
9. **Event listeners use `{ passive: true }`** for scroll/mouse/touch
10. **No JS animation library for world effects** — CSS only (framer-motion reserved for content)

### Memory Management

- Timer-based components (comets, aurora) clean up on unmount
- IntersectionObserver disconnects on unmount
- Cursor trail queue caps at 3 particles
- Stars are static (no timer, no position change — pure CSS)

### Layer Count Limits

| Element | Max Count |
|---|---|
| Stars (desktop) | 60 |
| Stars (tablet) | 30 |
| Stars (mobile) | 15 |
| Comets (simultaneous) | 2 |
| Cursor particles | 3 |
| City lights | 12 |
| Floating leaves | 6 |
| Fog particles | 4 |

### Bundle Size

- World components should be lightweight — SVGs inline, CSS in stylesheets
- WorldRoot: ~2KB gzipped
- All world CSS: ~8KB gzipped
- Total world addition: ~10-15KB gzipped

---

## 15. Accessibility Considerations

### Screen Readers

- All world elements have `aria-hidden="true"` — the world is purely decorative
- WorldRoot has `role="presentation"` or is simply a `<div>` (semantically neutral)
- No focusable elements inside the world
- No `aria-live` regions (world has no dynamic content that affects understanding)

### Keyboard

- The world does not trap or affect keyboard navigation
- Tab order flows through sections normally
- No keyboard interaction with world elements

### Color Contrast

- The world is purely decorative — no text, no interactive elements
- Color contrast requirements don't apply to decorative backgrounds
- All content (headlines, body text, buttons) sits above the world layer with existing contrast ratios

### Motion Sensitivity

- **Full support for `prefers-reduced-motion: reduce`** — see section 16
- No vestibular triggers (no flashing, no rapid scaling)
- All animations are slow and subtle (measured in seconds, not milliseconds)

### Reduced Data

- `prefers-reduced-data: reduce` could be supported in a future sprint
- For now, mobile responsive breakpoints already reduce world complexity

---

## 16. Reduced-Motion Behavior

### CSS Media Query

```css
/* world-reduced-motion.css */
@media (prefers-reduced-motion: reduce) {
  .world-sky {
    transition: none; /* Instant sky changes */
  }

  .world-star {
    animation: none;
    opacity: 0.3; /* Static, barely visible */
  }

  .world-mountains {
    transition: none;
  }

  .world-feature {
    transition: opacity 0.3s ease; /* Still transitions, but faster */
  }

  /* Pause all world animations */
  .world-root * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.3s !important; /* Keep zone transitions but fast */
  }

  /* Hide animated-only elements */
  .world-comet,
  .world-aurora,
  .world-cursor-particle,
  .world-foreground-particle {
    display: none !important;
  }

  /* Parallax: disable */
  .world-mountains {
    transform: none !important;
  }
}
```

### JavaScript Behavior

- `use-world-section.ts` checks `useReducedMotion()` from framer-motion
- When reduced motion is preferred:
  - Comet spawner does not start
  - Aurora spawner does not start
  - Cursor trail does not render
  - Parallax does not attach mouse listener
  - Zone transitions still work but without the 1.5s CSS transition (CSS handles this via the media query)
- The world still changes zones — just instantly

### pageHidden Handling

```css
[data-page-hidden="true"] .world-root * {
  animation-play-state: paused !important;
  transition: none !important;
}
```

---

## 17. State Management

### WorldTimeline (Primary State)

All temporal world state is owned by `WorldTimeline`, which is provided via `WorldContext`. `Environment` consumes the timeline to resolve zone config + theme.

```typescript
// src/types/world.ts
export type WorldZone = "entrance" | "forest" | "city" | "energy" | "observatory";

export interface WorldTimeline {
  // Sprint 1
  currentZone: WorldZone;

  // Future — continuous world evolution
  normalizedProgress?: number;        // 0–1, replaces IntersectionObserver
  timeOfDay?: "night" | "dawn" | "day" | "dusk";
  season?: "spring" | "summer" | "autumn" | "winter";
  worldClock?: number;                // ms since page load
  rareEventTiming?: RareEvent[];
}

export interface WorldState {
  timeline: WorldTimeline;
  reducedMotion: boolean;
  pageHidden: boolean;
  activeTheme: string;                // key into WORLD_THEMES, defaults to "night"
}

export interface WorldContextValue {
  state: WorldState;
  updateZone: (zone: WorldZone) => void;  // Sprint 1: only zone changes
}
```

### State Location

- `WorldRoot` owns `WorldTimeline` state via `useState<WorldTimeline>`
- `WorldRoot` also owns `activeTheme` (defaults to `"night"`)
- No reducer needed — timeline changes infrequently
- No persistence needed — world always starts at `entrance` with `"night"` theme
- Context provides both read state and a minimal update API (`updateZone`)

### Data Flow

```
WorldRoot
  │
  ├── WorldTimeline (useState: currentZone)
  ├── activeTheme     (useState: "night")
  │
  ▼
WorldContext.Provider ({ state: { timeline, activeTheme, ... }, updateZone })
  │
  ▼
Environment (reads context)
  │
  ├── const zone = WORLD_ZONES[timeline.currentZone]
  ├── const theme = WORLD_THEMES[state.activeTheme]
  ├── const capabilities = computeCapabilities(zone, theme, timeline)
  ├── const config = mergeAll(zone, theme, capabilities)  // → RenderConfig
  │
  ▼
  ├─ SkyLayer({ sky: config.sky })
  ├─ StarField({ atmosphere: config.atmosphere, enabled: config.capabilities.stars })
  ├─ MountainRange({ mountains: config.mountains, enabled: config.capabilities.mountains })
  └─ FeatureLayer({ features: config.features, capabilities: config.capabilities })
```

### Config Resolution

```typescript
// world-config.ts
export function resolveRenderConfig(timeline: WorldTimeline, themeName: string): RenderConfig {
  // 1. Resolve zone (structural)
  let zone: WorldZoneConfig;
  if (timeline.normalizedProgress !== undefined) {
    zone = resolveZoneConfigFromProgress(timeline.normalizedProgress);
  } else {
    zone = WORLD_ZONES[timeline.currentZone];
  }

  // 2. Resolve theme (visual)
  const theme = WORLD_THEMES[themeName] || WORLD_THEMES.night;

  // 3. Compute capabilities (what may render)
  const capabilities = computeCapabilities(zone, theme, timeline);

  // 4. Merge into flat render config
  return mergeAll(zone, theme, capabilities);
}
```

### Why Not Merge with EcosystemContext

The EcosystemContext (Creative Engine) manages pixel sprite state machines. The WorldContext manages the environment layer. They are:

- **Different concerns**: one is interactive pixel art, the other is decorative background
- **Different update patterns**: ecosystem ticks every 2s, world changes only on scroll
- **Different lifecycle**: ecosystem is interactive, world is passive
- **Different consumers**: ecosystem is used by WorldInteraction, world is used by Environment

**Decision**: Keep them separate. `WorldRoot` is a sibling to `EcosystemRoot` in the layout tree.

---

## 18. Z-Index Strategy

### Full Document Z-Index Map

```
-1     .pixel-grid::before           Fixed pixel grid overlay
 0     .world-root                   Fixed world background
   auto   .world-sky                 Sky gradient
   1     .world-star, .world-moon    Celestial objects
   2-4   .world-mountains--near/mid/far  Mountain layers
   5     .world-feature              Section-specific layers (city, forest, etc.)
   6     .world-comet                Rare comets
   7     .world-aurora               Very rare aurora
   8     .world-foreground           Ambient particles
   9     .world-pixel-grid           Subtle pixel grid overlay within world
10     section, main, header, footer  Content sections (globals.css)
20     h1-h6, p                       Text (globals.css)
50     nav                             Fixed navbar
9997   .film-grain                    Film grain overlay
9998   .scanlines                     Scanline overlay
99999  .boot-overlay                  Boot sequence
```

### New Foundation Tokens

```css
/* Add to foundation.css */
--z-world-sky: 0;
--z-world-stars: 1;
--z-world-mountains: 2;
--z-world-features: 5;
--z-world-comets: 6;
--z-world-aurora: 7;
--z-world-foreground: 8;
--z-world-grid: 9;
```

---

## 19. Responsive Behavior

### Breakpoint Strategy

Using existing Tailwind v4 default breakpoints:
- **`< 640px` (mobile)**: Minimal world
- **`640-768px` (tablet)**: Reduced world
- **`768-1024px` (tablet-landscape)**: Medium world
- **`> 1024px` (desktop)**: Full world

### Mobile (`< 640px`)

- Sky gradient (always shown — provides section context)
- **No stars** (filter: none / display: none via media query)
- **No moon**
- **No mountains** (they add visual noise at small sizes)
- **No comets**
- **No aurora**
- **No cursor trail** (mobile has no cursor)
- **No parallax** (no hover on mobile)
- **City**: reduced to 3 buildings, no window lights
- **Forest**: reduced to 2 trees, no floating leaves
- **Energy grid**: hidden
- **Observatory**: hidden

### Tablet (`640-1024px`)

- Sky gradient
- Stars: 30 (reduced)
- Moon: shown
- Mountains: 2 layers (no far layer)
- No comets
- No aurora
- No cursor trail
- No parallax
- City: 5 buildings, window lights (simplified)
- Forest: 4 trees, 3 leaves
- Energy grid: simplified
- Observatory: simplified

### Desktop (`> 1024px`)

- Full detail as specified throughout this document

### Implementation

```css
/* world-responsive.css */
@media (max-width: 639px) {
  .world-star { display: none; }
  .world-moon { display: none; }
  .world-mountains { display: none; }
  .world-comet { display: none; }
  .world-aurora { display: none; }
  .world-feature { opacity: 0.6 !important; } /* Subtler on mobile */
}

@media (min-width: 640px) and (max-width: 1023px) {
  /* Tablet reductions */
}
```

---

## 20. Build Order (Sprints)

### Sprint 1 — World Foundation (current)

**Goal**: Establish the continuous pixel-art environment across the entire website.

**Deliverables**:
- `src/types/world.ts` — types: `WorldZone`, `WorldTimeline`, `WorldState`, `WorldZoneConfig`, `WorldTheme`, `RenderCapabilities`, `RenderConfig`, `WorldContextValue`
- `WorldRoot.tsx` — fixed layer, owns `WorldTimeline` state + `activeTheme`, provides `WorldContext`
- `WorldTimeline.tsx` — single temporal source; Sprint 1 simply stores `currentZone`; interface prepared for `normalizedProgress`, `timeOfDay`, `season`, `worldClock`
- `WorldContext.tsx` — React context + `useWorld()` hook, provides `state` + `updateZone()`
- `Environment.tsx` — consumes `WorldTimeline` from context, calls `resolveRenderConfig()`, distributes config slices to subsystems
- `world-config.ts` — `WORLD_ZONES` (structural only) + `WORLD_THEMES` (night theme) + `resolveRenderConfig()` zone+theme merger
- `world-themes.ts` — `WORLD_THEMES` visual identity palette (in Sprint 1, just `night`; structure prepared for dawn/day/dusk/seasonal)
- `section-zone-map.ts` — abstract `SECTION_ZONE_MAP` (section ID → `WorldZone`)
- `use-world-section.ts` — IntersectionObserver hook, reads `SECTION_ZONE_MAP`, calls `updateZone()`
- `SkyLayer.tsx` — CSS gradient sky, receives `config.sky` (colors from theme + gradient direction from zone)
- `MountainRange.tsx` — multi-layer mountain silhouettes, receives `config.mountains` (colors from theme, visibility from zone)
- `world-root.css`, `sky.css`, `mountains.css`
- `world.css` barrel import
- `world-responsive.css` — responsive breakpoints
- `world-reduced-motion.css` — reduced motion support
- **Modified**: `globals.css` (import world.css), `foundation.css` (z-index tokens), `layout.tsx` (add WorldRoot before main)
- **Modified**: Hero, Projects, About, Contact sections — remove `bg-brand-blue/95` (sections become transparent, world shows through)

**Validation**:
- [x] Passes `npm run lint` (0 errors)
- [x] Passes `npm run build` (silent)
- [x] World layer is visible, fixed, behind content
- [x] Sky changes gradient as user scrolls between sections
- [x] Mountains are visible (3 layers on desktop, 2 on tablet, none on mobile)
- [x] `prefers-reduced-motion` pauses all world animations
- [x] Responsive: mountains hidden on mobile, 2 layers on tablet, 3 on desktop
- [x] All creative engine functionality preserved (no regressions)

### Sprint 2 — Star System

- `StarField.tsx` — CSS-only twinkling stars
- `Moon.tsx` — SVG pixel moon
- `stars.css`, `moon.css`

### Sprint 3 — Energy Comets

- `WorldComets.tsx` — comet spawner with timer
- `comets.css`

### Sprint 4 — Parallax & Camera Movement

- `use-world-parallax.ts` — mouse-based parallax hook
- Update MountainRange to use parallax offset
- Update StarField if needed (very subtle parallax)

### Sprint 5 — Ambient World Motion

- `WorldForeground.tsx` — ambient floating particles
- City window light flicker (add to WorldCityLights)
- Floating leaves for forest (add to WorldForestLeaves)
- `foreground.css`

### Sprint 6 — Section World Evolution

- `WorldCity.tsx` + `WorldCityLights.tsx` — pixel buildings
- `WorldForest.tsx` + `WorldForestLeaves.tsx` — pixel trees
- `WorldEnergyGrid.tsx` — energy grid lines
- `WorldObservatory.tsx` — telescope + star map
- `city.css`, `forest.css`, `energy-grid.css`, `observatory.css`

### Sprint 7 — Aurora, Rare Events, and Easter Eggs

- `WorldAurora.tsx` — rare aurora effect
- `WorldEasterEggs.tsx` — time-based easter eggs
- `aurora.css`

### Sprint 8 — Pixel Cursor, Polish, Optimization, and Final QA

- `WorldPixelCursor.tsx` — cursor trail
- `WorldAtmosphereAudio.tsx` — optional audio button
- `cursor.css`
- Performance optimization pass
- Accessibility audit pass
- Cross-browser testing
- Final QA against all quality gates

---

## Appendix A: Section Background Removal

### Current State

All sections use `bg-brand-blue/95` as their background color:

| Section | Current Class | New Class |
|---|---|---|
| Hero | `Section className="..."` (no bg class — bg is transparent via parent) | No change needed (hero has no `bg-*` class) |
| Projects | `bg-brand-blue/95 pt-14 md:pt-16 pb-16 md:pb-20 relative` | `pt-14 md:pt-16 pb-16 md:pb-20 relative` (remove bg) |
| About | `bg-brand-blue/95 relative py-14 md:py-20` | `relative py-14 md:py-20` (remove bg) |
| Contact | `bg-brand-blue/95 relative pb-16 sm:pb-36 pt-14 sm:pt-20 md:pt-32 overflow-hidden` | `relative pb-16 sm:pb-36 pt-14 sm:pt-20 md:pt-32 overflow-hidden` (remove bg) |

After removing backgrounds, sections become transparent, allowing the world layer to show through. The existing atmospheric overlay divs inside each section will still provide subtle gradient overlays on top of the world.

### Atmospheric Overlays

Each section has existing gradient overlay divs (e.g., `absolute inset-0 bg-gradient-to-b from-brand-blue/95 via-transparent to-brand-blue/98 pointer-events-none`). These should be kept — they provide a subtle gradient vignette that blends the content with the world background.

### Content Readability

- Text already has high contrast against any background (white text, opacity layers)
- Section overlay gradients prevent the world from competing with content
- The world is designed to be very subtle (low opacity, dark colors)
- No changes needed to text colors or contrast

---

*End of Specification*
