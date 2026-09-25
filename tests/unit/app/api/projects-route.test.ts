import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth/next", () => ({ getServerSession: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/db", () => ({ default: vi.fn() }));
vi.mock("@/models/Project", () => ({ default: { find: vi.fn(), countDocuments: vi.fn() } }));
vi.mock("@/lib/activity", () => ({ logActivity: vi.fn() }));

import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/db";
import { GET } from "@/app/api/projects/route";

const mockGetServerSession = vi.mocked(getServerSession);
const mockDbConnect = vi.mocked(dbConnect);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/projects — auth consistency and error honesty", () => {
  it("returns 401 (not 200 empty success) for an unauthenticated admin list request", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET(new Request("http://localhost/api/projects?admin=true"));

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Unauthorized");
    expect(mockDbConnect).not.toHaveBeenCalled();
  });

  it("returns 500 (not empty success) when the admin DB connection fails", async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: "admin@example.com" } });
    mockDbConnect.mockRejectedValue(new Error("connection refused"));

    const response = await GET(new Request("http://localhost/api/projects?admin=true"));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.success).toBeUndefined();
    expect(body.error).toBe("Failed to connect to database");
  });

  it("returns 500 (not empty success) when the admin query fails", async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: "admin@example.com" } });
    mockDbConnect.mockResolvedValue({} as never);

    const ProjectMock = (await import("@/models/Project")).default as unknown as {
      find: ReturnType<typeof vi.fn>;
    };
    ProjectMock.find.mockImplementation(() => {
      throw new Error("query boom");
    });

    const response = await GET(new Request("http://localhost/api/projects?admin=true&limit=5"));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.success).toBeUndefined();
    expect(body.error).toBe("Failed to fetch projects");
  });

  it("preserves the public fallback: unauthenticated PUBLIC list still returns empty success on DB failure", async () => {
    mockDbConnect.mockRejectedValue(new Error("connection refused"));

    const response = await GET(new Request("http://localhost/api/projects"));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ success: true, data: [] });
  });

  it("strips deployment metadata from PUBLIC list responses", async () => {
    mockDbConnect.mockResolvedValue({} as never);

    const ProjectMock = (await import("@/models/Project")).default as unknown as {
      find: ReturnType<typeof vi.fn>;
      countDocuments: ReturnType<typeof vi.fn>;
    };
    const doc = {
      _id: "abc",
      title: "Ghost",
      slug: "ghost-busters",
      status: "published",
      deployment: { state: "live", deploymentId: "dpl_x" },
    };
    ProjectMock.find.mockReturnValue({
      sort: () => ({ skip: () => ({ limit: () => ({ lean: vi.fn().mockResolvedValue([doc]) }) }) }),
    } as never);
    ProjectMock.countDocuments.mockResolvedValue(1);

    const response = await GET(new Request("http://localhost/api/projects"));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(1);
    expect(body.data[0].deployment).toBeUndefined();
    expect(body.data[0].title).toBe("Ghost");
  });

  it("keeps deployment metadata in ADMIN list responses", async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: "admin@example.com" } });
    mockDbConnect.mockResolvedValue({} as never);

    const ProjectMock = (await import("@/models/Project")).default as unknown as {
      find: ReturnType<typeof vi.fn>;
      countDocuments: ReturnType<typeof vi.fn>;
    };
    const doc = {
      _id: "abc",
      title: "Ghost",
      slug: "ghost-busters",
      status: "published",
      deployment: { state: "pending", deploymentId: "dpl_x" },
    };
    ProjectMock.find.mockReturnValue({
      sort: () => ({ skip: () => ({ limit: () => ({ lean: vi.fn().mockResolvedValue([doc]) }) }) }),
    } as never);
    ProjectMock.countDocuments.mockResolvedValue(1);

    const response = await GET(new Request("http://localhost/api/projects?admin=true"));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(1);
    expect(body.data[0].deployment).toEqual({ state: "pending", deploymentId: "dpl_x" });
  });
});