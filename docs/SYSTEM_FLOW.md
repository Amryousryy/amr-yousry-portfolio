# SYSTEM FLOW — Creative Engine v1.0

## Initialization Sequence

```
1. App mounts
2. EcosystemRoot renders
3. EcosystemProvider initializes default state
   ├── Core (idle, energy: 100)
   ├── Crystal (dormant, energy: 100)
   ├── Drone (patrol, energy: 100)
   ├── Beacon (idle, energy: 100)
   ├── Portal (idle, energy: 100)
   ├── activeCount: 0
   ├── reducedMotion: (from media query)
   ├── pageHidden: false
   └── lastTick: Date.now()
4. EcosystemProvider starts tick interval (2s)
5. WorldInteraction renders pixel components
6. Drone schedules first approach (25-50s random)
7. Core schedules first maintenance check (immediate)
```

## Render Loop

```
┌──────────────────────────────────────┐
│         NEXT.JS RENDER                │
│                                      │
│  WorldInteraction computes variants  │
│  from EcosystemState and passes to   │
│  each pixel component as props:      │
│                                      │
│  CoreVariant   ← core.state          │
│  CrystalVariant ← crystal.state      │
│  DroneVariant  ← drone.state         │
│  BeaconVariant ← beacon.state        │
│  PortalVariant ← portal.state        │
│                                      │
│  Pixel components render SVG with    │
│  CSS class matching variant          │
└──────────────────────────────────────┘
```

## Tick Cycle

```
Every 2000ms:
  1. Regenerate energy for idle/patrol/dormant objects (+0.3)
  2. Check safety timeouts (force idle if > 20s in any state)
  3. Execute pending object transitions
  4. Update activeCount
```

## Safety Mechanisms

| Mechanism | Threshold | Action |
|-----------|-----------|--------|
| Safety timeout | 20,000ms in any state | Force reset to idle |
| Active count limit | 4 concurrent | Block new interactions |
| Interaction cooldown | 18,000ms | Skip if within cooldown |
| Portal energy threshold | 60 core energy | Block portal activation |
| Portal cooldown | 30,000ms | Block portal activation |
| Portal sync threshold | 2 events in 5s | Block portal activation |

## CSS Variant Mapping

Each object state maps to a CSS visual variant:

| Object | State → Variant | CSS Class |
|--------|----------------|-----------|
| Core | `idle` → `idle` | `.ce-core-pixel--idle` |
| Core | `energy_transfer` → `pulse` | `.ce-core-pixel--pulse` |
| Core | `maintenance` → `pulse` | `.ce-core-pixel--pulse` |
| Core | `low_power` → `idle` | `.ce-core-pixel--idle` |
| Core | — → `static` | `.ce-core-pixel--static` |
| Crystal | `dormant` → `idle` | `.ce-crystal-pixel--idle` |
| Crystal | `resonating` → `pulse` | `.ce-crystal-pixel--pulse` |
| Crystal | `active` → `activate` | `.ce-crystal-pixel--activate` |
| Crystal | `energy_release` → `pulse` | `.ce-crystal-pixel--pulse` |
| Crystal | — → `static` | `.ce-crystal-pixel--static` |
| Drone | `patrol` → `idle` | `.ce-drone-pixel--idle` |
| Drone | `approach` → `idle` | `.ce-drone-pixel--idle` |
| Drone | `inspect` → `inspect` | `.ce-drone-pixel--inspect` |
| Drone | `transfer_energy` → `transfer` | `.ce-drone-pixel--transfer` |
| Drone | `return` → `idle` | `.ce-drone-pixel--idle` |
| Drone | — → `static` | `.ce-drone-pixel--static` |
| Beacon | `idle` → `idle` | `.ce-beacon-pixel--idle` |
| Beacon | `active` → `active` | `.ce-beacon-pixel--active` |
| Beacon | — → `static` | `.ce-beacon-pixel--static` |
| Portal | varies | `.ce-portal-pixel--{state}` |

## Health Metrics

The system is monitored via `scripts/health-metrics.js`:

| Metric | Target | Current |
|--------|--------|---------|
| Behavior API adoption | Increasing | 12 imports, 2 usages |
| Direct .animate() calls | 0 | 0 |
| Unauthorized lib usage | 0 | 0 |
| Documentation rate | 100% | 100% |
| Exception compliance | 100% | 100% |
| Health score | 100/100 | 100/100 |
