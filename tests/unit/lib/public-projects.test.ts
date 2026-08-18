import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({ default: vi.fn() }));
vi.mock("@/models/Project", () => ({ default: { findOne: vi.fn() } }));
vi.mock("@/data/projects", () => ({
  getProjectBySlug: vi.fn(),
  getAllProjects: vi.fn(() => []),
  featuredProjects: [],
}));

import dbConnect from "@/lib/db";
import ProjectModel from "@/models/Project";
import { getProjectBySlug as getStaticProjectBySlug } from "@/data/projects";
import { getProjectBySlug } from "@/lib/projects/public-projects";

const mockDbConnect = vi.mocked(dbConnect);
const mockFindOne = vi.mocked(ProjectModel.findOne);
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
