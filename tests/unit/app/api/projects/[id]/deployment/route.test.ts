import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth/next", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/db", () => ({ default: vi.fn() }));
vi.mock("@/models/Project", () => ({ default: { findById: vi.fn() } }));
vi.mock("@/lib/deployment/lifecycle", () => ({ reconcileDeployment: vi.fn() }));

import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/db";
import { GET } from "@/app/api/projects/[id]/deployment/route";
import { reconcileDeployment } from "@/lib/deployment/lifecycle";

const mockGetServerSession = vi.mocked(getServerSession);
const mockDbConnect = vi.mocked(dbConnect);
const mockReconcile = vi.mocked(reconcileDeployment);
const mockFindById = vi.mocked((await import("@/models/Project")).default.findById);

const PROJECT_ID = "507f1f77bcf86cd799439011";

beforeEach(() => {
  vi.clearAllMocks();
  mockGetServerSession.mockResolvedValue({ user: { email: "admin@example.com" } } as never);
  mockDbConnect.mockResolvedValue({} as never);
});

function statusUrl(id = PROJECT_ID) {
  return new Request(`http://localhost/api/projects/${id}/deployment`);
}

describe("GET /api/projects/[id]/deployment", () => {
  it("returns 401 for unauthenticated requests (never public)", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET(statusUrl(), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(401);
    expect(mockDbConnect).not.toHaveBeenCalled();
  });

  it("returns 404 when the project does not exist", async () => {
    mockFindById.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) } as never);

    const response = await GET(statusUrl(), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(404);
  });

  it("returns the safely-projected reconcile result for an admin", async () => {
    const doc = { _id: PROJECT_ID, slug: "brand-new-cms-page", status: "published", deployment: { state: "deploying", attemptId: "job_1" } };
    mockFindById.mockReturnValue({ lean: vi.fn().mockResolvedValue(doc) } as never);
    mockReconcile.mockResolvedValue({
      deployment: {
        state: "deploying",
        attemptId: "job_1",
        deploymentId: "dpl_1",
        requestedAt: "2026-01-01T00:00:00.000Z",
      },
    });

    const response = await GET(statusUrl(), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.deployment).toEqual({
      state: "deploying",
      attemptId: "job_1",
      deploymentId: "dpl_1",
      requestedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(mockReconcile).toHaveBeenCalledWith(doc);
  });

  it("never leaks the Build Hook URL, API token, or project id in the payload", async () => {
    const doc = { _id: PROJECT_ID, slug: "x", status: "published", deployment: { state: "failed", attemptId: "job_1", error: "boom" } };
    mockFindById.mockReturnValue({ lean: vi.fn().mockResolvedValue(doc) } as never);
    mockReconcile.mockResolvedValue({ deployment: { state: "failed", attemptId: "job_1", error: "boom" } });

    const response = await GET(statusUrl(), { params: Promise.resolve({ id: PROJECT_ID }) });
    const raw = await response.text();

    expect(raw).not.toContain("VERCEL_BUILD_HOOK_URL");
    expect(raw).not.toContain("VERCEL_API_TOKEN");
    expect(raw).not.toContain("integrations/deploy");
    expect(raw).not.toContain("Bearer ");
  });

  it("returns 500 on an internal failure without leaking details", async () => {
    mockFindById.mockReturnValue({
      lean: vi.fn().mockRejectedValue(new Error("db boom")),
    } as never);
    mockGetServerSession.mockResolvedValue({ user: { email: "admin@example.com" } } as never);

    const response = await GET(statusUrl(), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Failed to fetch deployment status");
  });
});