# CREATIVE ENGINE v2.x
## Master Roadmap & Strategic Vision

**Classification:** Strategic Planning Document
**Version:** 1.0
**Status:** Vision (Pre-Implementation)
**Effective:** July 20, 2026

---

## TABLE OF CONTENTS

1. Executive Summary
2. Design Principles
3. Vision Pillars
4. Release Roadmap
5. Quality Gates
6. Success Criteria
7. Non-Goals
8. Appendix: Relationship to v1.0

---

## 1. EXECUTIVE SUMMARY

Creative Engine v1.0 is a living background — an autonomous ecosystem that simulates a creative operating system behind the portfolio. Objects cycle through states, energy flows, and the world breathes independently of the visitor.

v2.x transforms this background into a **subtle creative companion** — a system that acknowledges the visitor's presence, reacts to their journey through the portfolio, and occasionally reveals deeper layers of the universe to those who pay attention.

The portfolio remains the primary experience. The ecosystem supports, enhances, and deepens it — never competes with it.

### The Shift

| v1.0 | v2.x |
|------|------|
| Autonomous simulation | Responsive companion |
| Visitor watches | Visitor participates |
| Fixed behavior | Context-aware behavior |
| Hidden complexity | Revealed depth (optional) |
| Same every visit | Different every visit |

---

## 2. DESIGN PRINCIPLES

Every v2.x feature must satisfy all of the following:

### Content Primacy
The portfolio is the reason the visitor is here. The ecosystem must never obscure, distract from, or compete with portfolio content. If a feature makes content harder to consume, it is rejected.

### Calm Interaction
The ecosystem responds to the visitor but never demands attention. Reactions are subtle — opacity shifts, slow transforms, gentle pulses. No pop-ups, no flashy interruptions, no attention grabs.

### Performance Foundation
Every feature must preserve 60 FPS on target devices. CSS transforms and opacity only. No layout-triggering properties. No JavaScript animation loops. No runtime canvas rendering.

### Disabled by Default
All interactive features must have an `enabled` prop (matching the v1.0 pattern) and must respect `prefers-reduced-motion: reduce`. Every feature can be independently disabled without affecting others.

### Ecosystem Logic
Every feature must have a clear in-universe reason for existing. "It looks cool" is insufficient. "The Engine detects visitor presence and adjusts ambient energy output" is sufficient.

### Minimal Complexity
A feature's implementation cost must be proportional to its impact. A 50-line CSS change is preferred over a 200-line React hook. A new CSS class is preferred over a new component.

### Backward Compatibility
v2.x must not break v1.0. Existing components, hooks, types, and CSS must continue to work unchanged. v2.x is additive only.

---

## 3. VISION PILLARS

The future of the Creative Engine is defined by five pillars. Each pillar represents a domain of evolution. They are ordered by priority — earlier pillars deliver more value for less complexity.

---

### PILLAR 1: Developer Experience (v2.1)

**Theme:** Tools for building, debugging, and maintaining the ecosystem.

v1.0 has no developer tooling. The ecosystem runs as a black box — events fire, states change, energy flows, but there is no way to observe, inspect, or debug the system in real time.

v2.1 adds non-intrusive developer overlays that make the ecosystem transparent.

#### Features

| Feature | Description | Effort | In-Universe Justification |
|---------|-------------|--------|---------------------------|
| **Debug Overlay** | Floating panel showing raw `EcosystemState` (all objects, energies, states, activeCount, tick count). Toggle via `__CE_DEBUG__` flag. | Low | "Diagnostic terminal connected to the Engine's main bus." |
| **State Inspector** | Per-object card showing current state, energy, lastActive, cooldownUntil, elapsed time in state. Color-coded by activity level. | Low | "Peripheral status display for each Engine subsystem." |
| **Event Inspector** | Rolling log of last 50 dispatched events with timestamps, source, and resulting state change. Filterable by event type. | Low | "System event recorder — logs every signal crossing the main bus." |
| **Timeline Viewer** | Horizontal timeline showing object state changes over the last 60 seconds. Gantt-style bars for each object. Scrollable. | Medium | "Engine chronograph — visual history of subsystem states." |
| **Performance Monitor** | FPS counter, tick duration (ms), memory estimate, active DOM node count. GPU-composited layers indicator. | Low | "Systems diagnostic — measures Engine throughput and thermal load." |
| **Energy Graph** | Real-time line chart of energy levels for all 5 objects over the last 120 seconds. | Medium | "Energy flow chart — tracks creative energy distribution across subsystems." |

