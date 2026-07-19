# AMR YOUSRY CREATIVE ENGINE
## Phase 2.0 — Asset Specification Manual v1.0

**Classification:** Internal Production Blueprint
**Studio:** AMR YOUSRY Creative Studio
**Version:** 1.0 — Phase 2.0
**Status:** Production Standard
**Authority:** This document is the mandatory blueprint for every pixel asset in the Creative Engine universe. No asset may enter production without first having an approved specification in this manual.

---

# PREAMBLE

This document contains the complete production specification for every visual object inside the Creative Engine Universe. Each specification is a self-contained blueprint — detailed enough that another artist can recreate the asset without asking a single design question.

Every specification follows the identical 13-section template. Every asset is measured against the same standards. Every detail is documented, quantified, and non-negotiable.

This is not inspiration. This is instruction.

---

# SPECIFICATION TEMPLATE

Every asset specification in this document follows this exact structure:

```
SECTION 01 — Identity
SECTION 02 — Visual Design
SECTION 03 — Technical Specifications
SECTION 04 — Materials
SECTION 05 — Color Specification
SECTION 06 — Lighting Specification
SECTION 07 — Animation Package
SECTION 08 — Environmental Behavior
SECTION 09 — Placement Rules
SECTION 10 — Readability Tests
SECTION 11 — Quality Assurance
SECTION 12 — Optimization
SECTION 13 — Future Expansion
```

---

# SPRINT 01 — CREATIVE CORE

---

# ASSET 01: CREATIVE CORE (FOCAL LIGHT)

## SECTION 01 — IDENTITY

| Field | Value |
|-------|-------|
| **Official Asset Name** | Creative Core — Focal Light |
| **Asset ID** | `ce_core_focal_v01` |
| **Category** | Hero Object |
| **Region** | Creative Core (Hero Section) |
| **Purpose** | The dominant visual anchor behind the headline. Guides the eye naturally toward the primary message. |
| **Narrative Role** | The first component built. Everything else was designed around it. It is the Engine's heart. |
| **Importance Level** | Critical — the Engine cannot operate without it |
| **Visual Priority** | Maximum — the brightest ambient element in the viewport |
| **Interaction Level** | Passive — responds to nothing, ignored by everything, always present |
| **Dependencies** | None (standalone asset) |

## SECTION 02 — VISUAL DESIGN

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | Elliptical radial gradient. Soft, feathered edges. No hard boundaries. Reads as a "glow behind content." |
| **Primary Shapes** | Single ellipse (900×600px at native). No secondary shapes. |
| **Secondary Shapes** | None. The Focal Light is a single, monolithic element. |
| **Design Language** | Minimal Pixel Brutalism — a field of concentrated energy. Not a physical object. Not a shape. A presence. |
| **Visual Weight** | Heaviest ambient element in the viewport. Draws the eye through luminance, not size. |
| **Recognizable Features** | Warm orange/amber color. Soft elliptical shape. Breathing animation (32s cycle). Centered behind headline. |
| **Readable From Distance** | Yes — the Focal Light is visible at any viewport size. At mobile widths, it scales proportionally. |
| **Negative Space** | The Focal Light IS negative space — it is the light that makes the surrounding darkness meaningful. |
| **Brand Consistency** | Warm orange = the Engine's primary energy color. The Focal Light is the purest expression of this color. |

## SECTION 03 — TECHNICAL SPECIFICATIONS

| Property | Value |
|----------|-------|
| **Native Canvas Size** | 900 × 600px (CSS, not pixel art) |
| **Visible Size** | Full ellipse, centered in viewport |
| **Render Scale** | N/A — CSS radial gradient, not pixel art |
| **Safe Padding** | N/A — extends beyond viewport edges |
| **Origin Point** | Center of viewport |
| **Pivot Point** | Center of viewport |
| **Anchor Position** | `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)` |
| **Grid Alignment** | Centered on viewport (no pixel grid alignment required) |
| **Pixel Density** | Standard density (1x) — this is a CSS gradient, not pixel art |
| **Bounding Box** | 900 × 600px ellipse |
| **Sprite Sheet Organization** | N/A — single-frame CSS element |
| **Export Format** | N/A — CSS radial-gradient property |

**CSS Specification:**
```css
background: radial-gradient(ellipse 900px 600px, rgba(251, 146, 60, 0.04) 0%, transparent 70%);
```

## SECTION 04 — MATERIALS

| Property | Specification |
|----------|--------------|
| **Primary Material** | Energy |
| **Secondary Material** | None |
| **Surface Texture** | Smooth gradient — no texture, no grain, no noise |
| **Metal Type** | N/A — this is pure energy, not a physical object |
| **Crystal Type** | N/A |
| **Energy Type** | Concentrated creative energy — the Engine's primary output |
| **Transparency** | 96% transparent at peak (opacity: 0.04) |
| **Reflection Level** | None — energy does not reflect, it emits |
| **Wear Level** | None — energy does not age |
| **Edge Treatment** | Feathered gradient — soft, continuous falloff from center to transparent |
| **Material Interaction with Light** | The Focal Light IS the light source. It does not interact with light — it creates it. |

## SECTION 05 — COLOR SPECIFICATION

