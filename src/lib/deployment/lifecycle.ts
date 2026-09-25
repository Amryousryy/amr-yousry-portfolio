/**
 * Server-only deployment lifecycle primitives for the AMR YOUSRY project
 * publish → deploy → verify pipeline.
 *
 * State machine (per project, stored at Project.deployment):
 *
 *   not_required ──(requires rebuild)──▶ pending ──▶ deploying ──▶ live
 *        ▲                                   │            │
 *        │            (retry / republish)    ▼            ▼
 *        └──────────── pending ◀── failed ◀──┴── failed
 *
 * A project becomes `live` ONLY after BOTH:
 *   1. the correlated Vercel deployment reaches READY, AND
 *   2. the canonical project URL returns HTTP 200.
 *
 * Stale-attempt protection: every triggered build is tagged with a
 * `deployment.attemptId` (the Build Hook job id — NOT the Vercel deployment
 * id). All terminal-state writes go through an atomic filter on attemptId, so
 * a completion that belongs to a superseded attempt — or to a project that was
 * unpublished/deleted meanwhile — is ignored instead of overwriting a newer
 * attempt's state.
 *
 * Rebuild discrimination uses the smallest reliable server-side signal
 * available in this architecture:
 *   - slugs backed by the static-fallback data set are always materialized by
 *     every build (they come from generateStaticParams directly), so edits to
 *     them never need a rebuild;
 *   - a DB slug is known-materialized only while Project.deployment.state ===
 *     "live" (previously materialized AND URL-verified). Any other state means
 *     "must be materialized on the next build", so triggering is required.
 *
 * Documented limitation: a DB-published slug that was materialized BEFORE this
 * truthful-deployment feature existed (no deployment record) will trigger ONE
 * rebuild on its next publish; afterwards the live state is tracked and edits
 * skip rebuilds.
 */
import Project from "@/models/Project";
import type { DeploymentState, ProjectDeployment } from "@/types/project";
import { getAllProjects as getStaticAllProjects } from "@/data/projects";
import { getCanonicalProjectSlug } from "@/lib/projects/canonical-slugs";
import {
  findRelevantDeployment,
  getDeployHookIdFromUrl,
  getDeployment,
  getVercelConfig,
  isVercelApiConfigured,
  isVercelHookConfigured,
  isVercelReady,
  listRecentProductionDeployments,
  mapDeploymentState,
  triggerProductionBuild,
  VercelError,
  type VercelDeployment,
} from "./vercel";

export const DEPLOYMENT_TIMEOUT_MS = 15 * 60 * 1000;
export const PROJECTS_BASE_URL = "https://amryousry.com";

export interface DeploymentOutcome {
  state: DeploymentState;
  deploymentId?: string;
  attemptId?: string;
  requestedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface ReconciliationResult {
  deployment?: DeploymentOutcome;
  resetForUnpublished?: boolean;
  liveApplied?: boolean;
  warning?: string;
}

export interface CanonicalUrlVerification {
  ok: boolean;
  status?: number;
  reason?: string;
}

interface DeploymentWriteShape {
  state: DeploymentState;
  deploymentId: string;
  attemptId: string;
  requestedAt: Date | null;
  completedAt: Date | null;
  error: string;
}

type DeploymentSnapshot = Partial<ProjectDeployment> | null | undefined;

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

export function getStaticProjectSlugs(): string[] {
  return getStaticAllProjects().map((project: { slug: string }) => project.slug);
}

/**
 * True when the slug needs to be present in the NEXT production build
 * (i.e. the current build does not materialize it). Static-fallback slugs are
 * always materialized; DB slugs are only known-materialized while `live`.
 */
export function requiresRebuild(project: {
  slug: string;
  deployment?: Partial<ProjectDeployment> | null;
}): boolean {
  const canonicalSlug = getCanonicalProjectSlug(project.slug);
  if (getStaticProjectSlugs().includes(canonicalSlug)) return false;
  return project.deployment?.state !== "live";
}

export function isActiveDeployment(deployment?: Partial<ProjectDeployment> | null): boolean {
  return deployment?.state === "pending" || deployment?.state === "deploying";
}

export function isDeploymentTimedOut(deployment: DeploymentSnapshot, now: Date = new Date()): boolean {
  const requestedAt = toUnixMs(deployment?.requestedAt);
  if (requestedAt === null) return false;
  return now.getTime() - requestedAt > DEPLOYMENT_TIMEOUT_MS;
}

export function toDeploymentOutcome(deployment: DeploymentSnapshot): DeploymentOutcome | undefined {
  if (!deployment) return undefined;
  return {
    state: deployment.state ?? "not_required",
    deploymentId: deployment.deploymentId || undefined,
    attemptId: deployment.attemptId || undefined,
    requestedAt: toIso(deployment.requestedAt),
    completedAt: toIso(deployment.completedAt),
    error: deployment.error || undefined,
  };
}

function toUnixMs(value: Date | string | number | null | undefined): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (value instanceof Date) return value.getTime();
  return null;
}

