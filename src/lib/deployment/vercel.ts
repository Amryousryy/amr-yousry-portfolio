/**
 * Server-only Vercel deployment client.
 *
 * This module is imported exclusively from server API routes and server-side
 * libraries — never from client components or client bundles. It reads
 * process.env variables that are secret and must never be serialized to a
 * client bundle, logged, or returned by any API response:
 *
 *   VERCEL_BUILD_HOOK_URL  — full Build Hook POST URL (the URL itself is the
 *                            only credential for triggering a build; no auth).
 *   VERCEL_API_TOKEN       — Vercel REST API token (authentication for
 *                            deployment status lookups).
 *   VERCEL_PROJECT_ID      — Vercel project identifier used for scoping the
 *                            deployments list query.
 *
 * Security rules enforced here:
 *   - Secrets are only ever read from process.env at call time.
 *   - Error messages derived from upstream responses are redacted/truncated
 *     and never contain tokens, credentials, or the Build Hook URL.
 *
 * CRITICAL IDENTITY RULE
 * ----------------------
 * A Build Hook trigger returns `{ job: { id } }`. That `job.id` is a per-trigger
 * job/correlation identifier and is NOT the Vercel deployment ID. Deployment
 * IDs are only known by querying the Vercel Deployments API and matching the
 * correlated deployment's metadata. Consumers must keep these two identifiers
 * separate (see lifecycle.ts: attemptId vs deploymentId).
 */
import type { DeploymentState } from "@/types/project";

const VERCEL_API_BASE = "https://api.vercel.com";
const DEFAULT_FETCH_TIMEOUT_MS = 10_000;

export type VercelReadyState =
  | "QUEUED"
  | "INITIALIZING"
  | "BUILDING"
  | "READY"
  | "ERROR"
  | "CANCELED"
  | "BLOCKED"
  | (string & {});

export interface VercelConfig {
  buildHookUrl: string;
  apiToken: string;
  projectId: string;
}

export interface VercelTriggerResult {
  /** Per-trigger job/correlation id from the Build Hook response. NOT a deployment id. */
  hookJobId: string;
  /** Trigger request timestamp (ms epoch) as reported by the Build Hook. */
  createdAt: number;
}

export interface VercelDeployment {
  id?: string;
  url?: string | null;
  readyState?: string | null;
  target?: string | null;
  source?: string | null;
  meta?: Record<string, unknown> & { deployHookId?: string };
  createdAt?: number | null;
  ready?: number | null;
  errorCode?: string | null;
  errorMessage?: string | null;
}

export class VercelError extends Error {
  readonly kind: "missing_config" | "trigger" | "api" | "not_found";
  readonly status?: number;

  constructor(kind: "missing_config" | "trigger" | "api" | "not_found", message: string, status?: number) {
    super(message);
    this.name = "VercelError";
    this.kind = kind;
    this.status = status;
  }
}

// ---------------------------------------------------------------------------
// Configuration (read at call time — no module-load side effects in tests)
// ---------------------------------------------------------------------------

export function getVercelConfig(): VercelConfig | null {
  const buildHookUrl = process.env.VERCEL_BUILD_HOOK_URL?.trim();
  const apiToken = process.env.VERCEL_API_TOKEN?.trim();
  const projectId = process.env.VERCEL_PROJECT_ID?.trim();
  if (!buildHookUrl || !apiToken || !projectId) return null;
  return { buildHookUrl, apiToken, projectId };
}

export function isVercelHookConfigured(): boolean {
  return Boolean(process.env.VERCEL_BUILD_HOOK_URL?.trim());
}

export function isVercelApiConfigured(): boolean {
  return Boolean(process.env.VERCEL_API_TOKEN?.trim() && process.env.VERCEL_PROJECT_ID?.trim());
}

/**
 * Extracts the deploy hook identifier — the last path segment of the Build
 * Hook URL. Vercel tags deployments spawned by a hook with meta.deployHookId
 * equal to this value, which is how a triggered build is correlated with its
 * resulting deployment (without assuming the hook job id IS the deployment id).
 */
export function getDeployHookIdFromUrl(url: string): string | null {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, "");
    const segments = path.split("/").filter(Boolean);
    return segments[segments.length - 1] || null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// HTTP primitives
// ---------------------------------------------------------------------------

function vercelAuthHeaders(apiToken: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  };
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = DEFAULT_FETCH_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Wraps transport-level failures (DNS, TCP, timeout, abort) in a typed, safe VercelError. */
async function guardedFetch(
  url: string,
  init: RequestInit,
  kind: "trigger" | "api",
  timeoutMs = DEFAULT_FETCH_TIMEOUT_MS
): Promise<Response> {
  try {
    return await fetchWithTimeout(url, init, timeoutMs);
  } catch (error) {
    if (error instanceof VercelError) throw error;
    throw new VercelError(kind, `Request to Vercel failed${init?.method ? ` (${init.method})` : ""}`);
  }
}

async function parseJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    throw new VercelError("api", "Vercel API returned an invalid response");
  }
}

// ---------------------------------------------------------------------------
// Build Hook trigger (preferred mechanism)
// ---------------------------------------------------------------------------

