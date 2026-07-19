# AMR YOUSRY CREATIVE ENGINE
## Phase 1.75 — Pixel Asset Pipeline v1.0

**Classification:** Internal Production Handbook
**Studio:** AMR YOUSRY Creative Studio
**Version:** 1.0 — Phase 1.75
**Status:** Production Standard
**Authority:** This document is the mandatory production pipeline for every pixel asset in the Creative Engine universe. No asset may be created, modified, or deployed without following this pipeline.

---

# PREAMBLE

This document is the production bible for the Creative Engine's pixel art pipeline. It does not teach pixel art. It defines the exact process every artist must follow to produce pixel assets that feel handcrafted by the same studio.

Every sprite, every animation frame, every visual effect, every decorative element that enters the Creative Engine must pass through this pipeline. There are no shortcuts. There are no exceptions. The pipeline exists because consistency is not accidental — it is manufactured.

If an asset does not follow this pipeline, it does not ship.

---

# SECTION 01 — ASSET CLASSIFICATION

## Official Asset Taxonomy

Every pixel asset in the Creative Engine belongs to exactly one of eight categories. The category determines the asset's purpose, visual priority, complexity budget, animation behavior, quantity limits, and performance cost.

### Category 01: HERO OBJECTS

**Purpose:** The primary visual anchors of the Creative Engine. Hero objects are the first things the visitor sees and the last things they remember. They define the Engine's identity.

**Members:**
- Pixel Drone (boot sequence mascot)
- Creative Core (focal light system)
- Hero headline ambient effects

**Visual Priority:** Maximum — highest rendering order among pixel elements
**Complexity:** High — up to 6 unique colors, multiple animation states
**Animation Frequency:** Continuous (always active when visible)
**Maximum Quantity:** 2 per viewport
**Performance Budget:** 15% of pixel art GPU budget

**Rules:**
- Hero objects must be immediately recognizable at 50% viewport width
- Hero objects must maintain pixel perfection at all zoom levels
- Hero objects must have complete animation sets (idle, activate, deactivate)
- Hero objects are the only assets permitted to use 6-color palettes

---

### Category 02: AMBIENT OBJECTS

**Purpose:** Atmospheric elements that create the Engine's spatial depth and living quality. They are not noticed consciously — they are felt.

**Members:**
- Depth layer orbs (background, mid, foreground)
- Atmospheric dust particles
- Light sweep effects
- Vignette overlays

**Visual Priority:** Low — always behind content layers
**Complexity:** Low — 1-2 colors maximum, simple shapes
**Animation Frequency:** Continuous drift (22-45s cycles)
**Maximum Quantity:** 10 per viewport (6 orbs + 2 dust + 1 sweep + 1 vignette)
**Performance Budget:** 25% of pixel art GPU budget

**Rules:**
- Ambient objects must never enter the Dominant Center zone
- Ambient objects must always use the warm color palette
- Ambient objects must drift at unique speeds (no two identical)
- Ambient objects must be invisible at first glance — discovered over time

---

### Category 03: INTERACTIVE OBJECTS

**Purpose:** Elements that respond to the visitor's presence. They acknowledge interaction without demanding it.

**Members:**
- Cursor glow
- Hover state indicators
- Focus ring accents
- Click feedback elements

**Visual Priority:** High — always in front of content
**Complexity:** Medium — 2-3 colors, responsive animation
**Animation Frequency:** On-demand (triggered by user input)
**Maximum Quantity:** 3 per viewport
**Performance Budget:** 10% of pixel art GPU budget

**Rules:**
- Interactive objects must respond within 160ms of user input
- Interactive objects must use the cool color palette (cyan family)
- Interactive objects must fade in/out smoothly (never snap)
- Interactive objects must have visible focus states for accessibility

---

### Category 04: ENVIRONMENTAL OBJECTS

**Purpose:** Functional elements that exist within specific regions of the Engine. They communicate the purpose and status of their region.

**Members:**
- Memory Crystals (About section)
- Signal Beacons (Contact section)
- Data Chips (Skills section)
- Energy Streams (connecting elements)
- Portal System (navigation transitions)

**Visual Priority:** Medium — visible but not dominant
**Complexity:** Medium — 3-4 colors, region-specific design
**Animation Frequency:** Moderate (idle loops, activation on scroll)
**Maximum Quantity:** 4 per region
**Performance Budget:** 20% of pixel art GPU budget

**Rules:**
- Environmental objects must match their region's mood board
- Environmental objects must use region-appropriate color palettes
- Environmental objects must animate at Level 1-2 speeds (breathing, drifting)
- Environmental objects must degrade gracefully when offscreen

---

### Category 05: BACKGROUND OBJECTS

**Purpose:** Structural textures and patterns that establish the Engine's digital architecture. They are the wallpaper of the digital world.

**Members:**
- Grid texture (32px cells)
- Scanline overlay (CRT effect)
- Background tile patterns
- Section divider textures

**Visual Priority:** Lowest — always behind everything
**Complexity:** Minimal — 1 color maximum, repeating patterns
**Animation Frequency:** Static or Level 1 breathing (4s cycle)
**Maximum Quantity:** 3 per viewport
**Performance Budget:** 5% of pixel art GPU budget

**Rules:**
- Background objects must tile seamlessly
- Background objects must use the lowest opacity in the viewport (0.03-0.04)
- Background objects must never animate position (opacity only)
- Background objects must use `image-rendering: pixelated`

---

### Category 06: FX OBJECTS

**Purpose:** Visual effects that communicate system events — boot completion, energy transfer, state changes. They are the Engine's punctuation.

**Members:**
- Boot sequence energy cells
- System status indicators
- Energy transfer animations
- Particle burst effects (future)
- Glow pulses (future)

**Visual Priority:** Context-dependent — high during events, zero otherwise
**Complexity:** Medium — 2-3 colors, event-triggered
**Animation Frequency:** Event-driven (not continuous)
**Maximum Quantity:** 5 per viewport (during events only)
**Performance Budget:** 15% of pixel art GPU budget

**Rules:**
- FX objects must have clear start and end states
- FX objects must complete within their designated duration
- FX objects must not loop indefinitely (except boot sequence)
- FX objects must respect `prefers-reduced-motion`

---

### Category 07: UI PIXEL ELEMENTS

**Purpose:** Pixel-styled interface components that bridge the retro aesthetic with functional UI. They are the Engine's control panel.

**Members:**
- Pixel-styled buttons
- Status bars
- Progress indicators
- Navigation arrows
- Form field decorations

**Visual Priority:** Medium — functional but stylized
**Complexity:** Low — 2 colors, simple geometry
**Animation Frequency:** On-demand (state changes)
**Maximum Quantity:** 8 per viewport
**Performance Budget:** 5% of pixel art GPU budget

**Rules:**
- UI pixel elements must meet 44×44px minimum touch target
- UI pixel elements must have visible hover and focus states
- UI pixel elements must use the Interface material category
- UI pixel elements must maintain readability at all viewport sizes

---

### Category 08: DECORATIVE ELEMENTS

**Purpose:** Non-functional pixel details that add character and charm. They are the Engine's personality.

**Members:**
- Boot sequence decorations
- Corner accents
- Section transition ornaments
- Easter egg elements (future)

**Visual Priority:** Low — noticed on close inspection
**Complexity:** Low — 1-2 colors, simple shapes
**Animation Frequency:** Static or Level 1 breathing
**Maximum Quantity:** 6 per viewport
**Performance Budget:** 5% of pixel art GPU budget

**Rules:**
- Decorative elements must never compete with content for attention
- Decorative elements must be at lower opacity than functional elements
- Decorative elements must follow the same palette as their region
- Decorative elements must be removable without affecting functionality

---

## Category Summary Table

| Category | Priority | Max Colors | Max Count | Animation | Budget |
|----------|----------|------------|-----------|-----------|--------|
| Hero | Maximum | 6 | 2 | Continuous | 15% |
| Ambient | Low | 2 | 10 | Continuous drift | 25% |
| Interactive | High | 3 | 3 | On-demand | 10% |
| Environmental | Medium | 4 | 4 per region | Moderate | 20% |
| Background | Minimal | 1 | 3 | Static/breathing | 5% |
| FX | Context | 3 | 5 | Event-driven | 15% |
| UI Pixel | Medium | 2 | 8 | On-demand | 5% |
| Decorative | Low | 2 | 6 | Static/breathing | 5% |

---

# SECTION 02 — PRODUCTION WORKFLOW

## The Fourteen-Stage Pipeline

Every pixel asset must pass through fourteen stages. No stage may be skipped. No stage may be combined with another. Each stage has specific inputs, outputs, and approval criteria.

---

### Stage 01: RESEARCH

**Purpose:** Understand the asset's role in the universe before drawing a single pixel.

**Input:** Asset brief from the Art Director
**Output:** Research document (written, not visual)

**Activities:**
1. Read the World Bible section relevant to the asset's region
2. Read the Visual Concept Document section relevant to the asset's category
3. Identify the asset's narrative purpose (what story does it tell?)
4. Identify the asset's functional purpose (what does it do?)
5. Identify the asset's emotional purpose (how should it make the visitor feel?)
6. Study the existing assets in the same category for consistency
7. Document all findings in a research brief

**Approval Criteria:**
- [ ] Asset's narrative purpose is documented
- [ ] Asset's functional purpose is documented
- [ ] Asset's emotional purpose is documented
- [ ] Existing similar assets have been studied
- [ ] Region mood board has been reviewed
- [ ] Category constraints have been noted

**Gate:** Art Director reviews research brief. Approval required before proceeding.

---

### Stage 02: SILHOUETTE EXPLORATION

**Purpose:** Find the asset's shape before finding its details. Silhouette is the foundation of readability.

**Input:** Research document
**Output:** 3-5 silhouette variations (black shapes on white background)

**Activities:**
1. Create 3-5 solid black silhouettes at native resolution
2. Each silhouette must be immediately recognizable at 50% scale
3. Each silhouette must be unique — no two should read the same
4. Test silhouettes against the Engine's background color (#0D0A1A)
5. Test silhouettes at 50% and 25% viewport width
6. Select the strongest silhouette based on readability and character