function toIso(value: Date | string | number | null | undefined): string | undefined {
  const ms = toUnixMs(value);
  return ms === null ? undefined : new Date(ms).toISOString();
}

// ---------------------------------------------------------------------------
// Error sanitization (never leak secrets/build-hook urls/tokens)
// ---------------------------------------------------------------------------

export function redactDeploymentError(input: string, maxLength = 300): string {
  let safe = String(input ?? "");
  safe = safe.replace(/https?:\/\/[^\s"'<>]*\/v1\/integrations\/deploy\/[^\s"'<>]*/gi, "[REDACTED_HOOK_URL]");
  safe = safe.replace(/Bearer\s+[A-Za-z0-9_\-./+~=]+/gi, "Bearer [REDACTED]");
  safe = safe.replace(/(token|secret|authorization)[=:]\s*[^\s,;&"'<>]+/gi, "$1=[REDACTED]");
  safe = safe.replace(/\s+/g, " ").trim();
  if (safe.length > maxLength) safe = `${safe.slice(0, maxLength).trimEnd()}…`;
  return safe || "Deployment failed";
}

export function toSafeDeploymentError(error: unknown): string {
  if (error instanceof VercelError) return redactDeploymentError(error.message);
  const message = error instanceof Error ? error.message : String(error);
  return redactDeploymentError(message);
}

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

function buildDeploymentWrite(
  deployment: DeploymentSnapshot,
  next: Partial<DeploymentWriteShape> = {}
): Record<string, unknown> {
  return {
    state: next.state ?? deployment?.state ?? "not_required",
    deploymentId: next.deploymentId !== undefined ? next.deploymentId : (deployment?.deploymentId || ""),
    attemptId: next.attemptId !== undefined ? next.attemptId : (deployment?.attemptId || ""),
    requestedAt: next.requestedAt !== undefined ? next.requestedAt : (deployment?.requestedAt ?? null),
    completedAt: next.completedAt !== undefined ? next.completedAt : (deployment?.completedAt ?? null),
    error: next.error !== undefined ? next.error : (deployment?.error || ""),
  };
}

async function writeDeployment(projectId: string, record: Record<string, unknown>): Promise<void> {
  await Project.updateOne({ _id: projectId }, { $set: { deployment: record } });
}

/** Atomic write that only applies if the attempt id still matches (stale protection). */
async function writeDeploymentIfCurrent(
  projectId: string,
  expectedAttemptId: string,
  record: Record<string, unknown>
): Promise<boolean> {
  const result = await Project.updateOne(
    { _id: projectId, "deployment.attemptId": expectedAttemptId },
    { $set: { deployment: record } }
  );
  return result?.matchedCount === 1;
}

// ---------------------------------------------------------------------------
// Canonical URL verification (FINAL live verification gate)
// ---------------------------------------------------------------------------

export async function verifyCanonicalUrl(slug: string): Promise<CanonicalUrlVerification> {
  const canonicalSlug = getCanonicalProjectSlug(slug);
  const url = `${PROJECTS_BASE_URL}/projects/${encodeURIComponent(canonicalSlug)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "amryousry-deployment-verifier" },
    });
    if (res.status === 200) return { ok: true, status: 200 };
    return { ok: false, status: res.status, reason: `canonical URL returned HTTP ${res.status}` };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { ok: false, reason: "canonical URL verification timed out" };
    }
    return { ok: false, reason: "canonical URL could not be reached" };
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Trigger lifecycle
// ---------------------------------------------------------------------------

/**
 * Starts a deployment attempt: reserves `pending`, triggers the Build Hook,
 * then correlates the hook job id as `attemptId` and transitions to
 * `deploying`. Any trigger failure (missing config, hook 4xx/5xx, network,
 * malformed response) deterministically lands the project in `failed` with a
 * safe diagnostic message.
 */
export async function startDeployment(
  projectId: string,
  opts: { now?: () => Date } = {}
): Promise<DeploymentOutcome> {
  const now = opts.now?.() ?? new Date();

  await writeDeployment(
    projectId,
    buildDeploymentWrite(null, {
      state: "pending",
      deploymentId: "",
      attemptId: "",
      requestedAt: now,
      completedAt: null,
      error: "",
    })
  );

  try {
    const trigger = await triggerProductionBuild();

    const deploying = buildDeploymentWrite(null, {
      state: "deploying",
      deploymentId: "",
      attemptId: trigger.hookJobId,
      requestedAt: now,
      completedAt: null,
      error: "",
    });
    await writeDeployment(projectId, deploying);
    return toDeploymentOutcome(deploying as unknown as Partial<ProjectDeployment>) ?? { state: "deploying" };
  } catch (error) {
    const failed = buildDeploymentWrite(null, {
      state: "failed",
      deploymentId: "",
      attemptId: "",
      requestedAt: now,
      completedAt: now,
      error: toSafeDeploymentError(error),
    });
    await writeDeployment(projectId, failed);
    return toDeploymentOutcome(failed as unknown as Partial<ProjectDeployment>) ?? { state: "failed" };
  }
}

/**
 * Publish-time deployment decision:
 *   - an already-active attempt (pending/deploying) is NEVER re-triggered
 *     (idempotency for repeated publish requests);
 *   - if no rebuild is required the subdocument is set to `not_required`
 *     (a previously `live` project is left `live` — edits propagate via ISR);
 *   - otherwise a new deployment attempt is started.
 */
export async function applyDeploymentForPublish(
  projectId: string,
  opts: {
    slug: string;
    deployment?: Partial<ProjectDeployment> | null;
    now?: () => Date;
  }
): Promise<DeploymentOutcome> {
  const { slug, deployment, now } = opts;

  if (isActiveDeployment(deployment)) {
    return toDeploymentOutcome(deployment) ?? { state: "deploying" };
  }

  if (!requiresRebuild({ slug, deployment })) {
    if (deployment?.state === "live") {
      return toDeploymentOutcome(deployment) ?? { state: "live" };
    }
    await writeDeployment(projectId, buildDeploymentWrite(deployment, { state: "not_required" }));
    return { state: "not_required" };
  }

  return startDeployment(projectId, { now });
}

/**
 * Admin status reconciliation. Progresses the stored deployment state against
 * Vercel and the canonical URL:
 *
 *   pending  →  resume trigger (crash window) or failed (unconfigured/timeout)
 *   deploying →  correlate → deploying | live (READY + URL 200) | failed
 *
 * Unpublished projects are reset to `not_required` so an in-flight attempt can
 * never mark them live afterwards.
 */
export async function reconcileDeployment(
  project: {
    _id: unknown;
    slug?: string | null;
    status?: string | null;
    deployment?: Partial<ProjectDeployment> | null;
  },
  opts: { now?: () => Date } = {}
): Promise<ReconciliationResult> {
  const now = opts.now?.() ?? new Date();
  const projectId = String(project._id);
  const deployment = project.deployment;

  if ((project.status || "draft") !== "published") {
    if (deployment) {
      await writeDeployment(projectId, buildDeploymentWrite(deployment, { state: "not_required" }));
      return { deployment: { state: "not_required" }, resetForUnpublished: true };
    }
    return {};
  }

  if (!deployment) return {};

  const settled = deployment.state === "live" || deployment.state === "not_required" || deployment.state === "failed";
  if (settled) {
    return { deployment: toDeploymentOutcome(deployment) };
  }

  const attemptId = deployment.attemptId || "";

  if (!isVercelApiConfigured()) {
    const failed = buildDeploymentWrite(deployment, {
      state: "failed",
      completedAt: now,
      error: "Deployment cannot be verified: Vercel API is not configured",
    });
    const applied = await writeDeploymentIfCurrent(projectId, attemptId, failed);
    return { deployment: applied ? toDeploymentOutcome(failed) : toDeploymentOutcome(deployment) };
  }

  if (isDeploymentTimedOut(deployment, now)) {
    const failed = buildDeploymentWrite(deployment, {
      state: "failed",
      completedAt: now,
      error: "Deployment timed out before reaching Vercel",
    });
    const applied = await writeDeploymentIfCurrent(projectId, attemptId, failed);
    return { deployment: applied ? toDeploymentOutcome(failed) : toDeploymentOutcome(deployment) };
  }

  if (deployment.state === "pending") {
    if (!isVercelHookConfigured()) {
      const failed = buildDeploymentWrite(deployment, {
        state: "failed",
        completedAt: now,
        error: "Deployment cannot start: Vercel Build Hook is not configured",
      });
      const applied = await writeDeploymentIfCurrent(projectId, attemptId, failed);
      return {
        deployment: applied ? toDeploymentOutcome(failed) : toDeploymentOutcome(deployment),
        warning: "A pending deployment trigger was recovered by the status endpoint",
      };
    }
    const resumed = await startDeployment(projectId, { now: () => now });
    return {
      deployment: resumed,
      warning: resumed.state === "failed" ? undefined : "Recovered a pending deployment trigger",
    };
  }

  // deploying: correlate with the actual Vercel deployment
  const hookId = getDeployHookIdFromUrl(getVercelConfig()?.buildHookUrl ?? "");
  try {
    let vercelDeployment: VercelDeployment | null = null;
    if (deployment.deploymentId) {
      vercelDeployment = await getDeployment(deployment.deploymentId);
      if (!vercelDeployment) {
        return {
          deployment: toDeploymentOutcome(deployment),
          warning: "Stored deployment id is no longer resolvable on Vercel",
        };
      }
    } else {
      const sinceMs = toUnixMs(deployment.requestedAt) ?? now.getTime() - DEPLOYMENT_TIMEOUT_MS;
      const recent = await listRecentProductionDeployments(sinceMs);
      vercelDeployment = findRelevantDeployment(recent, hookId);
    }

    if (!vercelDeployment) {
      return { deployment: toDeploymentOutcome(deployment) };
    }

    const vercelId = vercelDeployment.id || deployment.deploymentId || "";
    let current: DeploymentSnapshot = deployment;
    if (vercelId && current.deploymentId !== vercelId) {
      const correlated = buildDeploymentWrite(current, { state: "deploying", deploymentId: vercelId });
      await writeDeploymentIfCurrent(projectId, attemptId, correlated);
      current = { ...current, deploymentId: vercelId };
    }

    const readyState = vercelDeployment.readyState ?? null;

    if (mapDeploymentState(readyState) === "failed") {
      const message = redactDeploymentError(
        vercelDeployment.errorMessage || `Vercel deployment ended with ${readyState}`
      );
      const failed = buildDeploymentWrite(current, {
        state: "failed",
        deploymentId: vercelId,
        completedAt: now,
        error: message,
      });
      const applied = await writeDeploymentIfCurrent(projectId, attemptId, failed);
      return { deployment: applied ? toDeploymentOutcome(failed) : toDeploymentOutcome(current) };
    }

    if (isVercelReady(readyState)) {
      const verification = await verifyCanonicalUrl(project.slug || "");
      if (verification.ok) {
        const live = buildDeploymentWrite(current, {
          state: "live",
          deploymentId: vercelId,
          completedAt: now,
          error: "",
        });
        const applied = await writeDeploymentIfCurrent(projectId, attemptId, live);
        return {
          deployment: applied ? toDeploymentOutcome(live) : toDeploymentOutcome(current),
          liveApplied: applied,
        };
      }

      const reason = verification.reason ?? "canonical URL is not reachable";
      if (isDeploymentTimedOut(current, now)) {
        const failed = buildDeploymentWrite(current, {
          state: "failed",
          deploymentId: vercelId,
          completedAt: now,
          error: `Deployment reached READY but the canonical URL did not become reachable (${reason})`,
        });
        const applied = await writeDeploymentIfCurrent(projectId, attemptId, failed);
        return { deployment: applied ? toDeploymentOutcome(failed) : toDeploymentOutcome(current) };
      }

      const waiting = buildDeploymentWrite(current, {
        state: "deploying",
        deploymentId: vercelId,
        error: `READY but not live: ${reason}`,
      });
      await writeDeploymentIfCurrent(projectId, attemptId, waiting);
      return {
        deployment: toDeploymentOutcome(waiting),
        liveApplied: false,
        warning: `Vercel is READY but ${reason}`,
      };
    }

    return { deployment: toDeploymentOutcome(current) };
  } catch (error) {
    return {
      deployment: toDeploymentOutcome(deployment),
      warning: toSafeDeploymentError(error),
    };
  }
}