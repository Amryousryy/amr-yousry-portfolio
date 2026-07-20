/**
 * Creative Engine — Reactive Ecosystem Types
 * 
 * Phase 6.1: Architecture Refinement & v1.0 Stable Release.
 * Every object owns a state machine. Every interaction has a cause.
 */

// ─── Object States ───────────────────────────────────────────────

export type CoreState =
  | "idle"
  | "energy_transfer"
  | "maintenance"
  | "low_power";

export type CrystalState =
  | "dormant"
  | "resonating"
  | "active"
  | "energy_release";

export type DroneState =
  | "patrol"
  | "approach"
  | "inspect"
  | "transfer_energy"
  | "return";

export type BeaconState = "idle" | "active";

export type PortalState =
  | "idle"
  | "preparing"
  | "opening"
  | "active"
  | "synchronizing"
  | "closing"
  | "dormant";

// ─── Visual Variants (map states to CSS classes) ──────────────────

export type CoreVariant = "idle" | "pulse" | "static";
export type CrystalVariant = "idle" | "pulse" | "activate" | "static";
export type DroneVariant = "idle" | "inspect" | "transfer" | "static";
export type BeaconVariant = "idle" | "active" | "static";
export type PortalVariant = "idle" | "preparing" | "opening" | "active" | "synchronizing" | "closing" | "static";

// ─── Ecosystem Events ────────────────────────────────────────────

export type EcosystemEvent =
  | { type: "core:maintenance_request" }
  | { type: "core:sync_complete" }
  | { type: "drone:approach" }
  | { type: "drone:inspect_start" }
  | { type: "drone:inspect_complete" }
  | { type: "drone:energy_received" }
  | { type: "drone:return" }
  | { type: "crystal:sync_received" }
  | { type: "crystal:energy_released"; energy: number }
  | { type: "crystal:resonance_boost"; energy: number }
  | { type: "beacon:activate" }
  | { type: "world:reduced_motion"; active: boolean }
  | { type: "world:page_hidden"; hidden: boolean };

// ─── Object Identity ─────────────────────────────────────────────

export type ObjectId = "core" | "crystal" | "drone" | "beacon" | "portal";

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

export interface BeaconObjectState {
  id: "beacon";
  state: BeaconState;
  energy: number;
  lastActive: number;
  cooldownUntil: number;
}

export interface PortalObjectState {
  id: "portal";
  state: PortalState;
  energy: number;
  lastActive: number;
  cooldownUntil: number;
  syncEvents: number[];
}

export type ObjectState = CoreObjectState | CrystalObjectState | DroneObjectState | BeaconObjectState | PortalObjectState;

// ─── Ecosystem State ─────────────────────────────────────────────

export interface EcosystemState {
  core: CoreObjectState;
  crystal: CrystalObjectState;
  drone: DroneObjectState;
  beacon: BeaconObjectState;
  portal: PortalObjectState;
  activeCount: number;
  reducedMotion: boolean;
  pageHidden: boolean;
  lastTick: number;
}

// ─── Configuration ───────────────────────────────────────────────

export const ECOSYSTEM_CONFIG = {
  /** Maximum simultaneously active systems */
  maxActive: 4,
  /** Idle energy regen rate per tick */
  energyRegenRate: 0.3,
  /** Tick interval in ms */
  tickInterval: 2000,
  /** Minimum cooldown between interactions per object (ms) */
  interactionCooldown: 18000,
  /** Drone patrol interval range (ms) — long idle periods */
  patrolIntervalMin: 25000,
  patrolIntervalMax: 50000,
  /** Approach duration (ms) */
  approachDuration: 1500,
  /** Inspection duration (ms) */
  inspectDuration: 2000,
  /** Transfer duration (ms) */
  transferDuration: 1500,
  /** Return duration (ms) */
  returnDuration: 1500,
  /** Core sync delay after drone returns (ms) */
  coreSyncDelay: 2000,
  /** Independent Crystal cycle interval range (ms) */
  crystalIntervalMin: 40000,
  crystalIntervalMax: 80000,
  /** Crystal active duration before energy release (ms) */
  crystalActiveDuration: 5000,
  /** Beacon active duration (ms) */
  beaconActiveDuration: 3000,
  /** Safety timeout — force-reset stuck states (ms) */
  maxStateTime: 20000,
  /** Portal state durations (ms) */
  portalPreparingDuration: 1000,
  portalOpeningDuration: 1500,
  portalActiveDuration: 2000,
  portalSyncDuration: 2000,
  portalClosingDuration: 1500,
  /** Portal activation cooldown (ms) */
  portalActivationCooldown: 30000,
  /** Time window for counting sync events (ms) */
  portalSyncWindow: 5000,
  /** Minimum sync events to trigger portal */
  portalSyncThreshold: 2,
  /** Minimum core energy for portal activation */
  portalEnergyThreshold: 60,
} as const;
