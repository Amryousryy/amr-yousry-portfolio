import { describe, it, expect } from "vitest";
import type { Project } from "@/types/project-static";
import {
  getRelatedProjects,
  deterministicHash,
  buildRelatedSeed,
  computesRelatedLevel,
  computesRelatedScore,
  computesPopularityBump,
  computesFallbackRank,
  isUsableCandidateSlug,
  RELATED_LEVEL,
  DEFAULT_RELATED_LIMIT,
  POPULARITY_BUMP_MAX,
} from "@/lib/projects/related-projects";

function makeProject(overrides: Partial<Project>): Project {
  return {
    id: overrides.slug ?? "id",
    slug: "p",
    title: "Project",
    client: "",
    category: "",
    categories: [],
    services: [],
    summary: "",
    thumbnail: "/img.jpg",
    mainResult: "",
    featured: false,
    bannerImage: "/img.jpg",
    problem: "",
    solution: "",
    execution: "",
    detailedResults: [],
    ...overrides,
  } as Project;
}

// Spec example:
//   current:  Motion Graphics / Brand Campaigns / [Branding, Social Media, Advertising]
//   A: Motion Graphics + Brand Campaigns, views 300
//   B: Motion Graphics + Product Advertising, views 5000
//   C: Social Media + Brand Campaigns, views 1200
//   D: Web Design + Portfolio, views 9000
const motionGraphicsProject = makeProject({
  slug: "current",
  category: "Motion Graphics",
  categories: ["motion"],
  services: ["Brand Campaigns", "Branding", "Social Media", "Advertising"],
});

const projectA = makeProject({
  slug: "a",
  category: "Motion Graphics",
  categories: ["motion"],
  services: ["Brand Campaigns", "Branding"],
});

const projectB = makeProject({
  slug: "b",
  category: "Motion Graphics",
  categories: ["product"],
  services: ["Product Advertising"],
});

const projectC = makeProject({
  slug: "c",
  category: "Social Media",
  categories: ["social"],
  services: ["Brand Campaigns", "Branding"],
});

const projectD = makeProject({
  slug: "d",
  category: "Web Design",
  categories: ["web"],
  services: ["Portfolio"],
});

function slugsOf(result: { project: Project }[]): string[] {
  return result.map((r) => r.project.slug);
}

