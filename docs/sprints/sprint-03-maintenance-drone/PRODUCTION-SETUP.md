# SPRINT 03 — MAINTENANCE DRONE
## Production Setup & Interaction Framework

**Sprint:** 03 of 10
**Asset:** Maintenance Drone (Pixel Drone)
**Asset ID:** `ce_drone_idle_v01`
**Status:** READY FOR PRODUCTION
**Date:** 2026-07-19

---

# PRODUCTION REQUIREMENTS

## New for Sprint 03
Following Phase 3.1 Production Evolution, Sprint 03 must deliver:

1. ✅ Approved Concept
2. ✅ Silhouette Exploration (5 silhouettes)
3. ✅ Design Exploration (3 concepts)
4. ✅ Final Pixel Artwork
5. ✅ Master Sprite
6. ✅ Sprite Sheet
7. ✅ Animation Frames
8. ✅ Lighting Breakdown
9. ✅ Palette Reference
10. ✅ Quality Assurance Report
11. ✅ Integration Preview
12. ✅ Sprite Atlas Update
13. ✅ **Interaction Demonstration** (NEW)
14. ✅ Production Notes

---

# INTERACTION FRAMEWORK

## World Interaction Requirement
Following Phase 3.1 Priority 05, Sprint 03 must introduce at least one meaningful interaction with an existing system.

## Interaction Design: Drone Inspects Creative Core

### Scenario
The Maintenance Drone performs a routine inspection of the Creative Core. This communicates:
- **Monitoring** — the drone's primary function
- **Maintenance** — the Engine is actively maintained
- **Communication** — the drone and Core are aware of each other
- **Energy Transfer** — the drone receives power from the Core

### Interaction Sequence
```
1. Drone approaches Creative Core (scroll-triggered)
   ↓
2. Drone hovers near Core (idle animation)
   ↓
3. Drone's eye brightens (inspection active)
   ↓
4. Small energy stream transfers from Core to Drone
   ↓
5. Drone's core pulses (energy received)
   ↓
6. Creative Core emits brief glow (energy transferred)
   ↓
7. Drone's eye returns to normal (inspection complete)
   ↓
8. Both return to idle state
```

### Technical Implementation
- **Trigger:** IntersectionObserver on Hero section
- **Duration:** 3000ms total interaction
- **Components:** MaintenanceDronePixel, CreativeCorePixel
- **State Management:** Shared interaction state via React context or callback
- **Animation:** CSS keyframes + requestAnimationFrame for coordinated timing

### Interaction States
| State | Drone | Core | Duration |
|-------|-------|------|----------|
| Idle | Bob animation | Breathing animation | Until trigger |
| Approach | Move toward Core | No change | 500ms |
| Inspect | Eye brightens | No change | 500ms |
| Transfer | Core pulses | Glow intensifies | 1000ms |
| Complete | Eye returns normal | Glow returns normal | 500ms |
| Return | Bob animation | Breathing animation | Until next trigger |

---

# COMPATIBILITY NOTES

## Existing CSS Drone
The boot sequence already has a CSS-based drone (`CreativeEngineLoader.tsx`). Sprint 03 will create a pixel art version that:
- **Replaces** the CSS drone in the boot sequence (after approval)
- **Complements** the CSS drone in the hero section (if needed)
- **Maintains** visual consistency with the existing implementation

## Component Architecture
Following the Production Review corrections, the MaintenanceDronePixel component must:
- Use universal PixelSpriteProps
- Support optional extended props (activateOnScroll, pulseInterval)
- Include interaction props for Core communication
- Follow the same animation patterns as existing components

---

# ATLAS UPDATE

## New Assets for Sprint 03
| Asset | Position | Canvas | Display |
|-------|----------|--------|---------|
| Maintenance Drone — Idle | Column 5, Row 0 | 24×28px | 72×84px |
| Maintenance Drone — Activate | Column 5, Row 1 | 24×28px | 72×84px |
| Maintenance Drone — Glow | Column 5, Row 2 | 24×28px | 72×84px |

## Atlas Size Update
- **Previous:** 156×76px native
- **New:** 156×108px native (added row for drone variants)

---

# QUALITY GATES

## Sprint 03 Specific
- [ ] Drone is charming, character is clear
- [ ] Drone matches existing CSS drone reference
- [ ] Drone bob is smooth, wing flap is satisfying
- [ ] Drone eye glow is visible but not overpowering
- [ ] Drone is visible against #0D0A1A background
- [ ] Drone has minimum 3:1 contrast against background
- [ ] Drone animation is GPU-accelerated
- [ ] Drone respects prefers-reduced-motion
- [ ] Drone component uses universal props
- [ ] Drone interaction with Creative Core is smooth
- [ ] Drone improves the Creative Engine ecosystem
- [ ] Sprite Atlas remains visually consistent

## Universal (All Sprints)
- [ ] Asset functions correctly alone
- [ ] Asset functions correctly inside the website
- [ ] Asset matches all previous assets
- [ ] No unnecessary visual noise introduced
- [ ] World interaction has been expanded
- [ ] Production quality exceeds previous sprint

---

# PRODUCTION NOTES

## Key Decisions
1. **Canvas Size:** 24×28px (larger than standard 16×16 due to character complexity)
2. **Display Scale:** 3× (72×84px) — larger than other assets due to character importance
3. **Animation:** 6-frame idle, 8-frame activate, 4-frame glow — more frames for character animation
4. **Interaction:** Drone inspects Core — first inter-object interaction in the universe

## Risks
1. **Canvas inconsistency:** Drone is 24×28px while other assets are 16×16px. This is acceptable because the drone is a character, not a decorative element.
2. **Animation complexity:** More frames than previous assets. This is acceptable because character animation requires more nuance.
3. **Interaction complexity:** First inter-object interaction. This is a milestone that establishes the pattern for future sprints.

## Success Criteria
- Drone is charming and recognizable
- Drone matches the existing CSS drone reference
- Drone interaction with Creative Core is smooth and meaningful
- Sprite Atlas is updated with new assets
- Production quality exceeds Sprint 02

---

# READY FOR PRODUCTION

**Status:** APPROVED
**Blocked:** None
**Dependencies:** Sprint 01 (Creative Core), Sprint 02 (Memory Crystal)
**Next Step:** Begin Stage 01 — Asset Exploration