#### Technical Scope

- Single overlay component (`<CEDebugPanel>`) rendered outside the ecosystem DOM tree via portal
- Toggled by `window.__CE_DEBUG__` or URL param `?ce_debug=true`
- All panels collapsible and draggable
- Zero impact on production bundle (code-split via dynamic import)
- Respects `reducedMotion` — static display only

#### Creative Goals

The debug overlay is not just a developer tool — it is an **in-universe diagnostic terminal**. The visual design should match the Engine's aesthetic: pixel grid, cyan text on dark background, segmented displays, subtle scanline overlay. It should feel like peering into the Engine's control room.

#### Quality Gates

- Overlay does not affect ecosystem behavior (read-only)
- Zero performance impact when hidden
- < 5 KB gzipped when loaded
- Accessible via keyboard (Tab navigation)

---

### PILLAR 2: Ambient Intelligence (v2.2)

**Theme:** The world breathes with greater depth, variation, and atmosphere.

v1.0 objects have fixed animations (core breathes at 32s, drone idles with sine bobbing, etc.). The world is alive but predictable.

v2.2 adds environmental texture — secondary motion systems that make the world feel deeper without adding new interactive objects.

#### Features

| Feature | Description | Effort | In-Universe Justification |
|---------|-------------|--------|---------------------------|
| **Quiet Cycles** | Every 3-5 minutes, the ecosystem enters a brief "quiet cycle" — all objects slow down, dim slightly, and the energy stream fades. Duration: 8-12s. Occurs randomly. | Low | "The Engine performs a low-power maintenance cycle. All non-critical systems reduce draw." |
| **Data Rain** | Subtle vertical cyan lines (1px wide, 0.02 opacity) falling in the background behind the ecosystem area. Not a Matrix reference — more like diagnostic text scrolling on a distant monitor. Appears during high-energy states. | Low | "Raw data streams visible in the Engine's peripheral displays during peak processing." |
| **Network Pulses** | Brief horizontal light sweeps (0.015 opacity, warm amber) that cross the ecosystem area from left to right. Triggered by `core:sync_complete` and `crystal:energy_released` events. | Low | "Energy pulses propagating through the Engine's distribution grid." |
| **Soft Motion** | Existing object animations get subtle secondary motion — the Core's glow has a micro-oscillation (0.5s, < 2% amplitude), the Drone's antenna wiggles randomly, the Crystal's facets shimmer independently. | Medium | "Natural micro-fluctuations in the Engine's energy field." |
| **Environmental Variation** | Parameters like drift speed, pulse interval, and glow intensity vary slightly per session (seeded random). One visit the Core breathes at 31s, the next at 34s. The world never repeats exactly. | Low | "The Engine's ambient conditions vary naturally, like atmospheric pressure." |

#### Technical Scope

- CSS-only — no new JavaScript logic
- New keyframes in existing CSS files
- `ce_ambient.css` for cross-object effects (data rain, network pulses)
- CSS custom properties for seeded session variation
- All effects respect `prefers-reduced-motion: reduce`

#### Creative Goals

The visitor should not consciously notice these effects. They should feel the world is deeper but never be able to pinpoint why. These are **atmospheric enhancements** — the difference between a static diorama and a living environment.

#### Quality Gates

- Zero additional layout thrashing (no DOM mutations per frame)
- All effects GPU-composited (`transform`, `opacity` only)
- < 2 KB of new CSS total
- No JavaScript execution cost
- Passively fades when `pageHidden` is true

---

### PILLAR 3: Interactive Ecosystem (v2.3)

**Theme:** The world acknowledges the visitor.

