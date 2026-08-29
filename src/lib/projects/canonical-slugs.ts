/**
 * Canonical project slug / URL registry.
 *
 * This module is the SINGLE source of truth for legacy → canonical project
 * slug resolution. It is intentionally dependency-free (no DB, no Next.js
 * imports, no env access) so that it can be imported both by the server/client
 * application code AND by next.config.ts (redirect rules). Keeping the registry
 * shared makes it structurally impossible for internal links and redirect rules
 * to drift apart.
 *
 * Canonical URL model
 * -------------------
 * Every project has exactly ONE canonical internal URL:
 *
 *   /projects/{canonicalSlug}
 *
 * A legacy slug MAY exist as a permanent 308 redirect to its canonical slug, but
 * internal link generation (Related Projects, project cards, sitemap, etc.)
 * must ONLY ever emit the canonical slug. The reverse — a canonical-looking
 * slug redirecting to a missing project — must never happen.
 */

export interface LegacyProjectRedirect {
  /** Legacy slug that must never be emitted by internal link generation. */
  legacy: string;
  /** Canonical slug that owns the project in the canonical data source. */
  canonical: string;
}

/**
 * Legacy → canonical slug mapping.
 *
 * Al Ghazal's project was renamed in the CMS from `al-ghazal-exhibition`
 * ("Al Ghazal Exhibition", CREATIVE DIRECTION) to `al-ghazal-egc`
 * ("Al Ghazal EGC", UGC / Ads). The permanent 308 redirect preserves old
 * inbound links while all internal navigation uses the canonical slug.
 */
export const LEGACY_PROJECT_REDIRECTS: readonly LegacyProjectRedirect[] = [
  { legacy: "al-ghazal-exhibition", canonical: "al-ghazal-egc" },
] as const;

const LEGACY_TO_CANONICAL: ReadonlyMap<string, string> = new Map(
  LEGACY_PROJECT_REDIRECTS.map((redirect) => [redirect.legacy, redirect.canonical]),
);

/** Resolves a project slug to its canonical form. Unknown slugs are unchanged. */
export function getCanonicalProjectSlug(slug: string): string {
  return LEGACY_TO_CANONICAL.get(slug) ?? slug;
}

/** Returns the canonical internal project path, i.e. `/projects/{canonicalSlug}`. */
export function getCanonicalProjectPath(slug: string): string {
  return `/projects/${getCanonicalProjectSlug(slug)}`;
}

/** True when the slug is canonical (not a known legacy/redirect source slug). */
export function isCanonicalProjectSlug(slug: string): boolean {
  return !LEGACY_TO_CANONICAL.has(slug);
}