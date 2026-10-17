import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/projects/public-projects", () => ({
  getPublicProjects: vi.fn(),
}));
vi.mock("@/lib/projects/related-projects", () => ({
  getRelatedProjects: vi.fn(),
  buildRelatedSeed: vi.fn(() => "bucket:123"),
}));
vi.mock("@/lib/projects/project-views", () => ({
  getProjectViewCounts: vi.fn(),
}));

import { getRelatedProjectItems } from "@/lib/projects/case-study";
import { getPublicProjects } from "@/lib/projects/public-projects";
import { getRelatedProjects, buildRelatedSeed } from "@/lib/projects/related-projects";
import { getProjectViewCounts } from "@/lib/projects/project-views";

const mockPublicProjects = vi.mocked(getPublicProjects);
const mockGetRelated = vi.mocked(getRelatedProjects);
const mockViewCounts = vi.mocked(getProjectViewCounts);

function makeProject(overrides: Record<string, unknown> = {}) {
  return {
    id: "p1",
    slug: "nextgen-fitness-app",
    title: "NextGen",
    client: "",
    category: "design",
    categories: [],
    services: [],
    summary: "Summary",
    thumbnail: "/images/thumb.jpg",
    mainResult: "",
    bannerImage: "/images/banner.jpg",
    problem: "",
    solution: "",
    execution: "",
    detailedResults: [],
    ...overrides,
  } as never;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockPublicProjects.mockResolvedValue([] as never);
  mockViewCounts.mockResolvedValue({} as never);
});

describe("getRelatedProjectItems (shared by public page and draft preview)", () => {
  it("resolves the related list with the same query the public page makes", async () => {
    mockGetRelated.mockReturnValue([{ project: makeProject(), level: 1, score: 100, fallbackRank: 0 }] as never);

    const items = await getRelatedProjectItems(makeProject());

    expect(mockPublicProjects).toHaveBeenCalled();
    expect(mockViewCounts).toHaveBeenCalled();
    expect(buildRelatedSeed).toHaveBeenCalled();
    expect(mockGetRelated).toHaveBeenCalledWith(
      expect.anything(),
      [],
      expect.objectContaining({ limit: 2, viewsBySlug: {}, seed: "bucket:123" }),
    );
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({
      slug: "nextgen-fitness-app",
      title: "NextGen",
      category: "design",
      thumbnail: "/images/thumb.jpg",
      summary: "Summary",
    });
  });

  it("always emits the canonical slug for related navigation targets", async () => {
    // A legacy-slug candidate cannot be recommended by the engine, but the
    // mapper must still never leak the legacy form.
    mockGetRelated.mockReturnValue([
      { project: makeProject({ slug: "al-ghazal-exhibition", thumbnail: "" }), level: 1, score: 100, fallbackRank: 0 },
    ] as never);

    const items = await getRelatedProjectItems(makeProject());

    expect(items[0].slug).toBe("al-ghazal-egc");
  });

  it("falls back to the banner image when a project has no thumbnail", async () => {
    mockGetRelated.mockReturnValue([
      { project: makeProject({ slug: "retro-arcade-concept", thumbnail: "" }), level: 1, score: 100, fallbackRank: 0 },
    ] as never);

    const items = await getRelatedProjectItems(makeProject());

    expect(items[0].thumbnail).toBe("/images/banner.jpg");
  });
});