| Property | Value |
|----------|-------|
| **Allowed Colors** | Warm Orange (#FB923C) only |
| **Primary Color** | Warm Orange (#FB923C) at 0.04 opacity |
| **Secondary Color** | None |
| **Accent Color** | None |
| **Glow Color** | Same as primary — the entire element IS glow |
| **Shadow Color** | N/A — energy has no shadows |
| **Highlight Color** | N/A — the element is the highlight |
| **Forbidden Colors** | All non-Warm-Orange colors. Cyan is forbidden on this asset. |
| **Contrast Rules** | Must be visible against #0D0A1A background. Minimum perceived contrast: 2:1. |
| **Color Hierarchy** | Single-color element. No hierarchy needed. |

## SECTION 06 — LIGHTING SPECIFICATION

| Property | Specification |
|----------|--------------|
| **Primary Light Direction** | Omnidirectional — light radiates from center outward |
| **Secondary Light** | None |
| **Ambient Light** | The Focal Light IS the ambient light for the Hero section |
| **Glow Intensity** | 0.04 peak opacity — extremely subtle, almost subliminal |
| **Glow Animation** | Breathing: opacity oscillates 0.8→1.0→0.8 over 32s cycle |
| **Shadow Intensity** | None — energy does not cast shadows |
| **Highlight Intensity** | N/A — the element is the highlight |
| **Light Emission** | Continuous — always emitting, never off |
| **Reflection Rules** | None — energy does not reflect |
| **Lighting Consistency** | The Focal Light must be the brightest ambient element in the Hero section at all times |

## SECTION 07 — ANIMATION PACKAGE

| Animation | Purpose | Frames | Duration | FPS | Loop | Cooldown | Trigger | Motion Intensity | Priority |
|-----------|---------|--------|----------|-----|------|----------|---------|-----------------|----------|
| **Focal Breath** | Living heartbeat of the Engine | 1 (CSS) | 32s cycle | N/A | Seamless ping-pong | None | Always active | Level 2 (Drifting) | 1 (Highest) |

**Focal Breath — Detailed Specification:**
- **Scale oscillation:** 1.0 → 1.02 → 1.0 (2% size change)
- **Opacity oscillation:** 0.8 → 1.0 → 0.8 (20% opacity change)
- **Easing:** ease-in-out (smooth, predictable)
- **Property:** CSS `transform: scale()` and `opacity`
- **Reduced motion:** Disabled — element appears static at scale 1.0, opacity 0.9

## SECTION 08 — ENVIRONMENTAL BEHAVIOR

| Question | Answer |
|----------|--------|
| **How does it behave?** | The Focal Light breathes continuously. It never stops. It never moves position. It never changes color. It is the Engine's heartbeat. |
| **How often does it move?** | Continuous breathing animation (32s cycle). No positional movement. |
| **How does it react to nearby systems?** | It does not react to anything. It is the source, not the receiver. Other elements react to it. |
| **What activates it?** | Nothing activates it. It is always active. |
| **What deactivates it?** | Nothing deactivates it. It runs as long as the Engine runs. |
| **Can it communicate with other objects?** | It communicates through its light — other elements (headline, CTAs) position themselves relative to it. |
| **Can it emit energy?** | Yes — it IS energy emission. Its entire existence is energy output. |
| **Can it receive energy?** | No — it is the source, not the receiver. |

## SECTION 09 — PLACEMENT RULES

| Property | Value |
|----------|-------|
| **Allowed Regions** | Creative Core (Hero Section) only |
| **Preferred Position** | Centered behind the headline. Vertically at approximately 40% from viewport top. |
| **Minimum Spacing** | N/A — overlaps with headline (intentional) |
| **Maximum Spacing** | N/A — fixed position |
| **Relationship to Focal Elements** | The Focal Light IS the focal element. The headline positions itself within the Focal Light's glow. |
| **Depth Layer** | L2 (Background Ambient) |
| **Parallax Participation** | No — fixed position, no scroll movement |
| **Visibility Priority** | Maximum — always visible, never occluded |

## SECTION 10 — READABILITY TESTS

| Test | Criterion | Method |
|------|-----------|--------|
| **Silhouette Test** | N/A — gradient has no silhouette | N/A |
| **Distance Test** | Visible at arm's length on mobile | View on 375px viewport |
| **Scale Test** | Proportional at all viewport sizes | Test 320px → 2560px |
| **Background Test** | Visible against #0D0A1A | Place on dark background |
| **Motion Test** | Breathing is smooth at 60fps | Profile in Chrome DevTools |
| **Glow Test** | Glow is subtle, not overpowering | Compare against headline legibility |
| **Contrast Test** | Minimum 2:1 perceived contrast | Use contrast checker |
| **Brand Recognition Test** | Reads as "warm energy source" | Survey 5 people |
| **Pixel Perfection Test** | N/A — CSS gradient, not pixel art | N/A |

## SECTION 11 — QUALITY ASSURANCE

| Category | Criterion | Pass/Fail |
|----------|-----------|-----------|
| **Visual Quality** | Gradient is smooth, no banding | |
| **Pixel Quality** | N/A — CSS gradient | |
| **Material Quality** | Reads as pure energy | |
| **Lighting** | Brightest ambient in Hero section | |
| **Animation** | Breathing is smooth, 32s cycle | |
| **Performance** | No GPU strain, simple gradient | |
| **Readability** | Does not interfere with headline legibility | |
| **Consistency** | Matches Visual Concept Document Section 04 | |
| **Optimization** | Single CSS property, minimal cost | |
| **Production Readiness** | All specifications documented | |

## SECTION 12 — OPTIMIZATION

| Property | Value |
|----------|-------|
| **Memory Budget** | < 1 KB (single CSS property) |
| **Atlas Placement** | N/A — not a sprite |
| **Reuse Opportunities** | None — unique asset |
| **Animation Optimization** | CSS animation on `opacity` and `transform: scale()` — GPU-accelerated |
| **Reduced-Motion Fallback** | Static: `transform: scale(1.0); opacity: 0.9` |
| **GPU Considerations** | Minimal — single gradient, CSS animation |
| **Compression Rules** | N/A — CSS, not image |

## SECTION 13 — FUTURE EXPANSION

| Upgrade | Description |
|---------|-------------|
| **Alternative Variants** | None planned — the Focal Light is unique |
| **Rare Variants** | N/A |
| **Seasonal Variants** | N/A |
| **Interactive Variants** | Possible: intensity increase on cursor proximity |
| **Destroyed State** | Reserved — Engine shutdown scenario |
| **Enhanced State** | Reserved — Engine at full power scenario |

---

# SPRINT 02 — MEMORY CRYSTAL

---

# ASSET 02: MEMORY CRYSTAL

## SECTION 01 — IDENTITY

| Field | Value |
|-------|-------|
| **Official Asset Name** | Memory Crystal |
| **Asset ID** | `ce_crystal_idle_v01` |
| **Category** | Environmental Object |
| **Region** | Memory District (About Section) |
| **Purpose** | Stores compressed records of creative decisions. Each crystal holds a lesson, a pattern, or a successful approach. |
| **Narrative Role** | The Engine's memory banks. Every project, every decision, every lesson is preserved here. |
| **Importance Level** | High — the Engine builds on itself through accumulated memory |
| **Visual Priority** | Medium — visible but not dominant |
| **Interaction Level** | Passive — glows softly, responds to nothing |
| **Dependencies** | Sprint 01 (palette system, lighting rules) |

## SECTION 02 — VISUAL DESIGN

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | A diamond/rhombus shape — a crystal with two pointed ends (top and bottom) and angled facets. Reads as "precious, stored, valuable." |
| **Primary Shapes** | Diamond (rhombus) — 12px wide × 16px tall at native |
| **Secondary Shapes** | Internal facet lines — two diagonal lines dividing the crystal into 4 triangular facets |
| **Design Language** | Geometric precision — sharp edges, clean facets, no organic curves. A digital crystal. |
| **Visual Weight** | Medium — noticeable but not overpowering. Balanced against text content. |
| **Recognizable Features** | Diamond shape. Purple glow on facets. Cyan highlight on top point. Dark indigo body. |
| **Readable From Distance** | Yes — the diamond silhouette is distinct at 50% scale |
| **Negative Space** | 1px transparent padding on all edges. Internal facets create visual breathing room. |
| **Brand Consistency** | Deep Purple = secondary energy color. Crystal = stored memory, preserved knowledge. |

## SECTION 03 — TECHNICAL SPECIFICATIONS

| Property | Value |
|----------|-------|
| **Native Canvas Size** | 16 × 16px (including 1px safe padding) |
| **Visible Content Size** | 14 × 14px |
| **Render Scale** | 3× default (48 × 48px display) |
| **Safe Padding** | 1px on all edges |
| **Origin Point** | (8, 8) — center of canvas |
| **Pivot Point** | (8, 8) — center of diamond |
| **Anchor Position** | `transform-origin: center center` |
| **Grid Alignment** | Pixel grid (2px base units) |
| **Pixel Density** | 2px base pixel size |
| **Bounding Box** | 14 × 14px content area |
| **Sprite Sheet Organization** | Idle: 4 frames horizontal. Pulse: 6 frames horizontal. |
| **Export Format** | PNG-24 with alpha channel |

**Pixel Layout (Idle Frame 0):**
```
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ▲  ·  ·  ·  ▲  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ▲  ■  ▲  ·  ▲  ■  ▲  ·  ·  ·  ·  ·
     ·  ·  ·  ▲  ■  ■  ■  ▲  ■  ■  ■  ▲  ·  ·  ·  ·
     ·  ·  ▲  ■  ■  ■  ■  ■  ■  ■  ■  ■  ▲  ·  ·  ·
     ·  ▲  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ▲  ·  ·
     ·  ·  ▲  ■  ■  ■  ■  ■  ■  ■  ■  ■  ▲  ·  ·  ·
     ·  ·  ·  ▲  ■  ■  ■  ■  ■  ■  ■  ▲  ·  ·  ·  ·
     ·  ·  ·  ·  ▲  ■  ■  ■  ■  ■  ▲  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ▲  ■  ■  ■  ▲  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ▲  ■  ▲  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ▼  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
```
*▲ = highlight, ■ = body, ▼ = shadow, · = transparent*

## SECTION 04 — MATERIALS

| Property | Specification |
|----------|--------------|
| **Primary Material** | Energy — the crystal is a compressed energy storage device |
| **Secondary Material** | Structure — the crystal has solid, defined facets |
| **Surface Texture** | Faceted — each triangular face is a flat color region |
| **Metal Type** | N/A — not metallic |
| **Crystal Type** | Digital memory crystal — stores information as energy patterns |
| **Energy Type** | Deep Purple (#6D28D9) — the Engine's secondary energy color |
| **Transparency** | Fully opaque (crystal body). 30% opacity (glow border). |
| **Reflection Level** | Minimal — 1px highlight on upper facet |
| **Wear Level** | None — crystals do not degrade |
| **Edge Treatment** | Sharp pixel edges — no anti-aliasing, no smoothing |
| **Material Interaction with Light** | Crystal facets catch light on upper surfaces. Lower surfaces are in shadow. Internal glow emanates from the core. |

## SECTION 05 — COLOR SPECIFICATION

| Property | Value |
|----------|-------|
| **Allowed Colors** | Deep Purple (#6D28D9), Light Purple (#A78BFA), Dark Indigo (#1E1B4B), Electric Cyan (#22D3EE) |
| **Primary Color** | Deep Purple (#6D28D9) — crystal body (70% of pixels) |
| **Secondary Color** | Dark Indigo (#1E1B4B) — crystal shadow facets (15% of pixels) |
| **Accent Color** | Electric Cyan (#22D3EE) — top point highlight (2px max) |
| **Glow Color** | Light Purple (#A78BFA) — 1px glow border at 0.3 opacity |
| **Shadow Color** | Dark Indigo (#1E1B4B) — lower facets |
| **Highlight Color** | Light Purple (#A78BFA) — upper facets |
| **Forbidden Colors** | Warm Orange, White, Slate, any color not in the 4-color palette |
| **Contrast Rules** | Must be visible against #1E1B4B (About section background). Minimum 2.5:1 contrast. |
| **Color Hierarchy** | Deep Purple (dominant) → Dark Indigo (secondary) → Light Purple (accent) → Electric Cyan (detail) |

## SECTION 06 — LIGHTING SPECIFICATION

| Property | Specification |
|----------|--------------|
| **Primary Light Direction** | Upper-left (45°) — consistent with universal lighting system |
| **Secondary Light** | Subtle rim light from lower-right — Deep Purple at 30% intensity |
| **Ambient Light** | Warm Orange ambient at 15% — fills shadows slightly |
| **Glow Intensity** | 0.3 opacity — visible but not overpowering |
| **Glow Animation** | Level 1 breathing: opacity oscillates 0.2→0.5→0.2 over 4s cycle |
| **Shadow Intensity** | 1px shadow on lower facets — Dark Indigo |
| **Highlight Intensity** | 1-2px highlight on upper facets — Light Purple |
| **Light Emission** | Yes — the crystal emits a soft purple glow from its core |
| **Reflection Rules** | Upper facets reflect primary light. Lower facets are in shadow. |
| **Lighting Consistency** | All crystals in the Memory District must use identical lighting direction and intensity |

## SECTION 07 — ANIMATION PACKAGE

| Animation | Purpose | Frames | Duration | FPS | Loop | Cooldown | Trigger | Motion Intensity | Priority |
|-----------|---------|--------|----------|-----|------|----------|---------|-----------------|----------|
| **Idle** | Resting state — soft breathing glow | 4 | 1200ms | ~3 | Seamless ping-pong | None | Visible | Level 1 (Breathing) | 3 |
| **Pulse** | Rare energy spike — the crystal processes a memory | 6 | 900ms | ~7 | Play once | 10s | Random rare | Level 3 (Revealing) | 5 |
| **Activate** | Scroll intersection — crystal comes into view | 4 | 600ms | ~7 | Play once | None | Scroll intersection | Level 3 (Revealing) | 2 |

**Idle — Detailed Specification:**
- Frame 0: Base state — full crystal, standard glow
- Frame 1: Glow intensifies — opacity 0.3 → 0.5
- Frame 2: Glow peak — opacity 0.5, slight scale 1.0 → 1.01
- Frame 3: Glow fades — opacity 0.5 → 0.3 (returns to Frame 0)
- Easing: ease-in-out
- Reduced motion: Static at Frame 0

**Pulse — Detailed Specification:**
- Frame 0: Base state
- Frame 1: Core brightens — Electric Cyan pixel appears at center
- Frame 2: Glow expands — 2px glow border
- Frame 3: Glow peak — full brightness
- Frame 4: Glow contracts — returning to base
- Frame 5: Base state (same as Frame 0)
- Easing: cubic-bezier(0.22, 1, 0.36, 1)
- Reduced motion: Skipped — element remains in idle state

## SECTION 08 — ENVIRONMENTAL BEHAVIOR

| Question | Answer |
|----------|--------|
| **How does it behave?** | The Memory Crystal breathes softly. It pulses rarely (every 10-30s). It glows continuously at low intensity. |
| **How often does it move?** | Breathing animation: 4s cycle. Pulse animation: 10-30s random interval. |
| **How does it react to nearby systems?** | The crystal does not react to nearby objects. It is self-contained. However, it may pulse when the About section is actively being viewed (scroll intersection). |
| **What activates it?** | Scroll intersection (enters viewport). Rare random trigger (pulse). |
| **What deactivates it?** | Scroll exit (leaves viewport). Animation pauses. |
| **Can it communicate with other objects?** | No — crystals are independent storage units. They do not communicate with each other or with other objects. |
| **Can it emit energy?** | Yes — soft purple glow at 0.3 opacity. |
| **Can it receive energy?** | In narrative: yes, from the Creative Core. In implementation: no — no energy transfer animation. |

## SECTION 09 — PLACEMENT RULES

| Property | Value |
|----------|-------|
| **Allowed Regions** | Memory District (About Section) only |
| **Preferred Position** | Scattered within the About section — near skill summaries, bio highlights, or experience markers |
| **Minimum Spacing** | 32px from other crystals. 24px from text content. |
| **Maximum Spacing** | No maximum — crystals can be spread across the section |
| **Relationship to Focal Elements** | Crystals are decorative accents, not focal elements. They never compete with text. |
| **Depth Layer** | L4 (Foreground Ambient) — close to the viewer |
| **Parallax Participation** | No — fixed position within the section |
| **Visibility Priority** | Medium — visible when present, ignorable when not |

## SECTION 10 — READABILITY TESTS

| Test | Criterion | Method |
|------|-----------|--------|
| **Silhouette Test** | Diamond shape is distinct at 50% scale | Reduce to 24×24px display |
| **Distance Test** | Recognizable as a crystal at arm's length | View on mobile at arm's length |
| **Scale Test** | Maintains detail at 1×, 2×, 3×, 4× | Test all integer scales |
| **Background Test** | Visible against #1E1B4B | Place on About section background |
| **Motion Test** | Breathing is smooth, pulse is satisfying | Profile at 60fps |
| **Glow Test** | Glow is visible but not overpowering | Compare against text legibility |
| **Contrast Test** | Minimum 2.5:1 against background | Use contrast checker |
| **Brand Recognition Test** | Reads as "stored memory" | Survey 5 people |
| **Pixel Perfection Test** | All pixels aligned, no stray pixels | Zoom to 400% in browser |

## SECTION 11 — QUALITY ASSURANCE

| Category | Criterion | Pass/Fail |
|----------|-----------|-----------|
| **Visual Quality** | Crystal is recognizable, facets are clear | |
| **Pixel Quality** | All pixels intentional, no stray pixels | |
| **Material Quality** | Reads as crystalline energy storage | |
| **Lighting** | Consistent upper-left lighting | |
| **Animation** | Idle breathes, pulse is satisfying | |
| **Performance** | < 3 KB file size | |
| **Readability** | Distinct silhouette, clear purpose | |
| **Consistency** | Matches Visual Concept Document | |
| **Optimization** | Minimum palette, minimum frames | |
| **Production Readiness** | All specifications documented | |

## SECTION 12 — OPTIMIZATION

| Property | Value |
|----------|-------|
| **Memory Budget** | < 3 KB per animation set |
| **Atlas Placement** | Can share atlas with other Environmental objects in Memory District |
| **Reuse Opportunities** | Same sprite can be placed multiple times in the About section |
| **Animation Optimization** | 4-frame idle loop, 6-frame pulse — minimal GPU cost |
| **Reduced-Motion Fallback** | Static at Frame 0 of idle animation |
| **GPU Considerations** | Minimal — simple pixel art, CSS transform animation |
| **Compression Rules** | PNG-24 with alpha. Lossless only. |

## SECTION 13 — FUTURE EXPANSION

| Upgrade | Description |
|---------|-------------|
| **Alternative Variants** | Small crystal (8×8px), Large crystal (20×20px), Cluster (3 crystals grouped) |
| **Rare Variants** | Golden crystal (Warm Gold palette) — represents a breakthrough memory |
| **Seasonal Variants** | N/A |
| **Interactive Variants** | Hover: crystal brightens, displays memory content tooltip |
| **Destroyed State** | Reserved — crystal shatters, fragments scatter |
| **Enhanced State** | Reserved — crystal fully charged, emits strong glow |

---

# SPRINT 03 — MAINTENANCE DRONE

---

# ASSET 03: MAINTENANCE DRONE (PIXEL DRONE)

## SECTION 01 — IDENTITY

| Field | Value |
|-------|-------|
| **Official Asset Name** | Maintenance Drone |
| **Asset ID** | `ce_drone_idle_v01` |
| **Category** | Hero Object |
| **Region** | Creative Core (Boot Sequence) |
| **Purpose** | A small autonomous unit that monitors the Creative Core's status. The Engine's mascot and emotional anchor. |
| **Narrative Role** | The first entity created by the Engine. A simple monitoring tool that evolved into a companion. |
| **Importance Level** | Medium — decorative but emotionally essential |
| **Visual Priority** | High during boot, Low after boot completes |
| **Interaction Level** | Passive — bobs and tilts, responds to nothing |
| **Dependencies** | Sprint 01 (palette system), existing CSS drone (reference implementation) |

## SECTION 02 — VISUAL DESIGN

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | A small robotic character — rectangular head, thin antenna, compact body, two tiny wings. Reads as "cute, helpful, mechanical." |
| **Primary Shapes** | Rectangle (head: 8×6px), Rectangle (body: 6×8px), Line (antenna: 2×4px) |
| **Secondary Shapes** | Circle (eye: 2×2px), Rectangles (wings: 4×3px each) |
| **Design Language** | Pixel minimalism — maximum character from minimum pixels. Every pixel defines personality. |
| **Visual Weight** | Light — the drone is small and delicate. It floats, it does not anchor. |
| **Recognizable Features** | Single cyan eye. Purple core in body. Thin antenna. Two flapping wings. Bobs up and down. |
| **Readable From Distance** | Yes — the single eye and bobbing motion make it identifiable at 50% scale |
| **Negative Space** | 1px gaps between head and body, between body and wings. Antenna extends above head. |
| **Brand Consistency** | Deep Purple body = Engine's energy color. Electric Cyan eye = interactive/alive indicator. |

## SECTION 03 — TECHNICAL SPECIFICATIONS

| Property | Value |
|----------|-------|
| **Native Canvas Size** | 24 × 28px (including 1px safe padding) |
| **Visible Content Size** | 22 × 26px |
| **Render Scale** | 3× default (72 × 84px display) |
| **Safe Padding** | 1px on all edges |
| **Origin Point** | (12, 14) — center of canvas |
| **Pivot Point** | (12, 14) — center of body |
| **Anchor Position** | `transform-origin: center center` |
| **Grid Alignment** | Pixel grid (2px base units) |
| **Pixel Density** | 2px base pixel size |
| **Bounding Box** | 22 × 26px content area |
| **Sprite Sheet Organization** | Idle: 6 frames. Activate: 8 frames. Glow: 4 frames. |
| **Export Format** | PNG-24 with alpha channel |

**Pixel Layout (Idle Frame 0):**
```
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ▲  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ▲  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ■  ■  ■  ■  ■  ■  ■  ■  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ■  ■  ■  ■  ■  ■  ■  ■  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ■  ■  ●  ■  ■  ■  ■  ■  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ■  ■  ■  ■  ■  ■  ■  ■  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ■  ■  ■  ■  ■  ■  ■  ■  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ■  ■  ■  ■  ■  ■  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ■  ■  ■  ◆  ■  ■  ■  ■  ■  ■  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ■  ■  ■  ■  ■  ■  ■  ■  ■  ■  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ■  ■  ■  ■  ■  ■  ■  ■  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ■  ■  ■  ■  ■  ■  ■  ■  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ■  ■  ■  ■  ■  ■  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
     ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
```
*▲ = antenna, ■ = body/head, ● = eye, ◆ = core*

## SECTION 04 — MATERIALS

| Property | Specification |
|----------|--------------|
| **Primary Material** | Structure — the drone has a solid, mechanical body |
| **Secondary Material** | Energy — the core and eye emit light |
| **Surface Texture** | Flat pixel blocks — no texture, no grain |
| **Metal Type** | Dark Indigo body panels — matte, non-reflective |
| **Crystal Type** | N/A |
| **Energy Type** | Deep Purple (core) and Electric Cyan (eye) — the drone's life force |
| **Transparency** | Fully opaque body. Eye and core at full opacity. Wings semi-transparent (0.6). |
| **Reflection Level** | Minimal — 1px highlight on head top |
| **Wear Level** | None — the drone is maintained by the Engine |
| **Edge Treatment** | Sharp pixel edges — no anti-aliasing |
| **Material Interaction with Light** | Body reflects primary light (upper-left). Eye and core emit their own light. |

## SECTION 05 — COLOR SPECIFICATION

| Property | Value |
|----------|-------|
| **Allowed Colors** | Dark Indigo (#1E1B4B), Deep Purple (#6D28D9), Electric Cyan (#22D3EE), White (#F8FAFC) |
| **Primary Color** | Dark Indigo (#1E1B4B) — body and head (60% of pixels) |
| **Secondary Color** | Deep Purple (#6D28D9) — core in body (15% of pixels) |
| **Accent Color** | Electric Cyan (#22D3EE) — eye (2×2px, 4 pixels total) |
| **Glow Color** | Electric Cyan (#22D3EE) — eye glow at 0.4 opacity, 1px border |
| **Shadow Color** | Dark Indigo (#1E1B4B) — lower body edges |
| **Highlight Color** | White (#F8FAFC) — 1px highlight on head top |
| **Forbidden Colors** | Warm Orange, Slate, any color not in the 4-color palette |
| **Contrast Rules** | Must be visible against #0D0A1A (boot background). Minimum 3:1 contrast. |
| **Color Hierarchy** | Dark Indigo (dominant) → Deep Purple (secondary) → Electric Cyan (accent) → White (detail) |

## SECTION 06 — LIGHTING SPECIFICATION

| Property | Specification |
|----------|--------------|
| **Primary Light Direction** | Upper-left (45°) — consistent with universal lighting system |
| **Secondary Light** | Subtle rim from lower-right — Deep Purple at 20% |
| **Ambient Light** | Warm Orange at 10% — fills shadows slightly |
| **Glow Intensity** | Eye: 0.4 opacity. Core: 0.3 opacity. |
| **Glow Animation** | Eye: static glow. Core: Level 1 breathing (4s cycle). |
| **Shadow Intensity** | 1px shadow on lower body — Dark Indigo |
| **Highlight Intensity** | 1px highlight on head top — White |
| **Light Emission** | Yes — eye and core emit light |
| **Reflection Rules** | Upper surfaces reflect primary light. Lower surfaces are in shadow. |
| **Lighting Consistency** | All drone instances must use identical lighting direction |

## SECTION 07 — ANIMATION PACKAGE

| Animation | Purpose | Frames | Duration | FPS | Loop | Cooldown | Trigger | Motion Intensity | Priority |
|-----------|---------|--------|----------|-----|------|----------|---------|-----------------|----------|
| **Idle** | Resting state — gentle bob and tilt | 6 | 1200ms | 5 | Seamless ping-pong | None | Visible | Level 1 (Breathing) | 1 |
| **Activate** | Boot sequence — drone appears | 8 | 800ms | 10 | Play once | None | Boot start | Level 3 (Revealing) | 2 |
| **Glow** | Antenna pulse — cyan glow intensifies | 4 | 1600ms | ~3 | Seamless loop | None | After boot | Level 1 (Breathing) | 3 |

**Idle — Detailed Specification:**
- Frame 0: Neutral position — center (0, 0)
- Frame 1: Bob up — (0, -2px), tilt +1.5°
- Frame 2: Bob up peak — (0, -2px), tilt +1.5°
- Frame 3: Neutral — (0, 0), tilt 0°
- Frame 4: Bob down — (0, +2px), tilt -1.5°
- Frame 5: Bob down peak — (0, +2px), tilt -1.5°
- Easing: ease-in-out
- Wings: flap independently at 0.8s intervals (4-frame sub-cycle)
- Reduced motion: Static at Frame 0

**Activate — Detailed Specification:**
- Frame 0: Off-screen (below viewport)
- Frame 1: Rising — (0, +12px)
- Frame 2: Rising — (0, +6px)
- Frame 3: Center — (0, 0)
- Frame 4: Bob up — (0, -2px)
- Frame 5: Bob down — (0, +2px)
- Frame 6: Settle — (0, 0)
- Frame 7: Idle ready — (0, 0), eye glows
- Easing: cubic-bezier(0.22, 1, 0.36, 1)
- Reduced motion: Jump directly to Frame 7

## SECTION 08 — ENVIRONMENTAL BEHAVIOR

| Question | Answer |
|----------|--------|
| **How does it behave?** | The drone bobs gently up and down (sine wave). Tilts slightly. Wings flap at 0.8s intervals. Antenna pulses with cyan glow. |
| **How often does it move?** | Continuous idle animation (1.2s cycle). Wing flap: 0.8s sub-cycle. |
| **How does it react to nearby systems?** | The drone monitors the Energy Cells during boot. After boot, it monitors the Creative Core. It does not physically interact with other objects. |
| **What activates it?** | Boot sequence start. Scroll intersection (if visible after boot). |
| **What deactivates it?** | Boot sequence complete. Scroll exit. |
| **Can it communicate with other objects?** | Narratively: yes, it monitors the Core. In implementation: no direct communication. |
| **Can it emit energy?** | Yes — eye glow and core glow. |
| **Can it receive energy?** | Yes — from the Creative Core's ambient field (narrative). |

## SECTION 09 — PLACEMENT RULES

| Property | Value |
|----------|-------|
| **Allowed Regions** | Creative Core (Boot Sequence, Hero Section) |
| **Preferred Position** | Above the energy cells during boot. Below the headline after boot. |
| **Minimum Spacing** | 16px from energy cells. 24px from headline. |
| **Maximum Spacing** | N/A — fixed relative position |
| **Relationship to Focal Elements** | The drone is secondary to the headline. It never competes for attention. |
| **Depth Layer** | L5 (Content) — in front of ambient, behind interactive |
| **Parallax Participation** | No — fixed position |
| **Visibility Priority** | High during boot, Medium after boot |

## SECTION 10 — READABILITY TESTS

| Test | Criterion | Method |
|------|-----------|--------|
| **Silhouette Test** | Robot shape with antenna and wings is distinct | Reduce to 50% scale |
| **Distance Test** | Single cyan eye is recognizable at arm's length | View on mobile |
| **Scale Test** | Maintains character at 1×, 2×, 3×, 4× | Test all integer scales |
| **Background Test** | Visible against #0D0A1A | Place on boot background |
| **Motion Test** | Bob is smooth, tilt is subtle | Profile at 60fps |
| **Glow Test** | Eye glow is visible but not overpowering | Compare against boot text |
| **Contrast Test** | Minimum 3:1 against background | Use contrast checker |
| **Brand Recognition Test** | Reads as "cute mechanical helper" | Survey 5 people |
| **Pixel Perfection Test** | All pixels intentional, character intact | Zoom to 400% |

## SECTION 11 — QUALITY ASSURANCE

| Category | Criterion | Pass/Fail |
|----------|-----------|-----------|
| **Visual Quality** | Drone is charming, character is clear | |
| **Pixel Quality** | All pixels intentional, no stray pixels | |
| **Material Quality** | Reads as mechanical + energy | |
| **Lighting** | Consistent upper-left lighting | |
| **Animation** | Bob is smooth, wing flap is satisfying | |
| **Performance** | < 5 KB per animation set | |
| **Readability** | Distinct silhouette, single eye is focal | |
| **Consistency** | Matches existing CSS drone reference | |
| **Optimization** | Minimum palette, minimum frames | |
| **Production Readiness** | All specifications documented | |

## SECTION 12 — OPTIMIZATION

| Property | Value |
|----------|-------|
| **Memory Budget** | < 5 KB per animation set |
| **Atlas Placement** | Can share atlas with boot sequence UI elements |
| **Reuse Opportunities** | Same sprite used in boot and hero sections |
| **Animation Optimization** | 6-frame idle, 8-frame activate — minimal cost |
| **Reduced-Motion Fallback** | Static at Frame 0 of idle |
| **GPU Considerations** | Minimal — simple pixel art, CSS transform animation |
| **Compression Rules** | PNG-24 with alpha. Lossless only. |

## SECTION 13 — FUTURE EXPANSION

| Upgrade | Description |
|---------|-------------|
| **Alternative Variants** | Large drone (32×36px) for hero section feature |
| **Rare Variants** | Golden drone (Warm Gold palette) — represents a special achievement |
| **Seasonal Variants** | N/A |
| **Interactive Variants** | Hover: drone tilts toward cursor. Click: drone does a flip. |
| **Destroyed State** | Reserved — drone falls, wings fold, eye dims |
| **Enhanced State** | Reserved — drone glows brighter, wings extend, antenna pulses rapidly |

---

# SPRINT 04 — SIGNAL BEACON

---

# ASSET 04: SIGNAL BEACON

## SECTION 01 — IDENTITY

| Field | Value |
|-------|-------|
| **Official Asset Name** | Signal Beacon |
| **Asset ID** | `ce_beacon_idle_v01` |
| **Category** | Environmental Object |
| **Region** | Communication Tower (Contact Section) |
| **Purpose** | Transmits signals between the Engine and the outside world. The Contact section's signature object. |
| **Narrative Role** | The Engine's antenna — always listening, always ready to respond. |
| **Importance Level** | Medium — the Contact section's visual anchor |
| **Visual Priority** | Medium — visible but not dominant |
| **Interaction Level** | Passive — pulses on scroll intersection |
| **Dependencies** | Sprint 01 (palette system, lighting rules) |

## SECTION 02 — VISUAL DESIGN

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | A vertical antenna/tower with a glowing top. Reads as "transmission, communication, signal." |
| **Primary Shapes** | Rectangle (base: 4×6px), Line (mast: 2×8px), Circle (beacon: 4×4px) |
| **Secondary Shapes** | Signal waves — 2-3 curved lines emanating from the top |
| **Design Language** | Minimal pixel architecture — clean lines, clear function, no decoration |
| **Visual Weight** | Light — slender, vertical, reaching upward |
| **Recognizable Features** | Glowing cyan top. Thin mast. Signal waves. Reads as "broadcasting." |
| **Readable From Distance** | Yes — the vertical mast + glowing top is distinct |
| **Negative Space** | 1px between mast and signal waves. Generous space around the beacon. |
| **Brand Consistency** | Electric Cyan = interactive/communication color. Tower = the Engine's voice. |

## SECTION 03 — TECHNICAL SPECIFICATIONS

| Property | Value |
|----------|-------|
| **Native Canvas Size** | 12 × 16px (including 1px safe padding) |
| **Visible Content Size** | 10 × 14px |
| **Render Scale** | 3× default (30 × 42px display) |
| **Safe Padding** | 1px on all edges |
| **Origin Point** | (6, 8) — center of canvas |
| **Pivot Point** | (6, 8) — center of beacon head |
| **Anchor Position** | `transform-origin: center bottom` (grounded) |
| **Grid Alignment** | Pixel grid (2px base units) |
| **Pixel Density** | 2px base pixel size |
| **Bounding Box** | 10 × 14px content area |
| **Sprite Sheet Organization** | Idle: 2 frames. Pulse: 6 frames. |
| **Export Format** | PNG-24 with alpha channel |

## SECTION 04 — MATERIALS

| Property | Specification |
|----------|--------------|
| **Primary Material** | Structure — the mast and base are solid |
| **Secondary Material** | Energy — the beacon head emits light |
| **Surface Texture** | Flat pixel blocks — no texture |
| **Metal Type** | Dark Indigo mast — matte, non-reflective |
| **Crystal Type** | N/A |
| **Energy Type** | Electric Cyan — the beacon's signal energy |
| **Transparency** | Fully opaque body. Signal waves at 0.4 opacity. |
| **Reflection Level** | Minimal — 1px highlight on beacon head |
| **Wear Level** | None |
| **Edge Treatment** | Sharp pixel edges |
| **Material Interaction with Light** | Mast reflects primary light. Beacon head emits Cyan light. Signal waves are pure energy. |

## SECTION 05 — COLOR SPECIFICATION

| Property | Value |
|----------|-------|
| **Allowed Colors** | Dark Indigo (#1E1B4B), Electric Cyan (#22D3EE), Light Cyan (#67E8F9), White (#F8FAFC) |
| **Primary Color** | Dark Indigo (#1E1B4B) — mast and base (50% of pixels) |
| **Secondary Color** | Electric Cyan (#22D3EE) — beacon head and signal waves (30% of pixels) |
| **Accent Color** | Light Cyan (#67E8F9) — beacon glow highlight (2px max) |
| **Glow Color** | Electric Cyan (#22D3EE) — beacon glow at 0.4 opacity |
| **Shadow Color** | Dark Indigo (#1E1B4B) — lower mast |
| **Highlight Color** | White (#F8FAFC) — 1px on beacon head top |
| **Forbidden Colors** | Warm Orange, Deep Purple, Slate |
| **Contrast Rules** | Must be visible against #1E1B4B (Contact section background). Minimum 2.5:1. |
| **Color Hierarchy** | Dark Indigo (dominant) → Electric Cyan (secondary) → Light Cyan (accent) → White (detail) |

## SECTION 06 — LIGHTING SPECIFICATION

| Property | Specification |
|----------|--------------|
| **Primary Light Direction** | Upper-left (45°) — consistent with universal lighting system |
| **Secondary Light** | Beacon head emits Cyan light omnidirectionally |
| **Ambient Light** | Warm Orange at 10% — fills shadows |
| **Glow Intensity** | 0.4 opacity — visible but not overpowering |
| **Glow Animation** | Idle: static. Pulse: opacity oscillates 0.3→0.7→0.3 over 6 frames. |
| **Shadow Intensity** | 1px on lower mast — Dark Indigo |
| **Highlight Intensity** | 1px on beacon head — White |
| **Light Emission** | Yes — beacon head emits Cyan light |
| **Reflection Rules** | Mast reflects primary light. Beacon head is the light source. |
| **Lighting Consistency** | All beacons must use identical lighting direction |

## SECTION 07 — ANIMATION PACKAGE

| Animation | Purpose | Frames | Duration | FPS | Loop | Cooldown | Trigger | Motion Intensity | Priority |
|-----------|---------|--------|----------|-----|------|----------|---------|-----------------|----------|
| **Idle** | Resting state — subtle beacon glow | 2 | 2000ms | 1 | Seamless loop | None | Visible | Level 1 (Breathing) | 3 |
| **Pulse** | Signal transmission — beacon broadcasts | 6 | 900ms | ~7 | Play once | 8s | Scroll intersection | Level 3 (Revealing) | 2 |

**Idle — Detailed Specification:**
- Frame 0: Beacon glow at 0.3 opacity
- Frame 1: Beacon glow at 0.5 opacity
- Easing: ease-in-out
- Reduced motion: Static at Frame 0

**Pulse — Detailed Specification:**
- Frame 0: Base state — beacon glow 0.3
- Frame 1: Beacon brightens — glow 0.5, first signal wave appears (1px, 0.4 opacity)
- Frame 2: Signal expands — first wave at 0.3 opacity, second wave appears (1px, 0.4 opacity)
- Frame 3: Peak — both waves at full extent, beacon at 0.7 opacity
- Frame 4: Fade — waves at 0.2 opacity, beacon dimming
- Frame 5: Base state — waves disappear, beacon at 0.3 opacity
- Easing: cubic-bezier(0.22, 1, 0.36, 1)
- Reduced motion: Skipped — remains in idle

## SECTION 08 — ENVIRONMENTAL BEHAVIOR

| Question | Answer |
|----------|--------|
| **How does it behave?** | The beacon glows softly at idle. It pulses when the Contact section is viewed. Signal waves emanate outward during pulse. |
| **How often does it move?** | Idle: 2s breathing. Pulse: 8s cooldown between pulses. |
| **How does it react to nearby systems?** | Activated by scroll intersection. Does not react to other objects. |
| **What activates it?** | Scroll intersection (Contact section enters viewport). |
| **What deactivates it?** | Scroll exit. Animation pauses. |
| **Can it communicate with other objects?** | Narratively: yes, it transmits to the outside world. In implementation: no. |
| **Can it emit energy?** | Yes — signal waves and beacon glow. |
| **Can it receive energy?** | Yes — from the Power Generator (narrative). |

## SECTION 09 — PLACEMENT RULES

| Property | Value |
|----------|-------|
| **Allowed Regions** | Communication Tower (Contact Section) only |
| **Preferred Position** | Decorative accent near the contact form or contact information |
| **Minimum Spacing** | 24px from form fields. 16px from text. |
| **Maximum Spacing** | No maximum |
| **Relationship to Focal Elements** | Decorative — never competes with the contact form |
| **Depth Layer** | L4 (Foreground Ambient) |
| **Parallax Participation** | No |
| **Visibility Priority** | Medium |

## SECTION 10 — READABILITY TESTS

| Test | Criterion | Method |
|------|-----------|--------|
| **Silhouette Test** | Tower + signal waves is distinct | Reduce to 50% |
| **Distance Test** | Beacon glow is visible at arm's length | View on mobile |
| **Scale Test** | Maintains form at 1×, 2×, 3× | Test all scales |
| **Background Test** | Visible against #1E1B4B | Place on Contact background |
| **Motion Test** | Pulse is smooth, waves expand naturally | Profile at 60fps |
| **Glow Test** | Glow is visible but not overpowering | Compare against form |
| **Contrast Test** | Minimum 2.5:1 | Use contrast checker |
| **Brand Recognition Test** | Reads as "broadcasting antenna" | Survey 5 people |
| **Pixel Perfection Test** | All pixels aligned | Zoom to 400% |

## SECTION 11 — QUALITY ASSURANCE

| Category | Criterion | Pass/Fail |
|----------|-----------|-----------|
| **Visual Quality** | Beacon is recognizable, signal waves read clearly | |
| **Pixel Quality** | All pixels intentional | |
| **Material Quality** | Reads as mechanical + energy | |
| **Lighting** | Consistent upper-left + beacon emission | |
| **Animation** | Pulse is satisfying, waves expand naturally | |
| **Performance** | < 3 KB | |
| **Readability** | Distinct silhouette, clear function | |
| **Consistency** | Matches Visual Concept Document | |
| **Optimization** | Minimum palette, minimum frames | |
| **Production Readiness** | All specifications documented | |

## SECTION 12 — OPTIMIZATION

| Property | Value |
|----------|-------|
| **Memory Budget** | < 3 KB |
| **Atlas Placement** | Can share atlas with other Environmental objects |
| **Reuse Opportunities** | Same sprite for all beacon instances |
| **Animation Optimization** | 2-frame idle, 6-frame pulse |
| **Reduced-Motion Fallback** | Static at Frame 0 |
| **GPU Considerations** | Minimal |
| **Compression Rules** | PNG-24 with alpha |

## SECTION 13 — FUTURE EXPANSION

| Upgrade | Description |
|---------|-------------|
| **Alternative Variants** | Small beacon (8×10px), Large beacon (16×24px) |
| **Rare Variants** | Golden beacon — special achievement indicator |
| **Seasonal Variants** | N/A |
| **Interactive Variants** | Hover: beacon brightens, signal waves appear |
| **Destroyed State** | Reserved — beacon dark, no signal |
| **Enhanced State** | Reserved — beacon at full power, rapid signal |

---

# SPRINT 05 — ENERGY STREAM

---

# ASSET 05: ENERGY STREAM

## SECTION 01 — IDENTITY

| Field | Value |
|-------|-------|
| **Official Asset Name** | Energy Stream |
| **Asset ID** | `ce_stream_loop_v01` |
| **Category** | Environmental Object |
| **Region** | All Regions (connecting element) |
| **Purpose** | Visualizes creative energy flowing between Engine systems. The connective tissue of the universe. |
| **Narrative Role** | Energy highways — carrying creative intent from the Core to all regions. |
| **Importance Level** | Medium — the Engine's circulatory system |
| **Visual Priority** | Low — subtle, atmospheric |
| **Interaction Level** | Passive — flows continuously |
| **Dependencies** | Sprint 01 (palette system) |

## SECTION 02 — VISUAL DESIGN

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | A short horizontal line with animated energy particles flowing along it. Reads as "flow, connection, transfer." |
| **Primary Shapes** | Line (8×2px) — the stream path |
| **Secondary Shapes** | Dots (2×2px) — energy particles flowing along the path |
| **Design Language** | Minimal motion — the stream is almost invisible, discovered through movement |
| **Visual Weight** | Very light — the stream is atmospheric, not structural |
| **Recognizable Features** | Warm orange color. Flowing motion. Connects two points. |
| **Readable From Distance** | No — the stream is a micro-detail, discovered on close inspection |
| **Negative Space** | The stream IS negative space — it is the light between objects |
| **Brand Consistency** | Warm Orange = energy flow color. Stream = the Engine's lifeblood. |

## SECTION 03 — TECHNICAL SPECIFICATIONS

| Property | Value |
|----------|-------|
| **Native Canvas Size** | 8 × 4px (including 1px safe padding) |
| **Visible Content Size** | 6 × 2px |
| **Render Scale** | 3× default (18 × 6px display) |
| **Safe Padding** | 1px on all edges |
| **Origin Point** | (4, 2) — center |
| **Pivot Point** | (4, 2) — center |
| **Anchor Position** | `transform-origin: center center` |
| **Grid Alignment** | Pixel grid (2px base units) |
| **Pixel Density** | 2px base pixel size |
| **Bounding Box** | 6 × 2px content area |
| **Sprite Sheet Organization** | Loop: 8 frames horizontal |
| **Export Format** | PNG-24 with alpha channel |

## SECTION 04 — MATERIALS

| Property | Specification |
|----------|--------------|
| **Primary Material** | Energy — pure flowing energy |
| **Secondary Material** | None |
| **Surface Texture** | None — energy has no surface |
| **Metal Type** | N/A |
| **Crystal Type** | N/A |
| **Energy Type** | Warm Orange — the Engine's primary energy flow |
| **Transparency** | 70% transparent (opacity: 0.3) |
| **Reflection Level** | None — energy does not reflect |
| **Wear Level** | None |
| **Edge Treatment** | Soft — energy has no hard edges |
| **Material Interaction with Light** | The stream IS light. It does not interact with light — it is light. |

## SECTION 05 — COLOR SPECIFICATION

| Property | Value |
|----------|-------|
| **Allowed Colors** | Warm Orange (#FB923C), Deep Amber (#EA580C) |
| **Primary Color** | Warm Orange (#FB923C) — stream body (80% of pixels) |
| **Secondary Color** | Deep Amber (#EA580C) — stream particle (20% of pixels) |
| **Accent Color** | None |
| **Glow Color** | Warm Orange (#FB923C) — 1px glow at 0.3 opacity |
| **Shadow Color** | None — energy has no shadows |
| **Highlight Color** | None — energy is the highlight |
| **Forbidden Colors** | All non-Warm-Orange colors. Cyan is forbidden on this asset. |
| **Contrast Rules** | Must be visible against #0D0A1A. Minimum 2:1. |
| **Color Hierarchy** | Single-family element. Warm Orange only. |

## SECTION 06 — LIGHTING SPECIFICATION

| Property | Specification |
|----------|--------------|
| **Primary Light Direction** | Omnidirectional — energy emits in all directions |
| **Secondary Light** | None |
| **Ambient Light** | The stream IS ambient light |
| **Glow Intensity** | 0.3 opacity — subtle, atmospheric |
| **Glow Animation** | Level 2 drifting — particles move along the stream path |
| **Shadow Intensity** | None |
| **Highlight Intensity** | None — energy is the highlight |
| **Light Emission** | Continuous — always flowing |
| **Reflection Rules** | None |
| **Lighting Consistency** | All streams must use identical Warm Orange color |

## SECTION 07 — ANIMATION PACKAGE

| Animation | Purpose | Frames | Duration | FPS | Loop | Cooldown | Trigger | Motion Intensity | Priority |
|-----------|---------|--------|----------|-----|------|----------|---------|-----------------|----------|
| **Loop** | Continuous energy flow | 8 | 1200ms | ~7 | Seamless loop | None | Visible | Level 2 (Drifting) | 3 |
| **Activate** | Stream appears on scroll | 4 | 600ms | ~7 | Play once | None | Scroll intersection | Level 3 (Revealing) | 2 |

**Loop — Detailed Specification:**
- 8 frames showing energy particles flowing left to right
- Each frame: particles shift 1px right
- Frame 8 wraps to Frame 1 (seamless loop)
- Easing: linear (constant speed)
- Reduced motion: Static — stream appears as a dim line

## SECTION 08 — ENVIRONMENTAL BEHAVIOR

| Question | Answer |
|----------|--------|
| **How does it behave?** | Energy particles flow continuously from left to right along the stream path. |
| **How often does it move?** | Continuous loop (1.2s cycle). |
| **How does it react to nearby systems?** | The stream connects two objects. Energy flows from source to destination. |
| **What activates it?** | Scroll intersection. |
| **What deactivates it?** | Scroll exit. |
| **Can it communicate with other objects?** | Yes — it visually connects objects. Energy flows from one to another. |
| **Can it emit energy?** | Yes — the stream IS energy. |
| **Can it receive energy?** | Yes — from the Creative Core (narrative). |

## SECTION 09 — PLACEMENT RULES

| Property | Value |
|----------|-------|
| **Allowed Regions** | All regions (connecting element) |
| **Preferred Position** | Between two objects — connecting them visually |
| **Minimum Spacing** | 8px from connected objects |
| **Maximum Spacing** | 32px (stream length) |
| **Relationship to Focal Elements** | Never competes — always behind content |
| **Depth Layer** | L3 (Mid Ambient) |
| **Parallax Participation** | No |
| **Visibility Priority** | Low |

## SECTION 10 — READABILITY TESTS

| Test | Criterion | Method |
|------|-----------|--------|
| **Silhouette Test** | N/A — line has no silhouette | N/A |
| **Distance Test** | N/A — stream is a micro-detail | N/A |
| **Scale Test** | Maintains line at all integer scales | Test 1×-4× |
| **Background Test** | Visible against #0D0A1A | Place on dark background |
| **Motion Test** | Flow is smooth, no stutter | Profile at 60fps |
| **Glow Test** | Glow is subtle | Compare against content |
| **Contrast Test** | Minimum 2:1 | Use contrast checker |
| **Brand Recognition Test** | Reads as "energy flow" | Survey 5 people |
| **Pixel Perfection Test** | Line is clean, particles are aligned | Zoom to 400% |

## SECTION 11 — QUALITY ASSURANCE

| Category | Criterion | Pass/Fail |
|----------|-----------|-----------|
| **Visual Quality** | Stream is subtle, flow is smooth | |
| **Pixel Quality** | Line is clean, no stray pixels | |
| **Material Quality** | Reads as flowing energy | |
| **Lighting** | Consistent Warm Orange emission | |
| **Animation** | Flow is seamless, speed is constant | |
| **Performance** | < 2 KB | |
| **Readability** | Subtle but visible | |
| **Consistency** | Matches Visual Concept Document | |
| **Optimization** | Minimum palette, minimum frames | |
| **Production Readiness** | All specifications documented | |

## SECTION 12 — OPTIMIZATION

| Property | Value |
|----------|-------|
| **Memory Budget** | < 2 KB |
| **Atlas Placement** | Can share atlas with other energy objects |
| **Reuse Opportunities** | Same sprite for all stream instances |
| **Animation Optimization** | 8-frame loop — minimal cost |
| **Reduced-Motion Fallback** | Static dim line |
| **GPU Considerations** | Minimal |
| **Compression Rules** | PNG-24 with alpha |

## SECTION 13 — FUTURE EXPANSION

| Upgrade | Description |
|---------|-------------|
| **Alternative Variants** | Vertical stream, diagonal stream, curved stream |
| **Rare Variants** | Cyan stream — represents interactive energy |
| **Seasonal Variants** | N/A |
| **Interactive Variants** | Hover: stream brightens, particles speed up |
| **Destroyed State** | Reserved — stream breaks, particles scatter |
| **Enhanced State** | Reserved — stream glows brighter, particles multiply |

---

# SPRINT 06 — DATA CHIP

---

# ASSET 06: DATA CHIP

## SECTION 01 — IDENTITY

| Field | Value |
|-------|-------|
| **Official Asset Name** | Data Chip |
| **Asset ID** | `ce_chip_idle_v01` |
| **Category** | Environmental Object |
| **Region** | Knowledge Grid (Skills Section) |
| **Purpose** | Stores technical skills and capabilities. Each chip represents a tool, technique, or competency. |
| **Narrative Role** | The Engine's skill modules — interchangeable, updatable, always improving. |
| **Importance Level** | Medium — the Skills section's visual language |
| **Visual Priority** | Medium — visible but not dominant |
| **Interaction Level** | Passive — glows on scroll intersection |
| **Dependencies** | Sprint 01 (palette system) |

## SECTION 02 — VISUAL DESIGN

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | A small horizontal rectangle with a notch — reads as "memory card, data module, chip." |
| **Primary Shapes** | Rectangle (body: 10×6px) |
| **Secondary Shapes** | Rectangle (notch: 2×2px cut from bottom-left corner), Rectangle (indicator: 2×2px on top-right) |
| **Design Language** | Industrial minimal — functional, modular, interchangeable |
| **Visual Weight** | Light — small, compact, dense |
| **Recognizable Features** | Rectangular body. Notch in corner. Cyan indicator light. Reads as "data module." |
| **Readable From Distance** | At 50% scale — the notch + indicator make it distinct |
| **Negative Space** | 1px padding around indicator. Notch creates negative space in body. |
| **Brand Consistency** | Electric Cyan indicator = active/ready. Dark Indigo body = Structure material. |

## SECTION 03 — TECHNICAL SPECIFICATIONS

| Property | Value |
|----------|-------|
| **Native Canvas Size** | 12 × 8px (including 1px safe padding) |
| **Visible Content Size** | 10 × 6px |
| **Render Scale** | 3× default (30 × 18px display) |
| **Safe Padding** | 1px on all edges |
| **Origin Point** | (6, 4) — center |
| **Pivot Point** | (6, 4) — center |
| **Anchor Position** | `transform-origin: center center` |
| **Grid Alignment** | Pixel grid (2px base units) |
| **Pixel Density** | 2px base pixel size |
| **Bounding Box** | 10 × 6px content area |
| **Sprite Sheet Organization** | Idle: 2 frames. Loop: 4 frames. |
| **Export Format** | PNG-24 with alpha channel |

## SECTION 04 — MATERIALS

| Property | Specification |
|----------|--------------|
| **Primary Material** | Structure — solid, mechanical body |
| **Secondary Material** | Interface — the indicator is interactive |
| **Surface Texture** | Flat pixel blocks — no texture |
| **Metal Type** | Dark Indigo — matte, non-reflective |
| **Crystal Type** | N/A |
| **Energy Type** | Electric Cyan — indicator energy |
| **Transparency** | Fully opaque body. Indicator at full opacity. |
| **Reflection Level** | Minimal — 1px highlight on body top |
| **Wear Level** | None |
| **Edge Treatment** | Sharp pixel edges |
| **Material Interaction with Light** | Body reflects primary light. Indicator emits Cyan light. |

## SECTION 05 — COLOR SPECIFICATION

| Property | Value |
|----------|-------|
| **Allowed Colors** | Dark Indigo (#1E1B4B), Electric Cyan (#22D3EE), Light Cyan (#67E8F9) |
| **Primary Color** | Dark Indigo (#1E1B4B) — body (70% of pixels) |
| **Secondary Color** | Electric Cyan (#22D3EE) — indicator (15% of pixels) |
| **Accent Color** | Light Cyan (#67E8F9) — indicator highlight (2px max) |
| **Glow Color** | Electric Cyan (#22D3EE) — indicator glow at 0.3 opacity |
| **Shadow Color** | Dark Indigo (#1E1B4B) — body bottom edge |
| **Highlight Color** | Light Cyan (#67E8F9) — indicator center |
| **Forbidden Colors** | Warm Orange, Deep Purple, White, Slate |
| **Contrast Rules** | Must be visible against #1E1B4B. Minimum 2.5:1. |
| **Color Hierarchy** | Dark Indigo (dominant) → Electric Cyan (secondary) → Light Cyan (accent) |

## SECTION 06 — LIGHTING SPECIFICATION

| Property | Specification |
|----------|--------------|
| **Primary Light Direction** | Upper-left (45°) |
| **Secondary Light** | Indicator emits Cyan light |
| **Ambient Light** | Warm Orange at 10% |
| **Glow Intensity** | 0.3 opacity — subtle |
| **Glow Animation** | Idle: static. Loop: indicator blinks (2-frame toggle). |
| **Shadow Intensity** | 1px on body bottom — Dark Indigo |
| **Highlight Intensity** | 1px on body top — Light Cyan |
| **Light Emission** | Yes — indicator emits Cyan light |
| **Reflection Rules** | Body reflects primary light. Indicator is the light source. |
| **Lighting Consistency** | All chips must use identical lighting |

## SECTION 07 — ANIMATION PACKAGE

| Animation | Purpose | Frames | Duration | FPS | Loop | Cooldown | Trigger | Motion Intensity | Priority |
|-----------|---------|--------|----------|-----|------|----------|---------|-----------------|----------|
| **Idle** | Resting state — indicator on | 2 | 2000ms | 1 | Seamless loop | None | Visible | Level 1 (Breathing) | 3 |
| **Loop** | Active processing — indicator blinks | 4 | 1000ms | 4 | Seamless loop | None | Scroll intersection | Level 1 (Breathing) | 2 |

**Idle — Detailed Specification:**
- Frame 0: Indicator at 0.4 opacity
- Frame 1: Indicator at 0.6 opacity
- Easing: ease-in-out
- Reduced motion: Static at Frame 0

**Loop — Detailed Specification:**
- Frame 0: Indicator at 0.3 opacity
- Frame 1: Indicator at 0.6 opacity
- Frame 2: Indicator at 0.6 opacity
- Frame 3: Indicator at 0.3 opacity
- Easing: ease-in-out
- Reduced motion: Static at Frame 0

## SECTION 08 — ENVIRONMENTAL BEHAVIOR

| Question | Answer |
|----------|--------|
| **How does it behave?** | The chip's indicator blinks gently. It sits in a grid with other chips. |
| **How often does it move?** | Idle: 2s breathing. Loop: 1s blink cycle. |
| **How does it react to nearby systems?** | Chips do not interact with each other. They are independent modules. |
| **What activates it?** | Scroll intersection (Skills section enters viewport). |
| **What deactivates it?** | Scroll exit. |
| **Can it communicate with other objects?** | No — chips are independent modules. |
| **Can it emit energy?** | Yes — indicator glow. |
| **Can it receive energy?** | Yes — from the Knowledge Grid (narrative). |

## SECTION 09 — PLACEMENT RULES

| Property | Value |
|----------|-------|
| **Allowed Regions** | Knowledge Grid (Skills Section) only |
| **Preferred Position** | Grid layout — rows of chips, each representing a skill |
| **Minimum Spacing** | 8px between chips |
| **Maximum Spacing** | 16px between chips |
| **Relationship to Focal Elements** | Decorative — never competes with skill labels |
| **Depth Layer** | L4 (Foreground Ambient) |
| **Parallax Participation** | No |
| **Visibility Priority** | Medium |

## SECTION 10 — READABILITY TESTS

| Test | Criterion | Method |
|------|-----------|--------|
| **Silhouette Test** | Rectangle + notch is distinct | Reduce to 50% |
| **Distance Test** | Indicator blink is visible | View on mobile |
| **Scale Test** | Maintains form at 1×, 2×, 3× | Test all scales |
| **Background Test** | Visible against #1E1B4B | Place on Skills background |
| **Motion Test** | Blink is smooth | Profile at 60fps |
| **Glow Test** | Indicator glow is subtle | Compare against text |
| **Contrast Test** | Minimum 2.5:1 | Use contrast checker |
| **Brand Recognition Test** | Reads as "data module" | Survey 5 people |
| **Pixel Perfection Test** | All pixels aligned | Zoom to 400% |

## SECTION 11 — QUALITY ASSURANCE

| Category | Criterion | Pass/Fail |
|----------|-----------|-----------|
| **Visual Quality** | Chip is recognizable, indicator reads clearly | |
| **Pixel Quality** | All pixels intentional | |
| **Material Quality** | Reads as mechanical + electronic | |
| **Lighting** | Consistent upper-left + indicator emission | |
| **Animation** | Blink is subtle, not distracting | |
| **Performance** | < 1 KB | |
| **Readability** | Distinct shape, clear function | |
| **Consistency** | Matches Visual Concept Document | |
| **Optimization** | Minimum palette, minimum frames | |
| **Production Readiness** | All specifications documented | |

## SECTION 12 — OPTIMIZATION

| Property | Value |
|----------|-------|
| **Memory Budget** | < 1 KB |
| **Atlas Placement** | Can share atlas with other Knowledge Grid objects |
| **Reuse Opportunities** | Same sprite for all chip instances |
| **Animation Optimization** | 2-frame idle, 4-frame loop |
| **Reduced-Motion Fallback** | Static at Frame 0 |
| **GPU Considerations** | Minimal |
| **Compression Rules** | PNG-24 with alpha |

## SECTION 13 — FUTURE EXPANSION

| Upgrade | Description |
|---------|-------------|
| **Alternative Variants** | Vertical chip (6×10px), Mini chip (6×4px) |
| **Rare Variants** | Gold chip — represents a mastered skill |
| **Seasonal Variants** | N/A |
| **Interactive Variants** | Hover: chip brightens, displays skill name |
| **Destroyed State** | Reserved — chip dark, indicator off |
| **Enhanced State** | Reserved — chip glows, indicator rapid blink |

---

# SPRINT 07 — PORTAL SYSTEM

---

# ASSET 07: PORTAL SYSTEM

## SECTION 01 — IDENTITY

| Field | Value |
|-------|-------|
| **Official Asset Name** | Portal System |
| **Asset ID** | `ce_portal_idle_v01` |
| **Category** | Environmental Object |
| **Region** | All Regions (navigation transitions) |
| **Purpose** | Visualizes transitions between Engine regions. The doorway between sections. |
| **Narrative Role** | The Engine's internal transit system — energy flows through portals to reach different regions. |
| **Importance Level** | Low — transition effect, not a persistent object |
| **Visual Priority** | Low — brief appearance during navigation |
| **Interaction Level** | Active — triggered by navigation |
| **Dependencies** | Sprint 01 (palette system), Sprint 05 (energy streams) |

## SECTION 02 — VISUAL DESIGN

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | A circular ring of energy that opens and closes. Reads as "doorway, transition, passage." |
| **Primary Shapes** | Circle (12×12px ring) — the portal frame |
| **Secondary Shapes** | Inner glow (8×8px) — the portal's energy field |
| **Design Language** | Energy architecture — a temporary structure made of light |
| **Visual Weight** | Medium — noticeable during transition, gone after |
| **Recognizable Features** | Circular ring. Deep Purple frame. Electric Cyan inner glow. Opens/closes animation. |
| **Readable From Distance** | Yes — the circular shape is universal |
| **Negative Space** | The center of the ring is transparent — the "doorway" |
| **Brand Consistency** | Deep Purple = energy frame. Electric Cyan = energy field. Portal = transition. |

## SECTION 03 — TECHNICAL SPECIFICATIONS

| Property | Value |
|----------|-------|
| **Native Canvas Size** | 16 × 16px (including 1px safe padding) |
| **Visible Content Size** | 14 × 14px |
| **Render Scale** | 3× default (42 × 42px display) |
| **Safe Padding** | 1px on all edges |
| **Origin Point** | (8, 8) — center |
| **Pivot Point** | (8, 8) — center |
| **Anchor Position** | `transform-origin: center center` |
| **Grid Alignment** | Pixel grid (2px base units) |
| **Pixel Density** | 2px base pixel size |
| **Bounding Box** | 14 × 14px content area |
| **Sprite Sheet Organization** | Idle: 2 frames. Activate: 8 frames. |
| **Export Format** | PNG-24 with alpha channel |

## SECTION 04 — MATERIALS

| Property | Specification |
|----------|--------------|
| **Primary Material** | Energy — pure energy structure |
| **Secondary Material** | None |
| **Surface Texture** | None — energy has no surface |
| **Metal Type** | N/A |
| **Crystal Type** | N/A |
| **Energy Type** | Deep Purple (frame) + Electric Cyan (field) |
| **Transparency** | Frame at 0.6 opacity. Field at 0.3 opacity. Center transparent. |
| **Reflection Level** | None — energy does not reflect |
| **Wear Level** | None |
| **Edge Treatment** | Soft — energy has no hard edges |
| **Material Interaction with Light** | The portal IS light. It does not interact with light. |

## SECTION 05 — COLOR SPECIFICATION

| Property | Value |
|----------|-------|
| **Allowed Colors** | Deep Purple (#6D28D9), Electric Cyan (#22D3EE), Light Cyan (#67E8F9) |
| **Primary Color** | Deep Purple (#6D28D9) — portal ring (50% of pixels) |
| **Secondary Color** | Electric Cyan (#22D3EE) — inner field (30% of pixels) |
| **Accent Color** | Light Cyan (#67E8F9) — ring highlight (2px max) |
| **Glow Color** | Electric Cyan (#22D3EE) — field glow at 0.4 opacity |
| **Shadow Color** | None — energy has no shadows |
| **Highlight Color** | Light Cyan (#67E8F9) — ring edge highlight |
| **Forbidden Colors** | Warm Orange, White, Slate |
| **Contrast Rules** | Must be visible against #0D0A1A. Minimum 3:1. |
| **Color Hierarchy** | Deep Purple (frame) → Electric Cyan (field) → Light Cyan (highlight) |

## SECTION 06 — LIGHTING SPECIFICATION

| Property | Specification |
|----------|--------------|
| **Primary Light Direction** | Omnidirectional — portal emits in all directions |
| **Secondary Light** | None |
| **Ambient Light** | The portal IS ambient light |
| **Glow Intensity** | 0.4 opacity — noticeable during transition |
| **Glow Animation** | Activate: opens from center, full glow, closes to center |
| **Shadow Intensity** | None |
| **Highlight Intensity** | None — energy is the highlight |
| **Light Emission** | Continuous during activation |
| **Reflection Rules** | None |
| **Lighting Consistency** | All portals must use identical colors and glow intensity |

## SECTION 07 — ANIMATION PACKAGE

| Animation | Purpose | Frames | Duration | FPS | Loop | Cooldown | Trigger | Motion Intensity | Priority |
|-----------|---------|--------|----------|-----|------|----------|---------|-----------------|----------|
| **Idle** | Resting state — ring visible, field dim | 2 | 2000ms | 1 | Seamless loop | None | After activation | Level 1 (Breathing) | 3 |
| **Activate** | Portal opens — ring expands, field brightens | 8 | 800ms | 10 | Play once | None | Navigation | Level 3 (Revealing) | 1 |

**Activate — Detailed Specification:**
- Frame 0: Closed — 2px ring, no field
- Frame 1: Opening — 4px ring, field appears (0.1 opacity)
- Frame 2: Expanding — 6px ring, field brightens (0.2 opacity)
- Frame 3: Mid-open — 8px ring, field at 0.3 opacity
- Frame 4: Open — 10px ring, field at 0.4 opacity
- Frame 5: Full — 12px ring, field at 0.5 opacity, maximum glow
- Frame 6: Holding — same as Frame 5 (brief hold)
- Frame 7: Closing — ring contracts, field dims
- Easing: cubic-bezier(0.22, 1, 0.36, 1)
- Reduced motion: Jump directly to Frame 5 (fully open)

## SECTION 08 — ENVIRONMENTAL BEHAVIOR

| Question | Answer |
|----------|--------|
| **How does it behave?** | The portal opens during navigation, holds briefly, then closes. |
| **How often does it move?** | Only during navigation events. Not continuous. |
| **How does it react to nearby systems?** | Triggered by navigation. Does not react to other objects. |
| **What activates it?** | Navigation between sections. |
| **What deactivates it?** | Navigation complete. Portal closes. |
| **Can it communicate with other objects?** | Yes — it connects regions. Energy flows through it. |
| **Can it emit energy?** | Yes — during activation, it emits Purple/Cyan energy. |
| **Can it receive energy?** | Yes — from the Creative Core (narrative). |

## SECTION 09 — PLACEMENT RULES

| Property | Value |
|----------|-------|
| **Allowed Regions** | All regions (transition effect) |
| **Preferred Position** | Centered in viewport during transition |
| **Minimum Spacing** | N/A — temporary, centered |
| **Maximum Spacing** | N/A |
| **Relationship to Focal Elements** | Temporary — overlays everything during transition |
| **Depth Layer** | L6 (Interactive) — frontmost during activation |
| **Parallax Participation** | No |
| **Visibility Priority** | High during transition, zero after |

## SECTION 10 — READABILITY TESTS

| Test | Criterion | Method |
|------|-----------|--------|
| **Silhouette Test** | Circular ring is universal | Reduce to 50% |
| **Distance Test** | Ring is visible at arm's length | View on mobile |
| **Scale Test** | Maintains circle at all scales | Test 1×-4× |
| **Background Test** | Visible against #0D0A1A | Place on dark background |
| **Motion Test** | Open/close is smooth | Profile at 60fps |
| **Glow Test** | Glow is noticeable but not blinding | Compare against content |
| **Contrast Test** | Minimum 3:1 | Use contrast checker |
| **Brand Recognition Test** | Reads as "portal/doorway" | Survey 5 people |
| **Pixel Perfection Test** | Ring is clean, field is smooth | Zoom to 400% |

## SECTION 11 — QUALITY ASSURANCE

| Category | Criterion | Pass/Fail |
|----------|-----------|-----------|
| **Visual Quality** | Portal is recognizable, open/close is satisfying | |
| **Pixel Quality** | Ring is clean, no stray pixels | |
| **Material Quality** | Reads as energy structure | |
| **Lighting** | Consistent omnidirectional emission | |
| **Animation** | Open/close is smooth, timing is satisfying | |
| **Performance** | < 3 KB | |
| **Readability** | Circular shape is universal | |
| **Consistency** | Matches Visual Concept Document | |
| **Optimization** | Minimum palette, minimum frames | |
| **Production Readiness** | All specifications documented | |

## SECTION 12 — OPTIMIZATION

| Property | Value |
|----------|-------|
| **Memory Budget** | < 3 KB |
| **Atlas Placement** | Standalone — unique asset |
| **Reuse Opportunities** | Same sprite for all portal instances |
| **Animation Optimization** | 2-frame idle, 8-frame activate |
| **Reduced-Motion Fallback** | Static ring at Frame 0 |
| **GPU Considerations** | Minimal |
| **Compression Rules** | PNG-24 with alpha |

## SECTION 13 — FUTURE EXPANSION

| Upgrade | Description |
|---------|-------------|
| **Alternative Variants** | Small portal (8×8px), Large portal (24×24px) |
| **Rare Variants** | Gold portal — special transition effect |
| **Seasonal Variants** | N/A |
| **Interactive Variants** | Hover: portal pulses, inviting click |
| **Destroyed State** | Reserved — portal shatters, fragments scatter |
| **Enhanced State** | Reserved — portal at full power, energy streams through |

---

# SPRINT 08 — AMBIENT PROPS

---

# ASSET 08: AMBIENT PROPS (COLLECTION)

## SECTION 01 — IDENTITY

| Field | Value |
|-------|-------|
| **Official Asset Name** | Ambient Props Collection |
| **Asset ID** | `ce_corner_idle_v01`, `ce_divider_idle_v01`, `ce_accent_idle_v01` |
| **Category** | Decorative Elements |
| **Region** | All Regions (decorative accents) |
| **Purpose** | Non-functional pixel details that add character and charm. The Engine's personality. |
| **Narrative Role** | Architectural details — the small things that make the Engine feel handcrafted. |
| **Importance Level** | Low — noticed on close inspection only |
| **Visual Priority** | Low — behind content, below ambient |
| **Interaction Level** | Passive — static or Level 1 breathing |
| **Dependencies** | Sprint 01 (palette system) |

## SECTION 02 — VISUAL DESIGN

### Asset 08A: Corner Accent

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | An L-shaped corner bracket — 2px lines forming a right angle |
| **Primary Shapes** | Lines (2×8px horizontal, 2×8px vertical) |
| **Design Language** | Minimal bracket — frames content corners |
| **Recognizable Features** | L-shape. Electric Cyan. Subtle. |

### Asset 08B: Divider Ornament

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | A short horizontal line with a center dot — reads as "section separator" |
| **Primary Shapes** | Line (12×1px), Dot (2×2px center) |
| **Design Language** | Minimal punctuation — marks section boundaries |
| **Recognizable Features** | Line + dot. Electric Cyan. Subtle. |

### Asset 08C: Accent Dot

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | A single 2×2px square — the smallest decorative element |
| **Primary Shapes** | Square (2×2px) |
| **Design Language** | Atomic pixel — the building block of the pixel art system |
| **Recognizable Features** | Single dot. Electric Cyan or Deep Purple. |

## SECTION 03 — TECHNICAL SPECIFICATIONS

| Property | Corner Accent | Divider | Accent Dot |
|----------|--------------|---------|------------|
| **Native Canvas** | 8 × 8px | 16 × 4px | 4 × 4px |
| **Content Size** | 6 × 6px | 14 × 2px | 2 × 2px |
| **Render Scale** | 3× | 3× | 3× |
| **Safe Padding** | 1px | 1px | 1px |
| **Pixel Density** | 2px base | 2px base | 2px base |
| **Export Format** | PNG-24 | PNG-24 | PNG-24 |

## SECTION 04 — MATERIALS

| Property | Specification |
|----------|--------------|
| **Primary Material** | Structure — decorative architectural elements |
| **Surface Texture** | Flat pixel blocks |
| **Edge Treatment** | Sharp pixel edges |

## SECTION 05 — COLOR SPECIFICATION

| Property | Value |
|----------|-------|
| **Allowed Colors** | Electric Cyan (#22D3EE), Deep Purple (#6D28D9), Dark Indigo (#1E1B4B) |
| **Primary Color** | Electric Cyan (#22D3EE) — all props |
| **Opacity** | 0.3-0.5 — subtle, not dominant |

## SECTION 06 — LIGHTING SPECIFICATION

| Property | Specification |
|----------|--------------|
| **Primary Light Direction** | N/A — decorative elements do not have lighting |
| **Glow Intensity** | None — props do not glow |
| **Shadow Intensity** | None — props do not have shadows |

## SECTION 07 — ANIMATION PACKAGE

| Animation | Purpose | Frames | Duration | FPS | Loop | Cooldown | Trigger | Motion Intensity | Priority |
|-----------|---------|--------|----------|-----|------|----------|---------|-----------------|----------|
| **Idle** | Static — no animation | 1 | 0ms | N/A | None | N/A | Always | Level 0 (Static) | 6 |

## SECTION 08 — ENVIRONMENTAL BEHAVIOR

| Question | Answer |
|----------|--------|
| **How does it behave?** | Static. No movement. No glow. No interaction. |
| **How often does it move?** | Never. |
| **How does it react to nearby systems?** | It does not react to anything. |
| **What activates it?** | Nothing. |
| **What deactivates it?** | Nothing. |
| **Can it communicate with other objects?** | No. |
| **Can it emit energy?** | No. |
| **Can it receive energy?** | No. |

## SECTION 09 — PLACEMENT RULES

| Property | Value |
|----------|-------|
| **Allowed Regions** | All regions (decorative) |
| **Preferred Position** | Corners, dividers, between content blocks |
| **Minimum Spacing** | 8px from content |
| **Maximum Spacing** | No maximum |
| **Relationship to Focal Elements** | Never competes — always subordinate |
| **Depth Layer** | L1 (Base) — behind everything |
| **Parallax Participation** | No |
| **Visibility Priority** | Lowest |

## SECTION 10 — READABILITY TESTS

| Test | Criterion | Method |
|------|-----------|--------|
| **Silhouette Test** | Each shape is distinct | Visual inspection |
| **Distance Test** | Props are subliminal — not meant to be noticed | N/A |
| **Scale Test** | Maintains form at all scales | Test 1×-4× |
| **Background Test** | Visible against #0D0A1A | Place on dark background |
| **Motion Test** | N/A — static | N/A |
| **Glow Test** | N/A — no glow | N/A |
| **Contrast Test** | Minimum 2:1 at 0.3 opacity | Use contrast checker |
| **Brand Recognition Test** | Props are subliminal, not meant for recognition | N/A |
| **Pixel Perfection Test** | All pixels aligned | Zoom to 400% |

## SECTION 11 — QUALITY ASSURANCE

| Category | Criterion | Pass/Fail |
|----------|-----------|-----------|
| **Visual Quality** | Each shape is clean and intentional | |
| **Pixel Quality** | All pixels aligned | |
| **Material Quality** | Reads as architectural detail | |
| **Lighting** | N/A — no lighting | |
| **Animation** | N/A — static | |
| **Performance** | < 1 KB each | |
| **Readability** | Subliminal — not meant to be noticed | |
| **Consistency** | Matches Visual Concept Document | |
| **Optimization** | Minimum size, minimum palette | |
| **Production Readiness** | All specifications documented | |

## SECTION 12 — OPTIMIZATION

| Property | Value |
|----------|-------|
| **Memory Budget** | < 1 KB each |
| **Atlas Placement** | All three can share a single atlas |
| **Reuse Opportunities** | Same sprites across all regions |
| **Animation Optimization** | Static — zero cost |
| **Reduced-Motion Fallback** | N/A — no animation |
| **GPU Considerations** | Zero — static elements |
| **Compression Rules** | PNG-24 with alpha |

## SECTION 13 — FUTURE EXPANSION

| Upgrade | Description |
|---------|-------------|
| **Alternative Variants** | Different corner styles, different divider styles |
| **Rare Variants** | Golden accents — special decoration |
| **Seasonal Variants** | N/A |
| **Interactive Variants** | Hover: accent brightens briefly |
| **Destroyed State** | N/A |
| **Enhanced State** | N/A |

---

# SPRINT 09 — BACKGROUND TILES

---

# ASSET 09: BACKGROUND TILES (COLLECTION)

## SECTION 01 — IDENTITY

| Field | Value |
|-------|-------|
| **Official Asset Name** | Background Tiles Collection |
| **Asset ID** | `ce_grid_tile_v01`, `ce_scanline_tile_v01`, `ce_pattern_tile_v01` |
| **Category** | Background Objects |
| **Region** | All Regions (background textures) |
| **Purpose** | Structural textures that establish the Engine's digital architecture. The wallpaper of the digital world. |
| **Narrative Role** | The Engine's underlying grid — always present, barely visible, fundamentally structural. |
| **Importance Level** | Low — architectural texture, not content |
| **Visual Priority** | Lowest — behind everything |
| **Interaction Level** | Passive — static or Level 1 breathing |
| **Dependencies** | Sprint 01 (palette system) |

## SECTION 02 — VISUAL DESIGN

### Asset 09A: Grid Tile

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | A 32×32px grid of thin cyan lines — reads as "digital architecture, graph paper" |
| **Primary Shapes** | Lines (1px wide, 32px long) — horizontal and vertical |
| **Design Language** | Architectural foundation — the invisible grid made visible |
| **Recognizable Features** | Cyan grid lines. 32px spacing. Breathing opacity. |

### Asset 09B: Scanline Tile

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | Horizontal lines — 2px transparent, 2px black — reads as "CRT texture, retro display" |
| **Primary Shapes** | Lines (2px tall, full width) — alternating transparent and black |
| **Design Language** | Retro artifact — the Engine's original display system |
| **Recognizable Features** | Horizontal stripes. CRT aesthetic. Static. |

### Asset 09C: Pattern Tile

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | A subtle repeating pattern — dots or crosses at regular intervals |
| **Primary Shapes** | Dots (2×2px) at 8px intervals |
| **Design Language** | Background texture — barely visible, adds depth |
| **Recognizable Features** | Dot pattern. Electric Cyan at very low opacity. |

## SECTION 03 — TECHNICAL SPECIFICATIONS

| Property | Grid Tile | Scanline Tile | Pattern Tile |
|----------|-----------|---------------|--------------|
| **Native Canvas** | 32 × 32px | 4 × 4px | 16 × 16px |
| **Content Size** | 32 × 32px | 4 × 4px | 16 × 16px |
| **Render Scale** | 1× (CSS tiling) | 1× (CSS tiling) | 1× (CSS tiling) |
| **Safe Padding** | None (tileable) | None (tileable) | None (tileable) |
| **Pixel Density** | 1px lines | 1px lines | 2px dots |
| **Export Format** | PNG-24 | PNG-24 | PNG-24 |
| **Tileable** | Yes (seamless) | Yes (seamless) | Yes (seamless) |

## SECTION 04 — MATERIALS

| Property | Specification |
|----------|--------------|
| **Primary Material** | Energy — the grid is a visualization of the Engine's energy field |
| **Surface Texture** | Grid lines / scanline stripes / dot pattern |
| **Edge Treatment** | Sharp pixel lines |

## SECTION 05 — COLOR SPECIFICATION

| Property | Grid Tile | Scanline Tile | Pattern Tile |
|----------|-----------|---------------|--------------|
| **Primary Color** | Electric Cyan (#22D3EE) | Black (#000000) | Electric Cyan (#22D3EE) |
| **Opacity** | 0.03 | 0.04 | 0.02 |
| **Forbidden Colors** | All non-Cyan | All non-Black | All non-Cyan |

## SECTION 06 — LIGHTING SPECIFICATION

| Property | Specification |
|----------|--------------|
| **Primary Light Direction** | N/A — background textures do not have lighting |
| **Glow Intensity** | None |
| **Shadow Intensity** | None |

## SECTION 07 — ANIMATION PACKAGE

| Animation | Purpose | Frames | Duration | FPS | Loop | Cooldown | Trigger | Motion Intensity | Priority |
|-----------|---------|--------|----------|-----|------|----------|---------|-----------------|----------|
| **Grid Idle** | Breathing opacity | 1 (CSS) | 4s cycle | N/A | Seamless | None | Always | Level 1 (Breathing) | 6 |
| **Scanline Idle** | Static | 1 | 0ms | N/A | None | N/A | Always | Level 0 (Static) | 6 |
| **Pattern Idle** | Static | 1 | 0ms | N/A | None | N/A | Always | Level 0 (Static) | 6 |

**Grid Breathing — Detailed Specification:**
- Opacity oscillates: 0.03 × 0.4 → 0.03 × 0.7 → 0.03 × 0.4
- Effective range: 0.012 → 0.021 → 0.012
- Duration: 4s cycle
- Easing: ease-in-out
- Reduced motion: Static at opacity 0.015

## SECTION 08 — ENVIRONMENTAL BEHAVIOR

| Question | Answer |
|----------|--------|
| **How does it behave?** | Grid breathes (4s cycle). Scanlines and patterns are static. |
| **How often does it move?** | Grid: continuous breathing. Others: never. |
| **How does it react to nearby systems?** | It does not react. It is the foundation. |
| **What activates it?** | Nothing — always present. |
| **What deactivates it?** | Nothing — always present. |
| **Can it communicate with other objects?** | No. |
| **Can it emit energy?** | No — it reflects the Engine's ambient energy. |
| **Can it receive energy?** | No. |

## SECTION 09 — PLACEMENT RULES

| Property | Value |
|----------|-------|
| **Allowed Regions** | All regions (background) |
| **Preferred Position** | Full viewport coverage — tiled behind all content |
| **Minimum Spacing** | N/A — covers entire viewport |
| **Maximum Spacing** | N/A |
| **Relationship to Focal Elements** | Behind everything — never competes |
| **Depth Layer** | L1 (Base) — the foundation |
| **Parallax Participation** | No |
| **Visibility Priority** | Lowest |

## SECTION 10 — READABILITY TESTS

| Test | Criterion | Method |
|------|-----------|--------|
| **Silhouette Test** | N/A — tiles are patterns | N/A |
| **Distance Test** | Tiles are subliminal | N/A |
| **Scale Test** | Tiles tile seamlessly at all viewport sizes | Test 320px → 2560px |
| **Background Test** | Tiles are visible against #0D0A1A | Place on dark background |
| **Motion Test** | Grid breathing is smooth | Profile at 60fps |
| **Glow Test** | N/A — no glow | N/A |
| **Contrast Test** | Minimum 1.5:1 at target opacity | Use contrast checker |
| **Brand Recognition Test** | Tiles are subliminal | N/A |
| **Pixel Perfection Test** | Tiles are seamless, no visible seams | Tile test |

## SECTION 11 — QUALITY ASSURANCE

| Category | Criterion | Pass/Fail |
|----------|-----------|-----------|
| **Visual Quality** | Tiles are seamless, no visible seams | |
| **Pixel Quality** | Lines are clean, no anti-aliasing | |
| **Material Quality** | Reads as digital architecture | |
| **Lighting** | N/A | |
| **Animation** | Grid breathing is smooth | |
| **Performance** | < 1 KB each | |
| **Readability** | Subliminal — not meant to be noticed | |
| **Consistency** | Matches Visual Concept Document | |
| **Optimization** | Minimum size, CSS tiling | |
| **Production Readiness** | All specifications documented | |

## SECTION 12 — OPTIMIZATION

| Property | Value |
|----------|-------|
| **Memory Budget** | < 1 KB each |
| **Atlas Placement** | Standalone tiles — not atlased |
| **Reuse Opportunities** | Same tiles across all regions |
| **Animation Optimization** | CSS opacity animation (grid), static (others) |
| **Reduced-Motion Fallback** | Static at base opacity |
| **GPU Considerations** | Minimal — CSS tiling is efficient |
| **Compression Rules** | PNG-24 with alpha |

## SECTION 13 — FUTURE EXPANSION

| Upgrade | Description |
|---------|-------------|
| **Alternative Variants** | Diagonal grid, hexagonal grid, dot grid |
| **Rare Variants** | N/A |
| **Seasonal Variants** | N/A |
| **Interactive Variants** | N/A — background elements are not interactive |
| **Destroyed State** | N/A |
| **Enhanced State** | N/A |

---

# SPRINT 10 — INTEGRATION ASSETS

---

# ASSET 10: ENERGY CELLS (BOOT SEQUENCE)

## SECTION 01 — IDENTITY

| Field | Value |
|-------|-------|
| **Official Asset Name** | Energy Cells |
| **Asset ID** | `ce_cells_loop_v01` |
| **Category** | FX Object |
| **Region** | Creative Core (Boot Sequence) |
| **Purpose** | Visual progress indicators during boot. Each cell represents a unit of system initialization. |
| **Narrative Role** | Originally diagnostic tools, they became the standard way to display system status. |
| **Importance Level** | High during boot, irrelevant after |
| **Visual Priority** | High during boot sequence |
| **Interaction Level** | Passive — fills sequentially on boot |
| **Dependencies** | Sprint 01 (palette system), Sprint 03 (drone monitors cells) |

## SECTION 02 — VISUAL DESIGN

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | Ten small rectangles arranged horizontally — reads as "progress bar, loading, system init" |
| **Primary Shapes** | Rectangles (8×4px each) — 10 cells in a row |
| **Secondary Shapes** | Glow borders on active cells |
| **Design Language** | Retro system diagnostic — the Engine's heartbeat monitor |
| **Visual Weight** | Light — small, dense, functional |
| **Recognizable Features** | 10 cells. Sequential fill. Cyan glow on active cells. Reads as "loading progress." |
| **Readable From Distance** | Yes — the horizontal bar is universal |
| **Negative Space** | 2px between cells. 1px padding around each cell. |
| **Brand Consistency** | Electric Cyan = active/ready. Dark Indigo = inactive/standby. |

## SECTION 03 — TECHNICAL SPECIFICATIONS

| Property | Value |
|----------|-------|
| **Native Canvas Size** | 100 × 8px (10 cells × 8px width + 2px gaps) |
| **Visible Content Size** | 96 × 8px |
| **Render Scale** | 3× default (288 × 24px display) |
| **Safe Padding** | 2px between cells |
| **Origin Point** | (50, 4) — center of bar |
| **Pivot Point** | (50, 4) — center |
| **Anchor Position** | `transform-origin: center center` |
| **Grid Alignment** | Pixel grid (2px base units) |
| **Pixel Density** | 2px base pixel size |
| **Bounding Box** | 96 × 8px content area |
| **Sprite Sheet Organization** | 10 frames (one per cell fill state) |
| **Export Format** | PNG-24 with alpha channel |

## SECTION 04 — MATERIALS

| Property | Specification |
|----------|--------------|
| **Primary Material** | Structure (inactive cells) + Energy (active cells) |
| **Surface Texture** | Flat pixel blocks |
| **Edge Treatment** | Sharp pixel edges on cells, soft glow on active cells |

## SECTION 05 — COLOR SPECIFICATION

| Property | Inactive Cell | Active Cell |
|----------|--------------|-------------|
| **Primary Color** | Dark Indigo (#1E1B4B) | Electric Cyan (#22D3EE) |
| **Border Color** | Electric Cyan (#22D3EE) at 0.3 opacity | Electric Cyan (#22D3EE) at 0.6 opacity |
| **Glow Color** | None | Electric Cyan (#22D3EE) at 0.3 opacity |

## SECTION 06 — LIGHTING SPECIFICATION

| Property | Specification |
|----------|--------------|
| **Primary Light Direction** | N/A — cells are flat UI elements |
| **Glow Intensity** | Active cells: 0.3 opacity glow |
| **Shadow Intensity** | None |

## SECTION 07 — ANIMATION PACKAGE

| Animation | Purpose | Frames | Duration | FPS | Loop | Cooldown | Trigger | Motion Intensity | Priority |
|-----------|---------|--------|----------|-----|------|----------|---------|-----------------|----------|
| **Fill** | Cells illuminate sequentially | 10 | 2600ms total | N/A | Play once | None | Boot start | Level 3 (Revealing) | 1 |

**Fill — Detailed Specification:**
- Cell 0 illuminates at 0ms
- Cell 1 illuminates at 260ms
- Cell 2 illuminates at 520ms
- ... (260ms stagger per cell)
- Cell 9 illuminates at 2340ms
- All cells hold at 2600ms
- Each cell transition: 200ms ease-out
- Easing: ease-out per cell
- Reduced motion: All cells appear simultaneously at 0ms

## SECTION 08 — ENVIRONMENTAL BEHAVIOR

| Question | Answer |
|----------|--------|
| **How does it behave?** | Cells fill left to right during boot. Once full, they hold. |
| **How often does it move?** | Only during boot sequence. |
| **How does it react to nearby systems?** | The Drone monitors the cells. Cells indicate boot progress. |
| **What activates it?** | Boot sequence start. |
| **What deactivates it?** | Boot sequence complete. Cells remain filled. |
| **Can it communicate with other objects?** | Yes — cells indicate boot progress to the Drone. |
| **Can it emit energy?** | Yes — active cells glow. |
| **Can it receive energy?** | Yes — from the boot sequence initialization. |

## SECTION 09 — PLACEMENT RULES

| Property | Value |
|----------|-------|
| **Allowed Regions** | Creative Core (Boot Sequence) only |
| **Preferred Position** | Below the Drone, above the status messages |
| **Minimum Spacing** | 16px from Drone. 16px from status text. |
| **Maximum Spacing** | N/A — fixed position |
| **Relationship to Focal Elements** | Secondary — below the Drone, above the text |
| **Depth Layer** | L5 (Content) |
| **Parallax Participation** | No |
| **Visibility Priority** | High during boot |

## SECTION 10 — READABILITY TESTS

| Test | Criterion | Method |
|------|-----------|--------|
| **Silhouette Test** | Horizontal bar is universal | N/A — progress bar is universally recognized |
| **Distance Test** | Fill progress is visible | View on mobile |
| **Scale Test** | Maintains form at 1×, 2×, 3× | Test all scales |
| **Background Test** | Visible against #0D0A1A | Place on boot background |
| **Motion Test** | Sequential fill is smooth | Profile at 60fps |
| **Glow Test** | Active cell glow is visible | Compare against boot text |
| **Contrast Test** | Minimum 3:1 | Use contrast checker |
| **Brand Recognition Test** | Reads as "loading progress" | Survey 5 people |
| **Pixel Perfection Test** | All cells aligned, fill is clean | Zoom to 400% |

## SECTION 11 — QUALITY ASSURANCE

| Category | Criterion | Pass/Fail |
|----------|-----------|-----------|
| **Visual Quality** | Progress bar is clear, fill is satisfying | |
| **Pixel Quality** | All cells aligned, no stray pixels | |
| **Material Quality** | Reads as system diagnostic | |
| **Lighting** | Active cells glow consistently | |
| **Animation** | Sequential fill is smooth, timing is satisfying | |
| **Performance** | < 2 KB | |
| **Readability** | Universal progress bar metaphor | |
| **Consistency** | Matches existing boot sequence | |
| **Optimization** | Minimum palette, minimum frames | |
| **Production Readiness** | All specifications documented | |

## SECTION 12 — OPTIMIZATION

| Property | Value |
|----------|-------|
| **Memory Budget** | < 2 KB |
| **Atlas Placement** | Standalone — boot sequence only |
| **Reuse Opportunities** | None — unique to boot sequence |
| **Animation Optimization** | 10-frame fill — minimal cost |
| **Reduced-Motion Fallback** | All cells appear simultaneously |
| **GPU Considerations** | Minimal |
| **Compression Rules** | PNG-24 with alpha |

## SECTION 13 — FUTURE EXPANSION

| Upgrade | Description |
|---------|-------------|
| **Alternative Variants** | 5-cell bar, 20-cell bar |
| **Rare Variants** | Gold cells — special boot milestone |
| **Seasonal Variants** | N/A |
| **Interactive Variants** | N/A — boot sequence is not interactive |
| **Destroyed State** | N/A |
| **Enhanced State** | N/A |

---

# ASSET 11: VIGNETTE

## SECTION 01 — IDENTITY

| Field | Value |
|-------|-------|
| **Official Asset Name** | Vignette |
| **Asset ID** | `ce_vignette_static_v01` |
| **Category** | Background Object |
| **Region** | All Regions (edge darkening) |
| **Purpose** | Darkens viewport edges to focus attention on center. The Engine's natural optical effect. |
| **Narrative Role** | Not an object — a natural consequence of the Engine's lighting system. |
| **Importance Level** | High — without it, visual hierarchy breaks |
| **Visual Priority** | Lowest — behind everything, never noticed |
| **Interaction Level** | Passive — static |
| **Dependencies** | None |

## SECTION 02 — VISUAL DESIGN

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | A radial gradient — transparent at center, darkening to near-black at edges |
| **Primary Shapes** | Radial gradient (full viewport) |
| **Design Language** | Optical effect — not a drawn element |
| **Recognizable Features** | Dark edges, bright center. Reads as "focus, depth, atmosphere." |

## SECTION 03 — TECHNICAL SPECIFICATIONS

| Property | Value |
|----------|-------|
| **Native Canvas** | Full viewport (CSS) |
| **Export Format** | N/A — CSS radial-gradient |

**CSS Specification:**
```css
background: radial-gradient(ellipse at center, transparent 0%, rgba(15, 8, 3, 0.55) 100%);
```

## SECTION 04 — MATERIALS

| Property | Specification |
|----------|--------------|
| **Primary Material** | Energy — the vignette is a lighting effect |
| **Transparency** | 0% at center → 55% at edges |

## SECTION 05 — COLOR SPECIFICATION

| Property | Value |
|----------|-------|
| **Primary Color** | Near Black (#0F0803) at 0.55 opacity |

## SECTION 06-07 — LIGHTING & ANIMATION

Static. No lighting, no animation. CSS property only.

## SECTION 08 — ENVIRONMENTAL BEHAVIOR

Static. Always present. Never changes. Never reacts.

## SECTION 09 — PLACEMENT RULES

Full viewport overlay. Z-index: 0. Behind all content.

## SECTION 10-13 — QA, OPTIMIZATION, EXPANSION

N/A — CSS property, < 1 byte, no optimization needed. No future expansion planned.

---

# ASSET 12: CURSOR GLOW

## SECTION 01 — IDENTITY

| Field | Value |
|-------|-------|
| **Official Asset Name** | Cursor Glow |
| **Asset ID** | `ce_cursor_glow_v01` |
| **Category** | Interactive Object |
| **Region** | Creative Core (Hero Section) |
| **Purpose** | A reactive light that follows the visitor's cursor. The Engine's acknowledgment of presence. |
| **Narrative Role** | The Engine responds to visitors. When someone enters, the system acknowledges with light. |
| **Importance Level** | Medium — creates emotional connection |
| **Visual Priority** | High — in front of content |
| **Interaction Level** | Active — directly responds to cursor |
| **Dependencies** | Sprint 01 (palette system) |

## SECTION 02 — VISUAL DESIGN

| Property | Specification |
|----------|--------------|
| **Overall Silhouette** | A soft circular glow — reads as "warmth, presence, acknowledgment" |
| **Primary Shapes** | Circle (450px diameter, CSS gradient) |
| **Design Language** | Ambient interaction — the Engine's way of saying "I see you" |
| **Recognizable Features** | Warm orange. Follows cursor with 0.03 lerp. Fades in/out on enter/leave. |

## SECTION 03 — TECHNICAL SPECIFICATIONS

| Property | Value |
|----------|-------|
| **Native Canvas** | 450px diameter (CSS) |
| **Export Format** | N/A — CSS radial-gradient |

**CSS Specification:**
```css
background: radial-gradient(circle 225px, rgba(251, 146, 60, 0.025) 0%, transparent 70%);
filter: blur(20px);
```

## SECTION 04 — MATERIALS

| Property | Specification |
|----------|--------------|
| **Primary Material** | Energy — pure ambient light |
| **Transparency** | 97.5% transparent at peak (opacity: 0.025) |

## SECTION 05 — COLOR SPECIFICATION

| Property | Value |
|----------|-------|
| **Primary Color** | Warm Orange (#FB923C) at 0.025 opacity |

## SECTION 06 — LIGHTING SPECIFICATION

| Property | Specification |
|----------|--------------|
| **Glow Intensity** | 0.025 — extremely subtle |
| **Lerp Factor** | 0.03 — heavy, lagging movement |
| **Fade Duration** | 1.2s in, 1.2s out |
| **Fade Easing** | cubic-bezier(0.25, 0.1, 0.25, 1) |

## SECTION 07 — ANIMATION PACKAGE

| Animation | Purpose | Frames | Duration | FPS | Loop | Cooldown | Trigger | Motion Intensity | Priority |
|-----------|---------|--------|----------|-----|------|----------|---------|-----------------|----------|
| **Follow** | Tracks cursor position | N/A (CSS) | Continuous | N/A | Continuous | None | mousemove | Level 4 (Interacting) | 1 |
| **Fade In** | Appears on cursor enter | N/A (CSS) | 1.2s | N/A | Once | None | mouseenter | Level 4 | 1 |
| **Fade Out** | Disappears on cursor leave | N/A (CSS) | 1.2s | N/A | Once | None | mouseleave | Level 4 | 1 |

## SECTION 08 — ENVIRONMENTAL BEHAVIOR

| Question | Answer |
|----------|--------|
| **How does it behave?** | The glow follows the cursor with heavy lag (0.03 lerp). Fades in on enter, fades out on leave. |
| **How often does it move?** | Continuously while cursor is in Hero section. |
| **How does it react to nearby systems?** | It reacts only to the cursor. It does not interact with other objects. |
| **What activates it?** | Cursor enters Hero section. |
| **What deactivates it?** | Cursor leaves Hero section. |
| **Can it communicate with other objects?** | No. |
| **Can it emit energy?** | Yes — the glow IS energy emission. |
| **Can it receive energy?** | No. |

## SECTION 09 — PLACEMENT RULES

| Property | Value |
|----------|-------|
| **Allowed Regions** | Creative Core (Hero Section) only |
| **Preferred Position** | Follows cursor — no fixed position |
| **Depth Layer** | L6 (Interactive) — frontmost |
| **Visibility Priority** | High when cursor is present |

## SECTION 10-13 — QA, OPTIMIZATION, EXPANSION

Minimal — CSS property, < 1 byte, no optimization needed. Future: intensity increase on rapid cursor movement.

---

# APPENDIX A — COMPLETE ASSET REGISTRY

| Asset ID | Name | Category | Region | Sprint | Status |
|----------|------|----------|--------|--------|--------|
| `ce_core_focal_v01` | Creative Core — Focal Light | Hero | Hero | 01 | Specified |
| `ce_crystal_idle_v01` | Memory Crystal | Environmental | About | 02 | Specified |
| `ce_drone_idle_v01` | Maintenance Drone | Hero | Hero/Boot | 03 | Specified |
| `ce_beacon_idle_v01` | Signal Beacon | Environmental | Contact | 04 | Specified |
| `ce_stream_loop_v01` | Energy Stream | Environmental | All | 05 | Specified |
| `ce_chip_idle_v01` | Data Chip | Environmental | Skills | 06 | Specified |
| `ce_portal_idle_v01` | Portal System | Environmental | All | 07 | Specified |
| `ce_corner_idle_v01` | Corner Accent | Decorative | All | 08 | Specified |
| `ce_divider_idle_v01` | Divider Ornament | Decorative | All | 08 | Specified |
| `ce_accent_idle_v01` | Accent Dot | Decorative | All | 08 | Specified |
| `ce_grid_tile_v01` | Grid Tile | Background | All | 09 | Specified |
| `ce_scanline_tile_v01` | Scanline Tile | Background | All | 09 | Specified |
| `ce_pattern_tile_v01` | Pattern Tile | Background | All | 09 | Specified |
| `ce_cells_loop_v01` | Energy Cells | FX | Boot | 10 | Specified |
| `ce_vignette_static_v01` | Vignette | Background | All | 10 | Specified |
| `ce_cursor_glow_v01` | Cursor Glow | Interactive | Hero | 10 | Specified |

---

# APPENDIX B — CREATIVE REVIEW CHECKLIST

Before any specification is approved, verify:

| Check | Criterion |
|-------|-----------|
| CR01 | Can another artist recreate this asset without guidance? |
| CR02 | Does it match the Creative Engine Universe? |
| CR03 | Does it reinforce the AMR YOUSRY brand? |
| CR04 | Does it maintain visual consistency? |
| CR05 | Does it obey the World Bible? |
| CR06 | Does it obey the Visual Concept Document? |
| CR07 | Does it obey the Pixel Asset Pipeline? |

If the answer to any question is "No", revise the specification before approving it.

---

*This document is the definitive blueprint library for every asset in the AMR YOUSRY Creative Engine Universe. An entirely new art team should be able to produce every sprite, animation, and visual effect with complete consistency using this document alone.*

*Phase 2.0 — Asset Specification Manual v1.0*
*AMR YOUSRY Creative Studio*
