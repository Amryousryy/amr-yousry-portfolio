"use client";

import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ProjectService } from "@/lib/api-client";
import { DataTable, SortableHeader } from "@/components/admin/DataTable";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Star,
  ArrowLeft,
  MoreHorizontal,
  Send
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectRow {
  _id: string;
  title: { en: string; ar: string };
  slug: string;
  category: string;
  shortDescription: { en: string; ar: string };
  image: string;
  featured: boolean;
  status: "draft" | "published";
  tags: string[];
  createdAt: Date;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-[9px] px-2 py-0.5 font-bold uppercase ${
      status === "published" 
        ? "bg-emerald-500/20 text-emerald-400" 
        : "bg-yellow-500/20 text-yellow-400"
    }`}>
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: projects, isLoading, refetch } = useQuery({
    queryKey: ["projects", "admin", page, limit, debouncedSearch],
    queryFn: () => ProjectService.getAll(true, { page, limit, search: debouncedSearch || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete project");
    }
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => ProjectService.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project published successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to publish project");
    }
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) => ProjectService.unpublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project unpublished");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unpublish project");
    }
  });

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    const timeout = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  const handlePaginationChange = useCallback((newPage: number, newLimit: number) => {
    setPage(newPage);
    setLimit(newLimit);
  }, []);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const columns: ColumnDef<ProjectRow>[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <div className="w-16 h-10 bg-primary/20 overflow-hidden rounded-sm">
          {row.original.image && (
            <img 
              src={row.original.image} 
              alt="" 
              className="w-full h-full object-cover" 
            />
          )}
        </div>
      ),
    },
    {
      accessorKey: "title.en",
      header: ({ column }) => <SortableHeader column={column}>Title</SortableHeader>,
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title?.en || "Untitled"}</p>
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
      cell: ({ row }) => row.original.featured ? <FeaturedBadge /> : null,
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
                if (window.confirm(`Publish "${row.original.title?.en}"? It will be visible on the live site.`)) {
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
                if (window.confirm(`Unpublish "${row.original.title?.en}"? It will be hidden from the live site.`)) {
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
            onClick={() => handleDelete(row.original._id, row.original.title?.en || "this project")}
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
  const meta = projects?.meta;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <Link href="/admin" className="flex items-center space-x-2 text-accent group mb-4">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="pixel-text text-[10px] uppercase">Dashboard</span>
          </Link>
          <h1 className="text-xl font-display font-bold uppercase tracking-tight">Project Vault</h1>
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
        meta={meta}
        onPaginationChange={handlePaginationChange}
        pageSize={limit}
        isLoading={isLoading}
        searchPlaceholder="Search projects..."
        onSearchChange={handleSearch}
        searchValue={search}
      />
    </div>
  );
}