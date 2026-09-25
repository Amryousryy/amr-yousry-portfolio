import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/models/Project", () => ({ default: { updateOne: vi.fn() } }));
vi.mock("@/lib/deployment/vercel", () => {
  const impl = {
    getVercelConfig: vi.fn(),
    isVercelApiConfigured: vi.fn(),
    isVercelHookConfigured: vi.fn(),
    triggerProductionBuild: vi.fn(),
    listRecentProductionDeployments: vi.fn(),
    getDeployment: vi.fn(),
    findRelevantDeployment: vi.fn(),
    getDeployHookIdFromUrl: vi.fn(),
    mapDeploymentState: vi.fn(),
    isVercelReady: vi.fn(),
    VercelError: class VercelError extends Error {
      constructor(
        public kind: string,
        message: string,
        public status?: number
      ) {
        super(message);
        this.name = "VercelError";
      }
    },
  };
  return impl;
});

import {
  DEPLOYMENT_TIMEOUT_MS,
  applyDeploymentForPublish,
  isActiveDeployment,
  isDeploymentTimedOut,
  reconcileDeployment,
  redactDeploymentError,
  requiresRebuild,
  startDeployment,
  toSafeDeploymentError,
  verifyCanonicalUrl,
} from "@/lib/deployment/lifecycle";
import {
  findRelevantDeployment,
  getDeployment,
  getDeployHookIdFromUrl,
  getVercelConfig,
  isVercelApiConfigured,
  isVercelHookConfigured,
  listRecentProductionDeployments,
  mapDeploymentState,
  isVercelReady,
  triggerProductionBuild,
  VercelError,
} from "@/lib/deployment/vercel";
import Project from "@/models/Project";
import type { ProjectDeployment } from "@/types/project";

const NOW = new Date("2026-01-02T00:00:00.000Z");
const PROJECT_ID = "507f1f77bcf86cd799439011";
const HOOK_URL = "https://api.vercel.com/v1/integrations/deploy/prj_test/hook_myHookId";

const mockUpdateOne = vi.mocked(Project.updateOne);
const mockTrigger = vi.mocked(triggerProductionBuild);
const mockGetDeployment = vi.mocked(getDeployment);
const mockList = vi.mocked(listRecentProductionDeployments);
const mockFindRelevant = vi.mocked(findRelevantDeployment);
const mockIsVercelApiConfigured = vi.mocked(isVercelApiConfigured);
const mockIsVercelHookConfigured = vi.mocked(isVercelHookConfigured);
const mockGetVercelConfig = vi.mocked(getVercelConfig);
const mockGetDeployHookIdFromUrl = vi.mocked(getDeployHookIdFromUrl);
const mockMapDeploymentState = vi.mocked(mapDeploymentState);
const mockIsVercelReady = vi.mocked(isVercelReady);

function nowFn() {
  return NOW;
}

function updateOneDeploymentWrite(index: number): { $set: { deployment: Record<string, unknown> } } {
  const call = mockUpdateOne.mock.calls[index] as unknown as [Record<string, unknown>, { $set: { deployment: Record<string, unknown> } }];
  return call[1];
}

function makeProject(
  overrides: Record<string, unknown> = {}
): { _id: string; slug: string; status: string; deployment?: Partial<ProjectDeployment> | null } {
  const deployment: Partial<ProjectDeployment> = {
    state: "deploying",
    deploymentId: "dpl_1",
    attemptId: "job_attempt_1",
    requestedAt: new Date(NOW.getTime() - 60_000),
    error: "",
  };
  return {
    _id: PROJECT_ID,
    slug: "brand-new-cms-page",
    status: "published",
    deployment,
    ...overrides,
  } as { _id: string; slug: string; status: string; deployment?: Partial<ProjectDeployment> | null };
}

