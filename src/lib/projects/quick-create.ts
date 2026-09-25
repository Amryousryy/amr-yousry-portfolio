import type { NewProject } from "@/types";
import { generateSlugFromTitle, normalizeSlug } from "@/lib/validation";
import type { ProjectSaveIntent } from "@/lib/projects/save-intent";

/**
 * Builds a minimal-but-valid project shell for the Quick Create drawer.
 *
 * Only title (required) and a handful of identifying fields are collected; the
 * empty content fields are intentionally left blank so the editor can be opened
 * in the normal workflow. Hostile/edge input is normalized here (trimming,
 * slug generation/normalization) so the existing POST /api/projects contract —
 * including `projectCreateSchema` and the publish-readiness 422 — is never
 * bypassed. A `published` shell therefore surfaces the same readiness issues
 * as a fully-published editor save.
 */

export interface QuickProjectInput {
  title: string;
  slug?: string;
  clientName?: string;
  category?: string;
  year?: string;
  status?: "draft" | "published";
}

export function buildQuickProjectShell(input: QuickProjectInput): NewProject {
  const title = (input.title || "").trim();
  const requestedSlug = (input.slug || "").trim();
  const slug = normalizeSlug(
    requestedSlug || generateSlugFromTitle(title) || "untitled-project",
  );
  const status = input.status === "published" ? "published" : "draft";

  return {
    title,
    slug,
    shortDescription: "",
    fullDescription: "",
    category: (input.category || "").trim(),
    image: "",
    gallery: [],
    tags: [],
    sections: [],
    featured: false,
    status,
    displayOrder: 0,
    year: (input.year || "").trim() || new Date().getFullYear().toString(),
    categories: [],
    services: [],
    detailedResults: [],
    caseStudyMedia: [],
    featuredOrder: 0,
    clientName: (input.clientName || "").trim(),
  };
}

export function quickCreateIntent(status: "draft" | "published"): ProjectSaveIntent {
  return status === "published" ? "publish" : "save-draft";
}