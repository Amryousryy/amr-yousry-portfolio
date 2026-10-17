import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({ default: vi.fn() }));
vi.mock("@/models/Project", () => ({ default: { findOne: vi.fn(), find: vi.fn(), findById: vi.fn() } }));
vi.mock("@/data/projects", () => ({
  getProjectBySlug: vi.fn(),
  getAllProjects: vi.fn(() => [
    { slug: "al-ghazal-egc", title: "Static Al Ghazal" },
    { slug: "nextgen-fitness-app", title: "Static Fitness" },
    { slug: "retro-arcade-concept", title: "Static Arcade" },
  ]),
  featuredProjects: [],
}));

import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import { getProjectBySlug as getStaticProjectBySlug } from "@/data/projects";
import {
  getProjectBySlug,
  getPublicProjectSlugs,
  getPublicProjectForPreview,
  getFeaturedProjects,
} from "@/lib/projects/public-projects";

const mockDbConnect = vi.mocked(dbConnect);
const mockFindOne = vi.mocked(ProjectModel.findOne);
const mockFind = vi.mocked(ProjectModel.find);
const mockFindById = vi.mocked(ProjectModel.findById);
const mockStaticBySlug = vi.mocked(getStaticProjectBySlug);

function makeDbDoc(overrides: Record<string, unknown> = {}) {
  return {
    _id: { toString: () => "db-id-1" },
    title: "DB Project",
    slug: "test-slug",
    shortDescription: "A DB project",
    category: "design",
    image: "/images/test.jpg",
    status: "published",
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockDbConnect.mockResolvedValue({} as never);
});

describe("getProjectBySlug", () => {
  it("returns DB project when DB has the project", async () => {
    const doc = makeDbDoc();
    mockFindOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(doc) } as never);
    mockStaticBySlug.mockReturnValue(undefined);

    const result = await getProjectBySlug("test-slug");

    expect(result).not.toBeNull();
    expect(result!.title).toBe("DB Project");
    expect(result!.slug).toBe("test-slug");
    expect(mockStaticBySlug).not.toHaveBeenCalled();
  });

  it("falls back to static when DB query returns null (project not in DB)", async () => {
    mockFindOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) } as never);
    mockStaticBySlug.mockReturnValue({
      id: "static-1",
      slug: "test-slug",
      title: "Static Project",
    } as never);

    const result = await getProjectBySlug("test-slug");

    expect(result).not.toBeNull();
    expect(result!.title).toBe("Static Project");
    expect(mockStaticBySlug).toHaveBeenCalledWith("test-slug");
  });

  it("falls back to static when DB connection fails", async () => {
    mockDbConnect.mockRejectedValue(new Error("Connection refused"));
    mockStaticBySlug.mockReturnValue({
      id: "static-2",
      slug: "test-slug",
      title: "Fallback Project",
    } as never);

    const result = await getProjectBySlug("test-slug");

    expect(result).not.toBeNull();
    expect(result!.title).toBe("Fallback Project");
    expect(mockStaticBySlug).toHaveBeenCalledWith("test-slug");
  });

  it("returns null when neither DB nor static has the project", async () => {
    mockFindOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) } as never);
    mockStaticBySlug.mockReturnValue(undefined);

    const result = await getProjectBySlug("nonexistent");

    expect(result).toBeNull();
  });

  it("returns null when DB fails and static also has no match", async () => {
    mockDbConnect.mockRejectedValue(new Error("Connection refused"));
    mockStaticBySlug.mockReturnValue(undefined);

    const result = await getProjectBySlug("nonexistent");

    expect(result).toBeNull();
  });
});

describe("getPublicProjectSlugs", () => {
  it("unions DB slugs with static-only slugs and dedupes shared ones", async () => {
    mockFind.mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([
          { slug: "al-ghazal-egc" },
          { slug: "housy-mobile-app" },
          { slug: "taba-mobile-app-launch-campaign" },
        ]),
      }),
    } as never);

    const result = await getPublicProjectSlugs();

    expect(new Set(result).size).toBe(result.length);
    expect(result).toContain("al-ghazal-egc");
    expect(result).toContain("housy-mobile-app");
    expect(result).toContain("taba-mobile-app-launch-campaign");
    // Static-only slugs must always be present, even when the DB is up.
    expect(result).toContain("nextgen-fitness-app");
    expect(result).toContain("retro-arcade-concept");
  });

  it("falls back to static slugs only when the DB connection fails", async () => {
    mockDbConnect.mockRejectedValue(new Error("Connection refused"));

    const result = await getPublicProjectSlugs();

    expect(result).toEqual([
      "al-ghazal-egc",
      "nextgen-fitness-app",
      "retro-arcade-concept",
    ]);
  });

  it("applies the canonical slug mapping to DB results", async () => {
    mockFind.mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([
          { slug: "al-ghazal-exhibition" },
          { slug: "nextgen-fitness-app" },
        ]),
      }),
    } as never);

    const result = await getPublicProjectSlugs();

    // Legacy DB slug resolves to canonical form; static-only still included.
    expect(result).toContain("al-ghazal-egc");
    expect(result).not.toContain("al-ghazal-exhibition");
    expect(result).toContain("nextgen-fitness-app");
  });
});

