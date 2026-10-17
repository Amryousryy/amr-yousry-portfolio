import type { Project } from "@/types/project-static";
import { getPublicProjects } from "@/lib/projects/public-projects";
import { getRelatedProjects, buildRelatedSeed } from "@/lib/projects/related-projects";
import { getProjectViewCounts } from "@/lib/projects/project-views";
import { getCanonicalProjectSlug } from "@/lib/projects/canonical-slugs";

/**
 * Related-project resolution shared by the PUBLIC case-study page and the
 * ADMIN draft-preview page, so the preview renders exactly what a visitor
 * would see after publishing — including the related grid. The Db/analytics
 * lookups are intentionally the same calls the public page makes (no new
 * queries, no duplicated implementation).
 */

export interface RelatedProjectItem {
  slug: string;
  title: string;
  category: string;
  thumbnail: string;
  summary: string;
}

export async function getRelatedProjectItems(
  current: Project,
  limit = 2,
): Promise<RelatedProjectItem[]> {
  const allProjects = await getPublicProjects();
  const viewsBySlug = await getProjectViewCounts();

  return getRelatedProjects(current, allProjects, {
    limit,
    viewsBySlug,
    seed: buildRelatedSeed(),
  }).map((item) => item.project).map((p) => ({
    slug: getCanonicalProjectSlug(p.slug),
    title: p.title,
    category: p.category,
    thumbnail: p.thumbnail || p.bannerImage,
    summary: p.summary,
  }));
}