# CREATIVE ENGINE
## Visual Concept Document — Phase 1.5 Production Art Bible

**Classification:** Production Art Direction Reference
**Studio:** AMR YOUSRY Creative Studio
**Version:** 2.0 — Phase 1.5
**Status:** Pre-Production Visual Bible
**Authority:** This document supersedes all prior visual concept references. Every future asset, animation, and interaction must comply with the rules defined herein.

---

# PREAMBLE

This document is the single source of visual truth for the Creative Engine universe. It does not describe what the Engine looks like — it defines what every future asset **must feel like**. Every pixel placed, every gradient drawn, every animation curve authored must trace its reasoning back to a rule in this document.

If a rule is not defined here, it does not exist. If a rule is defined here, it is absolute.

This is not a style guide. This is the universe's DNA.

---

# SECTION 01 — ARCHITECTURAL STYLE

## Designation: Minimal Pixel Brutalism

The Creative Engine does not reference,模仿, or致敬 any real-world architectural movement. It does not borrow from Brutalism, Bauhaus, International Style, or any existing design canon. It establishes its own architectural language through a single, self-consistent principle:

**Structure reveals function. Nothing exists without purpose.**

This principle produces a style we call **Minimal Pixel Brutalism** — an architecture that combines:

- **Brutalist honesty** — Every element shows its function. No decorative facades. No ornamental skin. A container is visibly a container. A light source is visibly a light source.
- **Pixel precision** — Every element aligns to an invisible grid. Every edge is intentional. Every boundary is deliberate. No organic curves, no freeform shapes, no gestural marks.
- **Minimal restraint** — Only what is necessary exists. Every element must justify its presence through function. If an element cannot explain why it exists, it is removed.

## Core Architectural Principles

### 1. Structural Honesty

Every visual element reveals its purpose through its form. A container looks like a container — solid, bounded, holding content. A light source looks like a source — soft, radiating, consuming space. Nothing masquerades as something else. The Engine does not pretend to be a physical world. It does not simulate materials it does not possess. It is honest about being a digital interface, and it embraces the visual language of digital systems: grids, pixels, rectangles, light.

### 2. Grid Discipline

All elements exist on an invisible **4px base grid**. Positioning, sizing, spacing, alignment — everything snaps to this grid. The grid is never visible (except as a deliberate architectural texture in the boot sequence), but it is always felt. When an element feels "right," it is because it aligns to the grid. When an element feels "off," it has broken the grid.

**Grid rules:**
- All element positions must be divisible by 4px
- All element dimensions must be divisible by 4px
- All spacing must be a multiple of 4px
- Text may break the grid for optical alignment, but only at the line-box level
- Pixel art elements align to the pixel grid (2px or 3px units), which is a sub-grid of the 4px system

### 3. Monolithic Simplicity

Elements are built from simple geometric primitives: rectangles, squares, circles, lines, and points. Complexity never lives inside individual elements — it emerges from their arrangement, their relationships, and their collective behavior. A single rectangle is simple. Ten rectangles arranged with purpose create architecture.

### 4. Negative Authority

Empty space is the most powerful compositional tool in the Engine. It is not leftover space, not wasted space, not "nothing." It is the visual equivalent of silence in music — deliberate, structural, and essential. Negative space directs attention, creates breathing room, establishes hierarchy, and communicates confidence. A composition drowning in elements feels anxious. A composition with generous negative space feels authoritative.

### 5. Functional Gradient

Every visual property follows a gradient of function:

| Property | Functional End | Decorative End |
|----------|---------------|----------------|
| Color | Structural definition | Atmospheric mood |
| Opacity | Content legibility | Ambient depth |
| Size | Information hierarchy | Spatial presence |
| Position | Content flow | Environmental composition |
| Animation | State communication | Living atmosphere |

The Engine always operates closer to the functional end. Decorative properties exist only when they serve a functional purpose (atmosphere = spatial orientation = functional).

## Architectural Vocabulary

Every visual element in the Engine belongs to one of six architectural categories. This vocabulary is used throughout this document and all production communications.

| Term | Definition | Visual Form | Example |
|------|-----------|-------------|---------|
| **Block** | A rectangular element with clear boundaries and purpose | Rectangle with defined edges | Card, container, button |
| **Cell** | A small square element on the grid, atomic in nature | Square, grid-aligned | Pixel block, grid unit, indicator |
| **Beam** | A linear element connecting two points or spanning a distance | Horizontal or vertical line | Divider, border, grid line |
| **Field** | A large area of uniform color, gradient, or atmospheric effect | Area fill | Background, section fill, overlay |
| **Node** | A circular element representing a point of energy or interaction | Circle, soft or hard edge | Light source, indicator, particle |
| **Core** | A central element that anchors a composition and draws the eye | Largest or brightest element | Focal light, headline, logo |

## Style Boundaries

**The Engine IS:**
- Geometric (all forms are mathematical)
- Grid-aligned (all positions are calculated)
- Structurally honest (all elements show their function)
- Minimal (all elements justify their existence)
- Precise (all properties are intentional)
- Purposeful (nothing is arbitrary)

**The Engine IS NOT:**
- Organic (no freeform curves, no natural shapes)
- Fluid (no liquid simulation, no flow dynamics)
- Decorative (no ornamentation, no embellishment)
- Ornamental (no patterns that serve no function)
- Chaotic (no randomness, no disorder)
- Playful (no bouncing, no whimsy, no humor in form)

---

# SECTION 02 — PERSPECTIVE SYSTEM

## Designation: Frontal-Orthographic with Stratified Depth

The Creative Engine does not use traditional perspective. There are no vanishing points, no foreshortening, no converging lines. The viewport is a flat plane. Depth is communicated through a **stratified layering system** — six discrete horizontal planes stacked from background to foreground, each with its own blur, opacity, speed, and size characteristics.

This is not a compromise — it is a deliberate architectural decision. Traditional perspective implies a physical world the visitor moves through. The Engine is not a physical world. It is a digital system with depth, not distance.

## The Six-Layer Depth Architecture

```
LAYER 6 (Nearest):   INTERACTIVE — Cursor glow, hover states, focus rings
LAYER 5:             CONTENT — Text, buttons, cards, navigation
LAYER 4:             FOREGROUND AMBIENT — Small orbs (180-200px), dust particles (1-2px)
LAYER 3:             MID AMBIENT — Medium orbs (400-450px), light sweep
LAYER 2:             BACKGROUND AMBIENT — Large orbs (700-800px), focal light
LAYER 1 (Farthest):  BASE — Solid color, vignette, grid texture, scanlines
```

## Depth Communication Matrix

Each layer communicates depth through four visual properties. These values are absolute — no element may deviate without art director approval.

| Layer | Blur | Opacity Range | Drift Speed | Size Range | Z-Order |
|-------|------|---------------|-------------|------------|---------|
| L6 Interactive | 0-20px | 0.0-1.0 | Cursor-speed (lerp 0.03) | 350-450px | Front |
| L5 Content | None | 0.4-1.0 | Static or 700-900ms reveal | Variable | Front-Mid |
| L4 Foreground | 12-15px | 0.005-0.014 | Fast (22-26s cycles) | 180-200px | Mid-Front |
| L3 Mid | 30-35px | 0.01-0.015 | Moderate (30-34s cycles) | 400-450px | Mid |
| L2 Background | 50-60px | 0.008-0.025 | Slow (40-45s cycles) | 700-800px | Mid-Back |
| L1 Base | None | 0.03-1.0 | Static | Full viewport | Back |

## Depth Communication Rules

### Rule 1: Blur Increases with Distance
Elements farther from the viewer are always blurrier. This is the primary depth cue. A 60px blur reads as "very far away." A 15px blur reads as "close but not here." Zero blur reads as "here."

### Rule 2: Opacity Decreases with Distance
Distant elements are more transparent. This reinforces the blur cue and creates atmospheric perspective — the feeling that air and space exist between layers.

### Rule 3: Speed Increases with Proximity
Elements closer to the viewer move faster. Foreground orbs drift at 22-second cycles. Background orbs drift at 45-second cycles. This creates parallax during scroll, making the space feel three-dimensional without using perspective.

### Rule 4: Size Decreases with Proximity
Close elements are smaller. Far elements are larger. This is counterintuitive (in the real world, close objects are larger) but it serves the Engine's architecture: large blurry shapes read as distant ambient fields, small sharp shapes read as close interactive elements.

### Rule 5: Overlap Implies Proximity
When a Layer 4 element overlaps a Layer 2 element, the visitor perceives the Layer 4 element as closer. Overlap is the strongest monocular depth cue after blur.

## Perspective Violations (Permitted)

The following violations of orthographic rules are permitted for functional reasons:

| Violation | Reason | Justification |
|-----------|--------|---------------|
| Text always faces viewer | Readability | The Engine is an interface, not a world |
| Buttons are always flat | Clickability | 3D buttons reduce usability |
| Cursor glow is viewport-parallel | Interactivity | The glow must track the cursor plane |
| Cards have no perspective tilt | Legibility | Tilted text is harder to read |

These violations are acceptable because the Engine prioritizes **function over fiction**. It is a digital interface that uses depth as atmosphere, not as physics.

## Scroll-Induced Depth

When the visitor scrolls, depth layers move at different rates, creating parallax:

| Layer | Scroll Multiplier | Effect |
|-------|-------------------|--------|
| L1 Base | 0.0 (fixed) | Background never moves |
| L2 Background | 0.05 | Minimal drift — vast distance |
| L3 Mid | 0.1 | Moderate drift — mid-range |
| L4 Foreground | 0.15 | Noticeable drift — near field |
| L5 Content | 1.0 | Normal scroll — content plane |

This creates the illusion of descending through layers of atmosphere as the visitor scrolls — from distant background through ambient layers to content.

---

# SECTION 03 — ENVIRONMENT COMPOSITION

## The Rule of Dominant Center

Every region of the Creative Engine follows one compositional principle: **The Dominant Center**. The most important element in any region is positioned at or near the visual center. Secondary elements radiate outward. This creates natural visual hierarchy without requiring the visitor to search for information.

The Dominant Center is not always the geometric center of the viewport. It is the **visual center** — the point where the eye naturally rests. In most regions, this is slightly above geometric center (the "golden center" at approximately 40% from the top).

## Composition Grid

