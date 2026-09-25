import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth/next", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/db", () => ({ default: vi.fn() }));
vi.mock("@/models/Project", () => ({ default: { findById: vi.fn() } }));
vi.mock("@/lib/deployment/lifecycle", () => ({
  isActiveDeployment: vi.fn(),
  isDeploymentTimedOut: vi.fn(),
  startDeployment: vi.fn(),
}));

import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/db";
import { POST } from "@/app/api/projects/[id]/deployment/retry/route";
import {
  isActiveDeployment,
  isDeploymentTimedOut,
  startDeployment,
} from "@/lib/deployment/lifecycle";

const mockGetServerSession = vi.mocked(getServerSession);
const mockDbConnect = vi.mocked(dbConnect);
const mockIsActive = vi.mocked(isActiveDeployment);
const mockIsTimedOut = vi.mocked(isDeploymentTimedOut);
const mockStartDeployment = vi.mocked(startDeployment);
const mockFindById = vi.mocked((await import("@/models/Project")).default.findById);

const PROJECT_ID = "507f1f77bcf86cd799439011";

beforeEach(() => {
  vi.clearAllMocks();
  mockGetServerSession.mockResolvedValue({ user: { email: "admin@example.com" } } as never);
  mockDbConnect.mockResolvedValue({} as never);
  mockIsActive.mockReturnValue(false);
  mockIsTimedOut.mockReturnValue(false);
});

function retryUrl(id = PROJECT_ID) {
  return new Request(`http://localhost/api/projects/${id}/deployment/retry`, { method: "POST" });
}

describe("POST /api/projects/[id]/deployment/retry", () => {
  it("requires admin authentication", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await POST(retryUrl(), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(401);
  });

  it("rejects when the project no longer exists", async () => {
    mockFindById.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) } as never);

    const response = await POST(retryUrl(), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(404);
    expect(mockStartDeployment).not.toHaveBeenCalled();
  });

  it("rejects retry for unpublished content", async () => {
    const doc = { _id: PROJECT_ID, slug: "x", status: "draft", deployment: null };
    mockFindById.mockReturnValue({ lean: vi.fn().mockResolvedValue(doc) } as never);

    const response = await POST(retryUrl(), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(409);
    expect(mockStartDeployment).not.toHaveBeenCalled();
  });

  it("rejects when an equivalent deployment is already actively running (no duplicate builds)", async () => {
    const doc = {
      _id: PROJECT_ID,
      slug: "x",
      status: "published",
      deployment: { state: "deploying", attemptId: "job_1", deploymentId: "dpl_1", requestedAt: new Date() },
    };
    mockFindById.mockReturnValue({ lean: vi.fn().mockResolvedValue(doc) } as never);
    mockIsActive.mockReturnValue(true);
    mockIsTimedOut.mockReturnValue(false);

    const response = await POST(retryUrl(), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(409);
    expect(mockStartDeployment).not.toHaveBeenCalled();
  });

  it("rejects retry for an already-live project", async () => {
    const doc = { _id: PROJECT_ID, slug: "x", status: "published", deployment: { state: "live", deploymentId: "dpl_1" } };
    mockFindById.mockReturnValue({ lean: vi.fn().mockResolvedValue(doc) } as never);

    const response = await POST(retryUrl(), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(409);
    expect(mockStartDeployment).not.toHaveBeenCalled();
  });

  it("retries a failed deployment with a fresh attempt", async () => {
    const doc = {
      _id: PROJECT_ID,
      slug: "x",
      status: "published",
      deployment: { state: "failed", attemptId: "old_job", error: "previous failure" },
    };
    mockFindById.mockReturnValue({ lean: vi.fn().mockResolvedValue(doc) } as never);
    mockStartDeployment.mockResolvedValue({ state: "deploying", attemptId: "job_2" });

    const response = await POST(retryUrl(), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toEqual({ state: "deploying", attemptId: "job_2" });
    expect(mockStartDeployment).toHaveBeenCalledWith(PROJECT_ID);
  });

  it("allows a new attempt once an active deployment has timed out", async () => {
    const doc = {
      _id: PROJECT_ID,
      slug: "x",
      status: "published",
      deployment: { state: "deploying", attemptId: "stale_job", deploymentId: "dpl_1", requestedAt: new Date(0) },
    };
    mockFindById.mockReturnValue({ lean: vi.fn().mockResolvedValue(doc) } as never);
    mockIsActive.mockReturnValue(true);
    mockIsTimedOut.mockReturnValue(true);
    mockStartDeployment.mockResolvedValue({ state: "deploying", attemptId: "job_3" });

    const response = await POST(retryUrl(), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(200);
    expect(mockStartDeployment).toHaveBeenCalledTimes(1);
  });

  it("retries when state was never recorded (no subdocument)", async () => {
    const doc = { _id: PROJECT_ID, slug: "x", status: "published", deployment: null };
    mockFindById.mockReturnValue({ lean: vi.fn().mockResolvedValue(doc) } as never);
    mockStartDeployment.mockResolvedValue({ state: "deploying", attemptId: "job_4" });

    const response = await POST(retryUrl(), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(200);
    expect(mockStartDeployment).toHaveBeenCalledTimes(1);
  });

  it("returns 500 on an internal failure", async () => {
    mockFindById.mockReturnValue({
      lean: vi.fn().mockRejectedValue(new Error("db boom")),
    } as never);

    const response = await POST(retryUrl(), { params: Promise.resolve({ id: PROJECT_ID }) });

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Failed to retry deployment");
  });
});