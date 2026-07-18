"use client";

import React from "react";
import Link from "next/link";
import { Plus, ArrowLeft, Upload, Download } from "lucide-react";

interface WorkspaceHeaderProps {
  lastUpdatedAt: string;
}

export default function WorkspaceHeader({ lastUpdatedAt }: WorkspaceHeaderProps) {
  return (
    <header className="space-y-4">
      <Link
        href="/admin"
        className="flex items-center space-x-2 text-accent group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="pixel-text text-[10px] uppercase">Dashboard</span>
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-display font-bold uppercase tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-foreground/50">
            Manage and organize your portfolio projects.
          </p>
          {lastUpdatedAt && (
            <p className="text-xs text-foreground/30 mt-1">
              Last updated: {lastUpdatedAt}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-background text-xs font-medium uppercase tracking-tight hover:bg-accent/90 transition-colors"
          >
            <Plus size={14} />
            <span>New Project</span>
          </Link>

          <div className="relative group">
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2.5 border border-primary/20 text-foreground/30 text-xs font-medium uppercase tracking-tight cursor-not-allowed"
            >
              <Upload size={14} />
              <span>Import</span>
            </button>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-foreground/30 uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Coming Soon
            </span>
          </div>

          <div className="relative group">
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2.5 border border-primary/20 text-foreground/30 text-xs font-medium uppercase tracking-tight cursor-not-allowed"
            >
              <Download size={14} />
              <span>Export</span>
            </button>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-foreground/30 uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
