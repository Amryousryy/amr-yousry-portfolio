import { describe, it, expect, vi, afterEach } from "vitest";
import {
  getDeployHookIdFromUrl,
  getVercelConfig,
  isVercelApiConfigured,
  isVercelHookConfigured,
  triggerProductionBuild,
  listRecentProductionDeployments,
  getDeployment,
  findRelevantDeployment,
  mapDeploymentState,
  isVercelReady,
  VercelError,
} from "@/lib/deployment/vercel";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const HOOK_URL = "https://api.vercel.com/v1/integrations/deploy/prj_test/hook_myHookId";
const TOKEN = "tok_abc123";
const PROJECT_ID = "prj_test";

const mockFetch = vi.fn<typeof fetch>();

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  mockFetch.mockReset();
});

describe("Vercel configuration helpers", () => {
  it("reads the three required env vars only at call time", () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", HOOK_URL);
    vi.stubEnv("VERCEL_API_TOKEN", TOKEN);
    vi.stubEnv("VERCEL_PROJECT_ID", PROJECT_ID);
    expect(getVercelConfig()).toEqual({ buildHookUrl: HOOK_URL, apiToken: TOKEN, projectId: PROJECT_ID });
    expect(isVercelHookConfigured()).toBe(true);
    expect(isVercelApiConfigured()).toBe(true);
  });

  it("returns null / false when any variable is missing", () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", HOOK_URL);
    expect(getVercelConfig()).toBeNull();
    expect(isVercelHookConfigured()).toBe(true);
    expect(isVercelApiConfigured()).toBe(false);
  });
});

describe("getDeployHookIdFromUrl", () => {
  it("extracts the last path segment as the deploy hook id", () => {
    expect(getDeployHookIdFromUrl(HOOK_URL)).toBe("hook_myHookId");
  });

  it("handles a trailing slash", () => {
    expect(getDeployHookIdFromUrl(`${HOOK_URL}/`)).toBe("hook_myHookId");
  });

  it("returns null for an invalid URL", () => {
    expect(getDeployHookIdFromUrl("not-a-url")).toBeNull();
  });
});

describe("triggerProductionBuild (Build Hook)", () => {
  it("rejects when the hook URL is not configured", async () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", "");
    await expect(triggerProductionBuild()).rejects.toMatchObject({ kind: "missing_config" });
  });

  it("POSTs to the hook URL with NO auth header and returns the job id", async () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", HOOK_URL);
    mockFetch.mockResolvedValue(jsonResponse({ job: { id: "job_abc123", state: "PENDING", createdAt: 123456 } }));
    vi.stubGlobal("fetch", mockFetch);

    const result = await triggerProductionBuild();

    expect(result.hookJobId).toBe("job_abc123");
    expect(result.createdAt).toBe(123456);

    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(HOOK_URL);
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string> | undefined)?.Authorization).toBeUndefined();
  });

  it("fails with a safe message on a non-2xx hook response (no URL leaked)", async () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", HOOK_URL);
    mockFetch.mockResolvedValue(jsonResponse({ error: { code: "rate_limited" } }, 429));
    vi.stubGlobal("fetch", mockFetch);

    await expect(triggerProductionBuild()).rejects.toThrow(
      expect.objectContaining({ kind: "trigger", status: 429 })
    );
    await expect(triggerProductionBuild()).rejects.not.toThrow(HOOK_URL);
  });

  it("fails when the response has no job id (correlation cannot be trusted)", async () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", HOOK_URL);
    mockFetch.mockResolvedValue(jsonResponse({}));
    vi.stubGlobal("fetch", mockFetch);

    await expect(triggerProductionBuild()).rejects.toMatchObject({ kind: "trigger" });
  });

  it("fails on a network error", async () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", HOOK_URL);
    mockFetch.mockRejectedValue(new Error("ENOTFOUND api.vercel.com"));
    vi.stubGlobal("fetch", mockFetch);

    await expect(triggerProductionBuild()).rejects.toMatchObject({ kind: "trigger" });
  });
});

