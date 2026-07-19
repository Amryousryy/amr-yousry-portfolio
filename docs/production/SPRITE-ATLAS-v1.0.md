# CREATIVE ENGINE — SPRITE ATLAS v1.1
## Unified Pixel Art Reference

**Version:** 1.1
**Date:** 2026-07-19
**Assets Included:** Sprint 01 (Creative Core), Sprint 02 (Memory Crystal), Sprint 03 (Maintenance Drone)
**Purpose:** Central production reference for all pixel art assets

---

# ATLAS OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    CREATIVE ENGINE SPRITE ATLAS              │
│                         v1.1 — 2026-07-19                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐                │
│   │  CORE   │    │  CORE   │    │ CRYSTAL │                │
│   │  IDLE   │    │  PULSE  │    │  IDLE   │                │
│   │ 16×16   │    │ 16×16   │    │ 16×16   │                │
│   └─────────┘    └─────────┘    └─────────┘                │
│                                                             │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐                │
│   │ CRYSTAL │    │ CRYSTAL │    │  DRONE  │                │
│   │  PULSE  │    │ACTIVATE │    │  IDLE   │                │
│   │ 16×16   │    │ 16×16   │    │ 24×28   │                │
│   └─────────┘    └─────────┘    └─────────┘                │
│                                                             │
│   ┌─────────┐    ┌─────────┐                               │
│   │  DRONE  │    │  DRONE  │                               │
│   │ INSPECT │    │TRANSFER │                               │
│   │ 24×28   │    │ 24×28   │                               │
│   └─────────┘    └─────────┘                               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ATLAS SPECIFICATIONS                                       │
├─────────────────────────────────────────────────────────────┤
│  Canvas: 16×16px or 24×28px native                          │
│  Display Scale: 3× (48×48px or 72×84px)                     │
│  Pixel Size: 1px native                                     │
│  Safe Padding: 1-2px all edges                              │
│  Anti-Aliasing: None (crisp edges only)                     │
│  Export Format: SVG (web), PNG-24 (master)                  │
└─────────────────────────────────────────────────────────────┘
```

---

# ATLAS LAYOUT

## Grid System
- **Cell Size:** 16×16px native (Core/Crystal), 24×28px native (Drone)
- **Cell Spacing:** 4px between cells
- **Columns:** 8
- **Rows:** 4

## Asset Positions
| Asset | Column | Row | Native Size | Display Size |
|-------|--------|-----|-------------|--------------|
| Creative Core — Idle | 0 | 0 | 16×16 | 48×48 |
| Creative Core — Pulse | 1 | 0 | 16×16 | 48×48 |
| Memory Crystal — Idle | 2 | 0 | 16×16 | 48×48 |
| Memory Crystal — Pulse | 3 | 0 | 16×16 | 48×48 |
| Memory Crystal — Activate | 4 | 0 | 16×16 | 48×48 |
| Maintenance Drone — Idle | 5 | 0 | 24×28 | 72×84 |
| Maintenance Drone — Inspect | 6 | 0 | 24×28 | 72×84 |
| Maintenance Drone — Transfer | 7 | 0 | 24×28 | 72×84 |
| *Sprint 04 — Signal Beacon* | 0 | 1 | — | — |
| *Sprint 05 — Energy Stream* | 1 | 1 | — | — |

---

# PALETTE REFERENCE

## Universal Colors (Shared Across All Assets)
| Name | Hex | Usage |
|------|-----|-------|
| Electric Cyan | #22D3EE | Accent, containment fields, data indicators, drone eye/antenna/wings |
| Dark Indigo | #1E1B4B | Shadows, background, structural elements, drone head/body |

## Creative Core Palette
| Name | Hex | Usage |
|------|-----|-------|
| Warm Orange | #FB923C | Core center (dominant energy) |
| Deep Amber | #EA580C | Core mid-ring |
| Dark Orange | #9A3412 | Core edge |

## Memory Crystal Palette
| Name | Hex | Usage |
|------|-----|-------|
| Deep Purple | #6D28D9 | Crystal body (dominant) |
| Light Purple | #A78BFA | Upper facets, highlight, core glow |

## Maintenance Drone Palette
| Name | Hex | Usage |
|------|-----|-------|
| Dark Indigo | #1E1B4B | Head, body (dominant) |
| Electric Cyan | #22D3EE | Eye, antenna, wings |
| White | #F8FAFC | Head highlight |
| Deep Purple | #6D28D9 | Core inset |
| Light Purple | #A78BFA | Core glow (transfer state) |

## Forbidden Colors
- White (#FFFFFF) — never used in pixel art (except Drone highlight #F8FAFC)
- Slate colors — never used in pixel art
- Any color not in the approved palettes

---

# PIXEL DENSITY STANDARD

## Universal Rules
1. **Pixel Size:** 1px native across all assets
2. **Grid Alignment:** All pixels align to 1px grid
3. **Anti-Aliasing:** None — crisp edges only
4. **Safe Padding:** 1-2px all edges
5. **Content Area:** 12×12px minimum (within 16×16 canvas)

## Scale Reference
| Scale | 16×16 Native | 24×28 Native | Use Case |
|-------|-------------|--------------|----------|
| 1× | 16×16 | 24×28 | Favicon, tiny icon |
| 2× | 32×32 | 48×56 | Small UI element |
| 3× | 48×48 | 72×84 | Standard display (default) |
| 4× | 64×64 | 96×112 | Large display |
| 6× | 96×96 | 144×168 | Hero accent |

---

# LIGHTING STANDARD

## Universal Lighting Rules
1. **Energy Sources:** Omnidirectional lighting (no shadows)
2. **Physical Objects:** Upper-left 45° lighting
3. **Glow Elements:** Semi-transparent overlays (20-40% opacity)
4. **Shadows:** Dark Indigo (#1E1B4B) only
5. **Highlights:** Asset-specific highlight color

## Per-Asset Lighting
| Asset | Direction | Primary Light | Shadows | Glow |
|-------|-----------|---------------|---------|------|
| Creative Core | Omnidirectional | Center (energy emission) | None | Cyan drop-shadow at 0.3 |
| Memory Crystal | Upper-left 45° | Light Purple on upper facets | Dark Indigo on lower facets | Light Purple at 0.3 |
| Maintenance Drone | Upper-left 45° | Cyan eye/antenna emission | Dark Indigo body shadow | Cyan drop-shadow at 0.3 |

---

# ANIMATION STANDARD

## Universal Animation Rules
1. **Method:** CSS keyframes (GPU-accelerated)
2. **Properties:** opacity, transform, filter (no layout animations)
3. **Reduced Motion:** Static display, no animations
4. **Loop Types:** Seamless ping-pong (idle), Play once (events)
5. **Shared Duration:** 1200ms idle loop (ecosystem standard)

## Per-Asset Animation
| Asset | Idle Duration | Event Duration | Loop Type |
|-------|--------------|----------------|-----------|
| Creative Core | 1200ms | 1200ms (pulse) | Ping-pong |
| Memory Crystal | 1200ms | 900ms (pulse), 600ms (activate) | Ping-pong (idle), Play once (events) |
| Maintenance Drone | 1200ms | 500ms (inspect), 1000ms (transfer) | Ping-pong (idle), Play once (events) |

---

# COMPONENT ARCHITECTURE STANDARD

## Universal Component Props
```typescript
interface PixelSpriteProps {
  size?: number;           // Display size in pixels (default: 48 or 84)
  variant?: string;        // Animation variant
  className?: string;      // Additional CSS classes
  style?: CSSProperties;   // Inline styles
  ariaLabel?: string;      // Accessibility label
}
```

## Optional Extended Props (Crystal)
```typescript
interface CrystalExtendedProps extends PixelSpriteProps {
  activateOnScroll?: boolean;  // Trigger activate on scroll intersection
  pulseInterval?: number;      // Auto-pulse interval (ms), 0 = disabled
}
```

## Optional Extended Props (Drone)
```typescript
interface DroneExtendedProps extends PixelSpriteProps {
  interactWithCore?: boolean;              // Enable world interaction
  onInteractionStateChange?: (state) => void; // Callback for state changes
}
```

---

# WORLD INTERACTION SYSTEM

## Drone ↔ Core Interaction
The Maintenance Drone is the first "living entity" in the universe. It interacts with the Creative Core through a coordinated sequence:

1. Drone approaches Core
2. Drone hovers (inspect state)
3. Energy transfers from Core to Drone
4. Core pulses in response
5. Drone confirms completion
6. Both return to idle

## Interaction Component
```typescript
// WorldInteraction.tsx coordinates the interaction
<WorldInteraction enabled={true} className="..." />
```

---

# QUALITY CHECKLIST

## Atlas Consistency
- [x] All assets use 1px native pixel size
- [x] All assets use 3× display scale
- [x] All assets have 1-2px safe padding
- [x] All assets use crisp edges (no anti-aliasing)
- [x] All assets use approved palettes only
- [x] All assets follow lighting standards
- [x] All assets follow animation standards (1200ms idle)
- [x] All components use universal props
- [x] All SVGs use shape-rendering="crispEdges"
- [x] All SVGs use only <rect> primitives
- [x] No embedded <style> blocks in SVGs
- [x] All components with hooks have "use client" directive
- [x] All CSS glow effects use drop-shadow filter

---

# ATLAS MAINTENANCE

## Update Protocol
1. After each sprint, add new assets to the atlas
2. Update palette reference if new colors are introduced
3. Update animation reference if new patterns emerge
4. Run quality checklist after every update
5. Document any inconsistencies and correct before next sprint

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-19 | Initial atlas with Sprint 01-02 assets |
| 1.1 | 2026-07-19 | Added Sprint 03 Maintenance Drone, unified animation durations, added glow standards, added World Interaction section |