v1.0 runs identically whether a visitor is present or not. Objects cycle, energy flows, and the simulation is self-contained.

v2.3 adds responsive behavior — the ecosystem reacts to where the visitor is, what they're doing, and how they're engaging with the portfolio.

#### Features

| Feature | Description | Effort | In-Universe Justification |
|---------|-------------|--------|---------------------------|
| **Section Awareness** | Ecosystem state is influenced by which section is in the viewport. Core energy peaks on Hero (section 0-25%). Crystal energy peaks on About (25-50%). Drone becomes active on Projects (50-75%). Beacon hums on Contact (75-100%). | Low | "The Engine directs energy toward the region the visitor is currently exploring." |
| **Scroll-Responsive Drone** | The Drone's vertical position is loosely coupled to scroll progress. As the visitor scrolls down, the Drone drifts upward (staying within its container). Returns when scrolling back up. | Low | "The Maintenance Drone follows the visitor's attention to ensure all regions are monitored." |
| **Cursor Proximity** | If the visitor's cursor lingers near an ecosystem object (> 2s within a 100px radius), the object subtly brightens (+0.1 opacity) and shifts orientation toward the cursor (2-3px transform). | Medium | "The Engine registers local energy fluctuations caused by visitor presence." |
| **Click Response** | Clicking an object triggers a visible reaction — Core brief brightens (400ms), Crystal emits a small particle, Drone does a quick dip, Beacon flickers. Each object has a unique response. Cooldown: 10s per object. | Low | "Direct interaction with Engine subsystems produces a measurable energy response." |
| **Theme Awareness** | If the visitor has set `prefers-color-scheme: dark` (always the case for this portfolio), the ecosystem uses its existing dark palette. But if we detect light mode, the ecosystem slightly amplizes glow opacity to maintain visibility. | Low | "The Engine automatically calibrates its display luminance to match ambient conditions." |

#### Technical Scope

- Section awareness: use `IntersectionObserver` on section root elements — emit `world:section_visible` events
- Scroll-responsive: CSS `transform: translateY()` mapped to scroll position via `useScroll` or manual listener — throttled to animation frame
- Cursor proximity: `onMouseMove` with throttled distance calculation
- Click response: dispatch internal event, object brightens via CSS class toggle
- All interaction uses existing `ecosystem.ts` event dispatch — new events: `world:section_visible`, `world:cursor_proximity`, `world:object_click`

#### New Events

```
| Event | Payload | Purpose |
|-------|---------|---------|
| world:section_visible | { section: "hero" | "about" | "projects" | "skills" | "experience" | "contact" } | Which section is in view |
| world:cursor_proximity | { target: ObjectId, distance: number } | Cursor near an object |
| world:object_click | { target: ObjectId } | Object was clicked |
```

#### Creative Goals

The shift from "a world that runs" to "a world that notices you" is the single biggest leap in v2.x. This pillar is the most important for the visitor's emotional experience.

The key is **subtlety**. The visitor should feel that the world responds to them without being able to prove it. The Drone drifts upward as they scroll — did it always do that? The Core brightened when they stopped scrolling on the Hero — was that a coincidence?

Doubt is the goal. The line between "it's scripted" and "it's alive" is where the magic lives.

#### Quality Gates

- New events do not break existing handlers (additive schema only)
- Scroll listener is throttled to 1 sample per 100ms
- Cursor proximity check runs at max 30fps
- Click response uses `requestAnimationFrame` for class toggle
- All interaction disabled when `reducedMotion` is true
- All interaction disabled when `pageHidden` is true
- Section awareness uses passive `IntersectionObserver` (zero main-thread cost)

---

### PILLAR 4: World Expansion (v2.4)

**Theme:** New objects, new regions, new depth.

v1.0 has 5 objects (Core, Crystal, Drone, Beacon, Portal). The World Bible describes 7 regions and 8 planned expansions.

v2.4 adds new pixel objects that extend the universe without modifying v1.0. Each new object has its own state machine, its own CSS, and its own role in the ecosystem.

#### Features