```
┌──────────────────────────────────────────────────┐
│                    MARGIN                         │
│              (breathing room — dark)              │
│  ┌──────────────────────────────────────────┐    │
│  │           SECONDARY ZONE                  │    │
│  │     (ambient elements, supporting)        │    │
│  │  ┌──────────────────────────────────┐    │    │
│  │  │         PRIMARY ZONE              │    │    │
│  │  │    (supporting content, cards)    │    │    │
│  │  │  ┌──────────────────────────┐    │    │    │
│  │  │  │     DOMINANT CENTER       │    │    │    │
│  │  │  │  (primary message/CTA)    │    │    │    │
│  │  │  └──────────────────────────┘    │    │    │
│  │  │                                  │    │    │
│  │  └──────────────────────────────────┘    │    │
│  │                                          │    │
│  └──────────────────────────────────────────┘    │
│                                                   │
└──────────────────────────────────────────────────┘
```

## Zone Definitions

| Zone | Purpose | Content Density | Lighting Level | Background |
|------|---------|-----------------|----------------|------------|
| Dominant Center | Primary message, primary CTA | High | Brightest (focal light peak) | Warmest |
| Primary Zone | Supporting content, secondary CTAs | Medium | Well-lit | Warm |
| Secondary Zone | Ambient elements, decorative depth | Low | Dim | Cool-neutral |
| Margin | Breathing room, edge darkening | None | Dark (vignette) | Near-black |

## Compositional Balance

The Engine uses **asymmetrical balance**. Elements are never perfectly centered (unless they are the Dominant Center). They are visually weighted to create equilibrium through contrast, size, and luminance:

- A large dark element on the left is balanced by a small bright element on the right
- A heavy block at the top is balanced by generous negative space at the bottom
- A bright accent in one corner is balanced by a dim ambient field in the opposite corner

The eye perceives balance through **visual weight**, not mathematical centering. A 100px element at 0.04 opacity has less weight than a 20px element at 1.0 opacity.

## Horizontal Rhythm

Content follows a predictable horizontal rhythm:

| Alignment | Usage | Rationale |
|-----------|-------|-----------|
| Left-aligned | Body text, paragraphs, lists | Maximum readability for LTR languages |
| Center-aligned | Hero headlines, section titles, CTAs | Maximum impact and visual weight |
| Right-aligned | Accents, timestamps, metadata | Visual interest, breaks monotony |
| Never justified | — | Creates uneven word spacing, reduces readability |

## Vertical Rhythm

Content follows a strict vertical rhythm based on the 4px grid. This rhythm creates consistency across all regions:

| Level | Spacing | Grid Units | Usage |
|-------|---------|------------|-------|
| Page-level | 80-120px | 20-30 units | Section separation |
| Block-level | 32-48px | 8-12 units | Content block separation |
| Element-level | 16-24px | 4-6 units | Individual element separation |
| Inline-level | 4-8px | 1-2 units | Inline element separation |
| Tight | 2-4px | 0.5-1 unit | Pixel-level adjustments only |

## Region-Specific Composition

### Hero (Creative Core)
**Dominant Center:** Headline at 40% from top, centered horizontally
**Primary Zone:** Sub-headline below, CTAs below that
**Secondary Zone:** Ambient depth layers, cursor glow
**Margin:** Vignette darkening at all edges
**Special:** Focal light centered behind headline, creating a "spotlight" effect

### Projects (Factory District)
**Dominant Center:** Project card grid, centered in viewport
**Primary Zone:** Individual project cards with title, description, thumbnail
**Secondary Zone:** Ambient depth (simplified), section header
**Margin:** Standard breathing room
**Special:** Cards use consistent aspect ratio and spacing

### About (Memory District)
**Dominant Center:** Bio text or portrait area
**Primary Zone:** Supporting details, skills summary
**Secondary Zone:** Ambient depth (minimal)
**Margin:** Standard breathing room
**Special:** Left-aligned text for maximum readability

### Contact (Communication Tower)
**Dominant Center:** Contact form or CTA
**Primary Zone:** Form fields, submit button
**Secondary Zone:** Contact information, social links
**Margin:** Standard breathing room
**Special:** Warm, inviting lighting — the "we're listening" zone

### Footer (Power Generator)
**Dominant Center:** Minimal — the footer is the base
**Primary Zone:** Navigation links, copyright
**Secondary Zone:** None
**Margin:** Minimal — the footer is the grounding element
**Special:** Darkest region, lowest ambient energy

---

# SECTION 04 — LIGHTING BIBLE

## Lighting Philosophy

Light in the Creative Engine is not illumination. It is **communication**. Every light source tells the visitor something:

- **Where to look** — Focal light draws the eye to the headline
- **What is important** — Brighter elements are more important
- **What is interactive** — Cyan light signals "you can touch this"
- **What is ambient** — Warm glow signals "this is atmosphere"
- **What is alive** — Moving light signals "this system is operational"
- **What is absent** — Darkness signals "this area is not in focus"

Light is the Engine's primary communication tool. More important than typography. More powerful than layout. The visitor's eye follows light first, text second.

## The Five-Tier Light Hierarchy

### Tier 1: The Focal Light

The single most important light in the entire Engine.

| Property | Value |
|----------|-------|
| Color | Warm orange/amber |
| RGBA | rgba(251, 146, 60, 0.04) |
| Size | 900 × 600px (elliptical) |
| Blur | 50px |
| Shape | Radial gradient, elliptical |
| Position | Centered behind headline |
| Animation | Breathing — 32s cycle |
| Scale oscillation | 1.0 → 1.02 → 1.0 |
| Opacity oscillation | 0.8 → 1.0 → 0.8 |
| Easing | ease-in-out |

**Rules:**
1. Always centered behind the primary message — never moves position
2. Never brighter than 0.04 peak opacity — subtlety is authority
3. Only one focal light per viewport — plurality destroys hierarchy
4. Never interacts with other lights — it stands alone
5. Never responds to scroll — it is a fixed beacon
6. The focal light is not a "spotlight" — it is a field of concentrated energy

### Tier 2: Ambient Depth Lights

The spatial atmosphere of the Engine. These lights create the illusion of depth and vastness.

| Property | Background Layer (L2) | Mid Layer (L3) | Foreground Layer (L4) |
|----------|----------------------|-----------------|----------------------|
| Count | 2 orbs | 2 orbs | 2 orbs |
| Size | 700-800px | 400-450px | 180-200px |
| Blur | 50-60px | 30-35px | 12-15px |
| Opacity | 0.008-0.025 | 0.01-0.015 | 0.005-0.014 |
| Drift speed | 40-45s cycles | 30-34s cycles | 22-26s cycles |
| Drift range | 12-15px | 8-10px | 4-6px |
| Color | Warm orange/amber | Warm orange/amber | Warm orange/amber |

**Rules:**
1. Always at lower opacity than the focal light — they support, never compete
2. Never synchronize with each other — every orb has unique timing
3. Never enter the Dominant Center — they stay in their depth layer
4. Maximum 6 ambient orbs per viewport — more creates visual noise
5. Always warm-toned — cold ambient light violates the Engine's warmth principle
6. Never stop moving — still ambient lights read as dead

### Tier 3: Interactive Light

The cursor glow — the Engine's response to human presence.

| Property | Value |
|----------|-------|
| Color | Warm orange |
| RGBA | rgba(251, 146, 60, 0.025) |
| Size | 450px diameter |
| Blur | 20px |
| Shape | Radial gradient, circular |
| Lerp factor | 0.03 (heavy, lagging) |
| Fade-in duration | 1.2s |
| Fade-out duration | 1.2s |
| Fade easing | cubic-bezier(0.25, 0.1, 0.25, 1) |
| Layer | L6 (closest to viewer) |

**Rules:**
1. Only one interactive light per viewport — plurality destroys the "single presence" feeling
2. Always lower opacity than ambient lights — the visitor's presence is acknowledged, not celebrated
3. Never snaps to cursor position — the 0.03 lerp creates natural, heavy movement
4. Always has smooth fade transitions — the 1.2s fade prevents jarring appearance/disappearance
5. Never follows the cursor outside the Hero section — the glow is region-specific
6. The cursor glow is not a "flashlight" — it is a gentle acknowledgment of presence

### Tier 4: Accent Lights

Small, precise indicators that signal interactivity and status.

| Property | Value |
|----------|-------|
| Color | Electric cyan |
| RGBA | rgba(34, 211, 238, 0.15-0.3) |
| Size | 2-8px dots |
| Blur | None |
| Shape | Square or circle (pixel-aligned) |
| Animation | Static or gentle pulse (1-3s cycles) |
| Layer | L5 (content layer) |

**Rules:**
1. Always small (2-8px) — accent lights are punctuation, not paragraphs
2. Never brighter than 0.3 opacity — they are indicators, not beacons
3. Used sparingly — maximum 5 per viewport
4. Only on interactive or status elements — never decorative
5. Always pixel-aligned — accent lights that break the grid feel accidental
6. Electric cyan only — warm accents violate the color hierarchy (warm = ambient, cyan = interactive)

### Tier 5: Ambient Glow

A barely perceptible horizontal light that adds temporal variation.

| Property | Value |
|----------|-------|
| Color | Warm amber |
| RGBA | rgba(251, 146, 60, 0.005-0.012) |
| Size | 35% viewport width |
| Blur | None (gradient edges) |
| Shape | Horizontal gradient band |
| Movement | Left to right, linear |
| Cycle | 35 seconds |
| Peak opacity | 0.012 |
| Layer | L3 (mid ambient) |

**Rules:**
1. Never brighter than 0.012 peak opacity — this is almost subliminal
2. Only one sweep per viewport — plurality creates visual competition
3. Never pauses mid-sweep — a paused sweep looks broken
4. Always moves left to right — consistent direction establishes rhythm
5. The sweep is not a "scan line" — it is a gentle energy pulse

## Universal Lighting Rules