**Approval Criteria:**
- [ ] At least 3 silhouette variations exist
- [ ] Each silhouette is recognizable at 50% scale
- [ ] Each silhouette is unique (no duplicates)
- [ ] Silhouette reads clearly against #0D0A1A
- [ ] Silhouette fits the asset's category and region
- [ ] Strongest silhouette is selected with justification

**Gate:** Art Director selects final silhouette. Approval required before proceeding.

---

### Stage 03: PIXEL CONSTRUCTION

**Purpose:** Build the sprite's structural foundation using only black and white pixels.

**Input:** Approved silhouette
**Output:** Black-and-white pixel sprite at native resolution

**Activities:**
1. Place the silhouette on a canvas at native resolution
2. Define the sprite's internal structure using only black (structure) and white (void)
3. Establish pixel clusters — groups of same-color pixels that read as a single unit
4. Ensure every pixel has a purpose — no orphan pixels
5. Verify the sprite reads correctly at native resolution
6. Verify the sprite reads correctly at 2× and 3× integer scale

**Approval Criteria:**
- [ ] Sprite is built at native resolution
- [ ] Internal structure is clear in black and white
- [ ] Pixel clusters are well-defined
- [ ] No orphan pixels (every pixel serves a purpose)
- [ ] Sprite reads correctly at native, 2×, and 3× scale
- [ ] Sprite aligns to the pixel grid

**Gate:** Self-review against checklist. Art Director review for complex assets.

---

### Stage 04: SHAPE REFINEMENT

**Purpose:** Polish the sprite's pixel clusters until every edge is clean, every curve is smooth, and every detail is intentional.

**Input:** Black-and-white pixel sprite
**Output:** Refined black-and-white sprite with clean edges

**Activities:**
1. Remove any pixel that does not contribute to the silhouette or internal structure
2. Smooth any jagged edges that break the sprite's readability
3. Ensure consistent pixel cluster sizes — no isolated single pixels unless intentional
4. Verify the sprite's "sub-pixel" reads — the implied curves between pixels
5. Test the sprite at 100%, 50%, and 25% scale
6. Verify the sprite does not become muddy at small sizes

**Approval Criteria:**
- [ ] All edges are clean and intentional
- [ ] Pixel clusters are consistent in size
- [ ] No stray pixels remain
- [ ] Sprite reads clearly at all three test scales
- [ ] Sub-pixel reads are smooth
- [ ] Sprite feels "crafted" not "accidental"

**Gate:** Self-review. Peer review for complex assets.

---

### Stage 05: COLOR BLOCKING

**Purpose:** Apply the approved color palette to the black-and-white sprite.

**Input:** Refined black-and-white sprite + approved palette
**Output:** Color-blocked sprite (flat colors, no lighting)

**Activities:**
1. Select colors from the approved palette (Section 05)
2. Apply flat colors to the sprite's internal regions
3. Ensure maximum 4 colors per sprite (6 for Hero objects only)
4. Verify color contrast between adjacent regions
5. Test the sprite against #0D0A1A background
6. Test the sprite against white background (for dark sprites)

**Approval Criteria:**
- [ ] All colors are from the approved palette
- [ ] Maximum 4 colors used (6 for Hero objects)
- [ ] Colors are flat (no gradients, no lighting)
- [ ] Contrast between adjacent regions is sufficient
- [ ] Sprite reads against both dark and light backgrounds
- [ ] Color usage matches the asset's material category

**Gate:** Art Director reviews color choices. Approval required before proceeding.

---

### Stage 06: MATERIAL DEFINITION

**Purpose:** Assign each color region its material property — what the surface "feels like."

**Input:** Color-blocked sprite
**Output:** Material-annotated sprite (written annotations, not visual changes)

**Activities:**
1. For each color region, assign a material: Energy, Structure, Interface, or Text
2. Document which regions are emissive (glow), which are solid, which are interactive
3. Verify material assignments match the asset's category
4. Ensure Energy materials are on ambient/background elements
5. Ensure Structure materials are on solid elements
6. Ensure Interface materials are on interactive elements

**Approval Criteria:**
- [ ] Every color region has a material assignment
- [ ] Material assignments match the asset's category
- [ ] Energy materials are only on ambient/background elements
- [ ] Structure materials are only on solid elements
- [ ] Interface materials are only on interactive elements
- [ ] Material assignments are documented

**Gate:** Self-review. Art Director review for complex assets.

---

### Stage 07: LIGHTING PASS

**Purpose:** Apply the universal lighting system (Section 06) to the sprite.

**Input:** Material-annotated sprite
**Output:** Lit sprite (highlights and shadows applied)

**Activities:**
1. Determine the primary light direction (upper-left, 45°)
2. Apply highlight pixels to surfaces facing the light
3. Apply shadow pixels to surfaces facing away from the light
4. Ensure consistent lighting across all sprites in the same region
5. Verify lighting does not break the silhouette
6. Verify lighting does not exceed the color palette limit

**Approval Criteria:**
- [ ] Light direction is consistent with the universal lighting system
- [ ] Highlights are on the correct surfaces
- [ ] Shadows are on the correct surfaces
- [ ] Lighting does not break the silhouette
- [ ] Color palette limit is maintained
- [ ] Lighting matches other sprites in the same region

**Gate:** Art Director reviews lighting consistency. Approval required before proceeding.

---

### Stage 08: SHADOW PASS

**Purpose:** Add depth shadows that create volume and three-dimensionality.

**Input:** Lit sprite
**Output:** Sprite with depth shadows

**Activities:**
1. Add shadow pixels under overlapping elements
2. Add shadow pixels at the base of vertical elements
3. Ensure shadows use the darkest color in the palette
4. Verify shadows do not exceed 1-pixel width (for most sprites)
5. Verify shadows do not muddy the sprite's readability
6. Test shadows at 2× and 3× scale

**Approval Criteria:**
- [ ] Shadows are placed logically (under overlaps, at bases)
- [ ] Shadows use the darkest palette color
- [ ] Shadow width is 1px maximum (unless justified)
- [ ] Shadows do not reduce readability
- [ ] Shadows scale correctly at 2× and 3×
- [ ] Shadows are consistent with other sprites

**Gate:** Self-review. Art Director review for complex assets.

---

### Stage 09: GLOW PASS

**Purpose:** Add emissive glow to Energy material regions, creating the Engine's signature luminous quality.

**Input:** Shadowed sprite
**Output:** Sprite with glow effects (rendered as additional frames or CSS)

**Activities:**
1. Identify Energy material regions (from Stage 06)
2. Add 1-pixel glow border around emissive regions (same color, lower opacity)
3. For animated glow, create a separate glow frame or CSS animation
4. Ensure glow does not exceed the sprite's boundaries by more than 1px
5. Verify glow is visible against #0D0A1A background
6. Verify glow does not overpower the sprite's core colors

**Approval Criteria:**
- [ ] Glow is only on Energy material regions
- [ ] Glow border is 1px maximum
- [ ] Glow is visible against the dark background
- [ ] Glow does not overpower core colors
- [ ] Glow animation (if any) is Level 1 (breathing, 4s cycle)
- [ ] Glow respects the palette limit

**Gate:** Self-review. Art Director review for Hero objects.

---

### Stage 10: ANIMATION

**Purpose:** Bring the sprite to life with motion that communicates its state and personality.

**Input:** Completed static sprite
**Output:** Full animation set for the asset

**Activities:**
1. Define required animation states (Section 07)
2. Create animation frames at native resolution
3. Ensure each frame maintains pixel perfection
4. Ensure animation timing matches the asset's motion level
5. Test animation at 1×, 2×, and 3× scale
6. Verify animation does not exceed frame budget

**Approval Criteria:**
- [ ] All required animation states are complete
- [ ] Every frame maintains pixel perfection
- [ ] Animation timing matches the asset's motion level
- [ ] Animation scales correctly at all integer multiples
- [ ] Frame count is within budget (Section 10)
- [ ] Animation is smooth at 60fps

**Gate:** Art Director reviews animation quality. Approval required before proceeding.

---

### Stage 11: OPTIMIZATION

**Purpose:** Reduce the asset's memory and performance footprint without reducing visual quality.

**Input:** Completed animated sprite
**Output:** Optimized sprite ready for integration

**Activities:**
1. Remove any unused colors from the palette
2. Remove any transparent pixels that can be cropped
3. Verify the sprite uses the minimum necessary canvas size
4. Compress the sprite file (lossless only — PNG, WebP)
5. Verify the sprite's file size is within budget
6. Verify the sprite renders correctly after compression

**Approval Criteria:**
- [ ] Palette contains no unused colors
- [ ] Canvas is cropped to minimum necessary size
- [ ] File format is lossless (PNG or WebP)
- [ ] File size is within budget (Section 10)
- [ ] Visual quality is unchanged after compression
- [ ] Sprite renders correctly in the browser

**Gate:** Technical Lead reviews optimization. Approval required before proceeding.

---

### Stage 12: INTEGRATION TESTING

**Purpose:** Verify the asset works correctly within the Creative Engine's rendering pipeline.

**Input:** Optimized sprite
**Output:** Integration test report

**Activities:**
1. Load the sprite in the development environment
2. Verify `image-rendering: pixelated` is applied
3. Verify integer scaling at 1×, 2×, 3×, and 4×
4. Verify the sprite aligns to the 4px grid
5. Verify the sprite does not trigger layout recalculation
6. Verify the sprite respects `prefers-reduced-motion`
7. Verify the sprite does not exceed its performance budget
8. Test on Chrome, Firefox, Safari, and Edge
9. Test on mobile (iOS Safari, Chrome Android)

**Approval Criteria:**
- [ ] `image-rendering: pixelated` is applied
- [ ] Integer scaling works at all scales
- [ ] 4px grid alignment is maintained
- [ ] No layout recalculation triggered
- [ ] `prefers-reduced-motion` is respected
- [ ] Performance budget is maintained
- [ ] Works on all target browsers
- [ ] Works on mobile devices

**Gate:** Technical Lead reviews integration. Approval required before proceeding.

---

### Stage 13: CREATIVE REVIEW

**Purpose:** Final art direction review to ensure the asset meets the Creative Engine's quality standards.

**Input:** Integrated sprite
**Output:** Creative review report

**Activities:**
1. Review the asset against Section 12 (Creative Review Process)
2. Verify the asset matches its research document
3. Verify the asset matches the region's mood board
4. Verify the asset does not conflict with existing assets
5. Verify the asset contributes to the Engine's storytelling
6. Verify the asset feels like it belongs to the same universe