| Feature | Description | Effort | In-Universe Justification |
|---------|-------------|--------|---------------------------|
| **Memory Crystal Cluster** | 3 additional small crystals arranged around the existing Crystal. They pulse in sequence during `active` state and dim independently during `dormant`. No new state machine — visual extension of existing Crystal. | Low | "The Engine's memory storage density has been upgraded. Multiple crystals share the processing load." |
| **Ambient Energy Particles** | 5-8 tiny floating dots (2px) that drift slowly around the ecosystem area. Colored cyan (idle), purple (high energy), or amber (core sync). They avoid objects naturally via CSS transform. | Medium | "Free-floating energy particulates in the Engine's ambient field. Their color reflects current energy distribution." |
| **Creative Factory** | A new pixel object: a 24x24px assembly line with 3 conveyor slots. Products move along the conveyor at different rates depending on activeCount. Visible only when > 2 systems are active. Located below the Portal. | High | "The Factory District's assembly line — production scales with available energy." |
| **Memory Library** | A new pixel object: a 16x24px bookshelf with 8 slots. Each slot lights up when its corresponding project page has been visited. Persists for the session. Located to the left of the Crystal. | Medium | "The Memory District's library — each project visit leaves a trace." |
| **Archive Node** | A new pixel object: a 12x16px terminal with a scrolling text display. Shows cryptic one-line status messages from the Engine. Messages cycle every 5-8s from a pool of 30+ in-universe phrases. | Medium | "An Archive System terminal — displays real-time Engine status logs." |

#### Technical Scope

- Cluster: extend `MemoryCrystalPixel` with additional SVG `<rect>` elements — CSS-only animation
- Particles: new component (`<AmbientParticles>`) — positioned absolutely, animated via CSS `translate` with staggered delays
- Factory: new component (`<CreativeFactoryPixel>`) — own state machine with 3 states (idle, producing, peak)
- Library: new component (`<MemoryLibraryPixel>`) — reads section visibility from context
- Terminal: new component (`<ArchiveTerminal>`) — cycles through message pool via `useEffect` timer

#### Creative Goals

The world should feel like it has **depth to discover**. A first-time visitor sees the Core, Crystal, Drone, and Beacon. A returning visitor notices the Portal. An attentive visitor spots the Factory running when the ecosystem is busy.

New objects are **rewards for attention**.

#### Quality Gates

- Each new object < 5 KB gzipped
- Each new object independently disableable via `enabled` prop
- No new external dependencies
- Factory and Library respect `reducedMotion` (static display)
- Terminal messages are purely atmospheric — no data, no API calls
- All objects participate in energy system (energy property, cooldown)

---

### PILLAR 5: Creative Storytelling (v2.5)

**Theme:** Hidden moments, rare events, and narrative depth.

v1.0 has no storytelling — the ecosystem is a simulation, not a narrative.

v2.5 adds **discoverable moments** — rare events that feel special because they are rare. These are the payoff for attentive visitors.

#### Features

| Feature | Description | Effort | In-Universe Justification |
|---------|-------------|--------|---------------------------|
| **Hidden Discoveries** | Rare visual events with 1-5% probability per ecosystem hour. Examples: Drone stops and "looks" at the Core (5s), Crystal emits a double pulse, Beacon stays active for 10s instead of 3s. Each discovery has a cooldown of 1 hour real time. | Medium | "Rare subsystem resonances. The Engine occasionally exhibits unexpected behavior when energy harmonics align." |
| **Rare Sync Events** | When all 5 objects reach specific energy thresholds simultaneously (Core > 80, Crystal > 70, Drone > 60, Beacon > 50, Portal > 40), the entire ecosystem brightens for 4s and the Portal opens instantly. This is extremely rare (may never happen in a single visit). | High | "Full-system energy resonance cascade. All subsystems synchronized at peak efficiency." |
| **Seasonal Variations** | The ecosystem palette shifts slightly based on the month. Winter: slightly cooler tones, slower animations. Spring: warmer, slightly brighter. Summer: maximum brightness, faster cycles. Fall: amber emphasis, slower. Shift is subtle (< 10% parameter change). | Low | "The Engine's ambient calibration adjusts to seasonal atmospheric conditions." |
| **Milestone Celebrations** | If the visitor has viewed 3+ project pages, the ecosystem enters a brief "celebration" state — all objects pulse in sequence, energy streams fire in rapid succession, the Portal opens briefly. Duration: 6s. Occurs once per session. | Medium | "The Engine recognizes sustained visitor engagement and performs an acknowledgment sequence." |
| **Portal Rarity** | Portal activation conditions become more restrictive (requires all 3 conditions: core ready, beacon active, crystal recently released). Portal becomes a true rare event — maybe 1 in 10 sessions by average scroll depth. | Low | "The Portal requires precise energy alignment. It is not easily opened." |

