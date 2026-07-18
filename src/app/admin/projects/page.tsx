"use client";

import React, { useCallback, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ProjectService } from "@/lib/api-client";
import { DataTable, SortableHeader } from "@/components/admin/DataTable";
import { useProjectsFilters, STORAGE_KEY_PAGE_SIZE } from "@/hooks/useProjectsFilters";
import { useWorkspaceMetrics } from "@/hooks/useWorkspaceMetrics";
import WorkspaceHeader from "@/components/admin/WorkspaceHeader";
import WorkspaceInsights from "@/components/admin/WorkspaceInsights";
import FilterBar from "@/components/admin/FilterBar";
import EmptyState from "@/components/admin/EmptyState";
import StatusIndicator from "@/components/admin/StatusIndicator";
import {
  Edit2,
  Trash2,
  EyeOff,
  Send,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

interface ProjectRow {
  _id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  image: string;
  featured: boolean;
  status: "draft" | "published";
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

type FilterMode = "" | "published" | "draft" | "featured" | "archived";

function getFilterMode(status: string, featured: string): FilterMode {
  if (featured === "true") return "featured";
  if (status === "archived") return "archived";
  if (status === "published") return "published";
  if (status === "draft") return "draft";
  return "";
}

function getFilterModeLabel(mode: FilterMode): string {
  switch (mode) {
    case "published": return "Published";
    case "draft": return "Draft";
    case "featured": return "Featured";
    case "archived": return "Archived";
    default: return "";
  }
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(date: Date): string {
  return dateFormatter.format(new Date(date));
}

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const { filters, updateFilters } = useProjectsFilters();
  const { page, limit, search, sort, order, status, featured } = filters;

  const { metrics } = useWorkspaceMetrics();

  const filterMode = useMemo(() => getFilterMode(status, featured), [status, featured]);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localSearch, setLocalSearch] = React.useState(search);

  const { data: projects, isLoading, isFetching } = useQuery({
    queryKey: ["projects", "admin", page, limit, search, sort, order, status, featured],
    queryFn: () =>
      ProjectService.getAll(true, {
        page,
        limit,
        search: search || undefined,
        sort: sort || undefined,
        order: order || undefined,
        status: status || undefined,
        featured: featured === "true" ? true : undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const meta = projects?.meta;
  const totalPages = meta?.pages ?? 1;
  const totalItems = meta?.total ?? 0;

  useEffect(() => {
    if (!meta || isLoading) return;
    if (page > totalPages && totalPages >= 1) {
      updateFilters({ page: totalPages });
    }
  }, [page, totalPages, meta, isLoading, updateFilters]);

  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  useEffect(() => {
    if (nextPage) {
      queryClient.prefetchQuery({
        queryKey: ["projects", "admin", nextPage, limit, search, sort, order, status, featured],
        queryFn: () =>
          ProjectService.getAll(true, {
            page: nextPage,
            limit,
            search: search || undefined,
            sort: sort || undefined,
            order: order || undefined,
            status: status || undefined,
            featured: featured === "true" ? true : undefined,
          }),
      });
    }
  }, [nextPage, limit, search, sort, order, status, featured, queryClient]);

  useEffect(() => {
    if (prevPage) {
      queryClient.prefetchQuery({
        queryKey: ["projects", "admin", prevPage, limit, search, sort, order, status, featured],
        queryFn: () =>
          ProjectService.getAll(true, {
            page: prevPage,
            limit,
            search: search || undefined,
            sort: sort || undefined,
            order: order || undefined,
            status: status || undefined,
            featured: featured === "true" ? true : undefined,
          }),
      });
    }
  }, [prevPage, limit, search, sort, order, status, featured, queryClient]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete project");
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => ProjectService.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project published successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to publish project");
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) => ProjectService.unpublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project unpublished");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unpublish project");
    },
  });

  const handleSearch = useCallback(
    (value: string) => {
      setLocalSearch(value);
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => {
        updateFilters({ search: value, page: 1 });
      }, 300);
    },
    [updateFilters]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateFilters({ page: newPage });
    },
    [updateFilters]
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      updateFilters({ limit: newSize, page: 1 });
      try {
        localStorage.setItem(STORAGE_KEY_PAGE_SIZE, String(newSize));
      } catch {}
    },
    [updateFilters]
  );

  const handleDelete = useCallback((id: string, title: string) => {
    if (window.confirm(`Delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  const handleFilterModeChange = useCallback(
    (mode: string) => {
      if (mode === "featured") {
        updateFilters({ featured: "true", status: "", page: 1 });
      } else if (mode === "") {
        updateFilters({ featured: "", status: "", page: 1 });
      } else {
        updateFilters({ status: mode, featured: "", page: 1 });
      }
    },
    [updateFilters]
  );

  const handleSortChange = useCallback(
    (sortField: string, sortOrder: string) => {
      updateFilters({
        sort: sortField,
        order: sortOrder as "asc" | "desc",
        page: 1,
      });
    },
    [updateFilters]
  );

  const handleClearSearch = useCallback(() => {
    setLocalSearch("");
    updateFilters({ search: "", page: 1 });
  }, [updateFilters]);

  const handleClearFilter = useCallback(() => {
    updateFilters({ status: "", featured: "", page: 1 });
  }, [updateFilters]);

  const columns: ColumnDef<ProjectRow>[] = [
    {
      accessorKey: "image",
      header: "",
      size: 60,
      cell: ({ row }) => (
        <div className="w-14 h-9 bg-primary/15 overflow-hidden rounded relative ring-1 ring-primary/10">
          {row.original.image ? (
            <Image
              src={row.original.image}
              alt=""
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="w-4 h-4 bg-primary/25 rounded-sm" />
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => <SortableHeader column={column}>Project</SortableHeader>,
      cell: ({ row }) => (
        <div className="min-w-0 max-w-[280px]">
          <p className="font-medium truncate" title={row.original.title || "Untitled"}>
            {row.original.title || "Untitled"}
          </p>
          <p className="text-xs text-foreground/35 truncate mt-0.5">
            {row.original.slug}
            {row.original.category && (
              <span className="ml-1.5 inline-flex items-center text-[10px] px-1.5 py-px bg-accent/[0.08] text-accent/70 font-medium rounded-sm uppercase tracking-wide">
                {row.original.category}
              </span>
            )}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 140,
      cell: ({ row }) => (
        <StatusIndicator status={row.original.status} featured={row.original.featured} />
      ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <SortableHeader column={column}>Updated</SortableHeader>,
      size: 130,
      cell: ({ row }) => (
        <span className="text-xs text-foreground/45 tabular-nums whitespace-nowrap">
          {formatDate(row.original.updatedAt || row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      size: 140,
      cell: ({ row }) => {
        const project = row.original;
        const isPublished = project.status === "published";
        const isMutating = publishMutation.isPending || unpublishMutation.isPending || deleteMutation.isPending;

        return (
          <div className="flex items-center gap-0.5">
            {isPublished ? (
              <button
                onClick={() => {
                  if (window.confirm(`Unpublish "${project.title}"?`)) {
                    unpublishMutation.mutate(project._id);
                  }
                }}
                disabled={isMutating}
                className="p-1.5 text-foreground/40 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors rounded disabled:opacity-40"
                title="Unpublish"
                aria-label="Unpublish project"
              >
                <EyeOff size={14} />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (window.confirm(`Publish "${project.title}"? It will be visible on the live site.`)) {
                    publishMutation.mutate(project._id);
                  }
                }}
                disabled={isMutating}
                className="p-1.5 text-foreground/40 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors rounded disabled:opacity-40"
                title="Publish"
                aria-label="Publish project"
              >
                <Send size={14} />
              </button>
            )}

            <Link
              href={`/projects/${project.slug}`}
              target="_blank"
              className="p-1.5 text-foreground/40 hover:text-accent hover:bg-accent/10 transition-colors rounded"
              title="View live"
              aria-label="View project on live site"
            >
              <Globe size={14} />
            </Link>

            <Link
              href={`/admin/projects/edit/${project._id}`}
              className="p-1.5 text-foreground/50 hover:text-accent hover:bg-accent/10 transition-colors rounded"
              title="Edit"
              aria-label="Edit project"
            >
              <Edit2 size={14} />
            </Link>

            <div className="w-px h-4 bg-primary/15 mx-1" role="separator" />

            <button
              onClick={() => handleDelete(project._id, project.title)}
              disabled={isMutating}
              className="p-1.5 text-foreground/30 hover:text-red-400 hover:bg-red-400/10 transition-colors rounded disabled:opacity-40"
              title="Delete"
              aria-label="Delete project"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      },
    },
  ];

  const projectsData = Array.isArray(projects?.data) ? projects.data : [];

  const hasActiveSearch = search.length > 0;
  const hasActiveFilter = status !== "" || featured !== "";
  const showEmptyState = !isLoading && projectsData.length === 0;

  let emptyStateType: "no-projects" | "no-results" | "no-filtered-results" | null = null;
  if (showEmptyState) {
    if (metrics.total === 0 && !hasActiveSearch && !hasActiveFilter) {
      emptyStateType = "no-projects";
    } else if (hasActiveSearch) {
      emptyStateType = "no-results";
    } else if (hasActiveFilter) {
      emptyStateType = "no-filtered-results";
    } else {
      emptyStateType = "no-results";
    }
  }

  return (
    <div className="space-y-6">
      <WorkspaceHeader lastUpdatedAt={metrics.lastUpdatedAt} />

      <WorkspaceInsights
        total={metrics.total}
        published={metrics.published}
        drafts={metrics.drafts}
        featured={metrics.featured}
        archived={metrics.archived}
        activeFilter={filterMode}
        onFilterChange={handleFilterModeChange}
      />

      <FilterBar
        activeStatus={filterMode}
        activeSort={sort}
        activeOrder={order}
        onStatusChange={handleFilterModeChange}
        onSortChange={handleSortChange}
      />

      <div className="space-y-1">
        <div className="relative max-w-sm">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-background border border-primary/20 p-3 pl-10 outline-none focus:border-accent transition-colors text-sm"
            aria-label="Search projects"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {emptyStateType && (
        <EmptyState
          type={emptyStateType}
          filterLabel={getFilterModeLabel(filterMode)}
          onClearSearch={hasActiveSearch ? handleClearSearch : undefined}
          onClearFilter={hasActiveFilter ? handleClearFilter : undefined}
        />
      )}

      {!emptyStateType && (
        <DataTable
          columns={columns}
          data={projectsData as ProjectRow[]}
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={limit}
          isLoading={isLoading}
          isFetching={isFetching}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}
