# CREATIVE ENGINE — MASTER ASSET PIPELINE
## Production Workflow Standard

**Version:** 1.0
**Date:** 2026-07-19
**Purpose:** Establish the definitive workflow for creating pixel art assets

---

# PIPELINE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    MASTER ASSET PIPELINE                     │
│                         v1.0 — 2026-07-19                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. PIXEL ARTWORK (Master)                                  │
│     ↓                                                       │
│  2. SPRITE SHEET                                            │
│     ↓                                                       │
│  3. ANIMATION FRAMES                                        │
│     ↓                                                       │
│  4. OPTIMIZED WEB EXPORT                                    │
│     ↓                                                       │
│  5. SVG (when appropriate)                                  │
│     ↓                                                       │
│  6. WEBSITE INTEGRATION                                     │
│                                                             │
│  The original pixel artwork remains the permanent           │
│  source of truth.                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# STAGE 01 — PIXEL ARTWORK (MASTER)

## Purpose
Create the authentic HD Retro Pixel Art master file. This is the permanent source of truth for the asset.

## Requirements
- **Canvas:** 16×16px native (standard) or as specified
- **Pixel Size:** 1px native
- **Anti-Aliasing:** None — crisp edges only
- **Color Mode:** Indexed (limited palette)
- **Format:** PNG-24 with alpha channel

## Tool Recommendations
- **Aseprite** (primary) — industry standard for pixel art
- **Piskel** (web-based alternative) — free, collaborative
- **Photoshop** (with pixel art settings) — acceptable but less optimal

## Master File Naming
```
ce_[asset]_[variant]_master.png
```
Examples:
- `ce_core_idle_master.png`
- `ce_crystal_pulse_master.png`
- `ce_drone_idle_master.png`

## Storage Location
```
public/images/creative-engine/[asset]/master/
```

---

# STAGE 02 — SPRITE SHEET

## Purpose
Combine all animation frames into a single sprite sheet for efficient loading.

## Requirements
- **Frame Size:** 16×16px native per frame
- **Frame Layout:** Horizontal (left to right)
- **Frame Spacing:** 0px (no gaps)
- **Total Frames:** As required by animation spec
- **Format:** PNG-24 with alpha channel

## Sprite Sheet Naming
```
ce_[asset]_spritesheet_v[version].png
```
Examples:
- `ce_core_spritesheet_v01.png`
- `ce_crystal_spritesheet_v01.png`

## Storage Location
```
public/images/creative-engine/[asset]/spritesheets/
```

---

# STAGE 03 — ANIMATION FRAMES

## Purpose
Define the animation sequence, timing, and behavior for each asset.

## Requirements
- **Frame Rate:** As specified in asset spec (typically 3-7 FPS for pixel art)
- **Loop Type:** Seamless ping-pong (idle) or play once (events)
- **Easing:** ease-in-out (idle), cubic-bezier(0.22, 1, 0.36, 1) (events)
- **Reduced Motion:** Static frame 0

## Animation Frame Naming
```
ce_[asset]_[animation]_f[frame_number].png
```
Examples:
- `ce_core_idle_f0.png`
- `ce_core_idle_f1.png`
- `ce_crystal_pulse_f0.png`

## Storage Location
```
public/images/creative-engine/[asset]/frames/[animation]/
```

---

# STAGE 04 — OPTIMIZED WEB EXPORT

## Purpose
Create web-optimized versions of the pixel art for fast loading.

## Requirements
- **Format:** SVG (preferred for pixel art) or optimized PNG
- **SVG Settings:** shape-rendering="crispEdges", no viewBox scaling
- **PNG Settings:** PNG-8 if palette allows, PNG-24 if transparency needed
- **Compression:** Maximum lossless compression
- **File Size:** < 3KB per sprite, < 10KB per spritesheet

## Web Export Naming
```
ce_[asset]_[variant].svg
```
or
```
ce_[asset]_[variant].png
```

## Storage Location
```
public/images/creative-engine/[asset]/
```

---

# STAGE 05 — SVG (WHEN APPROPRIATE)

