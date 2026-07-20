# STATE MACHINE DIAGRAM — Creative Engine v1.0

## Creative Core

```
                  ┌──────────┐
                  │  idle    │◄──────────────────────┐
                  └────┬─────┘                       │
                       │                             │
                       │ core:maintenance_request    │
                       ▼                             │
                  ┌──────────┐                       │
                  │maintenance│                       │
                  └────┬─────┘                       │
                       │                             │
                       │ (auto-complete)              │
                       ▼                             │
                  ┌──────────┐                       │
                  │energy_   │                       │
                  │transfer  │                       │
                  └────┬─────┘                       │
                       │                             │
                       │ core:sync_complete           │
                       ▼                             │
                  ┌──────────┐                       │
                  │low_power │───(energy regen >─┐   │
                  └──────────┘     threshold)    │   │
                       │                        │   │
                       └────────────────────────┘   │
                                                    │
              (safety timeout 20s) ─────────────────┘
```

**Transitions:**
- `idle` → `maintenance`: `core:maintenance_request` (when energy < 30)
- `maintenance` → `energy_transfer`: automatic (after 2s)
- `energy_transfer` → `idle`: `core:sync_complete`
- `energy_transfer` → `low_power`: automatic (when energy < 20)
- `low_power` → `idle`: automatic (when energy regen >= 30)
- Any state → `idle`: safety timeout (20s)

## Memory Crystal

```
        ┌──────────┐
        │ dormant  │◄──────────────────────────┐
        └────┬─────┘                           │
             │                                 │
             │ crystal:sync_received            │
             ▼                                 │
        ┌──────────┐                           │
        │resonating│                           │
        └────┬─────┘                           │
             │                                 │
             │ crystal:resonance_boost          │
             ▼                                 │
        ┌──────────┐                           │
        │  active  │                           │
        └────┬─────┘                           │
             │                                 │
             │ (auto after 5s)                  │
             ▼                                 │
        ┌──────────┐                           │
        │ energy_  │                           │
        │ release  │───crystal:energy_released──┘
        └──────────┘
```

**Transitions:**
- `dormant` → `resonating`: `crystal:sync_received`
- `resonating` → `active`: `crystal:resonance_boost`
- `active` → `energy_release`: auto (5s timer)
- `energy_release` → `dormant`: `crystal:energy_released`

## Maintenance Drone

```
  ┌──────────┐
  │  patrol  │◄──────────────────────────────────────┐
  └────┬─────┘                                       │
       │                                              │
       │ drone:approach                                │
       ▼                                              │
  ┌──────────┐                                        │
  │ approach │                                        │
  └────┬─────┘                                        │
       │                                              │
       │ (1.5s timer)                                  │
       ▼                                              │
  ┌──────────┐                                        │
  │ inspect  │                                        │
  └────┬─────┘                                        │
       │                                              │
       │ drone:inspect_complete                        │
       ▼                                              │
  ┌──────────┐                                        │
  │transfer_ │                                        │
  │ energy   │                                        │
  └────┬─────┘                                        │
       │                                              │
       │ drone:energy_received                         │
       ▼                                              │
  ┌──────────┐                                        │
  │  return  │                                        │
  └────┬─────┘                                        │
       │                                              │
       │ drone:return                                  │
       └──────────────────────────────────────────────┘
```

**Transitions:**
- `patrol` → `approach`: `drone:approach` (random 25-50s interval)
- `approach` → `inspect`: auto (1.5s timer)
- `inspect` → `transfer_energy`: `drone:inspect_complete` (2s timer)
- `transfer_energy` → `return`: `drone:energy_received` (1.5s timer)
- `return` → `patrol`: `drone:return` (1.5s timer)

## Signal Beacon

```
  ┌──────────┐
  │  idle    │◄─────────────────┐
  └────┬─────┘                  │
       │                        │
       │ beacon:activate         │
       ▼                        │
  ┌──────────┐                  │
  │  active  │───(3s timer)─────┘
  └──────────┘
```

**Transitions:**
- `idle` → `active`: `beacon:activate` (triggered by core sync)
- `active` → `idle`: auto (3s timer)

## Portal

```
        ┌──────────┐
        │  idle    │◄─────────────────────────────┐
        └────┬─────┘                              │
             │                                    │
             │ (sync threshold met)                │
             ▼                                    │
        ┌──────────┐                              │
        │preparing │                              │
        └────┬─────┘                              │
             │                                    │
             │ (1s timer)                          │
             ▼                                    │
        ┌──────────┐                              │
        │ opening  │                              │
        └────┬─────┘                              │
             │                                    │
             │ (1.5s timer)                        │
             ▼                                    │
        ┌──────────┐                              │
        │  active  │                              │
        └────┬─────┘                              │
             │                                    │
             │ (2s timer)                          │
             ▼                                    │
        ┌──────────┐                              │
        │synchron- │                              │
        │ izing    │                              │
        └────┬─────┘                              │
             │                                    │
             │ (2s timer)                          │
             ▼                                    │
        ┌──────────┐                              │
        │ closing  │                              │
        └────┬─────┘                              │
             │                                    │
             │ (1.5s timer)                        │
             ▼                                    │
        ┌──────────┐                              │
        │ dormant  │──(30s cooldown)──────────────┘
        └──────────┘
```

**Activation conditions:**
- Core energy >= 60
- At least 2 sync events in 5s window
- 30s cooldown since last portal activation

**Transitions:**
- `idle` → `preparing`: conditions met
- `preparing` → `opening`: auto (1s)
- `opening` → `active`: auto (1.5s)
- `active` → `synchronizing`: auto (2s)
- `synchronizing` → `closing`: auto (2s)
- `closing` → `dormant`: auto (1.5s)
- `dormant` → `idle`: auto (30s cooldown)
- Any state → `idle`: safety timeout (20s)
