import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateBusinessInsights } from "@/lib/insight-engine";

const { dbConnectMock, analyticsCountMock, analyticsAggregateMock, projectFindMock } = vi.hoisted(() => ({
  dbConnectMock: vi.fn(),
  analyticsCountMock: vi.fn(),
  analyticsAggregateMock: vi.fn(),
  projectFindMock: vi.fn(),
}));

vi.mock("@/lib/db", () => ({ default: dbConnectMock }));
vi.mock("@/models/Analytics", () => ({
  default: { countDocuments: analyticsCountMock, aggregate: analyticsAggregateMock },
}));
vi.mock("@/models/Project", () => ({ default: { find: projectFindMock } }));

describe("generateBusinessInsights", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbConnectMock.mockResolvedValue(undefined);
    analyticsCountMock.mockResolvedValue(0);
    analyticsAggregateMock.mockResolvedValue([]);
    projectFindMock.mockResolvedValue([]);
  });

  it("matches popular projects by slug, not _id (regression)", async () => {
    analyticsCountMock.mockResolvedValue(60);
    analyticsAggregateMock.mockResolvedValue([{ _id: "hot-project", views: 120 }]);
    projectFindMock.mockResolvedValue([{ title: "Hot Project" }]);

    const result = await generateBusinessInsights();

    expect(projectFindMock).toHaveBeenCalledWith({ slug: { $in: ["hot-project"] } });
    expect(projectFindMock).not.toHaveBeenCalledWith(
      expect.objectContaining({ _id: expect.anything() })
    );

    const popular = result.insights.find((i) => i.title === "Popular Project");
    expect(popular).toBeDefined();
    expect(popular?.description).toContain("Hot Project");
  });

  it("produces no Popular Project insight when nothing exceeds the threshold", async () => {
    analyticsCountMock.mockResolvedValue(60);
    analyticsAggregateMock.mockResolvedValue([{ _id: "slow-project", views: 5 }]);

    const result = await generateBusinessInsights();

    expect(projectFindMock).not.toHaveBeenCalled();
    expect(result.insights.find((i) => i.title === "Popular Project")).toBeUndefined();
  });

  it("returns empty metrics and insights when the database is unreachable", async () => {
    dbConnectMock.mockRejectedValueOnce(new Error("boom"));

    const result = await generateBusinessInsights();

    expect(result).toEqual({ metrics: { completionRate: 0, totalViews: 0 }, insights: [] });
  });
});
