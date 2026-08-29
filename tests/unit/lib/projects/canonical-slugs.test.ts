import { describe, it, expect } from "vitest";
import {
  LEGACY_PROJECT_REDIRECTS,
  getCanonicalProjectSlug,
  getCanonicalProjectPath,
  isCanonicalProjectSlug,
} from "@/lib/projects/canonical-slugs";

describe("canonical slug registry", () => {
  it("resolves the Al Ghazal legacy slug to its canonical slug", () => {
    expect(getCanonicalProjectSlug("al-ghazal-exhibition")).toBe("al-ghazal-egc");
  });

  it("passes unknown and already-canonical slugs through unchanged", () => {
    expect(getCanonicalProjectSlug("nextgen-fitness-app")).toBe("nextgen-fitness-app");
    expect(getCanonicalProjectSlug("retro-arcade-concept")).toBe("retro-arcade-concept");
    expect(getCanonicalProjectSlug("al-ghazal-egc")).toBe("al-ghazal-egc");
    expect(getCanonicalProjectSlug("brand-new-project")).toBe("brand-new-project");
  });

  it("builds canonical project paths, never legacy ones", () => {
    expect(getCanonicalProjectPath("al-ghazal-exhibition")).toBe("/projects/al-ghazal-egc");
    expect(getCanonicalProjectPath("retro-arcade-concept")).toBe("/projects/retro-arcade-concept");
  });

  it("flags legacy slugs as non-canonical", () => {
    expect(isCanonicalProjectSlug("al-ghazal-exhibition")).toBe(false);
    expect(isCanonicalProjectSlug("al-ghazal-egc")).toBe(true);
    expect(isCanonicalProjectSlug("nextgen-fitness-app")).toBe(true);
  });

  it("has no duplicate legacy sources and no duplicate canonical destinations", () => {
    const legacy = LEGACY_PROJECT_REDIRECTS.map((r) => r.legacy);
    const canonical = LEGACY_PROJECT_REDIRECTS.map((r) => r.canonical);
    expect(new Set(legacy).size).toBe(legacy.length);
    expect(new Set(canonical).size).toBe(canonical.length);
  });

  it("never redirects from a canonical slug (no redirect chains or loops)", () => {
    for (const redirect of LEGACY_PROJECT_REDIRECTS) {
      expect(isCanonicalProjectSlug(redirect.legacy)).toBe(false);
      expect(isCanonicalProjectSlug(redirect.canonical)).toBe(true);
      // The destination must never itself be a redirect source.
      expect(getCanonicalProjectSlug(redirect.canonical)).toBe(redirect.canonical);
      // Every destination must be resolvable to a canonical page somewhere.
      expect(getCanonicalProjectPath(redirect.legacy)).toBe(`/projects/${redirect.canonical}`);
    }
  });
});