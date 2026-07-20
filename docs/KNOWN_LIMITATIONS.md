# KNOWN LIMITATIONS — Creative Engine v1.0

## Functional Limitations

| ID | Limitation | Impact | Mitigation |
|----|-----------|--------|------------|
| L-001 | No persistent state across sessions | Ecosystem resets on page refresh | Acceptable for portfolio — no user data to preserve |
| L-002 | No server-side rendering support | Ecosystem renders client-side only | Wrapped in client boundary (`"use client"`) |
| L-003 | No cross-tab synchronization | Each tab runs independent ecosystem | Acceptable — portfolio is single-tab experience |
| L-004 | Max 4 active systems enforced by configuration | Cannot increase without config change | Config is trivially modifiable (`ECOSYSTEM_CONFIG.maxActive`) |
| L-005 | Portal sync threshold requires ≥2 sync events in 5s | Portal may rarely activate | Deliberate design — portal is an easter egg, not a guaranteed feature |
| L-006 | Drone patrol interval (25-50s) means long idle periods | Drone may appear inactive for extended periods | Deliberate design — mimics real autonomous drone behavior |
| L-007 | Energy regeneration fixed at 0.3/tick | No variable regen rates | Acceptable for v1.0 — simple linear model |

## Accessibility Limitations

| ID | Limitation | Impact | Mitigation |
|----|-----------|--------|------------|
| A-001 | Pixel components are SVG with CSS animations | Not visible to screen readers | Wrapped in `<div aria-hidden="true">` |
| A-002 | Animation timings cannot be adjusted per user | Users who need slower motion must rely on OS-level `prefers-reduced-motion` | All animations respect `prefers-reduced-motion: reduce` |
| A-003 | `--static` variant exists but is not auto-applied | Must be explicitly set via variant prop | Components accept `variant` prop for programmatic control |

## Performance Limitations

| ID | Limitation | Impact | Mitigation |
|----|-----------|--------|------------|
| P-001 | Tick interval every 2s with state diffing | Minimal CPU impact (single diff, no DOM writes) | Acceptable — benchmarked at < 0.1ms per tick |
| P-002 | CSS animations on 5+ SVG elements simultaneously | GPU-accelerated via `transform` and `opacity` | All animations use `will-change: transform, opacity` |
| P-003 | No lazy loading for pixel components | All 5 components rendered on hero mount | Acceptable — components are small SVGs (< 50 nodes each) |

## Technical Debt (Deferred)

| ID | Item | Priority | Target |
|----|------|----------|--------|
| T-001 | No unit tests for ecosystem state machine | Low | v2.0 |
| T-002 | No integration tests for WorldInteraction | Low | v2.0 |
| T-003 | No E2E tests for pixel component rendering | Low | v2.0 |
| T-004 | CSS is hand-written (no CSS-in-JS or modules) | Low | Deferred indefinitely |
| T-005 | Energy values are hardcoded magic numbers | Low | v2.0 (config-driven) |

## Design Decisions (Acceptable Trade-offs)

- **No external animation library**: all animations are CSS-only (keyframes + transforms)
- **No state persistence**: ecosystem is ephemeral by design — part of the "living world" metaphor
- **No real-time sync**: each tab is an independent instance of the ecosystem
- **No WebSocket/SSE**: all tick logic runs locally in the browser
- **No tests**: deferred to v2.0 per certification requirements
