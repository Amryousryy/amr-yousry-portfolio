/**
 * Creative Engine — World Interaction Orchestrator
 * 
 * Phase 4.0: State-driven ecosystem coordinator.
 * Replaces timeline-only interactions with event-driven behavior.
 */

"use client";

import { useEffect } from "react";
import { MaintenanceDronePixel } from "./MaintenanceDronePixel";
import { CreativeCorePixel } from "./CreativeCorePixel";
import { useEcosystem } from "@/lib/creative-engine/context";
import { ECOSYSTEM_CONFIG } from "@/lib/creative-engine/types";
import "@/styles/creative-engine/ce_world_interaction.css";

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

  // ── Drone Patrol → Maintenance Request (state-driven) ────────

  useEffect(() => {
    if (!enabled || state.reducedMotion || state.pageHidden) return;
    if (state.drone.state !== "patrol") return;

    const delay =
      ECOSYSTEM_CONFIG.patrolIntervalMin +
      Math.random() * (ECOSYSTEM_CONFIG.patrolIntervalMax - ECOSYSTEM_CONFIG.patrolIntervalMin);

    const timer = setTimeout(() => {
      if (state.core.state === "idle" && eco.canActivate) {
        processEvent({ type: "core:maintenance_request" });
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [
    state.drone.state,
    state.core.state,
    state.reducedMotion,
    state.pageHidden,
    eco.canActivate,
    processEvent,
    enabled,
  ]);

  // ── Core Maintenance → Drone Inspection trigger ──────────────

  useEffect(() => {
    if (!enabled) return;
    if (state.core.state === "maintenance" && state.drone.state === "patrol") {
      processEvent({ type: "drone:maintenance_complete" });
    }
  }, [state.core.state, state.drone.state, processEvent, enabled]);

  // ── Visual state derivation ──────────────────────────────────

  const isTransferring =
    state.drone.state === "transfer_energy" || state.core.state === "energy_transfer";
  const isInspecting = state.drone.state === "inspect" || state.drone.state === "repair";

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
      {/* Creative Core — responds to Drone inspection */}
      <CreativeCorePixel
        size={48}
        variant={eco.coreVariant}
        style={{
          transition: "filter 300ms ease, opacity 300ms ease",
          filter: isTransferring ? "brightness(1.3)" : "brightness(1)",
          opacity: state.core.state === "low_power" ? 0.6 : 1,
        }}
      />

      {/* Energy Stream — visible during transfer */}
      {isTransferring && <div className="ce-energy-stream" />}

      {/* Maintenance Drone — performs inspection */}
      <MaintenanceDronePixel
        size={72}
        variant={eco.droneVariant}
        style={{
          transition: "filter 300ms ease",
          filter: isInspecting ? "brightness(1.15)" : "brightness(1)",
        }}
      />
    </div>
  );
}