**Approval Criteria:**
- [ ] Asset matches its research document
- [ ] Asset matches the region's mood board
- [ ] Asset does not conflict with existing assets
- [ ] Asset contributes to the Engine's storytelling
- [ ] Asset feels like it belongs to the same universe
- [ ] Asset passes all 8 creative review categories (Section 12)

**Gate:** Creative Director reviews the asset. Final approval required before shipping.

---

### Stage 14: FINAL APPROVAL

**Purpose:** Formal sign-off that the asset is production-ready.

**Input:** Creative review report + integration test report
**Output:** Asset added to the production library

**Activities:**
1. Compile all stage outputs into a single asset dossier
2. Obtain signatures from Art Director, Technical Lead, and Creative Director
3. Add the asset to the production asset library
4. Update the asset registry with metadata
5. Announce the asset to the team

**Approval Criteria:**
- [ ] All 14 stages are complete
- [ ] All gate approvals are documented
- [ ] Asset dossier is compiled
- [ ] All three sign-offs are obtained
- [ ] Asset is in the production library
- [ ] Asset registry is updated

**Gate:** Asset is production-ready. No further changes without a new pipeline run.

---

# SECTION 03 — SPRITE STANDARDS

## Canvas and Resolution

### Native Canvas Sizes

Every sprite is created at its **native resolution** — the smallest size at which all pixel details are visible. The native resolution is the source of truth. All other sizes are derived through integer scaling.

| Asset Type | Native Canvas | Max Detail Level |
|------------|---------------|------------------|
| Hero Object | 24 × 28px to 32 × 32px | 6 colors, full detail |
| Environmental Object | 16 × 16px to 24 × 24px | 4 colors, moderate detail |
| FX Object | 8 × 8px to 16 × 16px | 3 colors, minimal detail |
| UI Pixel Element | 8 × 8px to 12 × 12px | 2 colors, minimal detail |
| Decorative Element | 4 × 4px to 8 × 8px | 2 colors, minimal detail |
| Background Tile | 8 × 8px to 32 × 32px | 1 color, pattern only |
| Dust Particle | 1 × 1px to 2 × 2px | 1 color, single pixel |

### Render Scale

All sprites are rendered at integer multiples of their native resolution:

| Scale | Usage | Example (24×28 native) |
|-------|-------|------------------------|
| 1× | Default display | 24 × 28px |
| 2× | High-DPI displays | 48 × 56px |
| 3× | Ultra high-DPI / zoom | 72 × 84px |
| 4× | Maximum zoom | 96 × 112px |

**Forbidden scales:** 1.5×, 2.5×, 3.5×, or any non-integer multiplier. These create uneven pixel rows/columns that break the pixel grid aesthetic.

### Safe Padding

Every sprite must include **1px transparent padding** on all four edges. This prevents adjacent sprites from touching when rendered in close proximity.

```
┌──────────────────────┐
│ · (transparent)      │
│ · ┌──────────────┐   │
│ · │              │   │
│ · │   SPRITE     │   │
│ · │   CONTENT    │   │
│ · │              │   │
│ · └──────────────┘   │
│ · (transparent)      │
└──────────────────────┘
```

**Rule:** The safe padding is part of the canvas. A 24×28px sprite with 1px padding on all sides has a 22×26px content area.

### Pivot Point

Every sprite's pivot point is at its **geometric center**. This ensures consistent rotation and scaling behavior.

| Canvas Size | Pivot Point (x, y) |
|-------------|---------------------|
| 24 × 28px | (12, 14) |
| 16 × 16px | (8, 8) |
| 8 × 8px | (4, 4) |

### Origin Point

The origin point is the sprite's **top-left corner** (0, 0). All position calculations use the origin point. The pivot point is used only for rotation and scaling transforms.

### Anchor System

Sprites are anchored using CSS `transform-origin`:

| Anchor | CSS Value | Usage |
|--------|-----------|-------|
| Center | `center center` (default) | Most sprites |
| Bottom-center | `center bottom` | Grounded elements |
| Top-center | `center top` | Floating elements |

### Pixel Alignment

Every sprite must align to the pixel grid. At native resolution, every pixel occupies exactly one screen pixel. At 2× scale, every pixel occupies exactly 4 screen pixels (2×2). At 3×, exactly 9 (3×3).

**Verification:** At any integer scale, zoom in to 400% in the browser. Every pixel boundary should be a clean, sharp edge. No anti-aliasing, no blurring, no sub-pixel rendering.

### Transparent Margins

Transparent pixels within the sprite canvas are permitted but must be intentional:

- **Allowed:** Transparent pixels that define the sprite's silhouette (e.g., space between wings)
- **Forbidden:** Transparent pixels that are leftover from incomplete cleanup
- **Verification:** Open the sprite in a pixel editor. Every transparent pixel should be deliberately placed.

### Grid Rules

All sprites must adhere to the Engine's grid system:

| Rule | Value |
|------|-------|
| Base pixel size | 2px (display) / 1px (native) |
| Grid unit | 2px (display) |
| Minimum sprite size | 4 × 4px (display) |
| Maximum sprite size | 128 × 128px (display) |
| Alignment | Pixel grid (not 4px UI grid) |

## Sprite Sheet Layout

When multiple animation frames are stored in a single image:

### Layout Rules
1. Frames are arranged **horizontally** (left to right, oldest to newest)
2. Each frame occupies an equal-sized cell
3. Cell size = sprite's native canvas size
4. No spacing between cells (frames are contiguous)
5. Transparent padding is included within each cell

### Frame Order
1. Idle state (first frame)
2. Active states (left to right)
3. Return to idle (last frame = first frame, for seamless loops)

### Example: Drone Animation Sheet
```
Frame 0: Idle (neutral)
Frame 1: Bob up
Frame 2: Bob down
Frame 3: Tilt left
Frame 4: Tilt right
Frame 5: Idle (same as Frame 0)
```

## File Formats

| Format | Usage | Notes |
|--------|-------|-------|
| PNG-24 | All sprite assets | Lossless, alpha channel, indexed colors |
| WebP (lossless) | Production deployment | Smaller file size, same quality |
| SVG | Not permitted for pixel art | Vector formats break pixel grid |

**Never use:** JPEG (lossy), GIF (limited palette), BMP (uncompressed, no alpha)

## Folder Structure

```
public/
  assets/
    sprites/
      hero/
        ce_drone_idle_v01.png
        ce_drone_activate_v01.png
        ce_core_glow_v01.png
      environmental/
        ce_crystal_idle_v01.png
        ce_beacon_pulse_v01.png
        ce_chip_loop_v01.png
      fx/
        ce_energy_burst_v01.png
        ce_particle_stream_v01.png
      ui/
        ce_pixel_button_v01.png
        ce_status_bar_v01.png
      background/
        ce_grid_tile_v01.png
        ce_scanline_tile_v01.png
      decorative/
        ce_corner_accent_v01.png
        ce_divider_ornament_v01.png
```

### Folder Naming Rules
- All lowercase
- Hyphens for word separation (not underscores)
- Category folders match Section 01 categories
- Asset files use the naming convention (Section 08)

## Versioning System

Every asset file includes a version number in its filename:

| Version | Meaning |
|---------|---------|
| v01 | First draft |
| v02 | Revised after review |
| v03 | Final revision |
| v10 | Production release (1.0) |
| v20 | Major revision (2.0) |

**Rules:**
- Version numbers are zero-padded to 2 digits
- Version increments when any pixel data changes
- Version does not increment for metadata changes (filename, folder)
- Previous versions are archived, not deleted

---

# SECTION 04 — PIXEL ART CONSTRUCTION RULES

## Silhouette Readability

The silhouette is the foundation of every sprite. If the silhouette fails, nothing else matters.

### The 50% Rule
Every sprite must be recognizable at 50% of its native display size. If a 24×28px sprite becomes unrecognizable at 12×14px, its silhouette is too complex.

### The 3-Second Rule
A viewer must be able to identify the sprite's purpose within 3 seconds of seeing it for the first time. If the sprite requires explanation, its silhouette has failed.

### Silhouette Tests
1. **Squint Test:** Squint at the sprite. Does the shape still read?
2. **Thumbnail Test:** Reduce the sprite to 16×16px. Does it still read?
3. **Reverse Test:** Fill the sprite with black. Does the outline still communicate?
4. **Distance Test:** View the sprite at arm's length on a mobile device. Does it still read?

## Outline Philosophy

The Creative Engine uses **selective outlining** — not every edge needs an outline, but key edges must have one.

### Outline Rules
1. **Outer silhouette:** Always outlined (1px, darkest palette color)
2. **Internal separations:** Outlined when adjacent regions have similar brightness
3. **Detail edges:** Never outlined (let the color contrast do the work)
4. **Glow edges:** Never outlined (glow replaces the outline)

### Outline Color
| Context | Outline Color |
|---------|---------------|
| Against dark background | Darkest color in palette |
| Against light background | Lightest color in palette |
| Between similar colors | Intermediate color in palette |
| Around emissive regions | No outline (glow replaces) |

## Internal Detail Density

The amount of detail inside a sprite depends on its native canvas size:

| Canvas Size | Max Internal Details | Detail Type |
|-------------|---------------------|-------------|
| 4 × 4px | 0 | Silhouette only |
| 8 × 8px | 1-2 | Single feature (eye, core) |
| 12 × 12px | 2-3 | Multiple features |
| 16 × 16px | 3-4 | Features + texture |
| 24 × 24px | 4-6 | Full detail |
| 32 × 32px | 6-8 | Maximum detail |

**Rule:** Detail must decrease as canvas size decreases. A 24×28px sprite cannot have the same detail density as a 32×32px sprite.

## Highlight Placement

Highlights indicate where light hits the sprite's surface.

### Highlight Rules
1. **Primary highlight:** Upper-left quadrant (light source direction)
2. **Secondary highlight:** Adjacent to primary, 1px offset
3. **Highlight color:** Lightest color in the palette (or second-lightest for dark sprites)
4. **Highlight size:** 1-2 pixels maximum
5. **Highlight count:** 1-3 per sprite (less is more)

### Highlight Placement Matrix

