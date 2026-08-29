import { unstable_cache } from "next/cache";
import dbConnect from "@/lib/db";
import Analytics from "@/models/Analytics";

/**
 * Server-side project view counts (slug -> detail-view count).
 *
 * The public site records a project detail view as an Analytics "interaction"
 * row with `interactionType: "project_detail_view"` and `projectId` set to the
 * project *slug* (see CaseStudyClient's `trackEvent` and the events API route).
 *
 * We aggregate those rows once per revalidation window and memoize the result
 * with `unstable_cache` so the query is NOT repeated for every project page.
 * This keeps view-count calculation:
 *   - server-side only (no browser request)
 *   - off the LCP-critical path (already-cached read after the first window)
 *   - compatible with the project detail page's ISR (`revalidate = 60`)
 *
 * Views are a *secondary* ranking signal only; the recommendation engine still
 * lets relevance tiers (specialization > filter > taxonomy) dominate.
 */

export const PROJECT_VIEWS_REVALIDATE_SECONDS = 60;

export type ProjectViewCounts = Record<string, number>;

async function computeProjectViewCounts(): Promise<ProjectViewCounts> {
  const counts: ProjectViewCounts = {};
  try {
    await dbConnect();
    const rows = (await Analytics.aggregate([
      {
        $match: {
          interactionType: "project_detail_view",
          projectId: { $ne: null },
        },
      },
      { $group: { _id: "$projectId", views: { $sum: 1 } } },
    ])) as { _id: unknown; views: number }[];

    for (const row of rows) {
      if (typeof row._id === "string" && row._id.trim().length > 0) {
        counts[row._id.trim()] = row.views;
      }
    }
  } catch {
    // Analytics unreachable (e.g. build time / DB down). Return empty map so
    // the recommendation engine falls back to `featured` — never crash.
  }
  return counts;
}

const getCachedProjectViewCounts = unstable_cache(
  computeProjectViewCounts,
  ["project-detail-view-counts"],
  {
    revalidate: PROJECT_VIEWS_REVALIDATE_SECONDS,
    tags: ["project-view-counts"],
  },
);

/**
 * Returns slug -> detail-view count. Safe to call from any server component
 * or route handler. Returns an empty object when analytics are unavailable.
 */
export async function getProjectViewCounts(): Promise<ProjectViewCounts> {
  try {
    return await getCachedProjectViewCounts();
  } catch {
    return {};
  }
}
