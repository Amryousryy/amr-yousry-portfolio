import type { Project } from "@/types/project-static";
import { getCanonicalProjectSlug } from "@/lib/projects/canonical-slugs";

/**
 * Related Projects recommendation engine.
 *
 * Pure, deterministic, side-effect free. Designed to be SSR / ISR safe:
 * no `Math.random()` during render, ordering is a pure function of
 * (current project, candidate pool, viewsBySlug, seed).
 *
 * Signal mapping (uses only metadata that already exists on the public
 * Project record — no invented fields):
 *
 *   - specialization / project type  -> project.category   (normalized label)
 *   - filter / category              -> project.categories  (filter keys)
 *   - related tags / taxonomy        -> project.services    (service strings)
 *   - popularity                     -> real view counts (slugs in viewsBySlug),
 *                                      else `featured` as a mild proxy
 *
 * Relevance hierarchy (fallback levels) is enforced by bucketing: a candidate
 * that matches a specialization ALWAYS outranks one that only shares a filter,
 * regardless of popularity, so an unrelated high-view project can never beat a
 * same-specialization project. Within an equal tier, real view counts nudge
 * ordering and a deterministic seed provides controlled variation.
 */

export const DEFAULT_RELATED_LIMIT = 2;

export const RELATED_SCORE = {
  specialization: 100,
  filterCategory: 60,
  taxonomyServices: 30,
  featured: 5,
  partialTaxonomy: 10,
} as const;

/**
 * Bounded popularity bump injected into the *within-tier* ordering. It is
 * intentionally kept small (<< a relevance gap) so views can nudge/rotate
 * among equally-relevant candidates but can NEVER let popularity cross a
 * relevance tier (specialization > filter > taxonomy is enforced by level).
 */
export const POPULARITY_BUMP_MAX = 4;

export const RELATED_LEVEL = {
  specialization: 1,
  filterCategory: 2,
  taxonomyServices: 3,
  fallback: 4,
} as const;

export interface RelatedProjectsOptions {
  /** Maximum number of projects to return. Defaults to the UI grid size. */
  limit?: number;
  /**
   * Optional slug -> view-count map. When present it is used for the
   * popularity signal. When absent, `featured` acts as a mild proxy.
   */
  viewsBySlug?: Record<string, number>;
  /**
   * Optional deterministic rotation seed (e.g. a server-side time bucket).
   * The engine is a pure function of (current, pool, viewsBySlug, seed):
   * the same seed always yields the same ordering, a different seed yields a
   * different ordering — but ONLY within equally-relevant candidates.
   * Omitting the seed falls back to a stable per-current-slug hash.
   */
  seed?: string;
}

export interface ScoredRelatedProject {
  project: Project;
  level: number;
  score: number;
  /** 0 = real views, 1 = featured, 2 = plain fallback. */
  fallbackRank: number;
}