1. **One Dominant Source** — Only one light can be the brightest in any viewport. The focal light always wins.
2. **Warm Dominance** — Ambient light is always warm-toned. Cool tones (cyan) are reserved exclusively for interactive elements.
3. **Opacity Hierarchy** — Brighter lights always have higher opacity than dimmer lights. No exceptions.
4. **No Hard Edges** — All light sources have soft, feathered edges. Sharp light boundaries break immersion.
5. **Energy Conservation** — Light intensity is inversely proportional to distance from source. Closer = brighter.
6. **Absence Is Light** — Darkness is a lighting decision. The vignette is as important as the focal light.
7. **Living Light** — Ambient lights never stop moving. Static ambient lights read as dead.
8. **Consistent Color Temperature** — Warm lights are always warm (2700-3500K equivalent). Cool lights are always cool (6500K+ equivalent). No mixing within a single light source.

---

# SECTION 05 — MATERIAL LIBRARY

## Material Taxonomy

Every visual element in the Creative Engine belongs to exactly one of four material categories. These categories are not aesthetic choices — they are functional classifications that determine behavior, rendering, and interaction rules.

### Material 01: ENERGY

**Definition:** Translucent, glowing, intangible substances that exist behind content layers.

**Members:**
- Focal light
- All ambient orbs (background, mid, foreground)
- Dust particles
- Cursor glow
- Light sweep
- Vignette
- Grid texture

**Visual Properties:**
| Property | Range |
|----------|-------|
| Opacity | 0.005 – 0.06 |
| Blur | 0 – 60px |
| Color | Warm orange/amber or Electric cyan |
| Edges | Soft, feathered, gradient |
| Movement | Smooth, continuous, organic |
| Rendering | GPU-accelerated (filter: blur) |

**Behavior Rules:**
- Never used for text, buttons, or interactive elements
- Always rendered behind content layers (L1-L4)
- Always at lower opacity than structural elements
- Maximum 10 energy elements per viewport
- Always uses GPU-accelerated properties (transform, opacity, filter)
- Never triggers layout recalculation

### Material 02: STRUCTURE

**Definition:** Solid, defined, tangible architectural elements that define space and hierarchy.

**Members:**
- Containers, cards, panels
- Borders, dividers, grid lines
- Section backgrounds
- Form field boundaries
- Navigation elements

