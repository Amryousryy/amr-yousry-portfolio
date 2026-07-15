"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ProjectService } from "@/lib/api-client";
import { DataTable, SortableHeader } from "@/components/admin/DataTable";
import { useProjectsFilters, STORAGE_KEY_PAGE_SIZE } from "@/hooks/useProjectsFilters";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  EyeOff,
  Star,
  ArrowLeft,
  Send,
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
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-[9px] px-2 py-0.5 font-bold uppercase ${
        status === "published"
          ? "bg-emerald-500/20 text-emerald-400"
          : "bg-yellow-500/20 text-yellow-400"
      }`}
    >
      {status}
    </span>
  );
}

function FeaturedBadge() {
  return (
    <div className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 bg-yellow-500/20 text-yellow-400 font-bold uppercase">
      <Star size={10} fill="currentColor" />
      Featured
    </div>
  );
}

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const { filters, updateFilters } = useProjectsFilters();
  const { page, limit, search, sort, order, status, category } = filters;

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localSearch, setLocalSearch] = React.useState(search);

  const { data: projects, isLoading, isFetching } = useQuery({
    queryKey: ["projects", "admin", page, limit, search, sort, order, status, category],
    queryFn: () =>
      ProjectService.getAll(true, {
        page,
        limit,
        search: search || undefined,
        sort: sort || undefined,
        order: order || undefined,
        status: status || undefined,
        category: category || undefined,
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
        queryKey: ["projects", "admin", nextPage, limit, search, sort, order, status, category],
        queryFn: () =>
          ProjectService.getAll(true, {
            page: nextPage,
            limit,
            search: search || undefined,
            sort: sort || undefined,
            order: order || undefined,
            status: status || undefined,
            category: category || undefined,
          }),
      });
    }
  }, [nextPage, limit, search, sort, order, status, category, queryClient]);

  useEffect(() => {
    if (prevPage) {
      queryClient.prefetchQuery({
        queryKey: ["projects", "admin", prevPage, limit, search, sort, order, status, category],
        queryFn: () =>
          ProjectService.getAll(true, {
            page: prevPage,
            limit,
            search: search || undefined,
            sort: sort || undefined,
            order: order || undefined,
            status: status || undefined,
            category: category || undefined,
          }),
      });
    }
  }, [prevPage, limit, search, sort, order, status, category, queryClient]);

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

  const columns: ColumnDef<ProjectRow>[] = [
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
          <div className="w-16 h-10 bg-primary/20 overflow-hidden rounded-sm relative">
            {row.original.image && (
              <Image
                src={row.original.image}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            )}
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: ({ column }) => <SortableHeader column={column}>Title</SortableHeader>,
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.title || "Untitled"}</p>
            <p className="text-xs text-foreground/40">{row.original.slug}</p>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <span className="text-xs px-2 py-0.5 bg-primary/10 text-accent font-medium uppercase">
            {row.original.category || "Uncategorized"}
          </span>
        ),
      },
      {
        accessorKey: "featured",
        header: "Featured",
        cell: ({ row }) =>
          row.original.featured ? <FeaturedBadge /> : null,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <SortableHeader column={column}>Created</SortableHeader>,
        cell: ({ row }) => (
          <span className="text-xs text-foreground/50">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.status === "draft" ? (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Publish "${row.original.title}"? It will be visible on the live site.`
                    )
                  ) {
                    publishMutation.mutate(row.original._id);
                  }
                }}
                disabled={publishMutation.isPending}
                className="p-2 hover:bg-green-500 hover:text-white transition-colors rounded-sm disabled:opacity-50"
                title="Publish"
              >
                <Send size={14} />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Unpublish "${row.original.title}"? It will be hidden from the live site.`
                    )
                  ) {
                    unpublishMutation.mutate(row.original._id);
                  }
                }}
                disabled={unpublishMutation.isPending}
                className="p-2 hover:bg-yellow-500 hover:text-white transition-colors rounded-sm disabled:opacity-50"
                title="Unpublish"
              >
                <EyeOff size={14} />
              </button>
            )}
            <Link
              href={`/projects/${row.original.slug}`}
              target="_blank"
              className="p-2 hover:bg-accent hover:text-background transition-colors rounded-sm"
              title="View Live"
            >
              <ExternalLink size={14} />
            </Link>
            <Link
              href={`/admin/projects/edit/${row.original._id}`}
              className="p-2 hover:bg-accent hover:text-background transition-colors rounded-sm"
              title="Edit"
            >
              <Edit2 size={14} />
            </Link>
            <button
              onClick={() => handleDelete(row.original._id, row.original.title)}
              className="p-2 hover:bg-red-500 hover:text-white transition-colors rounded-sm"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ),
      },
  ];

  const projectsData = Array.isArray(projects?.data) ? projects.data : [];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <Link
            href="/admin"
            className="flex items-center space-x-2 text-accent group mb-4"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="pixel-text text-[10px] uppercase">Dashboard</span>
          </Link>
          <h1 className="text-xl font-display font-bold uppercase tracking-tight">
            Project Vault
          </h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-background text-xs font-medium uppercase tracking-tight hover:bg-accent/90 transition-colors"
        >
          <Plus size={14} />
          <span>New Project</span>
        </Link>
      </header>

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
        searchPlaceholder="Search projects..."
        onSearchChange={handleSearch}
        searchValue={localSearch}
      />
    </div>
  );
}