| Surface Angle | Highlight Placement |
|---------------|---------------------|
| Facing upper-left | Primary highlight |
| Facing upper | Secondary highlight |
| Facing upper-right | Rare (only if justified) |
| Facing down | Never (shadow zone) |
| Facing left/right | Rare (only for round objects) |

## Shadow Placement

Shadows indicate depth, overlap, and the absence of light.

### Shadow Rules
1. **Drop shadows:** 1px below and 1px right of overlapping elements
2. **Core shadows:** On surfaces facing away from the light source
3. **Shadow color:** Darkest color in the palette
4. **Shadow size:** 1 pixel (never more than 2px unless justified)
5. **Shadow count:** 2-4 per sprite

### Shadow Placement Matrix

| Surface Angle | Shadow Placement |
|---------------|------------------|
| Facing down-right | Core shadow |
| Facing down | Core shadow |
| Under overlapping elements | Drop shadow |
| Facing upper-left | Never (highlight zone) |

## Volume Creation

Volume is created through the interaction of highlights, midtones, and shadows.

### The Three-Tone Rule
Every sprite with volume uses at least three tones:
1. **Highlight:** Lightest color (1-3 pixels)
2. **Midtone:** Primary color (majority of pixels)
3. **Shadow:** Darkest color (2-4 pixels)

### Volume by Shape

| Shape | Volume Technique |
|-------|-----------------|
| Rectangle | Highlight on top edge, shadow on bottom edge |
| Square | Highlight on top-left corner, shadow on bottom-right |
| Circle | Highlight on upper-left arc, shadow on lower-right arc |
| Cylinder | Highlight on top surface, shadow on bottom surface |
| Sphere | Full gradient from upper-left (light) to lower-right (dark) |

## Material Readability

Different materials should look different, even at pixel scale.

### Material Visual Language

| Material | Visual Treatment |
|----------|-----------------|
| Energy | Emissive glow border, 1px, same color at lower opacity |
| Structure | Clean edges, flat color, no glow |
| Interface | Sharp edges, high contrast, clear boundaries |
| Text | Not applicable (text is rendered by the font engine) |

### Material-Specific Rules

**Energy Materials:**
- Add 1px glow border around emissive regions
- Glow color matches the region's base color
- Glow opacity: 0.3-0.5 (visible but not overpowering)
- No outline around emissive regions (glow replaces outline)

**Structure Materials:**
- Clean, sharp edges
- No glow, no blur, no soft edges
- Flat color fills
- 1px outline on outer silhouette

**Interface Materials:**
- High contrast between states (hover, active, focus)
- Clear visual boundaries
- Consistent hit area (44×44px minimum)

## Contrast Rules

### Minimum Contrast Ratios

| Element Pair | Minimum Ratio |
|-------------|---------------|
| Sprite against #0D0A1A | 3:1 |
| Sprite against #1E1B4B | 2.5:1 |
| Highlight against midtone | 2:1 |
| Shadow against midtone | 1.5:1 |
| Glow against background | 2:1 |

### Contrast Verification
1. Open the sprite in a contrast checker tool
2. Test against the Engine's background color (#0D0A1A)
3. Test against the section's background color (varies by region)
4. Verify all contrast ratios meet minimums

## Negative Space in Sprites

Negative space within a sprite (transparent pixels that define shape) is as important as the filled pixels.

### Negative Space Rules
1. **Silhouette negative space:** Required for complex shapes (drone wings, antenna gaps)
2. **Internal negative space:** Permitted for material separation (energy vs. structure)
3. **Edge negative space:** The 1px safe padding is mandatory
4. **No orphan negative space:** Every transparent pixel should contribute to the shape

## Pixel Cluster Rules

Pixel clusters are groups of same-color pixels that read as a single visual unit.

### Cluster Rules
1. **Minimum cluster size:** 2×2px (single pixels are permitted only for highlights/dots)
2. **Maximum cluster size:** No limit, but clusters larger than 6×6px should be broken up
3. **Cluster alignment:** Clusters should align to the pixel grid
4. **Cluster consistency:** Similar elements should have similar cluster sizes
5. **No L-shapes:** L-shaped clusters create visual noise. Use rectangles or squares instead.

### Common Cluster Patterns

| Pattern | Usage | Example |
|---------|-------|---------|
| 2×2 square | Small detail | Drone eye, status indicator |
| 2×4 rectangle | Medium detail | Drone antenna, status bar segment |
| 4×4 square | Large detail | Drone head, crystal facet |
| 1×N line | Edge definition | Grid line, border segment |
| N×1 line | Edge definition | Horizontal divider |

## Anti-Aliasing Policy

**The Creative Engine does not use anti-aliasing on pixel art.** Ever.

### Why No Anti-Aliasing?
Anti-aliasing smooths jagged edges by blending pixel colors. This creates intermediate colors that are not in the palette. It also creates a "fuzzy" look that contradicts the Engine's pixel precision principle.

### What to Do Instead
- **Jagged curves:** Use stair-step patterns (the "pixel curve" technique)
- **Diagonal lines:** Use consistent step patterns (2-1-2-1 or 3-2-3-2)
- **Small details:** Simplify the shape rather than smoothing it
- **Readability issues:** Increase the sprite size rather than smoothing edges

### The Only Exception
Anti-aliasing is permitted on the **cursor glow** effect, which is a CSS radial gradient — not pixel art. This exception does not apply to any sprite asset.

## Consistency Rules

### Within a Sprite
- Pixel cluster sizes are consistent
- Highlight/shadow placement follows the lighting rules
- Color palette is limited to the approved colors
- Edge treatment (outline/no-outline) is consistent

### Across Sprites in the Same Category
- All Hero objects use the same base pixel size (2px)
- All Environmental objects use the same base pixel size (2px)
- All FX objects use the same base pixel size (2px)
- Lighting direction is identical across all sprites
- Color palette overlap is at least 50%

### Across All Sprites
- All sprites use the approved palettes (Section 05)
- All sprites follow the lighting rules (Section 06)
- All sprites respect the outline philosophy
- All sprites are pixel-aligned
- All sprites use `image-rendering: pixelated`

---

# SECTION 05 — COLOR SYSTEM

## Official Palette

The Creative Engine uses a restricted color palette. Every pixel art asset must use colors from this palette. No custom colors are permitted without Art Director approval.

### Primary Palette

| Name | Hex | RGB | Category | Usage |
|------|-----|-----|----------|-------|
| Void Black | #0D0A1A | 13, 10, 26 | Background | Deepest background |
| Dark Indigo | #1E1B4B | 30, 27, 75 | Structure | Primary structure color |
| Deep Purple | #6D28D9 | 109, 40, 217 | Energy | Core energy, drone core |
| Electric Cyan | #22D3EE | 34, 211, 238 | Interactive | Interactive elements, glow |
| White | #F8FAFC | 248, 250, 252 | Text | Primary text, highlights |
| Slate | #94A3B8 | 148, 163, 184 | Text | Secondary text, labels |
| Warm Orange | #FB923C | 251, 146, 60 | Energy | Ambient energy, focal light |
| Deep Amber | #EA580C | 234, 88, 12 | Energy | Background energy |

### Extended Palette

| Name | Hex | RGB | Category | Usage |
|------|-----|-----|----------|-------|
| Near Black | #0F0803 | 15, 8, 3 | Background | Vignette, deep shadows |
| Dark Cyan | #0E7490 | 14, 116, 144 | Interactive | Hover states, secondary accent |
| Light Cyan | #67E8F9 | 103, 232, 249 | Interactive | Glow highlights, active states |
| Warm Gold | #FCD34D | 252, 211, 77 | Energy | Dust particles, warm glow |
| Light Purple | #A78BFA | 167, 139, 250 | Energy | Secondary energy, crystal glow |

### Palette by Asset Category

| Category | Allowed Colors |
|----------|---------------|
| Hero Objects | All 13 colors |
| Ambient Objects | Warm Orange, Deep Amber, Warm Gold, Void Black |
| Interactive Objects | Electric Cyan, Dark Cyan, Light Cyan, White, Dark Indigo |
| Environmental Objects | Deep Purple, Light Purple, Electric Cyan, Dark Indigo |
| Background Objects | Electric Cyan (0.03 opacity), Void Black |
| FX Objects | Electric Cyan, Light Cyan, Warm Orange, Deep Purple |
| UI Pixel Elements | Electric Cyan, White, Dark Indigo, Slate |
| Decorative Elements | Electric Cyan, Deep Purple, Dark Indigo |

## Allowed Saturation

| Context | Saturation Range |
|---------|-----------------|
| Primary palette | As defined (no adjustment) |
| Extended palette | As defined (no adjustment) |
| Custom colors | Forbidden without approval |

**Rule:** Colors are used exactly as defined in the hex values. No brightness adjustments, no saturation shifts, no hue rotations. The palette is fixed.

## Accent Usage

Accents are high-contrast color pops that draw attention to specific elements.

