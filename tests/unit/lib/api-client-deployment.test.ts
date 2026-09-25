import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ProjectService } from "@/lib/api-client";

const getDeploymentUrl = "/api/projects/p1/deployment";
const retryDeploymentUrl = "/api/projects/p1/deployment/retry";

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("ProjectService deployment methods", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getDeployment requests the admin status endpoint via GET", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        success: true,
        data: { deployment: { state: "deploying" }, liveApplied: false },
      })
    );

    const result = await ProjectService.getDeployment("p1");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit | undefined];
    expect(url).toBe(getDeploymentUrl);
    expect(init).toBeUndefined();
    expect(result).toEqual({
      data: { deployment: { state: "deploying" }, liveApplied: false },
    });
  });

  it("getDeployment surfaces the backend error message when it fails", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: "Failed to fetch deployment status" }, 500)
    );

    const result = await ProjectService.getDeployment("p1");

    expect(result).toEqual({ error: "Failed to fetch deployment status" });
  });

  it("getDeployment returns a network error when fetch rejects", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));

    const result = await ProjectService.getDeployment("p1");

    expect(result).toEqual({ error: "Network error occurred" });
  });

  it("retryDeployment posts to the retry endpoint", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ success: true, data: { state: "deploying" } })
    );

    const result = await ProjectService.retryDeployment("p1");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(retryDeploymentUrl);
    expect(init.method).toBe("POST");
    expect(result).toEqual({ data: { state: "deploying" } });
  });

  it("retryDeployment surfaces a 409 duplicate-build response safely", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: "A deployment is already in progress" }, 409)
    );

    const result = await ProjectService.retryDeployment("p1");

    expect(result).toEqual({ error: "A deployment is already in progress" });
  });

  it("never sends credentials, auth headers, or build-hook payloads", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ success: true, data: { state: "failed" } }, 200)
    );

    await ProjectService.retryDeployment("p1");

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = (init.headers ?? {}) as Record<string, string>;
    expect(headers.Authorization ?? headers.authorization).toBeUndefined();
    expect(init.body).toBeUndefined();
    expect(fetchMock.mock.calls[0][0]).not.toMatch(
      /https?:\/\/[^\s"'<>]*\/v1\/integrations\/deploy\/[^\s"'<>]*/i
    );
  });

  it("retryDeployment returns a network error when fetch rejects", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));

    const result = await ProjectService.retryDeployment("p1");

    expect(result).toEqual({ error: "Network error occurred" });
  });
});