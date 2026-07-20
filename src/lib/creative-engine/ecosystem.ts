/**
 * Creative Engine — Ecosystem Manager
 * 
 * Phase 6.1: Architecture Refinement & v1.0 Stable Release.
 * Every object owns a state machine. Every interaction has a cause.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  EcosystemState,
  EcosystemEvent,
  CoreState,
  CrystalState,
  DroneState,
  BeaconState,
  PortalState,
  ObjectId,
} from "./types";
import { ECOSYSTEM_CONFIG } from "./types";

// ─── Initial State ───────────────────────────────────────────────

function createInitialState(): EcosystemState {
  let reducedMotion = false;
  if (typeof window !== "undefined") {
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return {
    core: { id: "core", state: "idle", energy: 80, lastActive: Date.now(), cooldownUntil: 0 },
    crystal: { id: "crystal", state: "dormant", energy: 60, lastActive: Date.now(), cooldownUntil: 0 },
    drone: { id: "drone", state: "patrol", energy: 90, lastActive: Date.now(), cooldownUntil: 0 },
    beacon: { id: "beacon", state: "idle", energy: 85, lastActive: Date.now(), cooldownUntil: 0 },
    portal: { id: "portal", state: "idle", energy: 0, lastActive: Date.now(), cooldownUntil: 0, syncEvents: [] },
    activeCount: 0,
    reducedMotion,
    pageHidden: false,
    lastTick: Date.now(),
  };
}

// ─── State Mappers ───────────────────────────────────────────────

export function coreStateToVariant(state: CoreState): "idle" | "pulse" {
  switch (state) {
    case "energy_transfer":
    case "maintenance":
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
      return "inspect";
    case "transfer_energy":
      return "transfer";
    default:
      return "idle";
  }
}

export function beaconStateToVariant(state: BeaconState): "idle" | "active" {
  return state === "active" ? "active" : "idle";
}

export function portalStateToVariant(state: PortalState): "idle" | "preparing" | "opening" | "active" | "synchronizing" | "closing" {
  switch (state) {
    case "preparing":
      return "preparing";
    case "opening":
      return "opening";
    case "active":
      return "active";
    case "synchronizing":
      return "synchronizing";
    case "closing":
      return "closing";
    default:
      return "idle";
  }
}

// ─── Helpers ─────────────────────────────────────────────────────

function isCooledDown(obj: { cooldownUntil: number }): boolean {
  return Date.now() >= obj.cooldownUntil;
}

// ─── Ecosystem Hook ──────────────────────────────────────────────

export function useCreativeEngine() {
  const [state, setState] = useState<EcosystemState>(createInitialState);
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
        case "world:reduced_motion":
          return { ...next, reducedMotion: event.active };

        case "world:page_hidden":
          return { ...next, pageHidden: event.hidden };

        // ── Core Events ───────────────────────────────────────
        case "core:maintenance_request": {
          if (prev.core.state !== "idle" && prev.core.state !== "low_power") return prev;
          if (!isCooledDown(prev.core)) return prev;
          if (prev.activeCount >= ECOSYSTEM_CONFIG.maxActive) return prev;
          return {
            ...next,
            core: { ...prev.core, state: "maintenance", lastActive: now, cooldownUntil: now + ECOSYSTEM_CONFIG.interactionCooldown * 2 },
            activeCount: prev.activeCount + 1,
          };
        }

        case "core:sync_complete": {
          if (prev.core.state !== "energy_transfer") return prev;
          return {
            ...next,
            core: { ...prev.core, state: "idle", energy: Math.min(100, prev.core.energy + 15), lastActive: now, cooldownUntil: now + ECOSYSTEM_CONFIG.interactionCooldown },
            activeCount: Math.max(0, prev.activeCount - 1),
          };
        }

        // ── Drone Events ──────────────────────────────────────
        case "drone:approach": {
          if (prev.drone.state !== "patrol") return prev;
          if (prev.activeCount >= ECOSYSTEM_CONFIG.maxActive) return prev;
          return { ...next, drone: { ...prev.drone, state: "approach", lastActive: now }, activeCount: prev.activeCount + 1 };
        }

        case "drone:inspect_start": {
          if (prev.drone.state !== "approach") return prev;
          return { ...next, drone: { ...prev.drone, state: "inspect", lastActive: now } };
        }

        case "drone:inspect_complete": {
          if (prev.drone.state !== "inspect") return prev;
          return { ...next, drone: { ...prev.drone, state: "transfer_energy", lastActive: now } };
        }

        case "drone:energy_received": {
          if (prev.drone.state !== "transfer_energy") return prev;
          return {
            ...next,
            drone: { ...prev.drone, state: "return", energy: Math.min(100, prev.drone.energy + 30), lastActive: now },
            core: { ...prev.core, state: "energy_transfer", energy: Math.max(0, prev.core.energy - 15), lastActive: now },
          };
        }

        case "drone:return": {
          if (prev.drone.state !== "return" && prev.drone.state !== "transfer_energy") return prev;
          return { ...next, drone: { ...prev.drone, state: "patrol", lastActive: now, cooldownUntil: now + ECOSYSTEM_CONFIG.interactionCooldown }, activeCount: Math.max(0, prev.activeCount - 1) };
        }

        // ── Crystal Events ────────────────────────────────────
        case "crystal:sync_received": {
          if (prev.crystal.state !== "dormant") return prev;
          if (!isCooledDown(prev.crystal)) return prev;
          if (prev.activeCount >= ECOSYSTEM_CONFIG.maxActive) return prev;
          return { ...next, crystal: { ...prev.crystal, state: "resonating", lastActive: now, cooldownUntil: now + ECOSYSTEM_CONFIG.interactionCooldown }, activeCount: prev.activeCount + 1 };
        }

        case "crystal:energy_released": {
          if (prev.crystal.state !== "resonating" && prev.crystal.state !== "active" && prev.crystal.state !== "energy_release") return prev;
          return {
            ...next,
            crystal: { ...prev.crystal, state: "dormant", energy: Math.max(0, prev.crystal.energy - event.energy), lastActive: now, cooldownUntil: now + ECOSYSTEM_CONFIG.interactionCooldown },
            core: { ...prev.core, energy: Math.min(100, prev.core.energy + event.energy) },
            portal: { ...prev.portal, syncEvents: [...prev.portal.syncEvents, now] },
            activeCount: Math.max(0, prev.activeCount - 1),
          };
        }

        case "crystal:resonance_boost": {
          if (prev.crystal.state !== "dormant") return prev;
          return { ...next, crystal: { ...prev.crystal, energy: Math.min(100, prev.crystal.energy + event.energy), lastActive: now } };
        }

        // ── Beacon Events ─────────────────────────────────────
        case "beacon:activate": {
          if (prev.beacon.state !== "idle") return prev;
          if (!isCooledDown(prev.beacon)) return prev;
          if (prev.activeCount >= ECOSYSTEM_CONFIG.maxActive) return prev;
          return {
            ...next,
            beacon: { ...prev.beacon, state: "active", lastActive: now, cooldownUntil: now + ECOSYSTEM_CONFIG.interactionCooldown },
            portal: { ...prev.portal, syncEvents: [...prev.portal.syncEvents, now] },
            activeCount: prev.activeCount + 1,
          };
        }

        default:
          return next;
      }
    });
  }, []);

  // ── Autonomous Ticking ───────────────────────────────────────

  useEffect(() => {
    const tick = setInterval(() => {
      setState((prev) => {
        if (prev.pageHidden) return prev;
        if (prev.reducedMotion) return prev;

        const now = Date.now();
        let next = { ...prev, lastTick: now };

        // Energy regeneration for idle objects
        const regen = (id: ObjectId) => {
          const obj = next[id] as { state: string; energy: number };
          if (obj.state === "idle" || obj.state === "patrol" || obj.state === "dormant") {
            next = {
              ...next,
              [id]: { ...next[id], energy: Math.min(100, obj.energy + ECOSYSTEM_CONFIG.energyRegenRate) },
            };
          }
        };

        regen("core");
        regen("crystal");
        regen("drone");
        regen("beacon");

        // ── Crystal state progression ───────────────────────
        if (next.crystal.state === "resonating" && now - next.crystal.lastActive > 2000) {
          next = { ...next, crystal: { ...next.crystal, state: "active", lastActive: now } };
        }
        if (next.crystal.state === "active" && now - next.crystal.lastActive > 5000) {
          next = { ...next, crystal: { ...next.crystal, state: "energy_release", lastActive: now } };
        }

        // ── Beacon auto-deactivation ───────────────────────
        if (next.beacon.state === "active" && now - next.beacon.lastActive > ECOSYSTEM_CONFIG.beaconActiveDuration) {
          next = { ...next, beacon: { ...next.beacon, state: "idle", lastActive: now }, activeCount: Math.max(0, next.activeCount - 1) };
        }

        // ── Portal state progression ──────────────────────
        if (next.portal.state === "preparing" && now - next.portal.lastActive > ECOSYSTEM_CONFIG.portalPreparingDuration) {
          next = { ...next, portal: { ...next.portal, state: "opening", lastActive: now } };
        }
        if (next.portal.state === "opening" && now - next.portal.lastActive > ECOSYSTEM_CONFIG.portalOpeningDuration) {
          next = { ...next, portal: { ...next.portal, state: "active", lastActive: now } };
        }
        if (next.portal.state === "active" && now - next.portal.lastActive > ECOSYSTEM_CONFIG.portalActiveDuration) {
          next = {
            ...next,
            portal: { ...next.portal, state: "synchronizing", lastActive: now },
            core: { ...next.core, energy: Math.min(100, next.core.energy + 5) },
            crystal: { ...next.crystal, energy: Math.min(100, next.crystal.energy + 3) },
            beacon: { ...next.beacon, energy: Math.min(100, next.beacon.energy + 3) },
          };
        }
        if (next.portal.state === "synchronizing" && now - next.portal.lastActive > ECOSYSTEM_CONFIG.portalSyncDuration) {
          next = { ...next, portal: { ...next.portal, state: "closing", lastActive: now } };
        }
        if (next.portal.state === "closing" && now - next.portal.lastActive > ECOSYSTEM_CONFIG.portalClosingDuration) {
          next = { ...next, portal: { ...next.portal, state: "dormant", lastActive: now } };
        }
        if (next.portal.state === "dormant") {
          next = { ...next, portal: { ...next.portal, state: "idle", lastActive: now, syncEvents: [] } };
        }

        // ── Portal activation conditions ──────────────────
        if (next.portal.state === "idle" && now >= next.portal.cooldownUntil) {
          const recentSyncs = next.portal.syncEvents.filter((t) => now - t < ECOSYSTEM_CONFIG.portalSyncWindow);
          next = { ...next, portal: { ...next.portal, syncEvents: recentSyncs } };

          const coreReady = next.core.energy > ECOSYSTEM_CONFIG.portalEnergyThreshold;
          const beaconActive = next.beacon.state === "active";
          const crystalRecentlyReleased = now - next.crystal.lastActive < 3000 && next.crystal.state === "dormant";
          const multipleSyncs = recentSyncs.length >= ECOSYSTEM_CONFIG.portalSyncThreshold;

          if ((coreReady && beaconActive && crystalRecentlyReleased) || multipleSyncs) {
            next = { ...next, portal: { ...next.portal, state: "preparing", lastActive: now, cooldownUntil: now + ECOSYSTEM_CONFIG.portalActivationCooldown } };
          }
        }

        // ── Occasional energy fluctuation ───────────────────
        if (next.core.state === "idle" && Math.random() < 0.003) {
          const drop = 8 + Math.floor(Math.random() * 12);
          const newEnergy = Math.max(20, next.core.energy - drop);
          next = { ...next, core: { ...next.core, energy: newEnergy, state: newEnergy < 40 ? "low_power" : next.core.state, lastActive: now } };
        }

        // ── Safety timeouts ─────────────────────────────────
        const maxState = ECOSYSTEM_CONFIG.maxStateTime;

        if (next.core.state !== "idle" && now - next.core.lastActive > maxState) {
          next = { ...next, core: { ...next.core, state: "idle", lastActive: now, cooldownUntil: now + 5000 }, activeCount: Math.max(0, next.activeCount - 1) };
        }
        if (next.drone.state !== "patrol" && now - next.drone.lastActive > maxState) {
          next = { ...next, drone: { ...next.drone, state: "patrol", lastActive: now, cooldownUntil: now + 5000 }, activeCount: Math.max(0, next.activeCount - 1) };
        }
        if (next.crystal.state !== "dormant" && now - next.crystal.lastActive > maxState) {
          next = { ...next, crystal: { ...next.crystal, state: "dormant", lastActive: now, cooldownUntil: now + 5000 }, activeCount: Math.max(0, next.activeCount - 1) };
        }
        if (next.beacon.state !== "idle" && now - next.beacon.lastActive > maxState) {
          next = { ...next, beacon: { ...next.beacon, state: "idle", lastActive: now, cooldownUntil: now + 5000 }, activeCount: Math.max(0, next.activeCount - 1) };
        }
        if (next.portal.state !== "idle" && now - next.portal.lastActive > maxState) {
          next = { ...next, portal: { ...next.portal, state: "idle", lastActive: now, cooldownUntil: now + ECOSYSTEM_CONFIG.portalActivationCooldown, syncEvents: next.portal.syncEvents.filter((t) => now - t < ECOSYSTEM_CONFIG.portalSyncWindow) } };
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

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) =>
      processEvent({ type: "world:reduced_motion", active: e.matches });
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [processEvent]);

  // ── Public API ───────────────────────────────────────────────

  return {
    state,
    processEvent,
    coreVariant: coreStateToVariant(state.core.state),
    crystalVariant: crystalStateToVariant(state.crystal.state),
    droneVariant: droneStateToVariant(state.drone.state),
    beaconVariant: beaconStateToVariant(state.beacon.state),
    portalVariant: portalStateToVariant(state.portal.state),
    coreEnergy: state.core.energy,
    crystalEnergy: state.crystal.energy,
    droneEnergy: state.drone.energy,
    beaconEnergy: state.beacon.energy,
    canActivate: state.activeCount < ECOSYSTEM_CONFIG.maxActive,
    reducedMotion: state.reducedMotion,
  };
}