function normalizeToken(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function toArray(value: string[] | undefined): string[] {
  return Array.isArray(value) ? value.map((v) => normalizeToken(v)) : [];
}

function countExactOverlap(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setB = new Set(b);
  let count = 0;
  for (const item of a) {
    if (setB.has(item)) count += 1;
  }
  return count;
}

/**
 * Deterministic 53-bit float in [0, 1) derived from a string (cyrb53).
 * Same input always produces the same output — SSR-safe, no state, no
 * `Math.random()`.
 */
export function deterministicHash(input: string): number {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const result = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return (result % 9007199254740992) / 9007199254740992;
}

export function computesRelatedLevel(current: Project, candidate: Project): number {
  const currentCategory = normalizeToken(current.category);
  const candidateCategory = normalizeToken(candidate.category);

  if (
    currentCategory.length > 0 &&
    candidateCategory.length > 0 &&
    currentCategory === candidateCategory
  ) {
    return RELATED_LEVEL.specialization;
  }

  const currentFilters = toArray(current.categories);
  const candidateFilters = toArray(candidate.categories);
  if (countExactOverlap(currentFilters, candidateFilters) > 0) {
    return RELATED_LEVEL.filterCategory;
  }

  const currentServices = toArray(current.services);
  const candidateServices = toArray(candidate.services);
  if (countExactOverlap(currentServices, candidateServices) > 0) {
    return RELATED_LEVEL.taxonomyServices;
  }

  return RELATED_LEVEL.fallback;
}

export function computesRelatedScore(current: Project, candidate: Project): number {
  const currentFilters = toArray(current.categories);
  const candidateFilters = toArray(candidate.categories);
  const filterOverlap = countExactOverlap(currentFilters, candidateFilters);

  const currentServices = toArray(current.services);
  const candidateServices = toArray(candidate.services);
  const serviceOverlap = countExactOverlap(currentServices, candidateServices);

  const currentCategory = normalizeToken(current.category);
  const candidateCategory = normalizeToken(candidate.category);
  const sameCategory =
    currentCategory.length > 0 &&
    candidateCategory.length > 0 &&
    currentCategory === candidateCategory;

  let score = 0;

  if (sameCategory) score += RELATED_SCORE.specialization;
  if (filterOverlap > 0) score += RELATED_SCORE.filterCategory;
  if (serviceOverlap > 0) score += RELATED_SCORE.taxonomyServices;

  if (filterOverlap > 0 && serviceOverlap > 0) {
    score += RELATED_SCORE.partialTaxonomy;
  }

  return score;
}

/**
 * Bounded, monotonic popularity bump from real view counts (capped at
 * POPULARITY_BUMP_MAX). Monotonic in views so, among otherwise-equal
 * candidates, the more-viewed one nudges ahead — but deliberately capped so it
 * can never out-rank a relevance tier difference.
 */
export function computesPopularityBump(views: number | undefined): number {
  if (typeof views !== "number" || !Number.isFinite(views) || views <= 0) return 0;
  return Math.min(POPULARITY_BUMP_MAX, Math.log2(views + 1) * 0.35);
}

/**
 * Secondary rank used to order candidates once the relevance tier is equal:
 *   0 = has real view counts
 *   1 = featured (secondary popularity proxy)
 *   2 = plain fallback
 * This keeps "high real view count" above "featured" above "any remaining"
 * within the fallback tier (levels 4-5-6 of the spec).
 */
export function computesFallbackRank(
  candidate: Project,
  views: number | undefined,
): number {
  if (typeof views === "number" && views > 0) return 0;
  if (candidate.featured) return 1;
  return 2;
}

export function isUsableCandidateSlug(slug: unknown): boolean {
  return typeof slug === "string" && slug.trim().length > 0;
}

/**
 * Builds a stable server-side seed from a time bucket (defaults to a half-day
 * window). Because the seed is computed once server-side and the resulting
 * recommendation array is baked into the served HTML, it never causes a
 * hydration mismatch. Different buckets rotate the ordering over time while
 * remaining deterministic within any single render.
 */
export function buildRelatedSeed(
  now: Date = new Date(),
  bucketSeconds = 60 * 60 * 12,
): string {
  const bucket = Math.floor(now.getTime() / (bucketSeconds * 1000));
  return `bucket:${bucket}`;
}

/**
 * Returns the recommended related projects for `current`, never including the
 * current project itself. A pure function of (current, pool, viewsBySlug,
 * seed): deterministic and SSR-safe for a fixed seed.
 */
export function getRelatedProjects(
  current: Project,
  allProjects: Project[],
  options: RelatedProjectsOptions = {},
): ScoredRelatedProject[] {
  const limit = options.limit ?? DEFAULT_RELATED_LIMIT;
  if (limit <= 0) return [];

  const viewsBySlug = options.viewsBySlug;
  const seed = options.seed ?? `stable:${current.slug}`;

  // Project identity is always resolved through the canonical slug so legacy
  // aliases can never be emitted as recommendation targets, create duplicates,
  // or survive as the "current" identity.
  const currentId = getCanonicalProjectSlug(current.slug);

  const seen = new Set<string>();
  const scored: ScoredRelatedProject[] = [];

  for (const candidate of allProjects) {
    if (!candidate) continue;
    if (!isUsableCandidateSlug(candidate.slug)) continue;

    const candidateId = getCanonicalProjectSlug(candidate.slug);
    // The engine only ever recommends canonical project identities. A legacy
    // slug (known redirect source) is structurally excluded — it must resolve
    // to its canonical project (already present under its own slug) instead of
    // being emitted as a navigation target.
    if (candidateId !== candidate.slug) continue;
    if (candidateId === currentId) continue;
    if (seen.has(candidateId)) continue;
    seen.add(candidateId);

    const views = viewsBySlug?.[candidate.slug];
    const relevance = computesRelatedScore(current, candidate);
    const viewsBump = computesPopularityBump(views);
    const fallbackRank = computesFallbackRank(candidate, views);
    // Variability source: deterministic per (seed, current, candidate). Ranges
    // in [0,1) and is added *after* relevance + popularity so it can only
    // distinguish otherwise-tied candidates. Relevance tiers are never crossed
    // because `level` is the primary sort key.
    const diversity = deterministicHash(`${seed}|${current.slug}|${candidate.slug}`);

    scored.push({
      project: candidate,
      level: computesRelatedLevel(current, candidate),
      score: relevance + viewsBump + diversity,
      fallbackRank,
    });
  }

  scored.sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    if (a.fallbackRank !== b.fallbackRank) return a.fallbackRank - b.fallbackRank;
    if (b.score !== a.score) return b.score - a.score;
    return a.project.slug < b.project.slug ? -1 : a.project.slug > b.project.slug ? 1 : 0;
  });

  return scored.slice(0, limit);
}