export async function triggerProductionBuild(): Promise<VercelTriggerResult> {
  const hookUrl = process.env.VERCEL_BUILD_HOOK_URL?.trim();
  if (!hookUrl) {
    throw new VercelError("missing_config", "VERCEL_BUILD_HOOK_URL is not configured");
  }

  const res = await guardedFetch(hookUrl, { method: "POST" }, "trigger");
  if (!res.ok) {
    throw new VercelError("trigger", `Build Hook request failed with status ${res.status}`, res.status);
  }

  const data = await parseJson(res);
  const payload = data as { job?: { id?: unknown; createdAt?: unknown } };
  const jobId = payload?.job?.id;
  if (typeof jobId !== "string" || jobId.length === 0) {
    throw new VercelError("trigger", "Build Hook response did not include a job id");
  }

  const createdAtRaw = payload?.job?.createdAt;
  const createdAt =
    typeof createdAtRaw === "number"
      ? createdAtRaw
      : typeof createdAtRaw === "string"
        ? Date.parse(createdAtRaw)
        : Date.now();

  return {
    hookJobId: jobId,
    createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
  };
}

// ---------------------------------------------------------------------------
// Deployments API
// ---------------------------------------------------------------------------

export async function listRecentProductionDeployments(sinceMs: number): Promise<VercelDeployment[]> {
  const config = getVercelConfig();
  if (!config) {
    throw new VercelError(
      "missing_config",
      "VERCEL_API_TOKEN and VERCEL_PROJECT_ID must be configured to list deployments"
    );
  }

  const url = new URL(`${VERCEL_API_BASE}/v13/deployments`);
  url.searchParams.set("projectId", config.projectId);
  url.searchParams.set("target", "production");
  url.searchParams.set("limit", "100");
  url.searchParams.set("since", String(sinceMs));

  const res = await guardedFetch(url.toString(), {
    headers: vercelAuthHeaders(config.apiToken),
  }, "api");
  if (!res.ok) {
    throw new VercelError("api", `Vercel deployments API failed with status ${res.status}`, res.status);
  }

  const data = await parseJson(res);
  const deployments = (data as { deployments?: unknown })?.deployments;
  if (!Array.isArray(deployments)) {
    throw new VercelError("api", "Vercel deployments API returned an unexpected payload");
  }
  return deployments.map(normalizeVercelDeployment);
}

export async function getDeployment(id: string): Promise<VercelDeployment | null> {
  const config = getVercelConfig();
  if (!config) {
    throw new VercelError(
      "missing_config",
      "VERCEL_API_TOKEN and VERCEL_PROJECT_ID must be configured to look up a deployment"
    );
  }

  const res = await guardedFetch(`${VERCEL_API_BASE}/v13/deployments/${encodeURIComponent(id)}`, {
    headers: vercelAuthHeaders(config.apiToken),
  }, "api");
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new VercelError("api", `Vercel deployment lookup failed with status ${res.status}`, res.status);
  }
  return normalizeVercelDeployment(await parseJson(res));
}

// ---------------------------------------------------------------------------
// Correlation + state mapping
// ---------------------------------------------------------------------------

/**
 * Finds the deployment that resulted from the given Build Hook trigger by
 * matching the deployment's meta.deployHookId against the deploy hook id
 * (derived from the Build Hook URL). Returns the earliest matching deployment.
 */
export function findRelevantDeployment(
  deployments: VercelDeployment[],
  hookId: string | null | undefined
): VercelDeployment | null {
  if (!hookId) return null;
  return (
    deployments
      .filter((deployment) => deployment.meta?.deployHookId === hookId)
      .sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0))[0] ?? null
  );
}

const IN_FLIGHT_READY_STATES = new Set(["QUEUED", "INITIALIZING", "BUILDING", "READY"]);
const TERMINAL_FAILURE_STATES = new Set(["ERROR", "CANCELED", "BLOCKED"]);

/**
 * Maps a Vercel readyState to our deployment axis.
 *
 * READY intentionally maps to "deploying" (NOT "live"): a Vercel deployment
 * reaching READY only means the build finished — a project may only become
 * "live" after the canonical URL is verified to return HTTP 200.
 * Unknown/unavailable states map to "deploying" so an admin never sees a
 * fabricated terminal state.
 */
export function mapDeploymentState(readyState: string | null | undefined): DeploymentState {
  const state = (readyState || "").toUpperCase();
  if (TERMINAL_FAILURE_STATES.has(state)) return "failed";
  if (IN_FLIGHT_READY_STATES.has(state)) return "deploying";
  return "deploying";
}

export function isVercelReady(readyState: string | null | undefined): boolean {
  return (readyState || "").toUpperCase() === "READY";
}

export function isVercelTerminalFailure(readyState: string | null | undefined): boolean {
  return TERMINAL_FAILURE_STATES.has((readyState || "").toUpperCase());
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

function normalizeVercelDeployment(raw: unknown): VercelDeployment {
  const record = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const meta = (record.meta && typeof record.meta === "object"
    ? record.meta
    : {}) as Record<string, unknown> & { deployHookId?: string };

  return {
    id: typeof record.id === "string" ? record.id : undefined,
    url: typeof record.url === "string" ? record.url : (record.url as string | null | undefined) ?? null,
    readyState: typeof record.readyState === "string" ? record.readyState : null,
    target: typeof record.target === "string" ? record.target : (record.target as string | null | undefined) ?? null,
    source: typeof record.source === "string" ? record.source : (record.source as string | null | undefined) ?? null,
    meta,
    createdAt: typeof record.createdAt === "number" ? record.createdAt : null,
    ready: typeof record.ready === "number" ? record.ready : null,
    errorCode: typeof record.errorCode === "string" ? record.errorCode : null,
    errorMessage: typeof record.errorMessage === "string" ? record.errorMessage : null,
  };
}