function timedOutDeployment() {
  return {
    state: "deploying",
    deploymentId: "dpl_1",
    attemptId: "job_attempt_1",
    requestedAt: new Date(NOW.getTime() - DEPLOYMENT_TIMEOUT_MS - 1000),
    completedAt: null,
    error: "",
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUpdateOne.mockResolvedValue({ matchedCount: 1 } as never);
  mockIsVercelApiConfigured.mockReturnValue(true);
  mockIsVercelHookConfigured.mockReturnValue(true);
  mockGetVercelConfig.mockReturnValue({ buildHookUrl: HOOK_URL, apiToken: "tok", projectId: "prj_test" });
  mockGetDeployHookIdFromUrl.mockReturnValue("hook_myHookId");
  mockMapDeploymentState.mockImplementation((rs: string | null | undefined) =>
    ["ERROR", "CANCELED", "BLOCKED"].includes(String(rs ?? "").toUpperCase()) ? "failed" : "deploying"
  );
  mockIsVercelReady.mockImplementation((rs: string | null | undefined) => String(rs ?? "").toUpperCase() === "READY");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("requiresRebuild (rebuild discrimination)", () => {
  it("never requires a rebuild for a static-fallback slug (always materialized)", () => {
    expect(requiresRebuild({ slug: "al-ghazal-egc" })).toBe(false);
    expect(requiresRebuild({ slug: "nextgen-fitness-app", deployment: { state: "failed" } })).toBe(false);
  });

  it("requires a rebuild for a brand-new DB slug with no deployment record", () => {
    expect(requiresRebuild({ slug: "brand-new-cms-page" })).toBe(true);
  });

  it("does not require a rebuild while the slug is tracked as live", () => {
    expect(requiresRebuild({ slug: "brand-new-cms-page", deployment: { state: "live" } })).toBe(false);
  });

  it("requires a rebuild for failed/deploying/pending/not_required DB slugs", () => {
    for (const state of ["failed", "deploying", "pending", "not_required"]) {
      expect(requiresRebuild({ slug: "x", deployment: { state } as never })).toBe(true);
    }
  });
});

describe("isActiveDeployment / isDeploymentTimedOut", () => {
  it("treats pending and deploying as active", () => {
    expect(isActiveDeployment({ state: "pending" })).toBe(true);
    expect(isActiveDeployment({ state: "deploying" })).toBe(true);
    expect(isActiveDeployment({ state: "live" })).toBe(false);
    expect(isActiveDeployment({ state: "failed" })).toBe(false);
    expect(isActiveDeployment(undefined)).toBe(false);
  });

  it("times out based on requestedAt", () => {
    const fresh = { requestedAt: new Date(NOW.getTime() - 60_000) };
    const stale = { requestedAt: new Date(NOW.getTime() - DEPLOYMENT_TIMEOUT_MS - 1) };
    expect(isDeploymentTimedOut(fresh, NOW)).toBe(false);
    expect(isDeploymentTimedOut(stale, NOW)).toBe(true);
    expect(isDeploymentTimedOut({}, NOW)).toBe(false);
  });
});

describe("error sanitization", () => {
  it("redacts build hook URLs, bearer tokens, and token= assignments", () => {
    const input = `deploy to ${HOOK_URL} with Authorization: Bearer sk_live_12345 and token=super-secret now`;
    const out = redactDeploymentError(input);
    expect(out).not.toContain(HOOK_URL);
    expect(out).not.toContain("sk_live_12345");
    expect(out).not.toContain("super-secret");
    expect(out).toContain("[REDACTED_HOOK_URL]");
  });

  it("truncates long messages", () => {
    const out = redactDeploymentError("x".repeat(1000), 200);
    expect(out.length).toBeLessThanOrEqual(205);
  });

  it("produces a safe message from a VercelError", () => {
    const err = new VercelError("trigger", `Build Hook request failed with status 500 (${HOOK_URL})`, 500);
    const out = toSafeDeploymentError(err);
    expect(out).toContain("500");
    expect(out).not.toContain(HOOK_URL);
  });

  it("produces a safe message from a generic error", () => {
    expect(toSafeDeploymentError(new Error("boom"))).toBe("boom");
  });
});

describe("startDeployment", () => {
  it("reserves pending, triggers the build, then stores the hook job id as attemptId", async () => {
    mockTrigger.mockResolvedValue({ hookJobId: "job_attempt_9", createdAt: 123456 });

    const outcome = await startDeployment(PROJECT_ID, { now: nowFn });

    expect(mockTrigger).toHaveBeenCalledTimes(1);
    expect(mockUpdateOne).toHaveBeenCalledTimes(2);

    const first = updateOneDeploymentWrite(0);
    const second = updateOneDeploymentWrite(1);
    expect(first.$set.deployment.state).toBe("pending");
    expect(second.$set.deployment.state).toBe("deploying");
    expect(second.$set.deployment.attemptId).toBe("job_attempt_9");
    expect(second.$set.deployment.deploymentId).toBe("");

    expect(outcome.state).toBe("deploying");
    expect(outcome.attemptId).toBe("job_attempt_9");
    expect(outcome.deploymentId).toBeUndefined();
    expect(outcome.requestedAt).toBe(NOW.toISOString());
  });

  it("marks the project failed when the Build Hook trigger fails, storing only a safe error", async () => {
    mockTrigger.mockRejectedValue(new VercelError("trigger", `Build Hook request failed with status 500 (${HOOK_URL})`, 500));

    const outcome = await startDeployment(PROJECT_ID, { now: nowFn });

    expect(outcome.state).toBe("failed");
    expect(outcome.attemptId ?? "").toBe("");
    expect(outcome.error).toContain("500");
    expect(outcome.error).not.toContain(HOOK_URL);
    expect(mockTrigger).toHaveBeenCalledTimes(1);
  });
});

describe("applyDeploymentForPublish", () => {
  it("does not re-trigger when an attempt is already active (duplicate publish)", async () => {
    const deployment: Partial<ProjectDeployment> = { state: "deploying", attemptId: "job_1", requestedAt: new Date("2026-01-01T00:00:00Z") };
    const outcome = await applyDeploymentForPublish(PROJECT_ID, { slug: "brand-new-cms-page", deployment, now: nowFn });

    expect(outcome.state).toBe("deploying");
    expect(outcome.attemptId).toBe("job_1");
    expect(mockTrigger).not.toHaveBeenCalled();
    expect(mockUpdateOne).not.toHaveBeenCalled();
  });

  it("explicitly initializes the subdocument to not_required for a static slug", async () => {
    const outcome = await applyDeploymentForPublish(PROJECT_ID, { slug: "retro-arcade-concept", deployment: null, now: nowFn });

    expect(outcome.state).toBe("not_required");
    expect(mockTrigger).not.toHaveBeenCalled();
    expect(mockUpdateOne).toHaveBeenCalledTimes(1);
const write = updateOneDeploymentWrite(0);
    expect(write.$set.deployment.state).toBe("not_required");
  });

  it("keeps a live project untouched (edits propagate via ISR)", async () => {
    const deployment: Partial<ProjectDeployment> = { state: "live", deploymentId: "dpl_1", attemptId: "job_1" };
    const outcome = await applyDeploymentForPublish(PROJECT_ID, { slug: "brand-new-cms-page", deployment, now: nowFn });

    expect(outcome.state).toBe("live");
    expect(mockUpdateOne).not.toHaveBeenCalled();
    expect(mockTrigger).not.toHaveBeenCalled();
  });

  it("starts a fresh deployment for a new slug that requires materialization", async () => {
    mockTrigger.mockResolvedValue({ hookJobId: "job_attempt_2", createdAt: 1 });
    const deployment: Partial<ProjectDeployment> = { state: "failed", error: "previous failure" };

    const outcome = await applyDeploymentForPublish(PROJECT_ID, { slug: "another-new-slug", deployment, now: nowFn });

    expect(mockTrigger).toHaveBeenCalledTimes(1);
    expect(outcome.state).toBe("deploying");
    expect(outcome.attemptId).toBe("job_attempt_2");
  });
});

describe("reconcileDeployment", () => {
  it("resets an unpublished project to not_required so it can never become live", async () => {
    const project = makeProject({ status: "draft" });

    const result = await reconcileDeployment(project, { now: nowFn });

    expect(result.resetForUnpublished).toBe(true);
    expect(result.deployment).toEqual({ state: "not_required" });
    expect(mockUpdateOne).toHaveBeenCalledTimes(1);
    expect(updateOneDeploymentWrite(0).$set.deployment.state).toBe("not_required");
  });

  it("returns nothing for a published project without a deployment subdocument", async () => {
    const result = await reconcileDeployment(makeProject({ deployment: null }), { now: nowFn });
    expect(result.deployment).toBeUndefined();
    expect(mockUpdateOne).not.toHaveBeenCalled();
  });

  it("returns settled state as-is for live / not_required / failed", async () => {
    for (const state of ["live", "not_required", "failed"]) {
      const result = await reconcileDeployment(makeProject({ deployment: { state } }), { now: nowFn });
      expect(result.deployment?.state).toBe(state);
      expect(mockGetDeployment).not.toHaveBeenCalled();
    }
  });

  it("fails when Vercel API configuration is missing (never invents a status)", async () => {
    mockIsVercelApiConfigured.mockReturnValue(false);
    const result = await reconcileDeployment(makeProject(), { now: nowFn });
    expect(result.deployment?.state).toBe("failed");
    expect(result.deployment?.error).toContain("Deployment cannot be verified");
  });

  it("fails when deployment discovery times out (deployment may still exist on Vercel)", async () => {
    const result = await reconcileDeployment(makeProject({ deployment: timedOutDeployment() }), { now: nowFn });
    expect(result.deployment?.state).toBe("failed");
    expect(result.deployment?.error).toContain("Deployment discovery timed out");
    expect(result.deployment?.error).not.toContain("before reaching Vercel");
  });

  it("resumes a straggler pending trigger", async () => {
    mockTrigger.mockResolvedValue({ hookJobId: "job_resume", createdAt: 1 });
    const pending = { state: "pending", deploymentId: "", attemptId: "", requestedAt: new Date(NOW.getTime() - 60_000) };
    const result = await reconcileDeployment(makeProject({ deployment: pending }), { now: nowFn });
    expect(mockTrigger).toHaveBeenCalledTimes(1);
    expect(result.deployment?.state).toBe("deploying");
    expect(result.warning).toBeTruthy();
  });

  it("fails a pending trigger when the hook is not configured", async () => {
    mockIsVercelHookConfigured.mockReturnValue(false);
    const pending = { state: "pending", deploymentId: "", attemptId: "", requestedAt: new Date(NOW.getTime() - 60_000) };
    const result = await reconcileDeployment(makeProject({ deployment: pending }), { now: nowFn });
    expect(result.deployment?.state).toBe("failed");
    expect(result.deployment?.error).toContain("Build Hook is not configured");
  });

  it("marks the project LIVE only after Vercel READY AND canonical URL returns 200", async () => {
    mockGetDeployment.mockResolvedValue({ id: "dpl_1", readyState: "READY" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("ok", { status: 200 })));

    const result = await reconcileDeployment(makeProject(), { now: nowFn });

    expect(result.liveApplied).toBe(true);
    expect(result.deployment?.state).toBe("live");
    expect(result.deployment?.deploymentId).toBe("dpl_1");
    expect(result.deployment?.attemptId).toBe("job_attempt_1");
    expect(result.deployment?.completedAt).toBe(NOW.toISOString());
    const liveIndex = mockUpdateOne.mock.calls.findIndex((_call, i) => updateOneDeploymentWrite(i).$set.deployment.state === "live");
    expect(liveIndex).toBeGreaterThanOrEqual(0);
    const filter = mockUpdateOne.mock.calls[liveIndex][0] as Record<string, unknown>;
    expect(filter).toMatchObject({ _id: PROJECT_ID, "deployment.attemptId": "job_attempt_1" });
  });

  it("does NOT mark live when READY but the canonical URL is still 404", async () => {
    mockGetDeployment.mockResolvedValue({ id: "dpl_1", readyState: "READY" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Not Found", { status: 404 })));

    const result = await reconcileDeployment(makeProject(), { now: nowFn });

    expect(result.liveApplied).toBe(false);
    expect(result.deployment?.state).toBe("deploying");
    expect(result.deployment?.error).toContain("READY but not live");
    expect(result.warning).toBeTruthy();
  });

  it("does NOT mark live when READY but the canonical URL has a transient network failure", async () => {
    mockGetDeployment.mockResolvedValue({ id: "dpl_1", readyState: "READY" });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    const result = await reconcileDeployment(makeProject(), { now: nowFn });

    expect(result.liveApplied).toBe(false);
    expect(result.deployment?.state).toBe("deploying");
    expect(result.warning).toBeTruthy();
  });

  it("marks failed on Vercel deployment ERROR", async () => {
    mockGetDeployment.mockResolvedValue({ id: "dpl_1", readyState: "ERROR", errorMessage: `build failed (${HOOK_URL})` });

    const result = await reconcileDeployment(makeProject(), { now: nowFn });

    expect(result.deployment?.state).toBe("failed");
    expect(result.deployment?.error).not.toContain(HOOK_URL);
  });

  it("marks failed on Vercel deployment CANCELED", async () => {
    mockGetDeployment.mockResolvedValue({ id: "dpl_1", readyState: "CANCELED" });

    const result = await reconcileDeployment(makeProject(), { now: nowFn });

    expect(result.deployment?.state).toBe("failed");
  });

  it("ignores a stale completion (attempt id no longer current) — never overwrites a newer attempt", async () => {
    mockGetDeployment.mockResolvedValue({ id: "dpl_1", readyState: "READY" });
    mockUpdateOne.mockResolvedValue({ matchedCount: 0 } as never);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("ok", { status: 200 })));

    const result = await reconcileDeployment(makeProject(), { now: nowFn });

    expect(result.liveApplied).toBe(false);
    expect(result.deployment?.state).toBe("deploying");
    const liveIndex = mockUpdateOne.mock.calls.findIndex((_call, i) => updateOneDeploymentWrite(i).$set.deployment.state === "live");
    expect(liveIndex).toBeGreaterThanOrEqual(0);
    expect((mockUpdateOne.mock.calls[liveIndex][0] as { _id: string; "deployment.attemptId": string })["deployment.attemptId"]).toBe("job_attempt_1");
  });

  it("stays deploying when the build is not yet correlated to a Vercel deployment", async () => {
    mockList.mockResolvedValue([]);
    mockFindRelevant.mockReturnValue(null);

    const result = await reconcileDeployment(makeProject({ deployment: { ...makeProject().deployment, deploymentId: "" } }), { now: nowFn });

    expect(result.deployment?.state).toBe("deploying");
  });

  it("discovers the Vercel deployment from the list and persists its deploymentId", async () => {
    mockList.mockResolvedValue([]);
    mockFindRelevant.mockReturnValue({
      id: "dpl_discovered_1",
      readyState: "BUILDING",
      meta: { deployHookId: "hook_myHookId" },
    } as never);

    const result = await reconcileDeployment(
      makeProject({ deployment: { ...makeProject().deployment, deploymentId: "" } }),
      { now: nowFn }
    );

    expect(mockList).toHaveBeenCalled();
    expect(result.deployment?.state).toBe("deploying");
    expect(result.deployment?.deploymentId).toBe("dpl_discovered_1");
    const correlated = mockUpdateOne.mock.calls.findIndex(
      (_call, i) => updateOneDeploymentWrite(i).$set.deployment.deploymentId === "dpl_discovered_1"
    );
    expect(correlated).toBeGreaterThanOrEqual(0);
  });

  it("keeps deploying when the Vercel API call fails (transient), instead of inventing a failure", async () => {
    mockList.mockRejectedValue(new VercelError("api", "Vercel deployments API failed with status 500", 500));

    const result = await reconcileDeployment(makeProject({ deployment: { ...makeProject().deployment, deploymentId: "" } }), { now: nowFn });

    expect(result.deployment?.state).toBe("deploying");
    expect(result.warning).toContain("500");
  });
});

describe("verifyCanonicalUrl", () => {
  it("verifies HTTP 200 as ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 200 })));
    expect((await verifyCanonicalUrl("al-ghazal-egc")).ok).toBe(true);
  });

  it("reports a non-200 as not ok without claiming live", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 404 })));
    const result = await verifyCanonicalUrl("missing-slug");
    expect(result.ok).toBe(false);
    expect(result.status).toBe(404);
  });

  it("reports a network failure as not ok (transient)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    const result = await verifyCanonicalUrl("x");
    expect(result.ok).toBe(false);
    expect(result.reason).toBeTruthy();
  });
});