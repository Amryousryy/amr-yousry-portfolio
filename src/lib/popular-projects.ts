export const POPULAR_PROJECT_MIN_VIEWS = 50;

export interface ProjectViewsRow {
  _id: unknown;
  views: number;
}

/**
 * Derives the set of project slugs whose aggregated page-view count exceeds the
 * "popular" threshold. Analytics rows store the project *slug* in `projectId`,
 * so the returned values are slugs — they must be matched against the Project
 * `slug` field, never `_id`.
 */
export function getPopularProjectSlugs(rows: ProjectViewsRow[]): string[] {
  return [
    ...new Set(
      rows
        .filter((row) => row.views > POPULAR_PROJECT_MIN_VIEWS)
        .map((row) => (typeof row._id === "string" && row._id.trim().length > 0 ? row._id : ""))
        .filter((slug) => slug.length > 0)
    ),
  ];
}