**Visual Properties:**
| Property | Range |
|----------|-------|
| Opacity | 0.08 – 1.0 |
| Blur | None |
| Color | Dark indigo (#1E1B4B), slate (#94A3B8), or white (#F8FAFC) |
| Edges | Sharp, defined, pixel-aligned |
| Movement | Static or discrete transitions (160-300ms) |
| Rendering | Standard DOM rendering |

**Behavior Rules:**
- Always aligns to the 4px grid
- Always has clear, visible boundaries
- Never uses gradients (flat color only)
- Always provides clear visual hierarchy
- Border width: 1-2px (never exceed 3px)
- Border radius: 0px (sharp corners) unless circular

### Material 03: INTERFACE

**Definition:** Interactive, responsive, clickable elements that the visitor can manipulate.

**Members:**
- Buttons (primary, secondary, ghost)
- Links (inline, standalone)
- Form inputs (text, email, textarea)
- Navigation items
- Social links
- Filter controls

**Visual Properties:**
| Property | Range |
|----------|-------|
| Opacity | 0.6 – 1.0 |
| Blur | None |
| Color | Electric cyan (#22D3EE), white (#F8FAFC), or brand colors |
| Edges | Sharp, defined, pixel-aligned |
| Movement | Discrete transitions (160ms ease-out) |
| Rendering | Standard DOM rendering |

**Behavior Rules:**
- Always meets 44×44px minimum touch target
- Always has visible focus state (2px cyan outline)
- Always has hover state (opacity change or color shift)
- Always has active state (scale 0.98 or opacity reduction)
- Never uses animation longer than 300ms
- Never uses transform beyond scale(0.98) — no rotation, no translate

### Material 04: TEXT

**Definition:** Informational, readable, permanent content that communicates meaning.

**Members:**
- Headlines (Display, H1, H2, H3)
- Body text
- Labels, captions
- Status messages
- System messages (pixel font)
- Navigation labels

**Visual Properties:**
| Property | Range |
|----------|-------|
| Opacity | 0.4 – 1.0 |
| Blur | None |
| Color | White (#F8FAFC) or slate (#94A3B8) |
| Edges | Crisp (system font) or pixelated (pixel font) |
| Movement | Fade transitions only (700-900ms) |
| Rendering | Standard text rendering |

**Behavior Rules:**
- Always meets WCAG AA contrast ratio (4.5:1 for body, 3:1 for large text)
- Always uses system font (Inter) or pixel font (Press Start 2P)
- Never animates position (opacity only — no translate, no slide)
- Always has clear hierarchy through size, weight, and color
- Line height: 1.5 for body, 1.2 for headlines
- Letter spacing: normal for body, -0.02em for headlines

## Material Interaction Matrix

| | Energy | Structure | Interface | Text |
|---|--------|-----------|-----------|------|
| **Energy** | Overlap creates depth | Energy behind structure | Energy behind interface | Energy behind text |
| **Structure** | Structure contains energy | Adjacent structure creates boundaries | Structure contains interface | Structure frames text |
| **Interface** | Interface over energy | Interface within structure | Adjacent interface groups | Interface labels text |
| **Text** | Text over energy | Text within structure | Text labels interface | Text next to text |

---

# SECTION 06 — PIXEL DENSITY STANDARDS

## The Dual-Density System

The Creative Engine operates at two pixel densities simultaneously. This is not a technical limitation — it is a deliberate design decision that creates visual contrast between **system elements** (the Engine's infrastructure) and **content elements** (the Engine's output).

### Standard Density (1x)

**Used for:** All UI elements, text, buttons, containers, navigation, cards, forms.

**Characteristics:**
- Sharp, crisp edges with subpixel rendering
- Standard font smoothing (antialiased on macOS, ClearType on Windows)
- Full color depth (24-bit or 30-bit depending on display)
- Smooth gradients and curves
- Vector-based rendering

### Pixel Art Density (2-3x)

**Used for:** Decorative pixel elements only — the pixel drone, energy cells, grid texture, scanlines, boot sequence decorations.

**Characteristics:**
- Integer scaling only (2×, 3×, 4× — never 1.5× or 2.5×)
- `image-rendering: pixelated` on all scaled elements
- Limited color palette per element (maximum 4 colors excluding transparency)
- No antialiasing on edges — always sharp, always blocky
- Raster-based rendering at native pixel size, then scaled

## Pixel Art Production Rules

### Rule 1: Integer Scaling
Pixel art must scale to exact integer multiples. A 12×14px sprite rendered at 3× becomes 36×42px. Rendering at 2.5× produces 30×35px — this is forbidden because it creates uneven pixel rows/columns that break the pixel grid aesthetic.

### Rule 2: Grid Alignment
Pixel art elements must align to the pixel grid. A 2px-base pixel art element placed at x=5px breaks the grid (5 is not divisible by 2). It must be placed at x=4px or x=6px.

### Rule 3: Palette Limit
Each pixel art element uses a maximum of 4 colors (excluding full transparency). This constraint forces clarity and ensures pixel art elements remain legible at small sizes.

**Approved pixel art palettes:**

| Element | Color 1 | Color 2 | Color 3 | Color 4 |
|---------|---------|---------|---------|---------|
| Pixel Drone | #1E1B4B (body) | #6D28D9 (core) | #22D3EE (eye) | transparent |
| Energy Cells (inactive) | #1E1B4B (fill) | #22D3EE (border) | transparent | transparent |
| Energy Cells (active) | #22D3EE (fill) | #F8FAFC (glow) | transparent | transparent |
| Grid texture | #22D3EE (line) | transparent | transparent | transparent |

### Rule 4: No Antialiasing
Pixel art edges are always sharp. No smoothing, no blending, no feathering. The beauty of pixel art lies in its honesty — every pixel is visible, every edge is deliberate.

### Rule 5: Consistent Pixel Size
All pixel art in the same viewport uses the same base pixel size. If the drone uses 2px base pixels, the energy cells must also use 2px base pixels. Mixing pixel sizes creates visual inconsistency.

## Pixel Size Standards

| Element Type | Native Size | Base Pixel | Scale | Final Render Size |
|--------------|-------------|------------|-------|-------------------|
| Drone body | 12 × 14px | 2px | 1× | 24 × 28px |
| Drone eye | 2 × 2px | 2px | 1× | 4 × 4px |
| Drone antenna | 2 × 4px | 2px | 1× | 4 × 8px |
| Drone wings | 4 × 3px | 2px | 1× | 8 × 6px |
| Energy cell | 8 × 4px | 2px | 1× | 16 × 8px |
| Grid line | 1 × 1px | 1px | 1× | 1 × 1px |
| Dust particle | 1 × 1px | 1px | 1× | 1 × 1px |
| Decorative pixel | 1 × 1px | 2px | 2× | 4 × 4px |

---

# SECTION 07 — SCALE SYSTEM

## Relative Scale Philosophy

The Creative Engine uses a **relative scale system** based on viewport width. All sizes are defined as viewport percentages or clamped values. This ensures the Engine scales gracefully across devices — from 320px mobile to 2560px ultrawide.

Absolute pixel values are used only for pixel art elements (which must maintain integer scaling) and micro-details (dust particles, grid lines).

## The Eight Scale Tiers

| Tier | Name | Size Range | Grid Units | Usage |
|------|------|------------|------------|-------|
| T0 | Atomic | 1-4px | 0.25-1 | Dust particles, grid lines, pixel details |
| T1 | Micro | 4-16px | 1-4 | Energy cells, drone components, icons |
| T2 | Small | 16-32px | 4-8 | Small buttons, labels, status indicators |
| T3 | Medium | 32-64px | 8-16 | Icons, small cards, form elements |
| T4 | Large | 64-128px | 16-32 | Cards, section headers, large buttons |
| T5 | XL | 128-256px | 32-64 | Hero elements, large cards, featured content |
| T6 | XXL | 256-512px | 64-128 | Section backgrounds, focal light |
| T7 | Viewport | 512px+ | 128+ | Full-viewport elements, ambient layers |

## Type Scale

All typography uses `clamp()` for responsive sizing. This ensures text scales smoothly between breakpoints without abrupt jumps.

| Level | Size Formula | Min | Preferred | Max | Weight | Font |
|-------|-------------|-----|-----------|-----|--------|------|
| Display | clamp(3rem, 7vw, 6rem) | 48px | 7vw | 96px | 800 | Inter |
| H1 | clamp(2rem, 5vw, 3.5rem) | 32px | 5vw | 56px | 700 | Inter |
| H2 | clamp(1.5rem, 3vw, 2.25rem) | 24px | 3vw | 36px | 600 | Inter |
| H3 | clamp(1.25rem, 2.5vw, 1.75rem) | 20px | 2.5vw | 28px | 600 | Inter |
| Body | clamp(0.95rem, 2vw, 1.125rem) | 15.2px | 2vw | 18px | 400 | Inter |
| Small | 0.875rem | 14px | — | 14px | 400 | Inter |
| Pixel | 7-10px | 7px | — | 10px | 400 | Press Start 2P |

## Spacing Scale

| Token | Value | Grid Units | Usage |
|-------|-------|------------|-------|
| 3xs | 2px | 0.5 | Pixel-level adjustments |
| 2xs | 4px | 1 | Tight spacing, inline elements |
| xs | 8px | 2 | Small spacing, icon gaps |
| sm | 16px | 4 | Standard spacing, element gaps |
| md | 24px | 6 | Medium spacing, block gaps |
| lg | 32px | 8 | Large spacing, section elements |
| xl | 48px | 12 | Section spacing |
| 2xl | 64px | 16 | Major section spacing |
| 3xl | 80-120px | 20-30 | Page-level spacing, hero padding |

---

# SECTION 08 — NEGATIVE SPACE RULES

## The Breathing Principle

Negative space in the Creative Engine is not empty space. It is **breathing room** — the visual equivalent of silence in music. It is deliberate, structural, and essential. A composition without breathing room feels anxious. A composition with generous breathing room feels authoritative.

## The Breathing Hierarchy

### Macro Breathing (Section Level)
**Amount:** 80-120px vertical padding (20-30 grid units)
**Purpose:** Separates major sections. Creates visual rest between content blocks. Allows the ambient atmosphere to be felt between regions.
**Rules:**
- Never less than 60px — tighter spacing makes sections feel cramped
- Never more than 160px — wider spacing makes sections feel disconnected
- Always symmetrical (same top and bottom) — asymmetric section spacing breaks rhythm
- The Hero section uses 3xl (80-120px) on mobile, 4xl on desktop

### Meso Breathing (Block Level)
**Amount:** 32-48px vertical spacing (8-12 grid units)
**Purpose:** Separates content blocks within a section. Creates sub-hierarchy within regions.
**Rules:**
- Always a multiple of 8px — maintains grid alignment
- Consistent within each section — varying meso spacing within a section creates chaos
- Never less than 24px — tighter spacing makes blocks feel merged
- Never more than 64px — wider spacing makes blocks feel unrelated

### Micro Breathing (Element Level)
**Amount:** 8-16px vertical spacing (2-4 grid units)
**Purpose:** Separates individual elements within a block. Creates legibility and scan-ability.
**Rules:**
- Always a multiple of 4px — maintains grid alignment
- Tighter than meso breathing — the hierarchy must be clear
- Never less than 4px — tighter spacing makes elements feel overlapped
- Never more than 24px — wider spacing makes elements feel detached

### Inline Breathing
**Amount:** 4-8px (1-2 grid units)
**Purpose:** Separates inline elements (words in a label, icon + text, badge + text).
**Rules:**
- Always a multiple of 4px — maintains grid alignment
- Never less than 2px — tighter spacing makes inline elements feel merged
- Consistent across similar element types — all icon + text pairs use the same inline spacing

## The 50% Rule

At least 50% of any viewport should be negative space. This is not a suggestion — it is a constraint. Compositions that violate this rule feel cluttered, anxious, and unprofessional.

**How to verify:** At any scroll position, count the visible content elements. If they occupy more than 50% of the viewport area, reduce content or increase spacing.

## Edge Buffer Rule

Content never touches viewport edges. The minimum distance between any content element and the viewport edge is 16px on mobile, 24px on tablet, and 32px on desktop. This buffer zone is enforced by the Container component.

## Center Concentration Rule

Negative space increases toward viewport edges. The center of the viewport has the highest content density. The edges have the lowest. This creates a natural "vignette" effect where the visitor's eye is drawn toward the center.

---

# SECTION 09 — BACKGROUND COMPOSITION

## The Layered Background System

Every section of the Creative Engine has a multi-layered background. These layers work together to create depth, atmosphere, and visual hierarchy. No section has a flat, single-color background.

## Standard Background Stack

```
Layer 7: Content overlay (text, buttons, cards)
Layer 6: Interactive overlay (cursor glow)
Layer 5: Foreground ambient (small orbs, dust)
Layer 4: Mid ambient (medium orbs, light sweep)
Layer 3: Background ambient (large orbs, focal light)
Layer 2: Atmospheric (grid texture, scanlines)
Layer 1: Vignette (edge darkening)
Layer 0: Base (solid color)
```

## Background Color Rules

| Layer | Color/Gradient | Opacity | Purpose |
|-------|---------------|---------|---------|
| L0 Base | #0D0A1A (near-black) | 1.0 | Foundation — the void |
| L1 Vignette | Radial gradient, transparent → rgba(15,8,3,0.55) | 0.0-0.55 | Edge darkening — focuses attention |
| L2 Grid | #22D3EE (cyan) | 0.03 | Architecture suggestion — digital texture |
| L2 Scanlines | Black | 0.04 | Retro texture — CRT artifact |
| L3-L5 Ambient | Warm orange/amber | 0.005-0.04 | Atmosphere — spatial depth |
| L6 Interactive | Warm orange | 0.0-0.025 | Cursor response — presence acknowledgment |

## Background Animation Rules

| Layer | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| L0 Base | None (static) | — | — |
| L1 Vignette | None (static) | — | — |
| L2 Grid | Opacity breathing | 4s cycle | ease-in-out |
| L2 Scanlines | None (static) | — | — |
| L3-L5 Ambient | Transform drift | 22-45s cycles | ease-in-out |
| L6 Interactive | Opacity fade + transform lerp | 1.2s / 0.03 lerp | cubic-bezier(0.25, 0.1, 0.25, 1) |

## Section-Specific Backgrounds

### Hero (Creative Core)
**Complexity:** Maximum — full background stack (all 7 layers)
**Special elements:** Focal light, 6 depth orbs, 2 dust particles, light sweep, cursor glow, grid, scanlines, vignette
**Atmosphere:** Dense, immersive, alive

### Projects (Factory District)
**Complexity:** Medium — simplified stack (L0, L1, L3, L7)
**Special elements:** Subtle warm ambient (2 orbs maximum)
**Atmosphere:** Clean, organized, focused on content

### About (Memory District)
**Complexity:** Medium — simplified stack (L0, L1, L3, L7)
**Special elements:** Subtle warm ambient (2 orbs maximum)
**Atmosphere:** Calm, reflective, archival

### Contact (Communication Tower)
**Complexity:** Medium — simplified stack (L0, L1, L3, L7)
**Special elements:** Subtle warm ambient, inviting glow
**Atmosphere:** Open, accessible, warm

### Footer (Power Generator)
**Complexity:** Minimum — base stack (L0, L1, L7)
**Special elements:** None — the footer is deliberately minimal
**Atmosphere:** Steady, reliable, grounding

---

# SECTION 10 — OBJECT PLACEMENT RULES

## The Gravity Principle

Every object in the Creative Engine has **visual gravity** — it pulls other elements toward it or pushes them away. Object placement follows gravitational rules based on the object's tier in the placement hierarchy.

## The Three-Tier Placement Hierarchy

### Primary Objects (High Gravity)
**Members:** Headlines, primary CTAs, focal light, project thumbnails
**Placement:** Center or near-center of viewport (Dominant Center or Primary Zone)
**Rules:**
- Always in the Dominant Center or Primary Zone
- Always the largest or brightest element in the viewport
- Never positioned at viewport edges
- Maximum 2 primary objects per viewport
- Primary objects always win visual competition — if a primary and secondary object overlap, the primary is in front

### Secondary Objects (Medium Gravity)
**Members:** Sub-headlines, secondary CTAs, cards, navigation, form fields
**Placement:** Radiating outward from primary objects (Primary Zone)
**Rules:**
- Never closer to center than primary objects
- Always visually connected to a primary object (through proximity or alignment)
- Maximum 4 secondary objects per viewport
- Secondary objects never compete with primary objects for attention

### Tertiary Objects (Low Gravity)
**Members:** Ambient orbs, dust particles, decorative pixels, grid texture, scanlines
**Placement:** Peripheral areas, edges, backgrounds (Secondary Zone or Margin)
**Rules:**
- Never enters the Dominant Center or Primary Zone
- Always at lower opacity than secondary objects
- Never competes with primary or secondary objects for attention
- Tertiary objects exist to create atmosphere, not content

## The Five Placement Laws

### Law 1: No Orphans
Every object must be visually connected to at least one other object. An orphaned element — a lone button floating in empty space, a disconnected label — feels accidental. Connect elements through proximity (spacing ≤ 24px), alignment (shared grid line), or visual hierarchy (same color, same size).

### Law 2: No Crowding
Objects must maintain minimum spacing based on their tier:
- Primary to Primary: ≥ 48px
- Primary to Secondary: ≥ 24px
- Secondary to Secondary: ≥ 16px
- Secondary to Tertiary: ≥ 32px
- Any to viewport edge: ≥ 16px (mobile) / ≥ 32px (desktop)

### Law 3: No Grid Violations
Objects must align to the 4px grid. Every position, every dimension, every spacing value must be a multiple of 4px. The only exception is text, which may use optical alignment at the line-box level.

### Law 4: No Edge Touching
Objects must maintain the Edge Buffer (16px mobile, 32px desktop) from viewport edges. This buffer is enforced by the Container component and must not be overridden.

### Law 5: Gravity Compliance
Objects must respect the placement hierarchy. A tertiary object cannot occupy the Dominant Center. A primary object cannot be pushed to the margin. The hierarchy is absolute.

---

# SECTION 11 — MOTION HIERARCHY

## The Five Motion Levels

Every animation in the Creative Engine is classified into one of five levels. The level determines duration, easing, properties, and purpose. No animation may exceed its level's constraints.

### Level 0: STATIC
**Duration:** 0ms (no animation)
**Properties:** None
**Usage:** Base layers, vignettes, grid (except breathing), scanlines, structural elements
**Rules:** Never animates. Always fixed. If an element is Level 0, it is painted once and never touched again.

### Level 1: BREATHING
**Duration:** 2000-4000ms cycles
**Properties:** opacity only
**Usage:** Grid opacity oscillation, subtle pulses on status indicators
**Rules:**
- Only opacity changes — never position, never scale, never rotation
- Always ease-in-out — smooth, predictable, ignorable
- Always looping — breathing never stops
- Always subtle — peak opacity change ≤ 0.3 of base opacity
- `prefers-reduced-motion`: Disabled (element appears static)

### Level 2: DRIFTING
**Duration:** 22000-45000ms cycles
**Properties:** transform (translate only)
**Usage:** Ambient orbs, dust particles, light sweep, focal light breathing
**Rules:**
- Only transform (translate) — never opacity as primary property
- Always ease-in-out — smooth, continuous, organic
- Always looping — drifting never stops
- Every element has unique timing — no two elements drift at the same speed
- Movement range: 4-15px maximum — drifting is subtle, not dramatic
- `prefers-reduced-motion`: Disabled (elements appear static)

### Level 3: REVEALING
**Duration:** 700-900ms
**Properties:** opacity (and optionally scale for CTAs)
**Usage:** Text fade-in, content reveal on scroll, section entrance
**Rules:**
- Only opacity — never translate (no slide-in, no fly-in)
- Exception: CTAs may use scale(0.95 → 1.0) for a "settle" effect
- Always cubic-bezier(0.22, 1, 0.36, 1) — the "decelerate" curve
- Never looping — revealing is a one-time event per element
- Triggered by scroll intersection (IntersectionObserver)
- `prefers-reduced-motion`: Disabled (elements appear immediately at full opacity)

### Level 4: INTERACTING
**Duration:** 100-300ms
**Properties:** opacity + transform (scale, translate)
**Usage:** Button hover, cursor glow fade, interactive state changes, focus rings
**Rules:**
- Opacity + transform — the fastest GPU-accelerated properties
- Always ease-out — responsive, immediate, satisfying
- Never overshoot — no bounce, no elastic, no spring
- Never looping — interacting is triggered by user action
- Maximum scale range: 0.95-1.0 — subtle, not dramatic
- `prefers-reduced-motion`: May be reduced but not disabled (interactive feedback is essential)

## The Seven Motion Laws

### Law 1: Hierarchy Compliance
Higher-level motions never interrupt lower-level motions. A Level 4 button hover never stops a Level 2 orb drift. A Level 3 content reveal never pauses a Level 1 grid breathing.

### Law 2: No Synchronization
No two animations start at the same time. Even when multiple elements reveal simultaneously, their start times are staggered by at least 50ms. Synchronized animation feels mechanical.

### Law 3: No Identical Loops
Every looping animation has unique timing. If two orbs drift at 30s, one must drift at 30.5s or 29.5s. Identical loops create a "clockwork" feeling that breaks the organic atmosphere.

### Law 4: GPU Only
Only `transform` and `opacity` are used for animation. `filter: blur()` is permitted for ambient elements. Layout properties (width, height, margin, padding, top, left) are never animated.

### Law 5: Reduced Motion Respect
All Level 1-3 motions are disabled when `prefers-reduced-motion: reduce` is active. Level 4 motions may be reduced but not disabled. The Engine must be fully functional without animation.

### Law 6: Easing Consistency
Every motion level has a designated easing function. These functions are never mixed within a level:
- Level 1-2: ease-in-out
- Level 3: cubic-bezier(0.22, 1, 0.36, 1)
- Level 4: ease-out

### Law 7: Duration Ceilings
No animation may exceed its level's maximum duration:
- Level 1: 4000ms
- Level 2: 45000ms
- Level 3: 900ms
- Level 4: 300ms

---

# SECTION 12 — DEPTH LAYERS

## The Six-Layer Depth Model (Detailed)

This section provides the complete technical specification for each depth layer, including element counts, rendering rules, and interaction protocols.

### Layer 1: BASE (Farthest)

**Purpose:** The foundation — the void upon which everything else is composed.

**Elements:**
| Element | Color | Opacity | Blur | Animation |
|---------|-------|---------|------|-----------|
| Base fill | #0D0A1A | 1.0 | None | Static |
| Vignette | Radial gradient | 0.0-0.55 | None | Static |
| Grid texture | #22D3EE | 0.03 | None | 4s breathing |
| Scanlines | Black | 0.04 | None | Static |

**Rendering:** Standard DOM. No GPU acceleration required (static elements).

**Interaction:** None. Layer 1 never responds to user input.

### Layer 2: BACKGROUND AMBIENT

**Purpose:** Creates the illusion of vast distance. Establishes the Engine's spatial scale.

**Elements:**
| Element | Size | Blur | Opacity | Drift Speed | Drift Range |
|---------|------|------|---------|-------------|-------------|
| Background Orb A | 800px | 60px | 0.025 | 40s cycle | 15px |
| Background Orb B | 700px | 55px | 0.018 | 45s cycle | 12px |
| Focal Light | 900×600px | 50px | 0.04 | 32s cycle | Scale only |

**Rendering:** GPU-accelerated (filter: blur, transform: translate).

**Interaction:** None. Layer 2 never responds to user input. The focal light is fixed behind the headline.

### Layer 3: MID AMBIENT

**Purpose:** Bridges the gap between background and foreground. Provides spatial context.

**Elements:**
| Element | Size | Blur | Opacity | Drift Speed | Drift Range |
|---------|------|------|---------|-------------|-------------|
| Mid Orb A | 450px | 35px | 0.015 | 30s cycle | 10px |
| Mid Orb B | 400px | 30px | 0.012 | 34s cycle | 8px |
| Light Sweep | 35% width | None | 0.012 | 35s (linear) | Full viewport |

**Rendering:** GPU-accelerated (filter: blur, transform: translate).

**Interaction:** None. Layer 3 never responds to user input.

### Layer 4: FOREGROUND AMBIENT

**Purpose:** Adds micro-depth close to the viewer. Creates the impression of floating particles near the surface.

**Elements:**
| Element | Size | Blur | Opacity | Drift Speed | Drift Range |
|---------|------|------|---------|-------------|-------------|
| Foreground Orb A | 200px | 15px | 0.01 | 22s cycle | 6px |
| Foreground Orb B | 180px | 12px | 0.008 | 26s cycle | 4px |
| Dust Particle 1 | 1.5px | None | 0.14 | 30s cycle | 12px |
| Dust Particle 2 | 1px | None | 0.1 | 36s cycle | 8px |

**Rendering:** GPU-accelerated (filter: blur, transform: translate, opacity).

**Interaction:** None. Layer 4 never responds to user input.

### Layer 5: CONTENT

**Purpose:** The information layer — everything the visitor reads, clicks, or interacts with.

**Elements:** Headlines, paragraphs, buttons, cards, navigation, forms, labels, status messages.

**Rendering:** Standard DOM rendering. No GPU acceleration required for static content. Reveals use GPU-accelerated opacity transitions.

**Interaction:** Full interactivity. Buttons, links, forms, and navigation are all active in this layer.

### Layer 6: INTERACTIVE (Nearest)

**Purpose:** The visitor's presence layer — cursor glow, hover states, focus rings.

**Elements:**
| Element | Size | Blur | Opacity | Behavior |
|---------|------|------|---------|----------|
| Cursor Glow | 450px | 20px | 0.025 | Lerp 0.03, 1.2s fade |
| Hover States | Variable | None | Variable | 160ms ease-out |
| Focus Rings | Element outline | None | 1.0 | Instant |

**Rendering:** GPU-accelerated (transform: translate, opacity).

**Interaction:** Directly responds to cursor position and user input.

## Layer Interaction Protocol

1. **Lower layers never occlude higher layers** — Background elements are always behind content. If a Layer 2 orb appears to be "in front of" text, its opacity is too high.
2. **Higher layers have higher opacity** — Interactive elements are always most visible. Content is always more visible than ambient.
3. **Blur increases with depth** — Distant elements are always blurrier. If a foreground element is blurry, it is broken.
4. **Speed increases with proximity** — Close elements move faster than distant elements. The parallax must feel natural.
5. **Elements never cross layers** — An orb that starts in Layer 3 stays in Layer 3. Layer-crossing breaks the depth illusion.

---

# SECTION 13 — CAMERA PHILOSOPHY

## Static Camera with Implicit Movement

The Creative Engine does not use a traditional camera system. There is no camera object, no camera position, no camera rotation. The viewport is the camera. However, **implicit camera movement** is created through three techniques:

### Technique 1: Scroll-Driven Reveal

As the visitor scrolls, content enters the viewport from below. This creates the illusion of a camera moving downward through the Engine. Content does not fly in from the sides, scale up from nothing, or rotate into view. It simply fades in from below — as if the camera is tilting down to reveal what was always there.

**Implementation:** IntersectionObserver triggers opacity reveals. Content starts at opacity: 0 and transitions to opacity: 1 over 800ms.

### Technique 2: Parallax Depth

Different depth layers move at different scroll speeds. The background moves slowly. The foreground moves quickly. This creates the illusion of a camera moving through a three-dimensional space with real depth.

**Implementation:** CSS `transform: translateY()` with scroll-dependent offsets. Each layer has a unique scroll multiplier (see Section 02).

### Technique 3: Focus Shift

Content focus shifts from section to section as the visitor scrolls. The focal light stays with the Hero. Other sections have their own ambient atmosphere. This creates the illusion of a camera refocusing on different subjects as it moves through the Engine.

**Implementation:** Each section has its own ambient lighting configuration. The focal light is unique to the Hero.

## The Five Camera Laws

### Law 1: Never Move the Camera
The viewport is always fixed. Only content moves. The visitor's screen is the camera — it does not pan, tilt, zoom, or rotate.

### Law 2: Never Rotate
No tilt, pan, or roll. The camera is always perfectly frontal. The Engine is a 2D interface with depth layers, not a 3D world.

### Law 3: Never Zoom
No scale transforms on the viewport level. Content scales through responsive design (clamp values, breakpoints), not through camera zoom.

### Law 4: Implicit Only
Camera movement is always implied through parallax, reveal, and focus shift. It is never explicit. The visitor should never think "the camera is moving" — they should think "I am exploring."

### Law 5: Scroll Is Camera
The only "camera movement" is scroll position. Scroll down = camera moves forward. Scroll up = camera moves backward. This is the only spatial navigation in the Engine.

---

# SECTION 14 — ENVIRONMENTAL STORYTELLING RULES

## The Principle of Implied History

The Creative Engine does not tell stories through text, cutscenes, or explicit narratives. It tells stories through **environmental implication** — visual details that suggest a history, a purpose, and a living system without explaining it.

The visitor should never think "the Engine is telling me a story." They should think "this place feels real, like it has been here for a long time, and it will be here long after I leave."

## The Four Storytelling Techniques

### Technique 1: Ambient Activity

Objects that move suggest the Engine is alive and operational. The speed and pattern of movement implies the type of activity:

| Movement Pattern | Implied Activity | Example |
|-----------------|------------------|---------|
| Slow drift (40-45s) | Background processing, idle systems | Background orbs |
| Moderate drift (30-34s) | Active systems, mid-range operations | Mid orbs |
| Fast drift (22-26s) | Surface activity, near-field operations | Foreground orbs |
| Gentle breathing (32s) | Primary system heartbeat | Focal light |
| Rapid breathing (4s) | Infrastructure pulse | Grid texture |
| Continuous linear (35s) | Periodic energy sweep | Light sweep |
| Particle float (30-36s) | Atmospheric energy particles | Dust particles |
| Stillness | Dormant, archived, or offline systems | Vignette, scanlines |

**Rules:**
- Active regions have more movement than dormant regions
- The Hero (Creative Core) has the most movement — it is the Engine's heart
- The Footer (Power Generator) has the least movement — it is the Engine's foundation
- Movement speed communicates proximity, not importance

### Technique 2: Light as Status

The brightness and color of light indicates system status:

| Light State | Implied Status | Example |
|-------------|----------------|---------|
| Bright warm light | Active, processing, alive | Focal light during interaction |
| Dim warm light | Idle, waiting, standby | Ambient orbs |
| Bright cyan light | Interactive, responsive, online | Cursor glow, button hover |
| Dim cyan light | Available, ready, listening | Accent indicators |
| No light | Dormant, archived, offline | Vignette edges, margins |
| Pulsing light | Processing, working, computing | Energy cells during boot |

**Rules:**
- Warm light = system status (alive/dead)
- Cool light = interaction status (active/available)
- Light intensity communicates importance, not proximity
- The absence of light is as meaningful as its presence

### Technique 3: Structural Density

The density of elements in a region implies its importance and activity level:

| Density Level | Implied Status | Example |
|--------------|----------------|---------|
| High density | Active, important, functional | Hero (headline + CTAs + ambient) |
| Medium density | Supporting, reference, storage | Projects (cards + ambient) |
| Low density | Ambient, background, atmosphere | Footer (minimal elements) |
| Empty | Reserved, future, potential | Margins, padding areas |

**Rules:**
- Active regions have higher structural density
- Dormant regions have lower structural density
- Empty space implies future growth or intentional rest
- Density changes between regions communicate functional differences

### Technique 4: Temporal Variation

The Engine changes subtly over time, suggesting continuous operation:

| Variation | Timescale | Implied Meaning |
|-----------|-----------|-----------------|
| Orb drift position | 22-45s | Continuous spatial processing |
| Focal light breathing | 32s | System heartbeat — always on |
| Grid opacity oscillation | 4s | Infrastructure pulse |
| Light sweep crossing | 35s | Periodic energy transfer |
| Dust particle drift | 30-36s | Atmospheric energy flow |

**Rules:**
- Temporal variation is always present, even when the visitor is not looking
- No two variations have the same timescale — the Engine is organic, not mechanical
- Temporal variation is the strongest cue that the Engine is alive
- Reducing temporal variation makes the Engine feel dead

## The Five Storytelling Laws

### Law 1: Never Explain
The Engine never tells the visitor what it is doing. No tooltips that say "this orb represents background processing." No labels that say "energy flow indicator." The Engine trusts the visitor to feel the atmosphere without being told how to feel it.

### Law 2: Always Suggest
Visual details imply activity without being explicit. The breathing focal light suggests a heartbeat. The drifting orbs suggest spatial processing. The filling energy cells suggest system initialization. The visitor infers meaning from behavior, not from labels.

### Law 3: Consistent Logic
Same visual cues always mean the same thing. Warm light = alive. Cyan light = interactive. Movement = processing. Stillness = dormant. If the Engine uses warm light to mean "alive" in the Hero, it cannot use warm light to mean "archived" in the About section.

### Law 4: Respect Intelligence
The visitor is smart enough to infer meaning from visual cues. The Engine does not over-explain, does not hold hands, does not spell out every detail. It presents an atmosphere and trusts the visitor to understand it.

### Law 5: Layer Discovery
Storytelling details are revealed over multiple visits. First visit: headline and CTAs. Second visit: ambient motion and depth. Third visit: pixel drone and boot details. Fourth visit: cursor glow and interactive elements. Fifth visit: the understanding that everything is connected. The Engine rewards attention.

---

# SECTION 15 — VISUAL MOOD BOARDS

## Mood Board 01: The Creative Core (Hero)

**Overall Feeling:** Standing in the center of something important. The moment before a concert begins — the stage is lit, the audience is seated, the energy is palpable.

**Color Palette:**
- Background: Deep void (#0D0A1A) — not black, but a near-black with warmth
- Focal: Warm orange glow (like sunset seen through frosted glass — diffused, soft, all-encompassing)
- Accent: Electric cyan (like LED indicators in a server room — precise, digital, intentional)
- Text: Pure white (#F8FAFC) against dark background — maximum contrast, maximum authority

**Textures:**
- Soft, feathered gradients — no hard edges anywhere in the ambient layer
- Subtle grid pattern — like graph paper seen through three layers of fog
- Faint scanlines — like a CRT monitor viewed through the corner of your eye
- Pixel art elements — sharp, blocky, honest — like a heartbeat monitor in a digital hospital

**Lighting Quality:**
- Single dominant warm light source — like a campfire in absolute darkness
- Peripheral darkness — like a stage with a single spotlight, edges fading to black
- Subtle ambient glow — like city lights seen from ten miles away
- Cursor response — like the room acknowledging your presence with a gentle warmth

**Spatial Feeling:**
- Vast — the background orbs suggest enormous distance behind the content
- Intimate — the focal light creates a small, warm space around the headline
- Alive — everything is moving, breathing, processing
- Three-dimensional — the depth layers create real spatial separation

**Emotional Keywords:** Focused, Warm, Commanding, Premium, Alive, Vast, Intimate

---

## Mood Board 02: The Factory District (Projects)

**Overall Feeling:** Walking through a clean, organized workshop where every tool has its place. The satisfaction of a well-organized tool wall.

**Color Palette:**
- Background: Dark indigo (#1E1B4B) — slightly warmer than the void, suggesting enclosure
- Active elements: Electric cyan (#22D3EE) — signals "this is work in progress"
- Completed work: Warm amber (#FB923C) — signals "this is finished, this is quality"
- Structure: Dark borders on slightly lighter backgrounds — defined, organized, industrial

**Textures:**
- Sharp, defined edges — like metal frames around workstations
- Grid-aligned elements — like organized tools on a pegboard
- Minimal gradient — like task lighting focused on work surfaces
- Card-based layout — like project folders on a desk

**Lighting Quality:**
- Task-oriented illumination — brighter than other regions, but not harsh
- Focused spots on active work areas — each project card is its own workstation
- Dim ambient between workstations — the spaces between projects are quiet
- Consistent, even lighting — the Factory is always operational, never dramatic

**Spatial Feeling:**
- Organized — every element has a grid position and a purpose
- Productive — the density of elements suggests active work
- Industrial — the sharpness of edges suggests precision manufacturing
- Satisfying — the orderliness creates a sense of competence

**Emotional Keywords:** Productive, Precise, Organized, Industrial, Crafted, Satisfying

---

## Mood Board 03: The Memory District (About)

**Overall Feeling:** Sitting in a quiet library with floor-to-ceiling bookshelves. The smell of old paper. The weight of accumulated knowledge.

**Color Palette:**
- Background: Dark indigo (#1E1B4B) — warm, enclosed, safe
- Memory accents: Soft warm glow — like reading lamps on individual desks
- Structure: Subtle borders, low contrast — like library shelves that fade into the background
- Text: High contrast for readability — like well-printed pages

**Textures:**
- Soft, paper-like — no harsh edges, like pages in a book
- Gentle gradients — like aged paper darkening at the edges
- Minimal pattern — like library shelves stretching into the distance
- Left-aligned text — like paragraphs in a well-set book

**Lighting Quality:**
- Soft overhead illumination — like reading lamps in a study
- Individual spotlights on important memories — each fact, each skill, each experience is illuminated
- Warm, inviting atmosphere — the Memory District welcomes reflection
- No harsh shadows — knowledge casts no shadows

**Spatial Feeling:**
- Calm — the spacing is generous, the rhythm is slow
- Deep — the background suggests shelves extending far back
- Permanent — the weight of the typography suggests enduring knowledge
- Trustworthy — the consistency and order suggest reliability

**Emotional Keywords:** Calm, Reflective, Wise, Trustworthy, Permanent, Deep

---

## Mood Board 04: The Knowledge Grid (Skills)

**Overall Feeling:** Standing in a control room with organized displays. Each screen shows a different system status. The hum of active processing.

**Color Palette:**
- Background: Dark indigo (#1E1B4B) — cool, technical, enclosed
- Active indicators: Electric cyan (#22D3EE) — "this system is operational"
- Warning indicators: Warm amber (#FB923C) — "this system is updating"
- Inactive indicators: Slate (#94A3B8) — "this system is available but idle"

**Textures:**
- Clean, digital — like modern UI dashboards
- Grid-based layout — like server status displays
- Status indicators — like LED lights on rack-mounted equipment
- Minimal decoration — every element communicates status

**Lighting Quality:**
- Cool, even illumination — like fluorescent lights in a server room
- Cyan accents on active systems — the cool glow of operational hardware
- No warm ambient — the Knowledge Grid is technical, not atmospheric
- Consistent brightness — no dramatic lighting, just clear visibility

**Spatial Feeling:**
- Technical — the precision of the layout suggests engineering
- Organized — every skill has its position, its indicator, its status
- Active — the status indicators suggest systems that are always running
- Capable — the density of information suggests deep expertise

**Emotional Keywords:** Technical, Structured, Precise, Capable, Active, Organized

---

## Mood Board 05: The Communication Tower (Contact)

**Overall Feeling:** Standing at a transmission station that is always listening. The warm glow of a "we're open" sign. The anticipation of connection.

**Color Palette:**
- Background: Dark indigo (#1E1B4B) — warm, open, accessible
- Active signals: Electric cyan (#22D3EE) — "we receive your signal"
- Warm welcome: Soft orange glow — "we are here, we are ready"
- Structure: Clean, minimal borders — like a well-designed form

**Textures:**
- Clean, digital — like modern contact forms
- Open, airy — like satellite dishes pointed at the sky
- Signal waves — like radio transmission visualizations
- Warm gradients — like the glow of a welcoming light

**Lighting Quality:**
- Warm, inviting glow — like a lighthouse in the harbor
- Active signal indicators — like blinking LEDs on a transmitter
- Consistent, reliable illumination — the Tower never dims
- The brightest ambient region after the Hero — the Tower is always ready

**Spatial Feeling:**
- Open — the spacing is generous, the layout is uncluttered
- Responsive — the form suggests immediate processing
- Welcoming — the warm lighting invites engagement
- Professional — the precision of the layout suggests competence

**Emotional Keywords:** Open, Responsive, Connected, Welcoming, Ready, Professional

---

## Mood Board 06: The Power Generator (Footer)

**Overall Feeling:** The steady hum of a generator that never stops. The heartbeat beneath the floor. The most important system because it is the most reliable.

**Color Palette:**
- Background: Darkest indigo (darker than #0D0A1A) — the deepest foundation
- Minimal accent: Subtle warm glow — like pilot lights on always-on equipment
- Text: Low-contrast slate (#94A3B8) — present but not prominent
- Structure: Nearly invisible — the Generator does not draw attention to itself

**Textures:**
- Minimal — the Generator has almost no texture
- Flat — no gradients, no depth, no atmosphere
- Grounding — the Generator is the floor, not the furniture

**Lighting Quality:**
- Low, consistent glow — like ambient light from equipment status LEDs
- No drama — the Generator does not breathe, does not drift, does not pulse
- Constant — the Generator's light never changes

**Spatial Feeling:**
- Grounded — the Generator is the foundation upon which everything else rests
- Stable — the Generator does not move, does not change, does not react
- Humble — the Generator is the least visible but most essential system
- Permanent — the Generator will outlast everything else

**Emotional Keywords:** Stable, Foundation, Humble, Permanent, Reliable, Grounded

---

# SECTION 16 — PERFORMANCE-ORIENTED ART DECISIONS

## The 60fps Mandate

Every visual element in the Creative Engine must maintain 60fps (16.67ms per frame) on target devices. This is not a performance optimization — it is a **creative constraint** that shapes every art decision. If an animation drops below 60fps, it is broken — regardless of how beautiful it looks.

## The GPU-First Art Philosophy

Every visual effect in the Engine must be achievable through GPU-accelerated properties. This constraint eliminates entire categories of visual effects (complex shadows, animated gradients, SVG filters, canvas animations) but it ensures consistent 60fps performance.

### Allowed Properties (GPU-Accelerated)

| Property | Usage | Notes |
|----------|-------|-------|
| `transform: translate()` | Position changes, drift, parallax | The primary movement property |
| `transform: scale()` | Size changes, CTA settle | Used sparingly (Level 4 only) |
| `opacity` | Visibility changes, reveals, fades | The primary visibility property |
| `filter: blur()` | Depth simulation, ambient blur | Maximum 60px, used on ambient elements only |
| `filter: brightness()` | Light intensity changes | Very limited use |

### Forbidden Properties (CPU-Rendered)

| Property | Why Forbidden | Alternative |
|----------|---------------|-------------|
| `width` / `height` | Triggers layout recalculation | Use `transform: scale()` |
| `top` / `left` / `right` / `bottom` | Triggers layout recalculation | Use `transform: translate()` |
| `margin` / `padding` | Triggers layout recalculation | Animate only on load (not continuous) |
| `border-width` | Triggers paint | Use `outline` or `box-shadow` |
| `box-shadow` | Triggers paint | Use `filter: drop-shadow()` |
| `text-shadow` | Triggers paint | Use `filter: drop-shadow()` |
| `background` (animated) | Triggers paint | Use static backgrounds + opacity overlay |
| `clip-path` | Triggers paint | Use `transform` + `opacity` |
| `mask` | Triggers paint | Avoid entirely |

## The Art Decision Framework

When choosing between two visual approaches, always prefer the GPU-friendly option:

| Decision | Prefer | Avoid |
|----------|--------|-------|
| Moving an element | `transform: translate()` | `top`/`left` animation |
| Hiding an element | `opacity: 0` | `display: none` / `visibility: hidden` |
| Creating depth | `filter: blur()` on background | Detailed background textures |
| Creating atmosphere | Smooth gradients | Complex patterns |
| Creating dimension | 2D transforms | 3D perspective transforms |
| Showing progress | Opacity change | Width/height change |
| Indicating hover | Opacity + scale(0.98) | Color change + box-shadow |

## Memory Budget

The Engine must operate within strict memory limits to ensure smooth performance on low-end devices:

| Element Category | Maximum Count | Memory Impact | Notes |
|-----------------|---------------|---------------|-------|
| Energy orbs | 6 | Low | Simple radial gradients |
| Dust particles | 2 | Minimal | 1-2px dots, nearly invisible |
| Cursor glow | 1 | Low | Single radial gradient |
| Content elements | 50 | Medium | DOM nodes (text, buttons, cards) |
| CSS animations | 15 | Low | GPU-accelerated only |
| Total DOM nodes | 200 | Medium | Including all ambient elements |

## Paint Budget

The Engine must minimize paint operations to maintain 60fps:

| Area | Maximum Paint Complexity |
|------|--------------------------|
| Hero section | 3 gradient layers + 1 blur filter |
| Content sections | 1 gradient layer |
| Interactive elements | 1 transition (opacity + transform) |
| Background | 1 solid color + 1 gradient overlay |
| Boot sequence | 20 pixel art elements (integer-scaled) |

## The Performance Art Rules

### Rule 1: Blur Is Expensive
`filter: blur()` is the most expensive GPU operation allowed in the Engine. Use it sparingly:
- Maximum 3 blurred elements visible simultaneously
- Maximum 60px blur radius
- Never blur content elements (only ambient elements)
- Consider reducing blur count on low-end devices (via `prefers-reduced-motion` detection)

### Rule 2: Gradient Is Cheap
Radial gradients are the Engine's primary visual tool. They are:
- Rendered once (not continuously)
- GPU-composited (not CPU-painted)
- Memory-efficient (simple color interpolation)
Use gradients freely for atmosphere and depth.

### Rule 3: Opacity Is Free
Changing opacity is the cheapest animation in the Engine. It triggers no layout, no paint, and minimal compositing. Use opacity for:
- Reveals (Level 3)
- Fades (Level 4)
- Breathing (Level 1)
- Depth communication (distant = lower opacity)

### Rule 4: Transform Is Cheap
Changing transform is the second-cheapest animation. It triggers compositing but not layout or paint. Use transform for:
- Drift (Level 2)
- Parallax (scroll-driven)
- Scale (Level 4 hover)
- Cursor tracking (Level 4 lerp)

### Rule 5: DOM Count Matters
Every DOM node consumes memory and slows down style recalculation. The Engine targets:
- Maximum 200 total DOM nodes
- Maximum 50 content elements
- Maximum 15 animated elements
- Minimum 3 ambient elements (to maintain atmosphere)

---

# SECTION 17 — PRODUCTION CONSTRAINTS

## Hard Constraints (Non-Negotiable)

These constraints are absolute. Every asset, every animation, every interaction must comply. Deviation requires art director approval and documented justification.

### C01: Grid Alignment
Every element must align to the 4px grid. No exceptions. Positions, dimensions, and spacing must all be multiples of 4px.

### C02: Color Palette
Every element must use colors from the approved palette (Section 05, Appendix A). No custom colors without art director approval. No gradients between unapproved colors.

### C03: Animation Duration
| Level | Maximum Duration |
|-------|-----------------|
| Level 0 | 0ms (no animation) |
| Level 1 | 4000ms |
| Level 2 | 45000ms |
| Level 3 | 900ms |
| Level 4 | 300ms |

### C04: Opacity Limit
| Element Type | Maximum Opacity |
|-------------|-----------------|
| Ambient (L1-L4) | 0.06 |
| Content (L5) | 1.0 |
| Interactive (L6) | 1.0 |

### C05: Element Count
No viewport may contain more than:
- 6 ambient orbs
- 2 dust particles
- 1 cursor glow
- 50 content elements
- 15 animated elements
- 200 total DOM nodes

### C06: Blur Limit
No element may exceed 60px blur. Most elements should be under 40px. Content elements must never use blur.

### C07: Touch Target
All interactive elements must be at least 44×44px. This is a WCAG 2.1 requirement, not a suggestion.

### C08: Contrast Ratio
| Text Type | Minimum Ratio |
|-----------|---------------|
| Body text (< 18px) | 4.5:1 (WCAG AA) |
| Large text (≥ 18px bold or ≥ 24px) | 3:1 (WCAG AA) |
| Pixel font text | 4.5:1 (WCAG AA) |

### C09: Reduced Motion
All Level 1-3 animations must be disabled when `prefers-reduced-motion: reduce` is active. Level 4 animations may be reduced but not disabled. The Engine must be fully functional and visually complete without any animation.

### C10: No Layout Animation
No element may animate `width`, `height`, `margin`, `padding`, `top`, `left`, `right`, `bottom`, `border-width`, or any other layout-triggering property. Animation is limited to `transform`, `opacity`, and `filter`.

### C11: No Z-Index Chaos
Z-index values must follow the layer system:
| Layer | Z-Index Range |
|-------|---------------|
| L1 Base | 0 |
| L2-L4 Ambient | 1-10 |
| L5 Content | 100-199 |
| L6 Interactive | 200-299 |
| Modals/Overlays | 1000+ |

No element may use a z-index outside its layer range without approval.

### C12: Accessibility
Every interactive element must have:
- Visible focus state (2px cyan outline)
- Keyboard accessibility (Tab navigation, Enter/Space activation)
- ARIA labels where visual labels are absent
- Screen reader compatibility

## Soft Constraints (Guidelines)

These constraints are guidelines. Deviation is allowed with documented justification.

### S01: Element Spacing
Prefer multiples of 8px for spacing. 4px minimum. 120px maximum for section padding.

### S02: Border Width
Prefer 1-2px borders. Never exceed 3px. Borders use `border-color` from the approved palette.

### S03: Border Radius
Prefer 0px (sharp corners). Use border-radius only for circular elements (orbs, dots, avatars). Maximum border-radius: 9999px (fully circular).

### S04: Font Size
Prefer the defined type scale (Section 07). Custom sizes require justification and must still be multiples of 4px.

### S05: Animation Easing
| Level | Preferred Easing |
|-------|-------------------|
| Level 1-2 | ease-in-out |
| Level 3 | cubic-bezier(0.22, 1, 0.36, 1) |
| Level 4 | ease-out |

### S06: Transition Property
Prefer `transition-property: opacity, transform` for all interactive transitions. Avoid transitioning `background-color`, `border-color`, or `color` — use opacity overlay instead.

### S07: Container Width
Prefer `max-w-7xl` (1280px) for content containers. Hero sections may use full viewport width. Footer uses full viewport width.

---

# APPENDIX A — COMPLETE ELEMENT REFERENCE

## Ambient Elements

| Element | Size | Blur | Opacity | Speed | Easing | Layer | Color |
|---------|------|------|---------|-------|--------|-------|-------|
| Focal Light | 900×600px | 50px | 0.04 max | 32s | ease-in-out | L2 | Warm orange |
| Background Orb A | 800px | 60px | 0.025 max | 40s | ease-in-out | L2 | Warm orange |
| Background Orb B | 700px | 55px | 0.018 max | 45s | ease-in-out | L2 | Warm amber |
| Mid Orb A | 450px | 35px | 0.015 max | 30s | ease-in-out | L3 | Warm orange |
| Mid Orb B | 400px | 30px | 0.012 max | 34s | ease-in-out | L3 | Warm amber |
| Foreground Orb A | 200px | 15px | 0.01 max | 22s | ease-in-out | L4 | Warm orange |
| Foreground Orb B | 180px | 12px | 0.008 max | 26s | ease-in-out | L4 | Warm amber |
| Dust Particle 1 | 1.5px | None | 0.14 max | 30s | ease-in-out | L4 | Warm gold |
| Dust Particle 2 | 1px | None | 0.1 max | 36s | ease-in-out | L4 | Warm gold |
| Light Sweep | 35% width | None | 0.012 max | 35s | linear | L3 | Warm amber |
| Cursor Glow | 450px | 20px | 0.025 max | 0.03 lerp | cubic-bezier | L6 | Warm orange |
| Vignette | Full viewport | None | 0.55 max | Static | — | L1 | Near-black |
| Grid | 32px cells | None | 0.03 | 4s | ease-in-out | L1 | Electric cyan |
| Scanlines | Full viewport | None | 0.04 | Static | — | L1 | Black |

## Animation Reference

| Animation | Duration | Easing | Property | Level | Trigger |
|-----------|----------|--------|----------|-------|---------|
| Button hover | 160ms | ease-out | opacity, transform | L4 | mouseenter |
| Button leave | 160ms | ease-out | opacity, transform | L4 | mouseleave |
| Content reveal | 800ms | cubic-bezier(0.22, 1, 0.36, 1) | opacity | L3 | scroll intersection |
| CTA primary reveal | 650ms | cubic-bezier(0.22, 1, 0.36, 1) | opacity, scale | L3 | scroll intersection |
| CTA secondary reveal | 820ms | cubic-bezier(0.22, 1, 0.36, 1) | opacity, scale | L3 | scroll intersection |
| CTA settle | 260ms | cubic-bezier(0.22, 1, 0.36, 1) | opacity, scale | L4 | after reveal |
| Grid breath | 4s | ease-in-out | opacity | L1 | continuous |
| Focal breath | 32s | ease-in-out | opacity, scale | L2 | continuous |
| Orb drift | 22-45s | ease-in-out | transform | L2 | continuous |
| Dust float | 30-36s | ease-in-out | transform, opacity | L2 | continuous |
| Light sweep | 35s | linear | transform | L2 | continuous |
| Cursor fade in | 1.2s | cubic-bezier(0.25, 0.1, 0.25, 1) | opacity | L4 | mouseenter |
| Cursor fade out | 1.2s | cubic-bezier(0.25, 0.1, 0.25, 1) | opacity | L4 | mouseleave |
| Cursor follow | 0.03 lerp | — | transform | L4 | mousemove |
| Boot sequence | 2600ms | cubic-bezier(0.22, 1, 0.36, 1) | multiple | L3 | page load |

---

# APPENDIX B — REGION-BY-REGION VISUAL SPECIFICATION

## Hero (Creative Core)

| Property | Value |
|----------|-------|
| Background | Full stack (all 7 layers) |
| Ambient orbs | 6 (2 background, 2 mid, 2 foreground) |
| Dust particles | 2 |
| Focal light | Yes (900×600px, 50px blur) |
| Cursor glow | Yes (450px, 0.03 lerp) |
| Grid texture | Yes (32px, breathing) |
| Scanlines | Yes (static) |
| Vignette | Yes (0.55 max) |
| Content | Headline, paragraph, 2 CTAs |
| Reveal timing | Headline 0ms, Paragraph 100ms, CTA-primary 650ms, CTA-secondary 820ms |
| Section padding | 80-120px vertical |

## Projects (Factory District)

| Property | Value |
|----------|-------|
| Background | Simplified (L0, L1, L3, L7) |
| Ambient orbs | 2 maximum (warm) |
| Content | Project cards in grid |
| Card style | Dark background, border, hover opacity change |
| Reveal timing | Staggered card reveals on scroll |
| Section padding | 80-120px vertical |

## About (Memory District)

| Property | Value |
|----------|-------|
| Background | Simplified (L0, L1, L3, L7) |
| Ambient orbs | 2 maximum (warm) |
| Content | Bio text, skills summary |
| Text alignment | Left-aligned |
| Reveal timing | Staggered paragraph reveals |
| Section padding | 80-120px vertical |

## Contact (Communication Tower)

| Property | Value |
|----------|-------|
| Background | Simplified (L0, L1, L3, L7) |
| Ambient orbs | 2 maximum (warm, slightly brighter) |
| Content | Contact form, contact info |
| Form style | Dark inputs, cyan focus, cyan submit button |
| Reveal timing | Staggered field reveals |
| Section padding | 80-120px vertical |

## Footer (Power Generator)

| Property | Value |
|----------|-------|
| Background | Minimal (L0, L1, L7) |
| Ambient orbs | 0 |
| Content | Navigation links, copyright |
| Text color | Slate (#94A3B8) — low contrast, humble |
| Reveal timing | None (static) |
| Section padding | 32-48px vertical |

---

# APPENDIX C — ASSET APPROVAL CHECKLIST

Before any visual asset is approved for production, verify every item:

## Grid & Layout
- [ ] All positions are multiples of 4px
- [ ] All dimensions are multiples of 4px
- [ ] All spacing is a multiple of 4px
- [ ] Elements align to the 4px grid
- [ ] Edge buffer is maintained (16px mobile, 32px desktop)

## Color & Material
- [ ] All colors are from the approved palette
- [ ] Material category is correctly assigned (Energy/Structure/Interface/Text)
- [ ] Opacity is within material limits
- [ ] No unauthorized gradients

## Animation & Motion
- [ ] Animation level is correctly classified (0-4)
- [ ] Duration is within level limits
- [ ] Easing matches level specification
- [ ] Only GPU-accelerated properties are animated
- [ ] `prefers-reduced-motion` is respected
- [ ] No two animations start simultaneously
- [ ] No identical loops

## Depth & Layering
- [ ] Element is assigned to the correct depth layer (L1-L6)
- [ ] Blur matches depth layer specification
- [ ] Element does not occlude higher layers
- [ ] Z-index is within layer range

## Performance
- [ ] Total DOM nodes ≤ 200
- [ ] Animated elements ≤ 15
- [ ] Ambient orbs ≤ 6
- [ ] Blur radius ≤ 60px
- [ ] No CPU-rendered animations

## Accessibility
- [ ] Text meets WCAG AA contrast ratio
- [ ] Interactive elements are ≥ 44×44px
- [ ] Focus state is visible
- [ ] Keyboard navigation works
- [ ] Screen reader labels are present

## Storytelling
- [ ] Element serves a functional purpose
- [ ] Element follows consistent visual logic
- [ ] Element contributes to the region's atmosphere
- [ ] Element does not compete with primary content

---

# APPENDIX D — DESIGN DECISION LOG

| Decision | Rationale | Date |
|----------|-----------|------|
| Orthographic perspective over vanishing-point perspective | The Engine is an interface, not a world. Orthographic maintains readability. | Phase 1 |
| Warm ambient / cool interactive color split | Creates instant visual language: warm = atmosphere, cyan = action. | Phase 1 |
| 4px base grid | Balances precision with flexibility. 2px is too tight, 8px is too loose. | Phase 1 |
| 6-layer depth model | More layers = finer depth control. Fewer layers = insufficient spatial depth. | Phase 1.5 |
| 0.03 cursor lerp | Heavy enough to feel organic, light enough to feel responsive. | Phase 1 |
| 32s focal breathing | Slow enough to be subconsciously felt, fast enough to be noticed on close inspection. | Phase 1 |
| 50% negative space minimum | Forces restraint. Compositions with less negative space feel cluttered. | Phase 1.5 |
| No 3D transforms | 3D transforms break the orthographic contract. The Engine is 2D with depth layers. | Phase 1.5 |
| Pixel art for boot only | Pixel art in content areas reduces readability. Reserved for decorative/system elements. | Phase 1.5 |
| cubic-bezier(0.22, 1, 0.36, 1) for reveals | The "decelerate" curve — fast start, slow finish — feels like content settling into place. | Phase 1 |

---

*This document defines every visual rule necessary so that every future asset feels like it belongs to one handcrafted universe.*

*Phase 1.5 — Production Art Bible*
*AMR YOUSRY Creative Studio*