describe("public mapping of admin fields (single source of truth)", () => {
  function makeAdminDoc(overrides: Record<string, unknown> = {}) {
    return {
      _id: { toString: () => "mapped-id" },
      title: "Mapped Project",
      slug: "mapped-project",
      shortDescription: "",
      fullDescription: "Full description text",
      category: "design",
      image: "/images/mapped.jpg",
      status: "published",
      problem: "Problem text",
      strategy: "Strategy text",
      idea: "",
      solution: "",
      execution: "Execution text",
      results: "Results text",
      mainResult: "",
      outcomeNarrative: undefined,
      caseStudyMedia: [],
      gallery: [],
      detailedResults: [],
      ...overrides,
    };
  }

  function mockDbDoc(doc: Record<string, unknown>) {
    mockFindOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(doc) } as never);
    mockStaticBySlug.mockReturnValue(undefined);
  }

  it("maps admin strategy into the public solution chapter", async () => {
    mockDbDoc(makeAdminDoc());
    const result = await getProjectBySlug("mapped-project");
    expect(result?.solution).toBe("Strategy text");
  });

  it("prefers an explicit solution over idea/strategy", async () => {
    mockDbDoc(makeAdminDoc({ solution: "Real solution" }));
    const result = await getProjectBySlug("mapped-project");
    expect(result?.solution).toBe("Real solution");
  });

  it("maps admin results into the public mainResult", async () => {
    mockDbDoc(makeAdminDoc());
    const result = await getProjectBySlug("mapped-project");
    expect(result?.mainResult).toBe("Results text");
  });

  it("prefers an explicit mainResult over results", async () => {
    mockDbDoc(makeAdminDoc({ mainResult: "Headline result" }));
    const result = await getProjectBySlug("mapped-project");
    expect(result?.mainResult).toBe("Headline result");
  });

  it("uses fullDescription as the summary fallback when shortDescription is empty", async () => {
    mockDbDoc(makeAdminDoc());
    const result = await getProjectBySlug("mapped-project");
    expect(result?.summary).toBe("Full description text");
  });

  it("prefers shortDescription over fullDescription for the summary", async () => {
    mockDbDoc(makeAdminDoc({ shortDescription: "Short line" }));
    const result = await getProjectBySlug("mapped-project");
    expect(result?.summary).toBe("Short line");
  });
});

describe("getFeaturedProjects (homepage curation ordering)", () => {
  it("returns published+featured projects in curator order, honoring the limit", async () => {
    mockFind.mockReturnValue({
      sort: vi.fn((sortSpec: Record<string, number>) => {
        expect(sortSpec).toEqual({ featuredOrder: 1, createdAt: -1 });
        return {
          lean: vi.fn().mockResolvedValue([
            makeDbDoc({ featured: true, featuredOrder: 0, title: "First" }),
            makeDbDoc({ featured: true, featuredOrder: 1, title: "Second" }),
            makeDbDoc({ featured: true, featuredOrder: 2, title: "Third" }),
            makeDbDoc({ featured: true, featuredOrder: 3, title: "Fourth (cut off)" }),
          ]),
        };
      }),
    } as never);

    const result = await getFeaturedProjects(3);

    expect(mockFind).toHaveBeenCalledWith({ status: "published", featured: true });
    expect(result.map((p) => p.title)).toEqual(["First", "Second", "Third"]);
  });

  it("only ever queries published + featured (drafts can never surface)", async () => {
    mockFind.mockReturnValue({
      sort: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue([]) }),
    } as never);

    await getFeaturedProjects(3);

    expect(mockFind).toHaveBeenCalledWith({ status: "published", featured: true });
  });
});

describe("getPublicProjectForPreview (admin draft preview)", () => {
  function mockPreviewDoc(overrides: Record<string, unknown> = {}) {
    const doc = {
      _id: { toString: () => "draft-id-1" },
      title: "Draft Project",
      slug: "draft-project",
      shortDescription: "Draft summary",
      category: "design",
      image: "/images/draft.jpg",
      status: "draft",
      ...overrides,
    };
    mockFindById.mockReturnValue({ lean: vi.fn().mockResolvedValue(doc) } as never);
  }

  beforeEach(() => {
    mockStaticBySlug.mockReturnValue(undefined as never);
  });

  it("returns a DRAFT project (no status filter) so drafts can be previewed", async () => {
    mockPreviewDoc({ status: "draft" });

    const result = await getPublicProjectForPreview("draft-id-1");

    expect(mockFindById).toHaveBeenCalledWith("draft-id-1");
    expect(result).not.toBeNull();
    expect(result!.title).toBe("Draft Project");
  });

  it("applies the same public mapping used on the live page", async () => {
    mockPreviewDoc({
      status: "draft",
      shortDescription: "",
      fullDescription: "Long draft description",
      results: "Draft result",
      mainResult: "",
    });

    const result = await getPublicProjectForPreview("draft-id-1");

    expect(result?.summary).toBe("Long draft description");
    expect(result?.mainResult).toBe("Draft result");
  });

  it("returns null when no project matches the id (renders 404)", async () => {
    mockFindById.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) } as never);

    const result = await getPublicProjectForPreview("missing-id");

    expect(result).toBeNull();
  });

  it("returns null when the DB is unavailable (no static fallback for admin ids)", async () => {
    mockDbConnect.mockRejectedValue(new Error("Connection refused"));

    const result = await getPublicProjectForPreview("draft-id-1");

    expect(result).toBeNull();
  });

  it("getProjectBySlug only ever queries published status (drafts cannot surface)", async () => {
    mockFindOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(makeDbDoc({ status: "draft" })) } as never);
    mockStaticBySlug.mockReturnValue(undefined);

    const result = await getProjectBySlug("test-slug");

    // The public lookup must structurally filter to published projects, so a
    // draft can never be materialized through the public page.
    expect(mockFindOne).toHaveBeenCalledWith({ slug: "test-slug", status: "published" });
    expect(result).not.toBeNull();
  });
});