describe("listRecentProductionDeployments", () => {
  it("rejects when API config is missing", async () => {
    vi.stubEnv("VERCEL_API_TOKEN", "");
    await expect(listRecentProductionDeployments(1000)).rejects.toMatchObject({ kind: "missing_config" });
  });

  it("requests production deployments scoped by projectId and since, with Bearer auth", async () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", HOOK_URL);
    vi.stubEnv("VERCEL_API_TOKEN", TOKEN);
    vi.stubEnv("VERCEL_PROJECT_ID", PROJECT_ID);
    mockFetch.mockResolvedValue(
      jsonResponse({ deployments: [{ uid: "dpl_1", readyState: "BUILDING", meta: { deployHookId: "hook_myHookId" } }] })
    );
    vi.stubGlobal("fetch", mockFetch);

    const result = await listRecentProductionDeployments(987654);

    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const parsed = new URL(url);
    expect(parsed.pathname).toBe("/v6/deployments");
    expect(url).toContain("projectId=prj_test");
    expect(url).toContain("target=production");
    expect(url).toContain("since=987654");
    expect((init.headers as Record<string, string>).Authorization).toBe(`Bearer ${TOKEN}`);
    expect(result).toHaveLength(1);
    expect(result[0].meta?.deployHookId).toBe("hook_myHookId");
  });

  it("regression: targets /v6 for listing and never the /v13 list (400 'Invalid API version' in production)", async () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", HOOK_URL);
    vi.stubEnv("VERCEL_API_TOKEN", TOKEN);
    vi.stubEnv("VERCEL_PROJECT_ID", PROJECT_ID);
    mockFetch.mockResolvedValue(jsonResponse({ deployments: [] }));
    vi.stubGlobal("fetch", mockFetch);

    await listRecentProductionDeployments(987654);

    const [url] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/v6/deployments");
    expect(url).not.toContain("/v13/deployments");
  });

  it("normalizes the list payload identifier from uid (GET /v6/deployments shape)", async () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", HOOK_URL);
    vi.stubEnv("VERCEL_API_TOKEN", TOKEN);
    vi.stubEnv("VERCEL_PROJECT_ID", PROJECT_ID);
    mockFetch.mockResolvedValue(
      jsonResponse({ deployments: [{ uid: "dpl_example", readyState: "READY", target: "production", createdAt: 200, meta: { deployHookId: "hook_myHookId" } }] })
    );
    vi.stubGlobal("fetch", mockFetch);

    const [result] = await listRecentProductionDeployments(1);

    expect(result.id).toBe("dpl_example");
  });

  it("keeps backward compatibility when the payload uses id (singular / list legacy shape)", async () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", HOOK_URL);
    vi.stubEnv("VERCEL_API_TOKEN", TOKEN);
    vi.stubEnv("VERCEL_PROJECT_ID", PROJECT_ID);
    mockFetch.mockResolvedValue(jsonResponse({ deployments: [{ id: "dpl_legacy" }] }));
    vi.stubGlobal("fetch", mockFetch);

    const [result] = await listRecentProductionDeployments(1);

    expect(result.id).toBe("dpl_legacy");
  });

  it("supports correlation on the real list shape (uid + meta.deployHookId) via findRelevantDeployment", async () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", HOOK_URL);
    vi.stubEnv("VERCEL_API_TOKEN", TOKEN);
    vi.stubEnv("VERCEL_PROJECT_ID", PROJECT_ID);
    mockFetch.mockResolvedValue(
      jsonResponse({
        deployments: [
          { uid: "dpl_unrelated", createdAt: 150, readyState: "READY", meta: { deployHookId: "hook_other" } },
          { uid: "dpl_older", createdAt: 100, readyState: "READY", meta: { deployHookId: "hook_myHookId" } },
          { uid: "dpl_newer", createdAt: 200, readyState: "BUILDING", meta: { deployHookId: "hook_myHookId" } },
        ],
      })
    );
    vi.stubGlobal("fetch", mockFetch);

    const found = findRelevantDeployment(await listRecentProductionDeployments(1), "hook_myHookId");

    expect(found?.id).toBe("dpl_older");
  });

  it("fails on non-ok API response", async () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", HOOK_URL);
    vi.stubEnv("VERCEL_API_TOKEN", TOKEN);
    vi.stubEnv("VERCEL_PROJECT_ID", PROJECT_ID);
    mockFetch.mockResolvedValue(jsonResponse({ error: {} }, 500));
    vi.stubGlobal("fetch", mockFetch);

    await expect(listRecentProductionDeployments(1)).rejects.toMatchObject({ kind: "api" });
  });
});

