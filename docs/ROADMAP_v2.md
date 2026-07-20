# ROADMAP — Creative Engine v2.0

## Vision

v2.0 transforms the Creative Engine from a decorative ecosystem into an interactive storytelling layer. The pixel world becomes responsive to user scrolling, section visibility, and active project exploration.

## Planned Features

### Interactive Ecosystem (Priority: High)

| Feature | Description | Effort |
|---------|-------------|--------|
| Scroll-aware state | Objects react to which section is in view — Core glows on hero, Crystal pulses on about, etc. | Medium |
| Section affinity | Certain objects follow the user as they scroll (e.g., Drone trailing behind viewport) | Medium |
| Click/tap interactions | Clicking an object triggers a visible reaction (pulse, color shift, message) | Low |
| Mouse proximity | Objects subtly lean toward or away from cursor position | Low |

### Enhanced Visuals (Priority: Medium)

| Feature | Description | Effort |
|---------|-------------|--------|
| Particle system | Floating energy particles that interact with objects | High |
| Energy trails | Objects leave a short, fading trail as they move | Medium |
| Micro-transitions | State changes get brief (100ms) intermediate frames | Low |
| Reduced motion tiers | Three levels: full, reduced (current), minimal (static only) | Low |

### Technical Improvements (Priority: Medium)

| Feature | Description | Effort |
|---------|-------------|--------|
| Unit tests | Full test coverage for state machine, dispatch, and components | High |
| Integration tests | E2E tests for ecosystem behavior | High |
| Config-driven tuning | Move all magic numbers to `ECOSYSTEM_CONFIG` | Low |
| Performance benchmarks | Automated tracking of tick duration, FPS, memory | Medium |

### New Objects (Priority: Low)

| Object | Description | Effort |
|--------|-------------|--------|
| Ambient particles | Floating dust/sparkles that react to object states | Medium |
| Energy conduit | Visible line between Core and Crystal when energy flows | Low |
| Mini-map | Tiny view of all objects in a corner of the viewport | High |

## Non-Goals (v2.0)

- No real-time collaboration
- No persistent storage (no login, no save states)
- No mobile canvas/WebGL rendering
- No audio or sound effects
- No external data fetching

## Timeline (Tentative)

| Milestone | Target | Deliverables |
|-----------|--------|--------------|
| Planning & Design | Q3 2026 | Spec, mockups, test plan |
| Core interactivity | Q4 2026 | Scroll-aware states, section affinity, click reactions |
| Enhanced visuals | Q1 2027 | Particle system, energy trails, micro-transitions |
| Testing & Polish | Q2 2027 | Full test suite, performance tuning, config-driven tuning |
| v2.0 Release | Q2 2027 | Certification, documentation, release |

## Dependencies

- No external dependencies required
- All features build on existing CSS animation and React architecture
- Behavior API (`useAmbient`, `useReveal`, etc.) will be used for scroll-aware state
