# EVENT FLOW DIAGRAM — Creative Engine v1.0

## Event Catalog

| Event | Source | Target(s) | Trigger |
|-------|--------|-----------|---------|
| `core:maintenance_request` | Tick logic | Core | Core energy < 30 |
| `core:sync_complete` | Core `energy_transfer` | Core, Drone, Crystal | Transfer timer expiry |
| `drone:approach` | Tick logic | Drone | Random 25-50s patrol timer |
| `drone:inspect_start` | Drone `approach` | Drone | 1.5s approach timer |
| `drone:inspect_complete` | Drone `inspect` | Drone | 2s inspect timer |
| `drone:energy_received` | Drone `transfer_energy` | Drone | 1.5s transfer timer |
| `drone:return` | Drone `return` | Drone, Core | 1.5s return timer |
| `crystal:sync_received` | Core `sync_complete` | Crystal | Core sync |
| `crystal:energy_released` | Crystal `energy_release` | Crystal, Core | 5s active timer |
| `crystal:resonance_boost` | Beacon `active` | Crystal | Beacon activation |
| `beacon:activate` | Core `sync_complete` | Beacon | Core sync |
| `world:reduced_motion` | System | Global | prefers-reduced-motion media query |
| `world:page_hidden` | System | Global | Page visibility API |

## Primary Interaction Flow

```
TICK (every 2s)
  │
  ├── Energy regeneration (idle/patrol/dormant objects)
  ├── Safety timeout check (force reset if > 20s in state)
  │
  ├── CORE (idle, energy ≥ 30)
  │    └── dispatch core:maintenance_request
  │         └── Core → maintenance → energy_transfer
  │              └── (2s timer) → core:sync_complete
  │                   ├── Core → idle (or low_power)
  │                   ├── dispatch beacon:activate → Beacon → active (3s)
  │                   ├── dispatch crystal:sync_received → Crystal → resonating
  │                   └── (Beacon active) → dispatch crystal:resonance_boost
  │                        └── Crystal → active → (5s) → energy_release
  │                             └── dispatch crystal:energy_released
  │                                  └── Core receives +10 energy
  │
  ├── DRONE (patrol, random 25-50s timer)
  │    └── dispatch drone:approach
  │         └── Drone → approach → (1.5s) → inspect → (2s)
  │              └── dispatch drone:inspect_start → dispatch drone:inspect_complete
  │                   └── Drone → transfer_energy → (1.5s)
  │                        └── dispatch drone:energy_received
  │                             └── Drone → return → (1.5s)
  │                                  └── dispatch drone:return → Drone → patrol
  │                                       └── dispatch core:sync_complete (bonus)
  │
  └── PORTAL (if conditions met: core ≥ 60 energy, ≥ 2 sync events in 5s, cooldown ready)
       └── Portal → preparing → (1s) → opening → (1.5s) → active → (2s)
            → synchronizing → (2s) → closing → (1.5s) → dormant → (30s) → idle
```

## Energy Flow

```
Beacon (active 3s) ──resonance_boost──┐
                                       ▼
Core (sync) ──sync_received──► Crystal ──resonating──► active ──(5s)──► energy_release
  │                                │                                          │
  │                                └── energy_released (+10 to Core) ─────────┘
  │
  └── beacon:activate ──► Beacon (active)

Drone ──approach──► inspect──► transfer_energy──► return──► (core sync bonus)
```

## Cooldown Enforcement

- Every object has a `cooldownUntil` timestamp
- Interactions are skipped if `Date.now() < cooldownUntil`
- Cooldown duration: 18,000ms (configurable via `ECOSYSTEM_CONFIG.interactionCooldown`)
- Portal has separate cooldown: 30,000ms (`portalActivationCooldown`)
