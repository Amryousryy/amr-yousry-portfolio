import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/db", () => ({ default: vi.fn() }));
vi.mock("@/models/Analytics", () => ({
  default: {
    create: vi.fn(),
    aggregate: vi.fn(),
  },
}));

import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import Analytics from "@/models/Analytics";
import * as analyticsRoute from "@/app/api/analytics/route";

const mockGetServerSession = vi.mocked(getServerSession);
const mockDbConnect = vi.mocked(dbConnect);
const mockAggregate = vi.mocked(Analytics.aggregate);
const mockCreate = vi.mocked(Analytics.create);

function authRequest(): Request {
  return new Request("http://localhost/api/analytics");
}

function legacyPostRequest(): Request {
  return new Request("http://localhost/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      type: "page_view",
      page: "/",
      projectId: null,
      interactionType: "view",
      metadata: { arbitrary: "client-supplied" },
    }),
  });
}

function dispatch(method: string, request: Request): Promise<Response> {
  const handler = (analyticsRoute as unknown as Record<string, ((req: Request) => Promise<Response>) | undefined>)[method];
  if (!handler) {
    return Promise.resolve(new Response(null, { status: 405 }));
  }
  return handler(request);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/analytics — authenticated aggregation route (GET preserved)", () => {
  it("returns 401 for unauthenticated requests", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await dispatch("GET", authRequest());

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 200 with the expected response shape for authenticated requests", async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: "admin@example.com" } });
    mockDbConnect.mockResolvedValue({} as never);
    mockAggregate.mockResolvedValue([]);

    const response = await dispatch("GET", authRequest());

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data.dailyViews)).toBe(true);
    expect(Array.isArray(body.data.topProjects)).toBe(true);
    expect(mockCreate).not.toHaveBeenCalled();
  });
});

describe("POST /api/analytics — legacy unauthenticated write handler removed", () => {
  it("no longer exports a POST handler from the route module", async () => {
    const exported = analyticsRoute as unknown as Record<string, unknown>;

    expect(exported.POST).toBeUndefined();
  });

  it("returns 405 with zero analytics writes for a legacy-style payload", async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: "admin@example.com" } });
    mockDbConnect.mockResolvedValue({} as never);
    mockCreate.mockResolvedValue({} as never);

    const response = await dispatch("POST", legacyPostRequest());

    expect(response.status).toBe(405);
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("never persists arbitrary client-supplied metadata", async () => {
    mockGetServerSession.mockResolvedValue({ user: { email: "admin@example.com" } });
    mockDbConnect.mockResolvedValue({} as never);

    const response = await dispatch("POST", legacyPostRequest());

    expect(response.status).toBe(405);
    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockCreate.mock.calls).toHaveLength(0);
  });
});