#### Technical Scope

- Hidden discoveries: time-based probability check in tick loop — emits new `world:hidden_discovery` event
- Rare sync: threshold check in tick loop — emits `world:grand_sync` event
- Seasonal: `useEffect` reading `new Date().getMonth()` — sets CSS custom property `--ce-season` on root
- Milestones: `sectionVisibility` state in context counts unique sections viewed
- Portal rarity: adjust `ECOSYSTEM_CONFIG.portalSyncThreshold` from 2 to 3 and require all 3 conditions

#### Storytelling Catalog

Each discoverable moment should feel like finding a secret in a video game — unexpected, delightful, and clearly intentional.

| Discovery | Trigger | Probability | Visual |
|-----------|---------|-------------|--------|
| **Drone Curiosity** | Drone has been in patrol for > 60s | 3% per tick | Drone "looks" at Core (rotates slightly) for 5s |
| **Crystal Echo** | Crystal transitions from active to dormant | 5% | Crystal double-pulses before dimming |
| **Beacon Resonance** | Beacon has been idle for > 120s | 2% per tick | Beacon flickers once briefly (200ms) |
| **Core Hum** | Core has been idle for > 90s | 2% per tick | Core's ring segments cycle around briefly |
| **Portal Flicker** | Portal is idle and energy > 60 | 1% per tick | Portal's inner core flickers for 500ms |
| **Ghost Stream** | No transfer activity for > 180s | 1% per tick | Faint energy stream appears for 1s, then fades |

#### Creative Goals

Storytelling features transform the ecosystem from a system into a **world with secrets**. The visitor who spends time, scrolls deeply, and returns multiple times is rewarded with moments that feel earned.

The key constraint: **these moments must feel natural**. If a visitor sees the Drone "look" at the Core, they should wonder: "Did it always do that, or did something happen?" The moment should fit so seamlessly into the existing aesthetic that it feels like a discovery, not a feature.

#### Quality Gates

- All discoveries use existing animation mechanisms — no new rendering paths
- Probability is session-scoped (not cumulative across sessions)
- Grand sync event has a 30-minute cooldown even if conditions are met
- Seasonal variation is CSS-only (custom properties)
- Milestone celebration plays once per session max
- All storytelling features respect `reducedMotion` (skip entirely)

---

## 4. RELEASE ROADMAP

Each release is an independent milestone. Releases can be reordered, split, or deferred based on feedback and capacity.

### v2.1 — Developer Experience

**Theme:** Transparency. Making the invisible visible.

| Component | Priority | Effort | Dependencies |
|-----------|----------|--------|--------------|
| Debug Overlay | P0 | Low | None |
| State Inspector | P0 | Low | None |
| Event Inspector | P0 | Low | None |
| Performance Monitor | P1 | Low | None |
| Timeline Viewer | P1 | Medium | None |
| Energy Graph | P2 | Medium | None |

**Validation:** All panels functional. Zero performance impact when hidden. < 5 KB loaded size.

---

### v2.2 — Ambient Systems

**Theme:** Depth. Making the world feel deeper without adding objects.

| Component | Priority | Effort | Dependencies |
|-----------|----------|--------|--------------|
| Quiet Cycles | P0 | Low | v2.3 section awareness (optional trigger) |
| Data Rain | P0 | Low | None |
| Network Pulses | P0 | Low | Existing ecosystem events |
| Soft Motion | P1 | Medium | None |
| Environmental Variation | P1 | Low | None |