describe("getDeployment", () => {
  it("returns the normalized deployment", async () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", HOOK_URL);
    vi.stubEnv("VERCEL_API_TOKEN", TOKEN);
    vi.stubEnv("VERCEL_PROJECT_ID", PROJECT_ID);
    mockFetch.mockResolvedValue(jsonResponse({ id: "dpl_9", readyState: "READY", meta: { deployHookId: "hook_x" } }));
    vi.stubGlobal("fetch", mockFetch);

    const result = await getDeployment("dpl_9");
    expect(result?.id).toBe("dpl_9");
    expect(result?.readyState).toBe("READY");
  });

  it("returns null on 404", async () => {
    vi.stubEnv("VERCEL_BUILD_HOOK_URL", HOOK_URL);
    vi.stubEnv("VERCEL_API_TOKEN", TOKEN);
    vi.stubEnv("VERCEL_PROJECT_ID", PROJECT_ID);
    mockFetch.mockResolvedValue(new Response("not found", { status: 404 }));
    vi.stubGlobal("fetch", mockFetch);

    expect(await getDeployment("dpl_missing")).toBeNull();
  });
});

describe("findRelevantDeployment (correlation, NOT job id)", () => {
  const deployments = [
    { id: "dpl_old", readyState: "READY", createdAt: 100, meta: { deployHookId: "hook_myHookId" } },
    { id: "dpl_new", readyState: "BUILDING", createdAt: 200, meta: { deployHookId: "hook_myHookId" } },
    { id: "dpl_unrelated", readyState: "READY", createdAt: 150, meta: { deployHookId: "hook_other" } },
  ];

  it("matches by meta.deployHookId and returns the earliest correlated deployment", () => {
    const found = findRelevantDeployment(deployments, "hook_myHookId");
    expect(found?.id).toBe("dpl_old");
  });

  it("never matches a hook job id as if it were a deployment correlation", () => {
    // The Build Hook response job id ("job_xyz") is NOT a deployHookId and must
    // not be used as a deployment correlation key.
    const found = findRelevantDeployment(deployments, "job_xyz");
    expect(found).toBeNull();
  });

  it("returns null when there is no match or no hook id", () => {
    expect(findRelevantDeployment(deployments, "hook_missing")).toBeNull();
    expect(findRelevantDeployment(deployments, undefined)).toBeNull();
  });
});

describe("mapDeploymentState / isVercelReady", () => {
  it("maps in-flight and READY to deploying (never live)", () => {
    for (const state of ["QUEUED", "INITIALIZING", "BUILDING", "READY", "ready"]) {
      expect(mapDeploymentState(state)).toBe("deploying");
    }
  });

  it("maps terminal failures to failed", () => {
    for (const state of ["ERROR", "CANCELED", "BLOCKED"]) {
      expect(mapDeploymentState(state)).toBe("failed");
    }
  });

  it("treats unknown/unavailable states as deploying, not a terminal state", () => {
    expect(mapDeploymentState(undefined)).toBe("deploying");
    expect(mapDeploymentState("WEIRD_STATE")).toBe("deploying");
  });

  it("reports READY explicitly (the live-verification trigger)", () => {
    expect(isVercelReady("READY")).toBe(true);
    expect(isVercelReady("BUILDING")).toBe(false);
  });

  it("exposes a typed VercelError with kind/status", () => {
    const err = new VercelError("api", "boom", 500);
    expect(err instanceof VercelError).toBe(true);
    expect(err.kind).toBe("api");
    expect(err.status).toBe(500);
  });
});