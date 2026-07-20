/**
 * Creative Engine — World Interaction Orchestrator
 * 
 * Phase 6.1: Architecture Refinement & v1.0 Stable Release.
 * Core sync → Beacon broadcast → Crystal resonance boost
 * Drone: patrol → approach → inspect → transfer → return → core sync
 * Crystal: dormant ↔ resonating → active → energy_release (independent)
 * Beacon: idle ↔ active (triggered by Core sync, boosts Crystal)
 * Portal: autonomous (triggered by ecosystem conditions)
 * Variation: timing jitter, occasional skip, independent activation
 */

"use client";

import { useEffect, useRef } from "react";
import { MaintenanceDronePixel } from "./MaintenanceDronePixel";
import { CreativeCorePixel } from "./CreativeCorePixel";
import { MemoryCrystalPixel } from "./MemoryCrystalPixel";
import { SignalBeaconPixel } from "./SignalBeaconPixel";
import { PortalPixel } from "./PortalPixel";
import { useEcosystem } from "@/lib/creative-engine/context";
import { ECOSYSTEM_CONFIG } from "@/lib/creative-engine/types";
import "@/styles/creative-engine/ce_world_interaction.css";
import "@/styles/creative-engine/ce_portal.css";

export interface WorldInteractionProps {
  enabled?: boolean;
  className?: string;
}