**Validation:** All effects GPU-composited. < 2 KB new CSS. No new JavaScript logic.

---

### v2.3 — Interactive Ecosystem

**Theme:** Presence. Making the world acknowledge the visitor.

| Component | Priority | Effort | Dependencies |
|-----------|----------|--------|--------------|
| Section Awareness | P0 | Low | Existing section elements |
| Scroll-Responsive Drone | P0 | Low | None |
| Cursor Proximity | P1 | Medium | None |
| Click Response | P1 | Low | None |
| Theme Awareness | P2 | Low | None |

**Validation:** New events are additive. Scroll throttled to 100ms. Cursor check at 30fps. All interaction disabled when `reducedMotion`.

---

### v2.4 — World Expansion

**Theme:** Expansion. Adding new objects that extend the universe.

| Component | Priority | Effort | Dependencies |
|-----------|----------|--------|--------------|
| Crystal Cluster | P0 | Low | Crystal state machine |
| Archive Terminal | P0 | Medium | Message pool, timer |
| Ambient Particles | P1 | Medium | Existing ecosystem |
| Creative Factory | P2 | High | Own state machine |
| Memory Library | P2 | Medium | Section visibility context |

**Validation:** Each object independently disableable. < 5 KB per object. No external dependencies.

---

### v2.5 — Creative Storytelling

**Theme:** Mystery. Rewarding attention with rare, special moments.

| Component | Priority | Effort | Dependencies |
|-----------|----------|--------|--------------|
| Hidden Discoveries (6 events) | P0 | Medium | Tick loop, probability check |
| Portal Rarity Tuning | P0 | Low | Portal config |
| Seasonal Variations | P1 | Low | CSS custom properties |
| Milestone Celebration | P1 | Medium | Section visibility context |
| Rare Sync Event | P2 | High | Threshold detection, visual sequence |

**Validation:** All discoveries use existing animation mechanisms. No new rendering paths. Probabilities session-scoped. Grand sync has 30-minute cooldown.

---

### Visual Delivery Order

If implementing incrementally within a release, build visual features in this order (most visible impact first):

1. Network Pulses (v2.2) — immediate atmospheric depth
2. Section Awareness (v2.3) — most impactful interaction
3. Click Response (v2.3) — simplest interaction, high delight
4. Data Rain (v2.2) — quick visual enhancement
5. Scroll Drone (v2.3) — second-most impactful interaction
6. Hidden Discoveries (v2.5) — reward for engagement
7. Soft Motion (v2.2) — polish pass on existing objects
8. Crystal Cluster (v2.4) — first new object
9. Archive Terminal (v2.4) — world depth
10. Milestone Celebration (v2.5) — narrative payoff

---

## 5. QUALITY GATES

Every v2.x release must pass:

### Build Integrity
- TypeScript: 0 errors
- ESLint: 0 errors, 0 warnings
- Build: silent (no warnings)
- `validate:behavior`: all checks pass
- `health:metrics`: >= 100/100

### Performance Budget
- Bundle size: < 5 KB per new component (gzipped)
- Zero layout-throttling properties in new CSS
- All animations GPU-composited (`transform`, `opacity` only)
- Scroll listeners throttled to max 10Hz
- No `requestAnimationFrame` loops (use CSS keyframes)
- No runtime canvas or WebGL

### Behavioral Compliance
- New events do not modify existing handler signatures
- New features respect `prefers-reduced-motion: reduce`
- New features respect `pageHidden`
- New features are independently disableable via `enabled` prop
- No new external dependencies

### Accessibility
- All new objects wrapped in `aria-hidden="true"`
- All interactive elements have `aria-label`
- Debug overlay is hidden from screen readers by default
- No required interaction for ecosystem operation

### Regression Prevention
- Existing v1.0 tests/checks continue to pass unchanged
- No modifications to v1.0 component interfaces
- No modifications to v1.0 CSS class names
- No modifications to v1.0 type definitions

---

## 6. SUCCESS CRITERIA

Creative Engine v2.x is successful when:

### Visitor Experience
- Returning visitors notice the ecosystem is different per visit
- Visitors who scroll deeply feel the world responds to them
- Visitors who click objects feel rewarded, not annoyed
- No visitor ever feels the ecosystem is distracting

### Technical Health
- Lighthouse performance score remains >= 95
- No regressions in Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- Bundle size increase per release < 10 KB gzipped
- All v1.0 quality gates continue to pass

### Creative Integrity
- The ecosystem feels like a unified world, not a collection of features
- Each new element has a clear in-universe purpose
- The portfolio remains the primary experience
- The world bible (CREATIVE-ENGINE-WORLD-BIBLE.md) accurately describes v2.x

---

## 7. NON-GOALS

The following are explicitly out of scope for v2.x:

### No Real-Time Collaboration
The ecosystem is single-visitor, single-tab. No multiplayer, no shared state, no presence awareness.

### No Persistent Storage
No localStorage, IndexedDB, cookies, or server-side state. Every session starts fresh. The ecosystem is ephemeral by design.

### No Audio
No sound effects, ambient audio, or music. The ecosystem is a visual-only experience.

### No WebGL or Canvas
All rendering remains SVG + CSS. No WebGL, no `<canvas>`, no third-party animation libraries.

### No Server-Side Rendering
The ecosystem is `"use client"` only. No SSR, no streaming, no RSC for the ecosystem layer.

### No External Data
No API calls, no database queries, no external content loading. The ecosystem is fully self-contained.

### No AI or LLM Integration
No generative text, no AI-driven behavior, no natural language processing. The ecosystem's intelligence is simulated, not artificial.

### No Mobile Canvas
No touch-driven canvas interactions. The ecosystem works on mobile via existing responsive CSS.

---

## 8. APPENDIX: RELATIONSHIP TO v1.0

### What v1.0 Is
- A production-certified autonomous ecosystem
- 5 stateful objects with CSS-animated pixel art
- A tick-based event dispatch system
- Energy simulation with regeneration and transfer
- Portal system with rarity conditions

### What v1.0 Will Not Become
- v2.x will not refactor v1.0 components
- v2.x will not modify v1.0 type definitions
- v2.x will not alter v1.0 CSS class names
- v2.x will not change v1.0 event signatures
- v2.x will not remove or rename v1.0 exports

### How v2.x Adds to v1.0
- New events are added to the `EcosystemEvent` union type
- New state mappers are added alongside existing ones
- New CSS files are added to `src/styles/creative-engine/`
- New components are added to `src/components/creative-engine/`
- New features are added to `WorldInteraction.tsx` as conditional render blocks
- New overlay components render via portal (outside the DOM tree)

### Architecture Evolution

```
v1.0:
  context.ts -> ecosystem.ts (state machine + tick loop) -> types.ts (types + config)
    -> WorldInteraction.tsx (orchestrator) -> Pixel Components (pure SVG)

v2.x:
  [v1.0 unchanged] +
  SectionObserver.ts (new) -> ecosystem.ts (new event handlers)
  DebugPanel.tsx (portal outside main tree)
  Ambient CSS (new files, new keyframes)
  New Pixel Components (CrystalCluster, Factory, Terminal, Library)
  Storytelling hooks (useHiddenDiscoveries, useSeasonalVariation)
```

### Migration Path
v2.x features are opt-in via environment flags and component props:
- `WorldInteraction` accepts `interactive?: boolean` (default: false) for v2.3 features
- `WorldInteraction` accepts `showDebug?: boolean` (default: false) for v2.1 overlay
- `WorldInteraction` accepts `expandWorld?: boolean` (default: false) for v2.4 objects
- `WorldInteraction` accepts `enableStorytelling?: boolean` (default: false) for v2.5 events

Each feature flag is independently togglable. v1.0 behavior is the default.

---

*This document defines the strategic direction for Creative Engine v2.x. It is a living document — updated as priorities shift, ideas evolve, and feedback emerges.*

*Version 1.0 — Strategic Vision*
*AMR YOUSRY Creative Studio — July 2026*