## Purpose
Create SVG versions for web integration when SVG is more appropriate than PNG.

## When to Use SVG
- Single-frame sprites (idle state)
- Simple animations (opacity, scale)
- Icons and UI elements
- When resolution independence is needed

## When to Use PNG
- Complex multi-frame animations
- Sprite sheets with many frames
- When SVG file size is larger than PNG
- When SVG rendering is inconsistent

## SVG Requirements
```xml
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 16 16" 
  width="48" 
  height="48" 
  shape-rendering="crispEdges"
>
  <!-- Pixel art as rect elements -->
</svg>
```

## SVG Naming
```
ce_[asset]_[variant].svg
```

## Storage Location
```
public/images/creative-engine/[asset]/
```

---

# STAGE 06 — WEBSITE INTEGRATION

## Purpose
Integrate the pixel art into the website as React components.

## Requirements
- **Component Format:** React functional component
- **Props:** Universal PixelSpriteProps + optional extended props
- **Animation:** CSS keyframes (GPU-accelerated)
- **Accessibility:** role="img", aria-label
- **Reduced Motion:** Respects prefers-reduced-motion

## Component Naming
```
[AssetName]Pixel.tsx
```
Examples:
- `CreativeCorePixel.tsx`
- `MemoryCrystalPixel.tsx`
- `MaintenanceDronePixel.tsx`

## Storage Location
```
src/components/creative-engine/
```

---

# QUALITY GATES

## Per-Stage Quality Checks

### Stage 01 — Pixel Artwork
- [ ] All pixels align to 1px grid
- [ ] No anti-aliasing
- [ ] No stray pixels
- [ ] Palette is approved
- [ ] Silhouette is readable at 50% scale

### Stage 02 — Sprite Sheet
- [ ] All frames are consistent
- [ ] Frame spacing is correct
- [ ] Total frames match animation spec
- [ ] File size is < 10KB

### Stage 03 — Animation Frames
- [ ] Frame rate matches spec
- [ ] Loop type is correct
- [ ] Easing is smooth
- [ ] Reduced motion works

### Stage 04 — Web Export
- [ ] File size is < 3KB per sprite
- [ ] Format is correct (SVG or PNG)
- [ ] Compression is maximum
- [ ] No visual artifacts

### Stage 05 — SVG
- [ ] shape-rendering="crispEdges" is set
- [ ] viewBox is correct
- [ ] No unnecessary elements
- [ ] File size is < 2KB

### Stage 06 — Integration
- [ ] Component uses universal props
- [ ] Animation is GPU-accelerated
- [ ] Accessibility is correct
- [ ] Reduced motion works

---

# FILE STRUCTURE

## Complete Asset Structure
```
public/images/creative-engine/[asset]/
  master/
    ce_[asset]_idle_master.png
    ce_[asset]_pulse_master.png
  spritesheets/
    ce_[asset]_spritesheet_v01.png
  frames/
    idle/
      ce_[asset]_idle_f0.png
      ce_[asset]_idle_f1.png
    pulse/
      ce_[asset]_pulse_f0.png
      ce_[asset]_pulse_f1.png
  ce_[asset]_idle.svg
  ce_[asset]_pulse.svg
  ce_[asset].css

src/components/creative-engine/
  [AssetName]Pixel.tsx
```

---

# VERSION CONTROL

## Version Numbering
- **v01:** Initial release
- **v02:** Bug fixes, minor adjustments
- **v03:** Major redesign
- **v1.0:** Production-ready (after Sprint 09 review)

## Version Naming
```
ce_[asset]_[variant]_v[version].[ext]
```
Examples:
- `ce_core_idle_v01.svg`
- `ce_crystal_pulse_v02.svg`

---

# MAINTENANCE

## Update Protocol
1. After each sprint, update the master asset files
2. Regenerate sprite sheets if frames change
3. Update web exports if master changes
4. Update React components if API changes
5. Run quality gates after every update

## Documentation
- Each sprint produces a PRODUCTION-REPORT.md
- The sprite atlas is updated after each sprint
- The master asset pipeline is versioned

---

# VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-19 | Initial pipeline establishment |
