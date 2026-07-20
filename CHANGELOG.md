# CHANGELOG

## v1.0.0 — Architecture Refinement & Stable Release (July 20, 2026)

### Phase 6.1 — Architecture Refinement

**Cleanup: Dead State Removal**
- Core: removed `charging`, `synchronizing`, `cooling` (3 dead states)
- Crystal: removed `charging`, `cooling`, `maintenance` (3 dead states)
- Drone: removed `hover`, `repair`, `idle_dock` (3 dead states)
- Total: 7 dead states eliminated from type system

**Cleanup: Dead Event Removal**
- `core:energy_drop` — replaced by tick-based energy regen
- `drone:transfer_start` — merged into transfer handler
- `beacon:deactivate` — beacon auto-deactivates on timer
- `portal:activate`, `portal:deactivate` — portal manages its own lifecycle
- `world:hero_visible`, `world:scroll_position` — removed unused tracking
- `system:cooldown_complete` — cooldown managed internally
- Total: 8 dead events eliminated from event system

**Cleanup: Handler & Guard Cleanup**
- Removed handlers for all 8 dead events in `ecosystem.ts`
- Removed dead state guards (sync_complete no longer checks "synchronizing", inspect_start no longer checks "hover")
- Removed unused exports (`getObjectState`, `isActive`)
- Removed `heroVisible` references and `world:scroll_position` no-op

**Cleanup: Component Alignment**
- `WorldInteraction.tsx`: removed "cooling" from core state guard, removed "hover" from drone state guard
- Updated phase comments across all engine files to Phase 6.1

**Accessibility: Static CSS Rules**
- Added `--static` animation: none rules to `ce_core_focal.css`, `ce_crystal.css`, `ce_drone.css`, `ce_beacon.css`
- Each static rule covers all sub-element animations (wings, antennae, rings, tips, cores)

**Quality Gates**
- Lint: 0 errors
- Build: silent
- `validate:behavior`: All checks passed
- `health:metrics`: 100/100 (EXCELLENT)

### Phase 6.0 — v1.0 Certification (July 19, 2026)

- Full 6-area certification audit (Visual/Behavioral/Runtime/Performance/Accessibility/UX)
- Fixed portal safety timeout (maxStateTime enforcement was missing)
- v1.0 APPROVED — certified for production use
- 7 dead states + 8 dead events documented as technical debt (resolved in 6.1)

### Phase 5.0 — Living World Expansion (Previous)

- Sprint 05: Energy Visualization Layer (CSS-only cyan/purple streams)
- Sprint 06: Portal System (16x16px SVG ring, 7-state machine, 30s cooldown)
