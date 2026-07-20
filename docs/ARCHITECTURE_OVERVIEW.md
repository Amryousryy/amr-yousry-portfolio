# ARCHITECTURE OVERVIEW — Creative Engine v1.0

## System Architecture

The Creative Engine is a client-side reactive ecosystem rendered within the Next.js application. It follows a layered architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    NEXT.JS APP                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   Hero       │  │  Sections    │  │  EcosystemRoot │  │
│  │  Section     │  │  (About,     │  │  (Provider)    │  │
│  │              │  │   Projects,  │  │                │  │
│  │  WorldInter- │  │   Skills,    │  │  Ecosystem     │  │
│  │  action      │  │   Exp,       │  │  Provider      │  │
│  │              │  │   Contact)   │  │                │  │
│  └──────┬───────┘  └──────────────┘  └───────┬────────┘  │
│         │                                     │          │
└─────────┼─────────────────────────────────────┼──────────┘
          │                                     │
          ▼                                     ▼
┌─────────────────────────────────────────────────────────┐
│              CREATIVE ENGINE LAYER                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Ecosystem Engine (ecosystem.ts)                  │   │
│  │  - State machine                                  │   │
│  │  - Event dispatch                                │   │
│  │  - Tick-based energy regen                        │   │
│  │  - Safety timeouts                               │   │
│  └──────────────┬───────────────────────────────────┘   │
│                  │                                       │
│  ┌───────────────┴───────────────────────────────────┐  │
│  │  Types (types.ts)                                 │   │
│  │  - Object states                                  │   │
│  │  - Visual variants                                │   │
│  │  - Ecosystem events                               │   │
│  │  - Configuration constants                        │   │
│  └───────────────┬───────────────────────────────────┘  │
│                  │                                       │
│  ┌───────────────┴───────────────────────────────────┐  │
│  │  React Context (context.tsx)                       │   │
│  │  - EcosystemState                                  │   │
│  │  - dispatchEvent                                   │   │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│              PIXEL COMPONENT LAYER                        │
│  CorePixel  CrystalPixel  DronePixel  BeaconPixel       │
│  PortalPixel  (CSS-animated SVG pixel art)               │
└─────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
EcosystemRoot (app/layout.tsx)
  └── EcosystemProvider (context.tsx)
       ├── WorldInteraction (WorldInteraction.tsx)
       │    ├── CreativeCorePixel
       │    ├── MemoryCrystalPixel
       │    ├── MaintenanceDronePixel
       │    ├── SignalBeaconPixel
       │    └── PortalPixel (conditional)
       └── (other sections consuming context if needed)
```

## Object Lifecycle

Each object (Core, Crystal, Drone, Beacon, Portal) owns a state machine defined in `types.ts`. States transition via dispatched events. The ecosystem runs a tick interval (2s) that handles energy regeneration and safety timeout checks.

### Key Rules
- Max 4 systems can be active simultaneously
- Each interaction has a cooldown (18s)
- Safety timeout forces reset after 20s in any state
- Energy regenerates at 0.3/tick for idle/patrol/dormant objects

## File Reference

| File | Purpose |
|------|---------|
| `src/lib/creative-engine/types.ts` | State types, event types, config |
| `src/lib/creative-engine/ecosystem.ts` | State machine, event dispatch, tick loop |
| `src/lib/creative-engine/context.ts` | React context provider |
| `src/components/creative-engine/WorldInteraction.tsx` | Orchestrator component |
| `src/components/creative-engine/CreativeCorePixel.tsx` | Core pixel art component |
| `src/components/creative-engine/MemoryCrystalPixel.tsx` | Crystal pixel art component |
| `src/components/creative-engine/MaintenanceDronePixel.tsx` | Drone pixel art component |
| `src/components/creative-engine/SignalBeaconPixel.tsx` | Beacon pixel art component |
| `src/components/creative-engine/PortalPixel.tsx` | Portal pixel art component |
