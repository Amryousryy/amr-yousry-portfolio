/**
 * Creative Engine — Ecosystem Manager
 * 
 * Phase 4.0: Central state machine that coordinates all objects.
 * No timeline-only interactions. Every animation has a cause.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  EcosystemState,
  EcosystemEvent,
  ObjectId,
  ObjectState,
  CoreState,
  CrystalState,
  DroneState,
} from "./types";
import { ECOSYSTEM_CONFIG } from "./types";

// ─── Initial State ───────────────────────────────────────────────

function createInitialState(): EcosystemState {
  const now = Date.now();
  let reducedMotion = false;
  if (typeof window !== "undefined") {
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return {
    core: {
      id: "core",
      state: "idle",
      energy: 80,
      lastActive: now,
      cooldownUntil: 0,
    },
    crystal: {
      id: "crystal",
      state: "dormant",
      energy: 60,
      lastActive: now,
      cooldownUntil: 0,
    },
    drone: {
      id: "drone",
      state: "patrol",
      energy: 90,
      lastActive: now,
      cooldownUntil: 0,
    },
    activeCount: 1,
    heroVisible: true,
    reducedMotion,
    pageHidden: false,
    lastTick: now,
  };
}

// ─── State Mappers ───────────────────────────────────────────────

export function coreStateToVariant(state: CoreState): "idle" | "pulse" {
  switch (state) {
    case "charging":
    case "synchronizing":
    case "energy_transfer":
      return "pulse";
    default:
      return "idle";
  }
}

export function crystalStateToVariant(state: CrystalState): "idle" | "pulse" | "activate" {
  switch (state) {
    case "resonating":
    case "active":
      return "pulse";
    case "energy_release":
      return "activate";
    default:
      return "idle";
  }
}

export function droneStateToVariant(state: DroneState): "idle" | "inspect" | "transfer" {
  switch (state) {
    case "inspect":
    case "repair":
      return "inspect";
    case "transfer_energy":
      return "transfer";
    default:
      return "idle";
  }
}

// ─── Transition Logic ────────────────────────────────────────────

function canActivate(state: EcosystemState): boolean {
  return state.activeCount < ECOSYSTEM_CONFIG.maxActive;
}

function isCooledDown(obj: { cooldownUntil: number }): boolean {
  return Date.now() >= obj.cooldownUntil;
}

function applyCooldown(state: EcosystemState, id: ObjectId): EcosystemState {
  const now = Date.now();
  return {
    ...state,
    [id]: {
      ...state[id],
      cooldownUntil: now + ECOSYSTEM_CONFIG.interactionCooldown,
      lastActive: now,
    },
  };
}

// ─── Ecosystem Hook ──────────────────────────────────────────────

export function useCreativeEngine() {
  const [state, setState] = useState<EcosystemState>(createInitialState);

  // Sync ref outside of render via effect
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  // ── Event Processor ──────────────────────────────────────────

  const processEvent = useCallback((event: EcosystemEvent) => {
    setState((prev) => {
      const now = Date.now();
      const next = { ...prev, lastTick: now };

      switch (event.type) {
        // ── World Events ──────────────────────────────────────
        case "world:hero_visible":
          return { ...next, heroVisible: event.visible };

        case "world:reduced_motion":
          return { ...next, reducedMotion: event.active };

        case "world:page_hidden":
          return { ...next, pageHidden: event.hidden };

        case "world:scroll_position":
          // Scroll position used by consumers, no state change needed
          return next;

        // ── Core Events ───────────────────────────────────────
        case "core:energy_drop": {
          if (prev.core.state !== "idle" && prev.core.state !== "cooling") return prev;
          const newEnergy = Math.max(20, event.energy);
          return {
            ...next,
            core: {
              ...prev.core,
              energy: newEnergy,
              state: newEnergy < 40 ? "low_power" : "idle",
            },
          };
        }

        case "core:maintenance_request": {
          if (!isCooledDown(prev.core)) return prev;
          if (!canActivate(prev)) return prev;
          return {
            ...next,
            core: { ...prev.core, state: "maintenance" },
            activeCount: prev.activeCount + 1,
          };
        }

        case "core:sync_complete": {
          if (prev.core.state !== "synchronizing") return prev;
          const cooled = applyCooldown(prev, "core");
          return {
            ...cooled,
            core: { ...cooled.core, state: "idle", energy: Math.min(100, cooled.core.energy + 20) },
            activeCount: Math.max(0, cooled.activeCount - 1),
          };
        }

        // ── Drone Events ──────────────────────────────────────
        case "drone:maintenance_complete": {
          if (prev.drone.state !== "inspect" && prev.drone.state !== "repair") return prev;
          const cooled = applyCooldown(prev, "drone");
          return {
            ...cooled,
            drone: { ...cooled.drone, state: "return" },
          };
        }

        case "drone:energy_received": {
          if (prev.drone.state !== "transfer_energy") return prev;
          const cooled = applyCooldown(prev, "drone");
          return {
            ...cooled,
            drone: {
              ...cooled.drone,
              state: "return",
              energy: Math.min(100, cooled.drone.energy + 30),
            },
            core: {
              ...prev.core,
              state: "energy_transfer",
              energy: Math.max(0, prev.core.energy - 15),
            },
          };
        }

        // ── Crystal Events ────────────────────────────────────
        case "crystal:sync_received": {
          if (!isCooledDown(prev.crystal)) return prev;
          if (!canActivate(prev)) return prev;
          return {
            ...next,
            crystal: { ...prev.crystal, state: "active" },
            activeCount: prev.activeCount + 1,
          };
        }

        case "crystal:energy_released": {
          if (prev.crystal.state !== "active" && prev.crystal.state !== "energy_release") return prev;
          const cooled = applyCooldown(prev, "crystal");
          return {
            ...cooled,
            crystal: {
              ...cooled.crystal,
              state: "dormant",
              energy: Math.max(0, cooled.crystal.energy - event.energy),
            },
            activeCount: Math.max(0, cooled.activeCount - 1),
          };
        }

        // ── System Events ─────────────────────────────────────
        case "system:cooldown_complete": {
          return {
            ...next,
            [event.target]: {
              ...next[event.target],
              cooldownUntil: 0,
            },
          };
        }

        default:
          return next;
      }
    });
  }, []);

  // ── Autonomous Ticking ───────────────────────────────────────
  // The world continues operating regardless of user interaction.

  useEffect(() => {
    const tick = setInterval(() => {
      setState((prev) => {
        if (prev.pageHidden) return prev;
        if (prev.reducedMotion) return prev;

        const now = Date.now();
        let next = { ...prev, lastTick: now };

        // Energy regeneration for idle objects
        const regen = (id: ObjectId) => {
          if (next[id].state === "idle" || next[id].state === "patrol" || next[id].state === "dormant") {
            next = {
              ...next,
              [id]: {
                ...next[id],
                energy: Math.min(100, next[id].energy + ECOSYSTEM_CONFIG.energyRegenRate),
              },
            };
          }
        };

        regen("core");
        regen("crystal");
        regen("drone");

        // Auto-transition: drone return → patrol
        if (next.drone.state === "return" && now > next.drone.cooldownUntil) {
          next = {
            ...next,
            drone: { ...next.drone, state: "patrol" },
          };
        }

        // Auto-transition: core energy_transfer → idle
        if (next.core.state === "energy_transfer") {
          next = {
            ...next,
            core: { ...next.core, state: "idle" },
          };
        }

        // Auto-transition: crystal active → dormant (after 6s)
        if (next.crystal.state === "active" && now - next.crystal.lastActive > 6000) {
          next = {
            ...next,
            crystal: { ...next.crystal, state: "dormant" },
            activeCount: Math.max(0, next.activeCount - 1),
          };
        }

        return next;
      });
    }, ECOSYSTEM_CONFIG.tickInterval);

    return () => clearInterval(tick);
  }, []);

  // ── Page Visibility ──────────────────────────────────────────

  useEffect(() => {
    const onVisibility = () => {
      processEvent({ type: "world:page_hidden", hidden: document.hidden });
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [processEvent]);

  // ── Reduced Motion ───────────────────────────────────────────
  // Initial state handled by createInitialState. This only watches for changes.

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) =>
      processEvent({ type: "world:reduced_motion", active: e.matches });
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [processEvent]);

  // ── Public API ───────────────────────────────────────────────

  const getObjectState = useCallback(
    (id: ObjectId) => stateRef.current[id] as ObjectState,
    []
  );

  const isActive = useCallback(
    (id: ObjectId) => {
      const s = stateRef.current[id];
      return s.state !== "idle" && s.state !== "patrol" && s.state !== "dormant";
    },
    []
  );

  return {
    state,
    processEvent,
    getObjectState,
    isActive,
    /** Derived visual variants */
    coreVariant: coreStateToVariant(state.core.state),
    crystalVariant: crystalStateToVariant(state.crystal.state),
    droneVariant: droneStateToVariant(state.drone.state),
    /** Energy levels */
    coreEnergy: state.core.energy,
    crystalEnergy: state.crystal.energy,
    droneEnergy: state.drone.energy,
    /** System flags */
    canActivate: canActivate(state),
    heroVisible: state.heroVisible,
    reducedMotion: state.reducedMotion,
  };
}
