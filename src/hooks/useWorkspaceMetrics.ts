"use client";

import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/lib/api-client";

export interface WorkspaceMetrics {
  total: number;
  published: number;
  drafts: number;
  featured: number;
  archived: number;
  lastUpdatedAt: string;
}

/**
 * Workspace Metrics Provider
 *
 * The Projects Workspace depends on an abstract metrics provider.
 * For Phase 2.1, the provider internally reuses the existing project query
 * to compute workspace-level statistics.
 *
 * Future implementations may migrate to a dedicated aggregation endpoint
 * without requiring any changes to the Workspace UI components.
 *
 * The UI depends only on the WorkspaceMetrics interface.
 * It should never know where those metrics come from.
 */
export function useWorkspaceMetrics(): {
  metrics: WorkspaceMetrics;
  isLoading: boolean;
} {
  const { data, isLoading } = useQuery({
    queryKey: ["projects", "workspace-metrics"],
    queryFn: () => ProjectService.getAll(true, { limit: 500 }),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const projects = Array.isArray(data?.data) ? data.data : [];

  const total = projects.length;
  const published = projects.filter(
    (p: { status: string }) => p.status === "published"
  ).length;
  const drafts = projects.filter(
    (p: { status: string }) => p.status === "draft"
  ).length;
  const featured = projects.filter(
    (p: { featured: boolean }) => p.featured === true
  ).length;
  const archived = projects.filter(
    (p: { status: string }) => p.status === "archived"
  ).length;

  let lastUpdatedAt = "";
  if (projects.length > 0) {
    const sorted = [...projects].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    const mostRecent = sorted[0];
    lastUpdatedAt = new Date(mostRecent.updatedAt).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  return {
    metrics: { total, published, drafts, featured, archived, lastUpdatedAt },
    isLoading,
  };
}
