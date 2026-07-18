"use client";

import React from "react";
import Link from "next/link";
import { Plus, FolderOpen, SearchX, Filter } from "lucide-react";

interface EmptyStateProps {
  type: "no-projects" | "no-results" | "no-filtered-results";
  filterLabel?: string;
  onClearSearch?: () => void;
  onClearFilter?: () => void;
}

export default function EmptyState({
  type,
  filterLabel,
  onClearSearch,
  onClearFilter,
}: EmptyStateProps) {
  if (type === "no-projects") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center space-y-4">
        <div className="w-12 h-12 border border-primary/20 flex items-center justify-center">
          <FolderOpen size={20} className="text-foreground/30" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-foreground/60">
            No projects yet. Create your first project to get started.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-background text-xs font-medium uppercase tracking-tight hover:bg-accent/90 transition-colors"
        >
          <Plus size={14} />
          <span>New Project</span>
        </Link>
      </div>
    );
  }

  if (type === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center space-y-4">
        <div className="w-12 h-12 border border-primary/20 flex items-center justify-center">
          <SearchX size={20} className="text-foreground/30" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-foreground/60">
            No projects match your search. Try a different term.
          </p>
        </div>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 text-foreground/50 text-xs font-medium uppercase tracking-tight hover:border-primary/40 hover:text-foreground/70 transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center space-y-4">
      <div className="w-12 h-12 border border-primary/20 flex items-center justify-center">
        <Filter size={20} className="text-foreground/30" />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-foreground/60">
          No {filterLabel?.toLowerCase()} projects found.
        </p>
      </div>
      {onClearFilter && (
        <button
          onClick={onClearFilter}
          className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 text-foreground/50 text-xs font-medium uppercase tracking-tight hover:border-primary/40 hover:text-foreground/70 transition-colors"
        >
          Show All Projects
        </button>
      )}
    </div>
  );
}