describe("getRelatedProjects", () => {
  it("excludes the current project", () => {
    const result = getRelatedProjects(motionGraphicsProject, [
      motionGraphicsProject,
      projectA,
      projectC,
    ]);
    const slugs = slugsOf(result);
    expect(slugs).not.toContain("current");
    expect(slugs).toHaveLength(2);
  });

  it("returns no more than the requested limit", () => {
    const pool = [projectA, projectB, projectC, projectD];
    const result = getRelatedProjects(motionGraphicsProject, pool, { limit: 2 });
    expect(result).toHaveLength(2);
    expect(slugsOf(result)).toEqual(["a", "b"]);
  });

  it("honors a custom limit", () => {
    const pool = [projectA, projectB, projectC, projectD];
    const result = getRelatedProjects(motionGraphicsProject, pool, { limit: 3 });
    expect(result).toHaveLength(3);
  });

  it("never includes duplicates", () => {
    const pool = [projectA, projectA, projectB, projectB, projectC];
    const result = getRelatedProjects(motionGraphicsProject, pool, { limit: 10 });
    const slugs = slugsOf(result);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("returns an empty array when the pool is empty", () => {
    expect(getRelatedProjects(motionGraphicsProject, [])).toEqual([]);
  });

  it("returns an empty array for a non-positive limit", () => {
    expect(getRelatedProjects(motionGraphicsProject, [projectA], { limit: 0 })).toEqual([]);
  });

  it("filters out candidates with blank slugs", () => {
    const blank = makeProject({ slug: "   " });
    const result = getRelatedProjects(motionGraphicsProject, [projectA, blank, projectC]);
    const slugs = slugsOf(result);
    expect(slugs).not.toContain("");
    expect(slugs).not.toContain("   ");
  });

  it("ranks same specialization above same filter above taxonomy above fallback", () => {
    const result = getRelatedProjects(motionGraphicsProject, [
      projectD,
      projectB,
      projectC,
      projectA,
    ], { limit: 4 });
    // A (spec+filter), B (spec), C (taxonomy), D (fallback)
    expect(slugsOf(result)).toEqual(["a", "b", "c", "d"]);
  });

  it("keeps a same-specialization project above an unrelated high-view project", () => {
    const views = { a: 300, b: 5000, c: 1200, d: 9000 };
    const result = getRelatedProjects(motionGraphicsProject, [
      projectD, // 9000 views, unrelated
      projectB, // motion graphics specialization, 5000 views
    ], { viewsBySlug: views });
    expect(slugsOf(result)[0]).toBe("b");
  });

  it("keeps same-filter relevance above unrelated popularity", () => {
    const sameFilter = makeProject({
      slug: "filter-match",
      category: "Something Else",
      categories: ["motion"], // same filter as current
      services: ["Other"],
    });
    const unrelatedPopular = makeProject({
      slug: "unrelated-popular",
      category: "Unrelated",
      categories: ["zzz"],
      services: ["Other"],
    });
    const result = getRelatedProjects(motionGraphicsProject, [unrelatedPopular, sameFilter], {
      limit: 2,
      viewsBySlug: { filter_match: 5, unrelated_popular: 100000 },
    });
    expect(slugsOf(result)[0]).toBe("filter-match");
  });

  it("uses views only to break ties within the same relevance tier", () => {
    // Two candidates in the SAME tier (both same specialization + filter).
    const highViews = makeProject({ slug: "high", category: "Motion Graphics", categories: ["motion"], services: ["Brand Campaigns"] });
    const lowViews = makeProject({ slug: "low", category: "Motion Graphics", categories: ["motion"], services: ["Brand Campaigns"] });
    const views = { high: 9999, low: 1 };
    const result = getRelatedProjects(motionGraphicsProject, [lowViews, highViews], {
      limit: 2,
      viewsBySlug: views,
    });
    // Same tier + same relevance score -> popularity bump nudges high above low
    // regardless of seed (bump difference ~4 >> diversity <1).
    expect(slugsOf(result)[0]).toBe("high");
  });

  it("is deterministic across repeated calls for the same seed", () => {
    const pool = [projectA, projectB, projectC, projectD];
    const first = getRelatedProjects(motionGraphicsProject, pool, { limit: 2, seed: "s1" });
    const second = getRelatedProjects(motionGraphicsProject, pool, { limit: 2, seed: "s1" });
    expect(slugsOf(first)).toEqual(slugsOf(second));
  });

  it("rotates ordering across different seeds among equally-relevant candidates", () => {
    const e = makeProject({ slug: "e", category: "Alpha", categories: ["x"], services: ["s1"] });
    const f = makeProject({ slug: "f", category: "Alpha", categories: ["x"], services: ["s1"] });
    const g = makeProject({ slug: "g", category: "Alpha", categories: ["x"], services: ["s1"] });
    const cur = makeProject({ slug: "cur", category: "Alpha", categories: ["x"], services: ["s1"] });

    const orders = new Set<string>();
    for (let i = 0; i < 50; i++) {
      orders.add(getRelatedProjects(cur, [e, f, g], { limit: 3, seed: `seed-${i}` }).map((r) => r.project.slug).join(","));
    }
    // With 3 equal candidates and 50 seeds, multiple distinct orderings appear.
    expect(orders.size).toBeGreaterThan(1);
  });

  it("same seed always yields the same output", () => {
    const e = makeProject({ slug: "e", category: "Alpha", categories: ["x"], services: ["s1"] });
    const f = makeProject({ slug: "f", category: "Alpha", categories: ["x"], services: ["s1"] });
    const cur = makeProject({ slug: "cur", category: "Alpha", categories: ["x"], services: ["s1"] });
    const seed = "fixed-seed";
    for (let i = 0; i < 5; i++) {
      expect(getRelatedProjects(cur, [e, f], { limit: 2, seed })).toEqual(
        getRelatedProjects(cur, [e, f], { limit: 2, seed }),
      );
    }
  });

  it("different seeds NEVER let irrelevant projects outrank stronger relevance tiers", () => {
    // E,F,G are unrelated (fallback, high popularity); A,B,C are same
    // specialization (low popularity). Regardless of seed, A/B/C must come
    // before E/F/G because relevance tier dominates.
    const e = makeProject({ slug: "e", category: "Unrelated", categories: ["zz"], services: ["zzz"] });
    const f = makeProject({ slug: "f", category: "Unrelated", categories: ["zz"], services: ["zzz"] });
    const lowViews = { a: 1, b: 1, c: 1, e: 100000, f: 90000 };
    for (let i = 0; i < 40; i++) {
      const result = getRelatedProjects(motionGraphicsProject, [e, projectA, projectC, f, projectB], {
        limit: 5,
        viewsBySlug: lowViews,
        seed: `seed-${i}`,
      });
      const slugs = slugsOf(result);
      // The three same-specialization candidates must occupy positions 0-2.
      expect(slugs.slice(0, 3).sort()).toEqual(["a", "b", "c"]);
    }
  });

  it("does not hard-code the same pair across many pages when enough candidates exist", () => {
    const candidates = ["A", "B", "C", "D", "E", "F", "G", "H"].map((letter) =>
      makeProject({ slug: `cand-${letter}`, category: "Alpha", categories: ["x"], services: ["s1"] }),
    );
    const seenPairs = new Set<string>();
    for (let i = 0; i < 60; i++) {
      const current = makeProject({ slug: `current-${i}`, category: "Alpha", categories: ["x"], services: ["s1"] });
      seenPairs.add(getRelatedProjects(current, candidates, { limit: 2 }).map((r) => r.project.slug).join(","));
    }
    expect(seenPairs.size).toBeGreaterThan(1);
  });

  it("allows candidates to repeat when fewer than limit exist", () => {
    const result = getRelatedProjects(motionGraphicsProject, [projectA], { limit: 2 });
    expect(slugsOf(result)).toEqual(["a"]);
  });

  it("treats featured as a secondary popularity proxy when no views data present", () => {
    const featuredPopular = makeProject({ slug: "pop", category: "Unrelated", categories: ["zz"], services: ["zzz"], featured: true });
    const plain = makeProject({ slug: "plain", category: "Unrelated", categories: ["zz"], services: ["zzz"], featured: false });
    const result = getRelatedProjects(projectA, [plain, featuredPopular], { limit: 1 });
    expect(slugsOf(result)[0]).toBe("pop");
  });

  it("handles missing analytics (empty viewsBySlug)", () => {
    const pool = [projectA, projectB, projectC];
    const result = getRelatedProjects(motionGraphicsProject, pool, {
      limit: 2,
      viewsBySlug: {},
    });
    expect(result).toHaveLength(2);
    expect(new Set(slugsOf(result)).size).toBe(2);
  });

  it("handles projects with missing category/categories/services", () => {
    const sparse = makeProject({ slug: "sparse", category: "", categories: [], services: [] });
    const result = getRelatedProjects(sparse, [projectA, projectB, projectC], { limit: 2 });
    // No relevance signal available -> all fallback; must still return valid slugs,
    // exclude current, and not crash.
    expect(result.length).toBeLessThanOrEqual(2);
    for (const r of result) expect(isUsableCandidateSlug(r.project.slug)).toBe(true);
  });
});

describe("real view count ranking", () => {
  it("ranks higher-view candidates above lower-view candidates within an equal tier", () => {
    const a = makeProject({ slug: "a", category: "Alpha", categories: ["x"], services: ["s1"] });
    const b = makeProject({ slug: "b", category: "Alpha", categories: ["x"], services: ["s1"] });
    const c = makeProject({ slug: "c", category: "Alpha", categories: ["x"], services: ["s1"] });
    const cur = makeProject({ slug: "cur", category: "Alpha", categories: ["x"], services: ["s1"] });
    const views = { a: 9000, b: 50, c: 1 };

    for (let i = 0; i < 20; i++) {
      const result = getRelatedProjects(cur, [c, b, a], { limit: 3, seed: `seed-${i}`, viewsBySlug: views });
      // a has by far the most views in the same tier; the bump (max ~4) dominates
      // any diversity (<1) but ties a/b are broken by bump (a > b). a must rank
      // first no matter the seed.
      expect(slugsOf(result)[0]).toBe("a");
    }
  });

  it("applies same specialization + views tie-break within the tier", () => {
    const a = makeProject({ slug: "a", category: "Alpha", categories: ["x"], services: ["s1"] });
    const b = makeProject({ slug: "b", category: "Alpha", categories: ["x"], services: ["s1"] });
    const cur = makeProject({ slug: "cur", category: "Alpha", categories: ["x"], services: ["s1"] });
    const result = getRelatedProjects(cur, [b, a], { limit: 2, viewsBySlug: { a: 50, b: 50 } });
    // Equal views -> fully tied on (level, relev, bump) -> deterministic seed breaks tie.
    expect(result).toHaveLength(2);
    expect(new Set(slugsOf(result)).size).toBe(2);
  });
});

describe("buildRelatedSeed", () => {
  it("is stable within the same time bucket", () => {
    const t = new Date("2026-01-01T12:00:00Z");
    const a = buildRelatedSeed(new Date(t.getTime()), 60 * 60 * 12);
    const b = buildRelatedSeed(new Date(t.getTime() + 10 * 1000), 60 * 60 * 12);
    expect(a).toBe(b);
  });

  it("changes across time buckets", () => {
    const t = new Date("2026-01-01T12:00:00Z");
    const a = buildRelatedSeed(t, 60 * 60); // 1 hour bucket
    const later = buildRelatedSeed(new Date(t.getTime() + 2 * 60 * 60 * 1000), 60 * 60);
    expect(a).not.toBe(later);
  });

  it("is deterministic for the same timestamp", () => {
    const t = new Date("2026-01-01T12:00:00Z");
    expect(buildRelatedSeed(new Date(t.getTime()))).toBe(buildRelatedSeed(new Date(t.getTime())));
  });
});

describe("deterministicHash", () => {
  it("is stable for the same input", () => {
    expect(deterministicHash("seed|a")).toBe(deterministicHash("seed|a"));
  });

  it("produces values in [0, 1)", () => {
    for (const input of ["a", "b", "seed|x|y"]) {
      const value = deterministicHash(input);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("varies for different inputs", () => {
    expect(deterministicHash("seed|a|b")).not.toBe(deterministicHash("seed|a|c"));
  });
});

describe("computesRelatedLevel", () => {
  it("maps the specification example to the expected hierarchy", () => {
    expect(computesRelatedLevel(motionGraphicsProject, projectA)).toBe(RELATED_LEVEL.specialization);
    expect(computesRelatedLevel(motionGraphicsProject, projectB)).toBe(RELATED_LEVEL.specialization);
    expect(computesRelatedLevel(motionGraphicsProject, projectC)).toBe(RELATED_LEVEL.taxonomyServices);
    expect(computesRelatedLevel(motionGraphicsProject, projectD)).toBe(RELATED_LEVEL.fallback);
  });
});

describe("computesRelatedScore", () => {
  it("weights specialization above filter above taxonomy above fallback", () => {
    const a = computesRelatedScore(motionGraphicsProject, projectA); // spec + filter + services
    const b = computesRelatedScore(motionGraphicsProject, projectB); // spec only
    const c = computesRelatedScore(motionGraphicsProject, projectC); // taxonomy only
    const d = computesRelatedScore(motionGraphicsProject, projectD); // fallback
    expect(a).toBeGreaterThan(b);
    expect(b).toBeGreaterThan(c);
    expect(c).toBeGreaterThan(d);
  });
});

describe("computesPopularityBump", () => {
  it("is zero for missing/non-finite/negative views", () => {
    expect(computesPopularityBump(undefined)).toBe(0);
    expect(computesPopularityBump(NaN)).toBe(0);
    expect(computesPopularityBump(0)).toBe(0);
    expect(computesPopularityBump(-5)).toBe(0);
  });

  it("is monotonic and bounded by POPULARITY_BUMP_MAX", () => {
    expect(computesPopularityBump(1)).toBeGreaterThan(0);
    expect(computesPopularityBump(1000)).toBeGreaterThan(computesPopularityBump(100));
    expect(computesPopularityBump(1e12)).toBeLessThanOrEqual(POPULARITY_BUMP_MAX);
  });
});

describe("computesFallbackRank", () => {
  it("orders real views before featured before plain", () => {
    const featured = makeProject({ slug: "f", featured: true });
    const plain = makeProject({ slug: "p", featured: false });
    expect(computesFallbackRank(featured, 10)).toBe(0);
    expect(computesFallbackRank(featured, undefined)).toBe(1);
    expect(computesFallbackRank(plain, undefined)).toBe(2);
  });
});

describe("isUsableCandidateSlug", () => {
  it("accepts non-empty slugs and rejects empty/whitespace/missing", () => {
    expect(isUsableCandidateSlug("proj-1")).toBe(true);
    expect(isUsableCandidateSlug(" p ")).toBe(true);
    expect(isUsableCandidateSlug("")).toBe(false);
    expect(isUsableCandidateSlug("   ")).toBe(false);
    expect(isUsableCandidateSlug(null)).toBe(false);
    expect(isUsableCandidateSlug(undefined)).toBe(false);
    expect(isUsableCandidateSlug(42)).toBe(false);
  });
});

describe("canonical navigation integrity", () => {
  it("never recommends a legacy (redirect-source) slug", () => {
    const legacy = makeProject({
      slug: "al-ghazal-exhibition",
      category: "Motion Graphics",
      categories: ["motion"],
      services: ["Brand Campaigns", "Branding"],
    });
    const result = getRelatedProjects(motionGraphicsProject, [legacy, projectB], { limit: 2 });
    expect(slugsOf(result)).not.toContain("al-ghazal-exhibition");
    expect(slugsOf(result)).toContain("b");
  });

  it("deduplicates by canonical identity when legacy and canonical both exist", () => {
    const legacy = makeProject({
      slug: "al-ghazal-exhibition",
      category: "Motion Graphics",
      categories: ["motion"],
      services: ["Brand Campaigns", "Branding"],
    });
    const canonical = makeProject({
      slug: "al-ghazal-egc",
      category: "Motion Graphics",
      categories: ["motion"],
      services: ["Brand Campaigns", "Branding"],
    });
    const result = getRelatedProjects(motionGraphicsProject, [legacy, canonical, projectB], { limit: 3 });
    const slugs = slugsOf(result);
    expect(slugs).not.toContain("al-ghazal-exhibition");
    expect(slugs).toContain("al-ghazal-egc");
    // Legacy + canonical collapse into a single recommended identity.
    expect(slugs).toHaveLength(2);
  });

  it("treats the current project by canonical identity even when presented under a legacy slug", () => {
    const currentLegacy = makeProject({
      slug: "al-ghazal-exhibition",
      category: "Motion Graphics",
      categories: ["motion"],
      services: ["Brand Campaigns", "Branding"],
    });
    const canonical = makeProject({
      slug: "al-ghazal-egc",
      category: "Motion Graphics",
      categories: ["motion"],
      services: ["Brand Campaigns", "Branding"],
    });
    const result = getRelatedProjects(currentLegacy, [currentLegacy, canonical, projectB], { limit: 2 });
    // Both legacy and canonical represent the SAME project as the current one.
    const slugs = slugsOf(result);
    expect(slugs).toContain("b");
    expect(slugs).not.toContain("al-ghazal-exhibition");
    expect(slugs).not.toContain("al-ghazal-egc");
  });

  it("all emitted slugs are canonical even when the pool mixes aliases", () => {
    const legacy = makeProject({
      slug: "al-ghazal-exhibition",
      category: "Motion Graphics",
      categories: ["motion"],
      services: ["Brand Campaigns", "Branding"],
    });
    const result = getRelatedProjects(motionGraphicsProject, [legacy, projectA, projectB], { limit: 3 });
    for (const r of result) {
      expect(r.project.slug).not.toBe("al-ghazal-exhibition");
    }
  });
});

describe("DEFAULT_RELATED_LIMIT", () => {
  it("matches the existing two-column UI grid", () => {
    expect(DEFAULT_RELATED_LIMIT).toBe(2);
  });
});
