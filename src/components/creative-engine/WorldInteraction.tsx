/**
 * Creative Engine — World Interaction System
 * 
 * Coordinates interactions between objects in the universe.
 * First implementation: Drone inspects Creative Core.
 * 
 * This system makes the universe feel alive —
 * objects are aware of each other and communicate.
 */

"use client";

import { useState, useCallback } from "react";
import { MaintenanceDronePixel, DroneInteractionState } from "./MaintenanceDronePixel";
import { CreativeCorePixel } from "./CreativeCorePixel";

export interface WorldInteractionProps {
  /** Enable the Drone-Core interaction */
  enabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Drone-Core Interaction Sequence:
 * 1. Drone approaches Core
 * 2. Drone hovers (inspect)
 * 3. Energy transfers from Core to Drone
 * 4. Core pulses in response
 * 5. Drone confirms completion
 * 6. Both return to idle
 */
export function WorldInteraction({
  enabled = true,
  className = "",
}: WorldInteractionProps) {
  const [droneState, setDroneState] = useState<DroneInteractionState>("idle");

  // Derive Core state from Drone state (no separate state needed)
  const coreActive = droneState === "transferring";
  const energyStream = droneState === "transferring";

  const handleDroneStateChange = useCallback((state: DroneInteractionState) => {
    setDroneState(state);
  }, []);

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
        variant={coreActive ? "pulse" : "idle"}
        style={{
          transition: "filter 300ms ease",
          filter: coreActive ? "brightness(1.3)" : "brightness(1)",
        }}
      />

      {/* Energy Stream — visible during transfer */}
      {energyStream && (
        <div 
          className="ce-energy-stream"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "2px",
            height: "24px",
            background: "linear-gradient(to bottom, #22D3EE, #6D28D9, #22D3EE)",
            opacity: 0.6,
            animation: "ceEnergyFlow 1000ms ease-in-out",
          }}
        />
      )}

      {/* Maintenance Drone — performs inspection */}
      <MaintenanceDronePixel
        size={72}
        variant={droneState === "inspecting" ? "inspect" : droneState === "transferring" ? "transfer" : "idle"}
        interactWithCore={enabled}
        onInteractionStateChange={handleDroneStateChange}
      />

      <style>{`
        @keyframes ceEnergyFlow {
          0% { opacity: 0; transform: translate(-50%, -50%) scaleY(0); }
          30% { opacity: 0.6; transform: translate(-50%, -50%) scaleY(1); }
          70% { opacity: 0.6; transform: translate(-50%, -50%) scaleY(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scaleY(0); }
        }
      `}</style>
    </div>
  );
}
