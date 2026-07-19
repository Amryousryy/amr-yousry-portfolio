# CREATIVE ENGINE — SPRITE ATLAS v1.0
## Unified Pixel Art Reference

**Version:** 1.0
**Date:** 2026-07-19
**Assets Included:** Sprint 01 (Creative Core), Sprint 02 (Memory Crystal)
**Purpose:** Central production reference for all pixel art assets

---

# ATLAS OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    CREATIVE ENGINE SPRITE ATLAS              │
│                         v1.0 — 2026-07-19                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐                │
│   │  CORE   │    │  CORE   │    │ CRYSTAL │                │
│   │  IDLE   │    │  PULSE  │    │  IDLE   │                │
│   │ 16×16   │    │ 16×16   │    │ 16×16   │                │
│   └─────────┘    └─────────┘    └─────────┘                │
│                                                             │
│   ┌─────────┐    ┌─────────┐                               │
│   │ CRYSTAL │    │ CRYSTAL │                               │
│   │  PULSE  │    │ACTIVATE │                               │
│   │ 16×16   │    │ 16×16   │                               │
│   └─────────┘    └─────────┘                               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ATLAS SPECIFICATIONS                                       │
├─────────────────────────────────────────────────────────────┤
│  Canvas: 16×16px native (all assets)                        │
│  Display Scale: 3× (48×48px)                                │
│  Pixel Size: 1px native                                     │
│  Safe Padding: 2px all edges                                │
│  Anti-Aliasing: None (crisp edges only)                     │
│  Export Format: SVG (web), PNG-24 (master)                  │
└─────────────────────────────────────────────────────────────┘
```

---

# ATLAS LAYOUT

## Grid System
- **Cell Size:** 16×16px native
- **Cell Spacing:** 4px between cells
- **Columns:** 8 (128px + 28px spacing = 156px)
- **Rows:** 4 (64px + 12px spacing = 76px)
- **Total Atlas Size:** 156×76px native

## Asset Positions
| Asset | Column | Row | Position (native) |
|-------|--------|-----|-------------------|
| Creative Core — Idle | 0 | 0 | (0, 0) |
| Creative Core — Pulse | 1 | 0 | (20, 0) |
| Memory Crystal — Idle | 2 | 0 | (40, 0) |
| Memory Crystal — Pulse | 3 | 0 | (60, 0) |
| Memory Crystal — Activate | 4 | 0 | (80, 0) |
| *Sprint 03 — Maintenance Drone* | 5 | 0 | (100, 0) |
| *Sprint 04 — Signal Beacon* | 6 | 0 | (120, 0) |
| *Sprint 05 — Energy Stream* | 7 | 0 | (140, 0) |

---

# PALETTE REFERENCE

## Universal Colors (Shared Across All Assets)
| Name | Hex | Usage |
|------|-----|-------|
| Electric Cyan | #22D3EE | Accent, containment fields, data indicators |
| Dark Indigo | #1E1B4B | Shadows, background, structural elements |

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

## Forbidden Colors
- White (#FFFFFF) — never used in pixel art
- Slate colors — never used in pixel art
- Any color not in the approved palettes

---

# PIXEL DENSITY STANDARD

## Universal Rules
1. **Pixel Size:** 1px native across all assets
2. **Grid Alignment:** All pixels align to 1px grid
3. **Anti-Aliasing:** None — crisp edges only
4. **Safe Padding:** 2px all edges
5. **Content Area:** 12×12px minimum (within 16×16 canvas)

## Scale Reference
| Scale | Native | Display | Use Case |
|-------|--------|---------|----------|
| 1× | 16×16 | 16×16 | Favicon, tiny icon |
| 2× | 16×16 | 32×32 | Small UI element |
| 3× | 16×16 | 48×48 | Standard display (default) |
| 4× | 16×16 | 64×64 | Large display |
| 6× | 16×16 | 96×96 | Hero accent |

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
| Creative Core | Omnidirectional | Center (energy emission) | None | Cyan ring at 40% |
| Memory Crystal | Upper-left 45° | Light Purple on upper facets | Dark Indigo on lower facets | Light Purple at 30% |

---

# ANIMATION STANDARD

## Universal Animation Rules
1. **Method:** CSS keyframes (GPU-accelerated)
2. **Properties:** opacity, transform, filter (no layout animations)
3. **Reduced Motion:** Static display, no animations
4. **Loop Types:** Seamless ping-pong (idle), Play once (events)

## Per-Asset Animation
| Asset | Idle Duration | Event Duration | Loop Type |
|-------|--------------|----------------|-----------|
| Creative Core | 4s | N/A | Ping-pong |
| Memory Crystal | 1200ms | 900ms (pulse), 600ms (activate) | Ping-pong (idle), Play once (events) |

---

# COMPONENT ARCHITECTURE STANDARD

## Universal Component Props
```typescript
interface PixelSpriteProps {
  size?: number;           // Display size in pixels (default: 48)
  variant?: string;        // Animation variant
  className?: string;      // Additional CSS classes
  style?: CSSProperties;   // Inline styles
  ariaLabel?: string;      // Accessibility label
}
```

## Optional Extended Props
```typescript
interface PixelSpriteExtendedProps extends PixelSpriteProps {
  activateOnScroll?: boolean;  // Trigger activate on scroll intersection
  pulseInterval?: number;      // Auto-pulse interval (ms), 0 = disabled
}
```

---

# QUALITY CHECKLIST

## Atlas Consistency
- [ ] All assets use 16×16 native canvas
- [ ] All assets use 3× display scale
- [ ] All assets use 1px native pixel size
- [ ] All assets have 2px safe padding
- [ ] All assets use crisp edges (no anti-aliasing)
- [ ] All assets use approved palettes only
- [ ] All assets follow lighting standards
- [ ] All assets follow animation standards
- [ ] All components use universal props

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
