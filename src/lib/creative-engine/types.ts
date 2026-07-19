/**
 * Creative Engine — Reactive Ecosystem Types
 * 
 * Phase 4.0: State machines, events, and ecosystem communication.
 * Every object owns a state machine. Every interaction has a cause.
 */

// ─── Object States ───────────────────────────────────────────────

export type CoreState =
  | "idle"
  | "charging"
  | "synchronizing"
  | "energy_transfer"
  | "maintenance"
  | "cooling"
  | "low_power";

export type CrystalState =
  | "dormant"
  | "charging"
  | "resonating"
  | "active"
  | "energy_release"
  | "cooling"
  | "maintenance";

export type DroneState =
  | "patrol"
  | "approach"
  | "hover"
  | "inspect"
  | "repair"
  | "transfer_energy"
  | "return"
  | "idle_dock";

// ─── Visual Variants (map states to CSS classes) ──────────────────

export type CoreVariant = "idle" | "pulse" | "static";
export type CrystalVariant = "idle" | "pulse" | "activate" | "static";
export type DroneVariant = "idle" | "inspect" | "transfer" | "static";

// ─── Ecosystem Events ────────────────────────────────────────────

export type EcosystemEvent =
  | { type: "core:energy_drop"; energy: number }
  | { type: "core:maintenance_request" }
  | { type: "core:sync_complete" }
  | { type: "drone:maintenance_complete" }
  | { type: "drone:energy_received" }
  | { type: "crystal:sync_received" }
  | { type: "crystal:energy_released"; energy: number }
  | { type: "world:hero_visible"; visible: boolean }
  | { type: "world:scroll_position"; position: number }
  | { type: "world:reduced_motion"; active: boolean }
  | { type: "world:page_hidden"; hidden: boolean }
  | { type: "system:cooldown_complete"; target: ObjectId };

// ─── Object Identity ─────────────────────────────────────────────

export type ObjectId = "core" | "crystal" | "drone";

export interface CoreObjectState {
  id: "core";
  state: CoreState;
  energy: number;
  lastActive: number;
  cooldownUntil: number;
}

export interface CrystalObjectState {
  id: "crystal";
  state: CrystalState;
  energy: number;
  lastActive: number;
  cooldownUntil: number;
}

export interface DroneObjectState {
  id: "drone";
  state: DroneState;
  energy: number;
  lastActive: number;
  cooldownUntil: number;
}

export type ObjectState = CoreObjectState | CrystalObjectState | DroneObjectState;

// ─── Ecosystem State ─────────────────────────────────────────────

export interface EcosystemState {
  core: CoreObjectState;
  crystal: CrystalObjectState;
  drone: DroneObjectState;
  activeCount: number;   // max 3
  heroVisible: boolean;
  reducedMotion: boolean;
  pageHidden: boolean;
  lastTick: number;
}

// ─── State Transition Rules ──────────────────────────────────────

export interface TransitionRule {
  from: string[];
  to: string;
  /** Duration in ms before auto-transition (0 = manual) */
  duration: number;
  /** Requires energy level above threshold */
  minEnergy?: number;
  /** Reduces active count when entering */
  activatesSystem: boolean;
}

// ─── Configuration ───────────────────────────────────────────────

export const ECOSYSTEM_CONFIG = {
  /** Maximum simultaneously active systems */
  maxActive: 3,
  /** Idle energy regen rate per tick (ms) */
  energyRegenRate: 0.5,
  /** Tick interval in ms */
  tickInterval: 2000,
  /** Minimum cooldown between interactions per object (ms) */
  interactionCooldown: 10000,
  /** Drone patrol interval range (ms) */
  patrolIntervalMin: 8000,
  patrolIntervalMax: 15000,
  /** Crystal resonance interval (ms) */
  resonanceInterval: 12000,
  /** Core sync interval (ms) */
  syncInterval: 20000,
} as const;