export function WorldInteraction({
  enabled = true,
  className = "",
}: WorldInteractionProps) {
  const eco = useEcosystem();
  const { state, processEvent } = eco;
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasInitialCycle = useRef(false);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  // Clear timers when page becomes hidden
  useEffect(() => {
    if (state.pageHidden) {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    }
  }, [state.pageHidden]);

  const scheduleTimer = (fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timersRef.current = timersRef.current.filter((t) => t !== id);
      fn();
    }, ms);
    timersRef.current.push(id);
    return id;
  };

  // ── Drone Lifecycle ──────────────────────────────────────────
  // patrol → approach → inspect → transfer → return → core sync → beacon activate

  useEffect(() => {
    if (!enabled || state.reducedMotion || state.pageHidden) return;
    if (state.drone.state !== "patrol") return;
    if (state.core.state !== "idle" && state.core.state !== "low_power") return;

    const isFirstCycle = !hasInitialCycle.current;
    hasInitialCycle.current = true;

    const baseDelay = isFirstCycle
      ? 5000
      : ECOSYSTEM_CONFIG.patrolIntervalMin +
        Math.random() * (ECOSYSTEM_CONFIG.patrolIntervalMax - ECOSYSTEM_CONFIG.patrolIntervalMin);

    const jitter = () => 0.85 + Math.random() * 0.3;
    const approachMs = Math.round(ECOSYSTEM_CONFIG.approachDuration * jitter());
    const inspectMs = Math.round(ECOSYSTEM_CONFIG.inspectDuration * jitter());
    const transferMs = Math.round(ECOSYSTEM_CONFIG.transferDuration * jitter());
    const returnMs = Math.round(ECOSYSTEM_CONFIG.returnDuration * jitter());

    let elapsed = 0;

    const timer = setTimeout(() => {
      processEvent({ type: "core:maintenance_request" });

      elapsed += 400;
      scheduleTimer(() => processEvent({ type: "drone:approach" }), elapsed);

      elapsed += approachMs;
      scheduleTimer(() => processEvent({ type: "drone:inspect_start" }), elapsed);

      elapsed += inspectMs;
      scheduleTimer(() => processEvent({ type: "drone:inspect_complete" }), elapsed);

      elapsed += transferMs;
      scheduleTimer(() => processEvent({ type: "drone:energy_received" }), elapsed);

      elapsed += returnMs;
      scheduleTimer(() => processEvent({ type: "drone:return" }), elapsed);

      // Core sync
      elapsed += ECOSYSTEM_CONFIG.coreSyncDelay;
      scheduleTimer(() => processEvent({ type: "core:sync_complete" }), elapsed);

      // Beacon activate (after Core sync — 80% chance)
      if (Math.random() > 0.2) {
        elapsed += 500;
        scheduleTimer(() => processEvent({ type: "beacon:activate" }), elapsed);

        // Beacon boosts Crystal after1s
        scheduleTimer(() => processEvent({ type: "crystal:resonance_boost", energy: 5 }), elapsed + 1000);
      }

      // Crystal sync (70% chance — less frequent now that Beacon handles some activation)
      if (Math.random() > 0.3) {
        elapsed += 2000;
        scheduleTimer(() => processEvent({ type: "crystal:sync_received" }), elapsed);

        elapsed += ECOSYSTEM_CONFIG.crystalActiveDuration;
        scheduleTimer(() => processEvent({ type: "crystal:energy_released", energy: 8 }), elapsed);
      }
    }, baseDelay);

    return () => clearTimeout(timer);
  }, [
    state.drone.state,
    state.core.state,
    state.reducedMotion,
    state.pageHidden,
    state.activeCount,
    processEvent,
    enabled,
  ]);

  // ── Independent Crystal Activation ──────────────────────────

  useEffect(() => {
    if (!enabled || state.reducedMotion || state.pageHidden) return;
    if (state.crystal.state !== "dormant") return;
    if (state.crystal.cooldownUntil > Date.now()) return;

    const delay =
      ECOSYSTEM_CONFIG.crystalIntervalMin +
      Math.random() * (ECOSYSTEM_CONFIG.crystalIntervalMax - ECOSYSTEM_CONFIG.crystalIntervalMin);

    const timer = setTimeout(() => {
      processEvent({ type: "crystal:sync_received" });

      scheduleTimer(() => {
        processEvent({ type: "crystal:energy_released", energy: 8 });
      }, ECOSYSTEM_CONFIG.crystalActiveDuration);
    }, delay);

    return () => clearTimeout(timer);
  }, [
    state.crystal.state,
    state.crystal.cooldownUntil,
    state.reducedMotion,
    state.pageHidden,
    processEvent,
    enabled,
  ]);

  // ── Visual State Derivation ──────────────────────────────────

  const isTransferring =
    state.drone.state === "transfer_energy" || state.core.state === "energy_transfer";
  const isInspecting = state.drone.state === "inspect";
  const isApproaching = state.drone.state === "approach";
  const isReturning = state.drone.state === "return";
  const isBeaconSyncing = state.beacon.state === "active";
  const isCrystalReleasing = state.crystal.state === "energy_release";

  if (!enabled) return null;

  return (
    <div
      className={`ce-world-interaction ${className}`}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
      }}
      aria-label="Creative Engine world interaction"
    >
      {/* Memory Crystal — above, centered */}
      <div
        className="ce-world-interaction__crystal"
        style={{
          position: "absolute",
          top: "-16px",
          left: "50%",
          transform: "translateX(-50%)",
          transition: "opacity 400ms ease",
          opacity: state.crystal.state === "dormant" ? 0.5 : 0.9,
        }}
      >
        <MemoryCrystalPixel size={32} />
      </div>

      {/* Creative Core — responds to Drone inspection */}
      <CreativeCorePixel
        size={48}
        variant={eco.coreVariant}
        style={{
          transition: "filter 400ms ease, opacity 400ms ease",
          filter: isTransferring ? "brightness(1.3)" : "brightness(1)",
          opacity: state.core.state === "low_power" ? 0.6 : 1,
        }}
      />

      {/* Energy Stream — Drone→Core (Cyan — primary energy) */}
      {isTransferring && <div className="ce-energy-stream ce-energy-stream--drone" />}

      {/* Energy Stream — Core→Beacon (Purple — sync pulse) */}
      {isBeaconSyncing && <div className="ce-energy-stream ce-energy-stream--beacon" />}

      {/* Energy Stream — Crystal→Core (Cyan — energy release) */}
      {isCrystalReleasing && <div className="ce-energy-stream ce-energy-stream--crystal" />}

      {/* Maintenance Drone — performs inspection */}
      <MaintenanceDronePixel
        size={72}
        variant={eco.droneVariant}
        style={{
          transition: "filter 400ms ease, transform 400ms ease",
          filter: isInspecting ? "brightness(1.15)" : "brightness(1)",
          transform: isApproaching
            ? "translateX(-8px)"
            : isReturning
            ? "translateX(8px)"
            : "translateX(0)",
        }}
      />

      {/* Signal Beacon — below Core, broadcasts sync signals */}
      <div
        className="ce-world-interaction__beacon"
        style={{
          position: "absolute",
          bottom: "-12px",
          left: "15%",
          transition: "opacity 400ms ease",
          opacity: state.beacon.state === "idle" ? 0.45 : 0.85,
        }}
      >
        <SignalBeaconPixel size={28} />
      </div>

      {/* Portal — appears only during major synchronization events */}
      <PortalPixel size={48} variant={eco.portalVariant} />
    </div>
  );
}
