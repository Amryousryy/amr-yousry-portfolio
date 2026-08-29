import { describe, it, expect } from "vitest";
import { getAllProjects } from "@/data/projects";
import { getCanonicalProjectSlug, isCanonicalProjectSlug } from "@/lib/projects/canonical-slugs";
import { getRelatedProjects, DEFAULT_RELATED_LIMIT } from "@/lib/projects/related-projects";
import type { Project } from "@/types/project-static";

const all = getAllProjects();

function slugsOf(result: { project: Project }[]): string[] {
  return result.map((r) => r.project.slug);
}

describe("static project data integrity (canonical source set)", () => {
  it("contains the canonical Al Ghazal project and no legacy exhibition skug", () => {
    const slugs = all.map((p) => p.slug);
    expect(slugs).toContain("al-ghazal-egc");
    expect(slugs).not.toContain("al-ghazal-exhibition");
  });

  it("never stores a legacy redirect source slug in the canonical data source", () => {
    for (const project of all) {
      expect(isCanonicalProjectSlug(project.slug)).toBe(true);
      expect(getCanonicalProjectSlug(project.slug)).toBe(project.slug);
    }
  });

  it("has unique slugs and unique ids", () => {
    const slugs = all.map((p) => p.slug);
    const ids = all.map((p) => p.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("related project navigation matrix (static fallback mode)", () => {
  it("every related recommendation resolves to an existing canonical project", () => {
    for (const project of all) {
      const related = getRelatedProjects(project, all, {
        limit: DEFAULT_RELATED_LIMIT,
        seed: `matrix:${project.slug}`,
      });
      const available = new Set(all.map((p) => p.slug));

      for (const candidate of related) {
        const hrefSlug = getCanonicalProjectSlug(candidate.project.slug);
        expect(candidate.project.slug).toBe(hrefSlug);
        expect(isCanonicalProjectSlug(hrefSlug)).toBe(true);
        expect(available.has(hrefSlug)).toBe(true);
      }
    }
  });

  it("never recommends the current project or duplicates in the matrix", () => {
    for (const project of all) {
      const related = getRelatedProjects(project, all, {
        limit: DEFAULT_RELATED_LIMIT,
        seed: `matrix:${project.slug}`,
      });
      const slugs = slugsOf(related);
      expect(slugs).not.toContain(project.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("produces a working related set for the Al Ghazal canonical project", () => {
    const project = all.find((p) => p.slug === "al-ghazal-egc");
    expect(project).toBeDefined();
    const related = getRelatedProjects(project!, all, { limit: DEFAULT_RELATED_LIMIT });
    for (const candidate of related) {
      expect(all.some((p) => p.slug === candidate.project.slug)).toBe(true);
    }
  });

  it("would still link correctly even if a legacy record leaked into the pool", () => {
    // A pre-existing legacy duplicate in a data source must be canonicalized
    // and deduplicated, never recommended under its legacy slug.
    const legacyAlGhazal: Project = {
      ...all.find((p) => p.slug === "al-ghazal-egc")!,
      slug: "al-ghazal-exhibition",
    };
    const pool = [legacyAlGhazal, ...all];
    const result = slugsOf(getRelatedProjects(legacyAlGhazal, pool, { limit: 2, seed: "x" }));
    expect(result).not.toContain("al-ghazal-exhibition");
    for (const s of result) expect(isCanonicalProjectSlug(s)).toBe(true);
  });
});