### Accent Rules
1. **Maximum 2 accent pixels per sprite** — accents are punctuation, not paragraphs
2. **Accent color:** Electric Cyan (#22D3EE) for interactive, Light Cyan (#67E8F9) for energy
3. **Accent placement:** On the most important feature (eye, core, indicator)
4. **Accent contrast:** Must be at least 3:1 against adjacent colors

## Glow Colors

Glow effects use specific color-opacity combinations:

| Glow Type | Color | Opacity | Size |
|-----------|-------|---------|------|
| Energy glow | Same as base | 0.3-0.5 | 1px border |
| Interactive glow | Electric Cyan | 0.4-0.6 | 1-2px border |
| Warm glow | Warm Orange | 0.2-0.4 | 1px border |
| Active glow | Light Cyan | 0.5-0.7 | 1-2px border |

## Color Hierarchy

| Priority | Color | Hex | Role |
|----------|-------|-----|------|
| 1 | Electric Cyan | #22D3EE | Primary accent, interactive |
| 2 | Deep Purple | #6D28D9 | Secondary accent, energy |
| 3 | Dark Indigo | #1E1B4B | Structure, containers |
| 4 | White | #F8FAFC | Text, highlights |
| 5 | Slate | #94A3B8 | Secondary text |
| 6 | Warm Orange | #FB923C | Ambient energy |
| 7 | Deep Amber | #EA580C | Background energy |

## Forbidden Color Combinations

| Combination | Reason |
|-------------|--------|
| Warm Orange + Electric Cyan in same sprite | Breaks warm/cool separation |
| Red tones anywhere | Not in the approved palette |
| Green tones anywhere | Not in the approved palette |
| Yellow as primary color | Not in the approved palette (gold is accent only) |
| Any color not in the palette | Unauthorized |

---

# SECTION 06 — LIGHTING SYSTEM

## Universal Lighting Rules

Every pixel sprite in the Creative Engine obeys the same lighting system. This ensures visual consistency across all assets, regardless of which artist created them.

### Primary Light Direction

**Direction:** Upper-left, approximately 45° from horizontal
**Color:** White (neutral — the light source is ambient, not colored)
**Intensity:** Full brightness on surfaces facing the light

```
        LIGHT SOURCE
            ↓
            ╲
             ╲  45°
              ╲
    ┌──────────╲──┐
    │             │
    │   SPRITE    │
    │             │
    └─────────────┘
```

### Secondary Light

**Direction:** Lower-right, opposite the primary light
**Color:** Deep Purple (#6D28D9) — a subtle energy glow from below
**Intensity:** 30% of primary light
**Usage:** Creates a subtle rim light that separates the sprite from the background

### Ambient Light

**Direction:** All directions (omnidirectional)
**Color:** Warm Orange (#FB923C) — the Engine's ambient energy
**Intensity:** 15% of primary light
**Usage:** Fills shadows slightly, prevents pure black areas

## Light Behavior by Material

### Energy Materials
- Emit light (glow effect)
- Glow is the same color as the base, at 30-50% opacity
- Glow extends 1px beyond the sprite boundary
- Glow is always visible (never fully extinguished)

### Structure Materials
- Reflect light (no emission)
- Highlight on upper-left surfaces
- Shadow on lower-right surfaces
- No glow, no emission

### Interface Materials
- Reflect light with higher intensity
- Brighter highlights than Structure materials
- Sharper shadow transitions
- Glow on hover/active states only

## Glow Behavior

### Static Glow
- Present on all Energy material regions
- Opacity: 0.3-0.5
- Size: 1px border around emissive region
- Color: Same as base color

### Animated Glow (Level 1)
- Breathing effect: opacity oscillates between 0.2 and 0.5
- Duration: 4s cycle
- Easing: ease-in-out
- Applied to: Energy materials in idle state

### Interactive Glow (Level 4)
- Triggered by user interaction
- Opacity: 0.4-0.7
- Duration: 160ms
- Easing: ease-out
- Applied to: Interface materials on hover/focus

## Energy Emission Rules

1. **Energy sprites always glow** — if it's Energy material, it emits light
2. **Structure sprites never glow** — if it's Structure material, it only reflects
3. **Interface sprites glow on interaction** — hover, focus, active states
4. **Background sprites glow at minimum** — grid texture at 0.03 opacity
5. **FX sprites glow during events** — energy bursts, particle effects

## Reflection Rules

1. **Primary reflection:** Upper-left surfaces receive the brightest highlight
2. **Secondary reflection:** Lower-right surfaces receive a subtle rim light (Deep Purple)
3. **No reflection on matte surfaces:** Energy materials do not have specular highlights
4. **Reflection intensity:** Decreases with distance from light source

## Shadow Softness

Pixel art does not have soft shadows. All shadows are **hard-edged** — 1px wide, single color, no gradient.

| Shadow Type | Width | Color | Placement |
|-------------|-------|-------|-----------|
| Core shadow | 1px | Darkest palette color | Surfaces facing away from light |
| Drop shadow | 1px | Darkest palette color | Under overlapping elements |
| Ambient shadow | None | N/A | Pixel art does not have ambient occlusion |

## Highlight Intensity

| Highlight Type | Color | Size | Placement |
|---------------|-------|------|-----------|
| Primary | Lightest palette color | 1-2px | Upper-left surfaces |
| Secondary | Second-lightest color | 1px | Adjacent to primary |
| Specular | White (#F8FAFC) | 1px | Only on Interface materials, on hover |

---

# SECTION 07 — ANIMATION STANDARDS

## Animation States

Every animated asset supports a subset of the following seven states. The required states depend on the asset's category and function.

### State 01: IDLE

**Purpose:** The asset's resting state. What the visitor sees 90% of the time.
**Trigger:** Always active when asset is visible
**Loop:** Yes (seamless loop)

| Asset Category | Frame Count | Timing | Loop Style |
|---------------|-------------|--------|------------|
| Hero | 4-6 frames | 200ms per frame | Ping-pong (forward + reverse) |
| Environmental | 2-4 frames | 300ms per frame | Ping-pong |
| FX | 2-3 frames | 250ms per frame | Loop |
| UI Pixel | 1 frame | Static | No animation |
| Decorative | 1-2 frames | 500ms per frame | Ping-pong |

**Motion Intensity:** Level 1 (breathing) — subtle, almost subliminal
**Cooldown:** None (continuous)

---

### State 02: ACTIVATE

**Purpose:** The asset's response to being triggered. A moment of increased energy.
**Trigger:** Scroll intersection, user interaction, or system event
**Loop:** No (play once)

| Asset Category | Frame Count | Timing | Loop Style |
|---------------|-------------|--------|------------|
| Hero | 6-8 frames | 100ms per frame | Play once, settle to idle |
| Environmental | 4-6 frames | 150ms per frame | Play once, settle to idle |
| FX | 6-10 frames | 80ms per frame | Play once, remove |
| UI Pixel | 2-3 frames | 100ms per frame | Play once, hold active |
| Decorative | N/A | N/A | Not applicable |

**Motion Intensity:** Level 3 (revealing) — visible but not dramatic
**Cooldown:** 500ms minimum between activations

---

### State 03: DEACTIVATE

**Purpose:** The asset's return to idle after activation. The energy settling back to rest.
**Trigger:** After activation completes, or when scroll intersection ends
**Loop:** No (play once)

| Asset Category | Frame Count | Timing | Loop Style |
|---------------|-------------|--------|------------|
| Hero | 4-6 frames | 150ms per frame | Play once, return to idle |
| Environmental | 2-4 frames | 200ms per frame | Play once, return to idle |
| FX | N/A | N/A | Not applicable (removed after play) |
| UI Pixel | 2 frames | 100ms per frame | Play once, return to idle |
| Decorative | N/A | N/A | Not applicable |

**Motion Intensity:** Level 2 (drifting) — slow, settling
**Cooldown:** None (triggered by activation completion)

---

### State 04: LOOP

**Purpose:** Continuous animation that plays indefinitely while the asset is visible.
**Trigger:** Asset becomes visible (scroll intersection)
**Loop:** Yes (seamless)

| Asset Category | Frame Count | Timing | Loop Style |
|---------------|-------------|--------|------------|
| Hero | 8-12 frames | 150ms per frame | Seamless loop |
| Environmental | 4-8 frames | 200ms per frame | Seamless loop |
| FX | 4-8 frames | 100ms per frame | Seamless loop |
| UI Pixel | 2-4 frames | 250ms per frame | Seamless loop |
| Decorative | 2-4 frames | 300ms per frame | Seamless loop |

**Motion Intensity:** Level 1-2 (breathing, drifting)
**Cooldown:** None (continuous while visible)

---

### State 05: RARE EVENT

**Purpose:** A special animation that plays infrequently, adding variety and surprise.
**Trigger:** Random interval or specific system event
**Loop:** No (play once)

| Asset Category | Frame Count | Timing | Loop Style |
|---------------|-------------|--------|------------|
| Hero | 4-8 frames | 120ms per frame | Play once, return to idle |
| Environmental | 3-5 frames | 150ms per frame | Play once, return to idle |
| FX | 6-10 frames | 80ms per frame | Play once, remove |
| UI Pixel | N/A | N/A | Not applicable |
| Decorative | 2-4 frames | 200ms per frame | Play once, return to idle |

**Motion Intensity:** Level 3 (revealing)
**Cooldown:** 10-30 seconds between rare events

---

### State 06: INTERACTION

**Purpose:** The asset's response to direct user interaction (hover, click, focus).
**Trigger:** User input
**Loop:** No (play once, hold state)

| Asset Category | Frame Count | Timing | Loop Style |
|---------------|-------------|--------|------------|
| Hero | N/A | N/A | Not applicable (cursor glow handles interaction) |
| Environmental | 2-3 frames | 100ms per frame | Play once, hold |
| FX | 3-5 frames | 80ms per frame | Play once, remove |
| UI Pixel | 2 frames | 80ms per frame | Play once, hold active |
| Decorative | 1-2 frames | 100ms per frame | Play once, hold |

**Motion Intensity:** Level 4 (interacting) — fast, responsive
**Cooldown:** None (immediate response)

---

### State 07: DAMAGE (Reserved)

**Purpose:** Reserved for future expansion. Will indicate the asset has been affected by an external force.
**Trigger:** Future system
**Loop:** No

**Status:** Not implemented. Reserved for future use.

---

## Animation Priority

When multiple animations want to play simultaneously, priority determines which wins:

| Priority | State | Reason |
|----------|-------|--------|
| 1 (Highest) | Interaction | User input always wins |
| 2 | Activation | System events are important |
| 3 | Rare Event | Variety adds life |
| 4 | Loop | Continuous but interruptible |
| 5 | Idle | Default state, lowest priority |
| 6 (Lowest) | Deactivation | Settling is least urgent |

---

# SECTION 08 — ASSET NAMING CONVENTION

## The Naming Formula

Every asset file follows a strict naming formula:

```
ce_[object]_[state]_[version].[ext]
```

| Component | Definition | Example |
|-----------|-----------|---------|
| `ce` | Creative Engine prefix | `ce` |
| `[object]` | Asset identifier (underscore-separated) | `drone`, `core`, `crystal` |
| `[state]` | Animation state | `idle`, `activate`, `loop` |
| `[version]` | Two-digit version number | `v01`, `v02`, `v10` |
| `[ext]` | File extension | `png`, `webp` |

## Object Names

| Object | Identifier | Category |
|--------|-----------|----------|
| Pixel Drone | `drone` | Hero |
| Creative Core | `core` | Hero |
| Memory Crystal | `crystal` | Environmental |
| Signal Beacon | `beacon` | Environmental |
| Data Chip | `chip` | Environmental |
| Energy Stream | `stream` | Environmental |
| Portal System | `portal` | Environmental |
| Grid Texture | `grid` | Background |
| Scanline Overlay | `scanline` | Background |
| Energy Burst | `burst` | FX |
| Particle Stream | `particle` | FX |
| Pixel Button | `btn` | UI |
| Status Bar | `status` | UI |
| Corner Accent | `corner` | Decorative |
| Divider Ornament | `divider` | Decorative |

## State Names

| State | Identifier |
|-------|-----------|
| Idle | `idle` |
| Activate | `activate` |
| Deactivate | `deactivate` |
| Loop | `loop` |
| Rare Event | `rare` |
| Interaction | `interact` |
| Glow | `glow` |
| Pulse | `pulse` |

## Complete Naming Examples

| File Name | Object | State | Version |
|-----------|--------|-------|---------|
| `ce_drone_idle_v01.png` | Drone | Idle | v01 |
| `ce_drone_activate_v01.png` | Drone | Activate | v01 |
| `ce_drone_glow_v01.png` | Drone | Glow | v01 |
| `ce_core_glow_v01.png` | Core | Glow | v01 |
| `ce_crystal_idle_v01.png` | Crystal | Idle | v01 |
| `ce_crystal_pulse_v01.png` | Crystal | Pulse | v01 |
| `ce_beacon_pulse_v01.png` | Beacon | Pulse | v01 |
| `ce_stream_loop_v01.png` | Stream | Loop | v01 |
| `ce_chip_loop_v01.png` | Chip | Loop | v01 |
| `ce_portal_activate_v01.png` | Portal | Activate | v01 |
| `ce_burst_activate_v01.png` | Burst | Activate | v01 |
| `ce_particle_loop_v01.png` | Particle | Loop | v01 |
| `ce_btn_idle_v01.png` | Button | Idle | v01 |
| `ce_btn_interact_v01.png` | Button | Interact | v01 |
| `ce_status_loop_v01.png` | Status | Loop | v01 |
| `ce_grid_tile_v01.png` | Grid | Tile | v01 |
| `ce_scanline_tile_v01.png` | Scanline | Tile | v01 |
| `ce_corner_idle_v01.png` | Corner | Idle | v01 |
| `ce_divider_idle_v01.png` | Divider | Idle | v01 |

## Naming Rules

1. **All lowercase** — no uppercase letters in filenames
2. **Underscores for separation** — no hyphens in asset names (hyphens are for folders)
3. **No spaces** — ever
4. **No special characters** — only letters, numbers, underscores
5. **Prefix is mandatory** — every file starts with `ce_`
6. **Version is mandatory** — every file ends with `_v##`
7. **Extension is lowercase** — `.png`, not `.PNG`

---

# SECTION 09 — QUALITY ASSURANCE

## The Mandatory Checklist

Every asset must pass all 12 quality categories before it can be approved. A single failure in any category returns the asset to production.

### Category 01: PIXEL PERFECTION

| Check | Criterion | Pass/Fail |
|-------|-----------|-----------|
| P01 | Every pixel is intentional (no stray pixels) | |
| P02 | Pixel clusters are well-defined (no L-shapes) | |
| P03 | Edges are clean (no jagged artifacts) | |
| P04 | Canvas is cropped to minimum size | |
| P05 | Transparent padding is 1px on all edges | |
| P06 | Sprite renders correctly at 1×, 2×, 3×, 4× | |
| P07 | `image-rendering: pixelated` produces sharp pixels | |

### Category 02: SILHOUETTE

| Check | Criterion | Pass/Fail |
|-------|-----------|-----------|
| S01 | Sprite is recognizable at 50% scale | |
| S02 | Sprite is identifiable within 3 seconds | |
| S03 | Silhouette reads against #0D0A1A | |
| S04 | Silhouette reads against white | |
| S05 | Squint test passes (shape still reads) | |
| S06 | Thumbnail test passes (reads at 16×16px) | |

### Category 03: LIGHTING

| Check | Criterion | Pass/Fail |
|-------|-----------|-----------|
| L01 | Primary light direction is upper-left (45°) | |
| L02 | Highlights are on correct surfaces | |
| L03 | Shadows are on correct surfaces | |
| L04 | Lighting is consistent with other sprites in category | |
| L05 | Glow is only on Energy material regions | |
| L06 | Glow does not overpower core colors | |

### Category 04: PALETTE

| Check | Criterion | Pass/Fail |
|-------|-----------|-----------|
| PL01 | All colors are from the approved palette | |
| PL02 | Maximum 4 colors used (6 for Hero objects) | |
| PL03 | No unauthorized colors | |
| PL04 | Color contrast meets minimum ratios | |
| PL05 | Accent usage is within limits (≤2 pixels) | |
| PL06 | Glow colors match the glow specification | |

### Category 05: ANIMATION

| Check | Criterion | Pass/Fail |
|-------|-----------|-----------|
| A01 | All required states are complete | |
| A02 | Every frame maintains pixel perfection | |
| A03 | Animation timing matches motion level | |
| A04 | Animation loops seamlessly (if looping) | |
| A05 | Frame count is within budget | |
| A06 | Animation is smooth at 60fps | |
| A07 | `prefers-reduced-motion` is respected | |

### Category 06: READABILITY

| Check | Criterion | Pass/Fail |
|-------|-----------|-----------|
| R01 | Sprite's purpose is immediately clear | |
| R02 | Sprite does not require explanation | |
| R03 | Sprite reads at mobile viewport size | |
| R04 | Sprite reads at desktop viewport size | |
| R05 | Sprite does not conflict with adjacent elements | |

### Category 07: SCALE

| Check | Criterion | Pass/Fail |
|-------|-----------|-----------|
| SC01 | Sprite is proportional to other sprites in category | |
| SC02 | Sprite does not dominate its region | |
| SC03 | Sprite is not too small to be noticed | |
| SC04 | Sprite maintains detail at all integer scales | |

### Category 08: BRAND CONSISTENCY

| Check | Criterion | Pass/Fail |
|-------|-----------|-----------|
| B01 | Sprite matches the region's mood board | |
| B02 | Sprite follows the Visual Concept Document | |
| B03 | Sprite reinforces the Engine's visual language | |
| B04 | Sprite does not introduce foreign aesthetics | |

### Category 09: PERFORMANCE

| Check | Criterion | Pass/Fail |
|-------|-----------|-----------|
| PF01 | File size is within budget (Section 10) | |
| PF02 | Sprite does not trigger layout recalculation | |
| PF03 | Sprite uses GPU-friendly rendering | |
| PF04 | Sprite respects the element count limits | |
| PF05 | Sprite degrades gracefully on low-end devices | |

### Category 10: TECHNICAL CORRECTNESS

| Check | Criterion | Pass/Fail |
|-------|-----------|-----------|
| T01 | File format is PNG-24 or WebP (lossless) | |
| T02 | Filename follows the naming convention | |
| T03 | Version number is correct | |
| T04 | Folder location is correct | |
| T05 | Sprite aligns to the pixel grid | |
| T06 | Sprite works on Chrome, Firefox, Safari, Edge | |
| T07 | Sprite works on mobile (iOS, Android) | |

### Category 11: VISUAL CONSISTENCY

| Check | Criterion | Pass/Fail |
|-------|-----------|-----------|
| V01 | Sprite feels like it belongs to the same universe | |
| V02 | Sprite uses the same pixel density as peers | |
| V03 | Sprite uses the same outline philosophy as peers | |
| V04 | Sprite uses the same material language as peers | |

### Category 12: PRODUCTION READINESS

| Check | Criterion | Pass/Fail |
|-------|-----------|-----------|
| PR01 | All 14 pipeline stages are complete | |
| PR02 | All gate approvals are documented | |
| PR03 | Asset dossier is compiled | |
| PR04 | Asset is added to the production library | |
| PR05 | Asset registry is updated | |

---

# SECTION 10 — PERFORMANCE STANDARDS

## Maximum Sprite Sizes

| Asset Category | Max Native Canvas | Max Display Size (3×) | Max File Size |
|---------------|-------------------|----------------------|---------------|
| Hero | 32 × 32px | 96 × 96px | 5 KB |
| Ambient | 16 × 16px | 48 × 48px | 2 KB |
| Interactive | 16 × 16px | 48 × 48px | 2 KB |
| Environmental | 24 × 24px | 72 × 72px | 3 KB |
| Background | 32 × 32px | 96 × 96px | 2 KB |
| FX | 16 × 16px | 48 × 48px | 3 KB |
| UI Pixel | 12 × 12px | 36 × 36px | 1 KB |
| Decorative | 8 × 8px | 24 × 24px | 1 KB |

## Atlas Strategy

When multiple sprites share the same material and animation state, they can be combined into a **texture atlas** — a single image containing multiple sprites.

### Atlas Rules
1. **Maximum atlas size:** 256 × 256px
2. **Maximum sprites per atlas:** 16
3. **Padding between sprites:** 2px (prevents bleeding)
4. **All sprites in an atlas must share:** Same palette, same material, same region
5. **Atlas format:** PNG-24 with alpha channel

### When to Use Atlases
- Multiple energy cells in the boot sequence
- Multiple decorative elements in the same region
- Animation frames for a single sprite (sprite sheet)

### When NOT to Use Atlases
- Hero objects (they need independent scaling)
- Interactive objects (they need independent hover states)
- Any sprite that may be independently cached

## Memory Budget

| Asset Type | Max Count | Max File Size | Total Budget |
|------------|-----------|---------------|--------------|
| Hero sprites | 2 | 5 KB each | 10 KB |
| Ambient sprites | 10 | 2 KB each | 20 KB |
| Interactive sprites | 3 | 2 KB each | 6 KB |
| Environmental sprites | 4 | 3 KB each | 12 KB |
| Background sprites | 3 | 2 KB each | 6 KB |
| FX sprites | 5 | 3 KB each | 15 KB |
| UI pixel sprites | 8 | 1 KB each | 8 KB |
| Decorative sprites | 6 | 1 KB each | 6 KB |
| **Total** | **41** | — | **83 KB** |

**Rule:** Total pixel art assets must not exceed 83 KB. If the budget is exceeded, sprites must be optimized or removed.

## Animation Budget

| Asset Type | Max Frames | Max Frame Size | Total Frame Budget |
|------------|-----------|----------------|-------------------|
| Hero idle | 6 | 5 KB | 30 KB |
| Hero activate | 8 | 5 KB | 40 KB |
| Environmental idle | 4 | 3 KB | 12 KB |
| Environmental loop | 8 | 3 KB | 24 KB |
| FX activate | 10 | 3 KB | 30 KB |
| UI pixel states | 3 | 1 KB | 3 KB |
| **Total** | — | — | **139 KB** |

**Rule:** Total animation frames must not exceed 139 KB. If exceeded, reduce frame count or optimize individual frames.

## Texture Organization

### Priority Loading
1. **Critical:** Boot sequence assets (loaded immediately)
2. **High:** Hero section assets (loaded after boot)
3. **Medium:** Environmental assets (loaded on scroll intersection)
4. **Low:** Background and decorative assets (loaded last)

### Caching Strategy
- All pixel art assets are cached by the browser after first load
- Version changes invalidate the cache (filename changes)
- WebP format reduces initial load time by 30-50%

## Reuse Strategy

### Sprite Reuse
- The same sprite can be used in multiple locations if it fits the context
- Reused sprites must be identical (same file, same version)
- Reused sprites share the same animation state

### Palette Reuse
- All sprites in the same region share at least 50% of their palette
- This creates visual cohesion without requiring identical sprites

### Animation Reuse
- Similar assets can share animation timing (not frames)
- All Environmental objects use the same idle timing (300ms per frame)
- All FX objects use the same activate timing (80ms per frame)

## GPU-Friendly Practices

1. **`image-rendering: pixelated`** — applied to all pixel art sprites
2. **Integer scaling only** — no fractional transforms
3. **`transform: translate()`** — for position changes (GPU-accelerated)
4. **`opacity`** — for visibility changes (GPU-accelerated)
5. **No `filter: blur()`** on pixel art — blur destroys pixel clarity
6. **No `box-shadow`** on pixel art — use glow effects instead
7. **No animated gradients** — static backgrounds only

## Idle Optimization

When sprites are offscreen or not visible:

1. **Pause animation** — `IntersectionObserver` stops frame advancement
2. **Reduce opacity** — offscreen sprites can be set to `opacity: 0`
3. **Prevent layout** — never reposition offscreen sprites
4. **Cache frames** — pre-rendered frames are reused, not regenerated

## Reduced-Motion Compatibility

When `prefers-reduced-motion: reduce` is active:

| Animation Level | Behavior |
|----------------|----------|
| Level 0 (Static) | No change |
| Level 1 (Breathing) | Disabled — sprite appears static |
| Level 2 (Drifting) | Disabled — sprite appears static |
| Level 3 (Revealing) | Disabled — sprite appears immediately |
| Level 4 (Interacting) | Reduced — faster transitions, no scale |

**Rule:** The Engine must be visually complete and fully functional with all pixel art animations disabled.

---

# SECTION 11 — ASSET LIBRARY ROADMAP

## Production Order

The asset library is built in ten sprints. Each sprint produces a specific set of assets that build upon the previous sprint's output.

---

### SPRINT 01: CREATIVE CORE

**Goal:** Establish the Engine's visual identity with the primary hero assets.

**Required Assets:**
| Asset | State | Frames | Canvas | Priority |
|-------|-------|--------|--------|----------|
| `ce_core_glow_v01` | Loop | 4 | 16×16px | Critical |
| `ce_grid_tile_v01` | Static | 1 | 32×32px | Critical |
| `ce_scanline_tile_v01` | Static | 1 | 32×32px | Critical |

**Dependencies:** None (first sprint)
**Acceptance Criteria:**
- [ ] Core glow animates at Level 1 (4s breathing cycle)
- [ ] Grid tile is seamless at any viewport size
- [ ] Scanline tile is seamless at any viewport size
- [ ] All three assets use the approved palette
- [ ] All three assets pass the Quality Assurance checklist

---

### SPRINT 02: MEMORY CRYSTAL

**Goal:** Create the Memory District's signature environmental object.

**Required Assets:**
| Asset | State | Frames | Canvas | Priority |
|-------|-------|--------|--------|----------|
| `ce_crystal_idle_v01` | Idle | 4 | 16×16px | High |
| `ce_crystal_pulse_v01` | Rare | 6 | 16×16px | Medium |

**Dependencies:** Sprint 01 (palette, lighting system)
**Acceptance Criteria:**
- [ ] Crystal idle loops seamlessly at 300ms per frame
- [ ] Crystal pulse plays once and returns to idle
- [ ] Crystal uses Deep Purple + Light Purple palette
- [ ] Crystal has Energy material glow on facets
- [ ] Crystal passes the Quality Assurance checklist

---

### SPRINT 03: MAINTENANCE DRONE

**Goal:** Create the Pixel Drone — the Engine's mascot and emotional anchor.

**Required Assets:**
| Asset | State | Frames | Canvas | Priority |
|-------|-------|--------|--------|----------|
| `ce_drone_idle_v01` | Idle | 6 | 24×28px | Critical |
| `ce_drone_activate_v01` | Activate | 8 | 24×28px | High |
| `ce_drone_glow_v01` | Glow | 4 | 24×28px | Medium |

**Dependencies:** Sprint 01 (palette, lighting system), existing CSS drone (reference)
**Acceptance Criteria:**
- [ ] Drone idle bobs at Level 1 (sine wave, 2px amplitude)
- [ ] Drone activate plays once and settles to idle
- [ ] Drone glow breathes at Level 1 (4s cycle)
- [ ] Drone uses Dark Indigo + Deep Purple + Electric Cyan palette
- [ ] Drone has Energy material on core, Structure on body
- [ ] Drone passes the Quality Assurance checklist
- [ ] Drone is recognizable at 50% scale

---

### SPRINT 04: SIGNAL BEACON

**Goal:** Create the Communication Tower's environmental object.

**Required Assets:**
| Asset | State | Frames | Canvas | Priority |
|-------|-------|--------|--------|----------|
| `ce_beacon_idle_v01` | Idle | 2 | 12×16px | High |
| `ce_beacon_pulse_v01` | Loop | 6 | 12×16px | Medium |

**Dependencies:** Sprint 01 (palette, lighting system)
**Acceptance Criteria:**
- [ ] Beacon idle is static or Level 1 breathing
- [ ] Beacon pulse loops seamlessly at 200ms per frame
- [ ] Beacon uses Electric Cyan + Dark Indigo palette
- [ ] Beacon has Interface material on signal elements
- [ ] Beacon passes the Quality Assurance checklist

---

### SPRINT 05: ENERGY STREAMS

**Goal:** Create connecting energy flows between regions.

**Required Assets:**
| Asset | State | Frames | Canvas | Priority |
|-------|-------|--------|--------|----------|
| `ce_stream_loop_v01` | Loop | 8 | 8×8px | Medium |
| `ce_stream_activate_v01` | Activate | 6 | 8×8px | Low |

**Dependencies:** Sprint 01 (palette, lighting system)
**Acceptance Criteria:**
- [ ] Stream loop is seamless at 150ms per frame
- [ ] Stream activate plays once on scroll intersection
- [ ] Stream uses Warm Orange + Deep Amber palette
- [ ] Stream has Energy material glow
- [ ] Stream passes the Quality Assurance checklist

---

### SPRINT 06: DATA CHIPS

**Goal:** Create the Knowledge Grid's informational objects.

**Required Assets:**
| Asset | State | Frames | Canvas | Priority |
|-------|-------|--------|--------|----------|
| `ce_chip_idle_v01` | Idle | 2 | 12×8px | Medium |
| `ce_chip_loop_v01` | Loop | 4 | 12×8px | Low |

**Dependencies:** Sprint 01 (palette, lighting system)
**Acceptance Criteria:**
- [ ] Chip idle is static or Level 1 breathing
- [ ] Chip loop animates at 250ms per frame
- [ ] Chip uses Electric Cyan + Dark Indigo palette
- [ ] Chip has Structure material body, Interface material indicator
- [ ] Chip passes the Quality Assurance checklist

---

### SPRINT 07: PORTAL SYSTEM

**Goal:** Create navigation transition effects.

**Required Assets:**
| Asset | State | Frames | Canvas | Priority |
|-------|-------|--------|--------|----------|
| `ce_portal_activate_v01` | Activate | 8 | 16×16px | Low |
| `ce_portal_idle_v01` | Idle | 2 | 16×16px | Low |

**Dependencies:** Sprint 01 (palette, lighting system), Sprint 05 (energy streams)
**Acceptance Criteria:**
- [ ] Portal activate plays once on navigation
- [ ] Portal idle is Level 1 breathing
- [ ] Portal uses Deep Purple + Electric Cyan palette
- [ ] Portal has Energy material glow
- [ ] Portal passes the Quality Assurance checklist

---

### SPRINT 08: AMBIENT DECORATIONS

**Goal:** Add personality with non-functional decorative elements.

**Required Assets:**
| Asset | State | Frames | Canvas | Priority |
|-------|-------|--------|--------|----------|
| `ce_corner_idle_v01` | Static | 1 | 8×8px | Low |
| `ce_divider_idle_v01` | Static | 1 | 16×4px | Low |
| `ce_accent_idle_v01` | Static | 1 | 4×4px | Low |

**Dependencies:** Sprint 01 (palette)
**Acceptance Criteria:**
- [ ] All decorations are static (Level 0)
- [ ] All decorations use the approved palette
- [ ] All decorations are at low opacity (0.3-0.5)
- [ ] All decorations pass the Quality Assurance checklist

---

### SPRINT 09: BACKGROUND TILES

**Goal:** Complete the background texture library.

**Required Assets:**
| Asset | State | Frames | Canvas | Priority |
|-------|-------|--------|--------|----------|
| `ce_pattern_tile_v01` | Static | 1 | 16×16px | Low |
| `ce_noise_tile_v01` | Static | 1 | 8×8px | Low |

**Dependencies:** Sprint 01 (palette)
**Acceptance Criteria:**
- [ ] All tiles are seamless (tileable on all edges)
- [ ] All tiles use Electric Cyan at 0.03 opacity
- [ ] All tiles pass the Quality Assurance checklist

---

### SPRINT 10: INTEGRATION & POLISH

**Goal:** Final integration, optimization, and polish of all assets.

**Required Activities:**
1. Load all assets in the production environment
2. Verify `image-rendering: pixelated` on all sprites
3. Verify integer scaling at 1×, 2×, 3×, 4×
4. Verify 4px grid alignment
5. Verify `prefers-reduced-motion` compatibility
6. Verify total memory budget (83 KB sprites, 139 KB animations)
7. Verify total element count budget
8. Cross-browser testing (Chrome, Firefox, Safari, Edge)
9. Mobile testing (iOS Safari, Chrome Android)
10. Performance profiling (60fps verification)

**Dependencies:** All previous sprints
**Acceptance Criteria:**
- [ ] All assets load correctly in production
- [ ] All assets render at correct scales
- [ ] All assets respect reduced motion
- [ ] Total memory budget is within limits
- [ ] All assets pass cross-browser testing
- [ ] All assets pass mobile testing
- [ ] 60fps is maintained on all target devices
- [ ] Asset registry is complete and accurate

---

# SECTION 12 — CREATIVE REVIEW PROCESS

## The Eight-Category Review

Every completed asset must be evaluated across eight categories. A passing score requires all eight categories to pass. A single failure returns the asset to production.

### Category 01: ART DIRECTION

**Evaluator:** Art Director
**Question:** Does this asset follow the Visual Concept Document?

| Criterion | Weight | Pass Threshold |
|-----------|--------|----------------|
| Architectural style compliance | 25% | Minimal Pixel Brutalism |
| Perspective system compliance | 25% | Orthographic with depth layers |
| Composition compliance | 25% | Dominant Center, asymmetric balance |
| Motion hierarchy compliance | 25% | Correct motion level |

**Scoring:**
- 90-100%: Pass
- 70-89%: Revision required
- Below 70%: Reject

---

### Category 02: BRAND IDENTITY

**Evaluator:** Creative Director
**Question:** Does this asset reinforce the AMR YOUSRY brand?

| Criterion | Weight | Pass Threshold |
|-----------|--------|----------------|
| Color palette adherence | 30% | Approved palette only |
| Emotional alignment | 30% | Quiet confidence |
| Premium feel | 20% | No cheap or gimmicky elements |
| Uniqueness | 20% | Distinct from other portfolios |

**Scoring:**
- 90-100%: Pass
- 70-89%: Revision required
- Below 70%: Reject

---

### Category 03: STORYTELLING

**Evaluator:** Creative Director
**Question:** Does this asset contribute to the Engine's narrative?

| Criterion | Weight | Pass Threshold |
|-----------|--------|----------------|
| Narrative purpose | 30% | Clear story contribution |
| Environmental implication | 30% | Suggests history without explaining |
| Consistency with world bible | 20% | Fits the universe |
| Layered discovery | 20% | Rewards repeated viewing |

**Scoring:**
- 90-100%: Pass
- 70-89%: Revision required
- Below 70%: Reject

---

### Category 04: ANIMATION QUALITY

**Evaluator:** Animation Director
**Question:** Does this asset's animation meet production standards?

| Criterion | Weight | Pass Threshold |
|-----------|--------|----------------|
| Timing accuracy | 25% | Matches motion level spec |
| Easing compliance | 25% | Correct easing function |
| Frame quality | 25% | Every frame is pixel-perfect |
| Loop seamlessness | 25% | No visible loop point |

**Scoring:**
- 90-100%: Pass
- 70-89%: Revision required
- Below 70%: Reject

---

### Category 05: TECHNICAL QUALITY

**Evaluator:** Technical Lead
**Question:** Does this asset meet all technical standards?

| Criterion | Weight | Pass Threshold |
|-----------|--------|----------------|
| File format compliance | 20% | PNG-24 or WebP |
| Naming convention compliance | 20% | Matches Section 08 |
| Grid alignment | 20% | Pixel grid alignment |
| Scaling behavior | 20% | Correct at all integer scales |
| Browser compatibility | 20% | Works on all target browsers |

**Scoring:**
- 90-100%: Pass
- 70-89%: Revision required
- Below 70%: Reject

---

### Category 06: PERFORMANCE

**Evaluator:** Technical Lead
**Question:** Does this asset meet the performance budget?

| Criterion | Weight | Pass Threshold |
|-----------|--------|----------------|
| File size | 30% | Within category budget |
| Memory impact | 30% | Within total budget |
| Rendering cost | 20% | GPU-friendly |
| Reduced-motion support | 20% | Graceful degradation |

**Scoring:**
- 90-100%: Pass
- 70-89%: Revision required
- Below 70%: Reject

---

### Category 07: VISUAL BALANCE

**Evaluator:** Art Director
**Question:** Does this asset feel balanced within its region?

| Criterion | Weight | Pass Threshold |
|-----------|--------|----------------|
| Proportion | 25% | Correct scale relative to peers |
| Weight | 25% | Does not dominate or disappear |
| Contrast | 25% | Visible but not jarring |
| Harmony | 25% | Works with adjacent elements |

**Scoring:**
- 90-100%: Pass
- 70-89%: Revision required
- Below 70%: Reject

---

### Category 08: PRODUCTION READINESS

**Evaluator:** All Reviewers
**Question:** Is this asset ready to ship?

| Criterion | Weight | Pass Threshold |
|-----------|--------|----------------|
| All 14 pipeline stages complete | 30% | 100% completion |
| All gate approvals documented | 30% | All signatures obtained |
| Asset dossier compiled | 20% | Complete documentation |
| No outstanding issues | 20% | Zero unresolved items |

**Scoring:**
- 90-100%: Pass
- 70-89%: Revision required
- Below 70%: Reject

---

## Review Process Flow

```
Asset Complete
      ↓
Self-Review (Artist)
      ↓
Peer Review (if complex)
      ↓
Technical Review (Technical Lead)
      ↓
Art Direction Review (Art Director)
      ↓
Creative Review (Creative Director)
      ↓
Production Readiness Review (All)
      ↓
FINAL APPROVAL
      ↓
Asset Added to Production Library
```

### Review Turnaround Times
| Review | Maximum Time |
|--------|-------------|
| Self-Review | Immediate |
| Peer Review | 24 hours |
| Technical Review | 48 hours |
| Art Direction Review | 48 hours |
| Creative Review | 72 hours |
| Production Readiness | 24 hours |

### Escalation Rules
- If a reviewer rejects an asset, the artist has 48 hours to address feedback
- If an asset is rejected three times, it returns to Stage 01 (Research)
- Disputes between reviewers are escalated to the Creative Director
- The Creative Director's decision is final

---

# APPENDIX A — COMPLETE PALETTE REFERENCE

## Primary Palette (Hex + RGB)

| Name | Hex | R | G | B | Category |
|------|-----|---|---|---|----------|
| Void Black | #0D0A1A | 13 | 10 | 26 | Background |
| Near Black | #0F0803 | 15 | 8 | 3 | Background |
| Dark Indigo | #1E1B4B | 30 | 27 | 75 | Structure |
| Deep Purple | #6D28D9 | 109 | 40 | 217 | Energy |
| Light Purple | #A78BFA | 167 | 139 | 250 | Energy |
| Electric Cyan | #22D3EE | 34 | 211 | 238 | Interactive |
| Dark Cyan | #0E7490 | 14 | 116 | 144 | Interactive |
| Light Cyan | #67E8F9 | 103 | 232 | 249 | Interactive |
| White | #F8FAFC | 248 | 250 | 252 | Text |
| Slate | #94A3B8 | 148 | 163 | 184 | Text |
| Warm Orange | #FB923C | 251 | 146 | 60 | Energy |
| Deep Amber | #EA580C | 234 | 88 | 12 | Energy |
| Warm Gold | #FCD34D | 252 | 211 | 77 | Energy |

## Quick Reference by Category

| Category | Primary | Secondary | Accent | Glow |
|----------|---------|-----------|--------|------|
| Hero | Dark Indigo | Deep Purple | Electric Cyan | Light Cyan |
| Ambient | Warm Orange | Deep Amber | Warm Gold | Warm Orange |
| Interactive | Electric Cyan | Dark Indigo | Light Cyan | Electric Cyan |
| Environmental | Deep Purple | Dark Indigo | Electric Cyan | Light Purple |
| Background | Electric Cyan | — | — | — |
| FX | Electric Cyan | Deep Purple | Light Cyan | Light Cyan |
| UI Pixel | Electric Cyan | Dark Indigo | White | Electric Cyan |
| Decorative | Electric Cyan | Deep Purple | — | — |

---

# APPENDIX B — SPRITE SHEET TEMPLATE

## Standard Layout

```
┌────────┬────────┬────────┬────────┬────────┬────────┐
│ Frame 0│ Frame 1│ Frame 2│ Frame 3│ Frame 4│ Frame 5│
│ (Idle) │ (Up)   │ (Down) │ (Left) │ (Right)│ (Idle) │
│        │        │        │        │        │(=Frm 0)│
└────────┴────────┴────────┴────────┴────────┴────────┘
```

## Template Specifications

| Property | Value |
|----------|-------|
| Cell width | Sprite native width |
| Cell height | Sprite native height |
| Cells per row | 6 (configurable) |
| Cell spacing | 0px (contiguous) |
| Padding | 1px per cell (included in cell size) |
| Background | Transparent |

---

# APPENDIX C — ASSET REGISTRY TEMPLATE

| Field | Description | Example |
|-------|-------------|---------|
| Asset ID | Unique identifier | `ce_drone_idle_v01` |
| Category | Asset classification | Hero |
| Object | Object name | Pixel Drone |
| State | Animation state | Idle |
| Version | Version number | v01 |
| Native Size | Canvas dimensions | 24 × 28px |
| Display Size | Rendered size (3×) | 72 × 84px |
| Frame Count | Number of animation frames | 6 |
| File Size | Optimized file size | 4.2 KB |
| Palette | Color palette used | Dark Indigo, Deep Purple, Electric Cyan |
| Material | Primary material | Energy + Structure |
| Region | Engine region | Creative Core |
| Motion Level | Animation level | Level 1 |
| Dependencies | Required assets | `ce_grid_tile_v01` |
| Status | Production status | Approved |
| Approval Date | Date of final approval | 2026-07-19 |
| Approved By | Reviewer names | Art Director, Creative Director |

---

*This document is the mandatory production pipeline for every pixel asset in the AMR YOUSRY Creative Engine universe. No asset may be created, modified, or deployed without following this pipeline.*

*Phase 1.75 — Pixel Asset Pipeline v1.0*
*AMR YOUSRY Creative Studio*
