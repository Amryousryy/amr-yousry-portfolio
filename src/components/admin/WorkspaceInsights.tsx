"use client";

import React from "react";
import { FolderKanban, Globe, FileEdit, Star, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightCard {
  label: string;
  count: number;
  filterValue: string;
  icon: React.ReactNode;
  color: string;
}

interface WorkspaceInsightsProps {
  total: number;
  published: number;
  drafts: number;
  featured: number;
  archived: number;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function WorkspaceInsights({
  total,
  published,
  drafts,
  featured,
  archived,
  activeFilter,
  onFilterChange,
}: WorkspaceInsightsProps) {
  const insights: InsightCard[] = [
    {
      label: "Total",
      count: total,
      filterValue: "",
      icon: <FolderKanban size={14} />,
      color: "text-accent",
    },
    {
      label: "Published",
      count: published,
      filterValue: "published",
      icon: <Globe size={14} />,
      color: "text-[var(--color-success)]",
    },
    {
      label: "Drafts",
      count: drafts,
      filterValue: "draft",
      icon: <FileEdit size={14} />,
      color: "text-[var(--color-warning)]",
    },
    {
      label: "Featured",
      count: featured,
      filterValue: "featured",
      icon: <Star size={14} />,
      color: "text-amber-400",
    },
    {
      label: "Archived",
      count: archived,
      filterValue: "archived",
      icon: <Archive size={14} />,
      color: "text-foreground/40",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {insights.map((insight) => {
        const isActive = activeFilter === insight.filterValue;
        return (
          <button
            key={insight.label}
            onClick={() => onFilterChange(insight.filterValue)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-4 border transition-all text-center",
              isActive
                ? "border-accent bg-accent/10"
                : "border-primary/10 hover:border-primary/30 hover:bg-primary/5"
            )}
          >
            <div className={cn("flex items-center gap-1.5", insight.color)}>
              {insight.icon}
              <span className="text-[9px] font-bold uppercase tracking-wider text-foreground/50">
                {insight.label}
              </span>
            </div>
            <span
              className={cn(
                "text-2xl font-display font-bold",
                isActive ? "text-accent" : "text-foreground"
              )}
            >
              {insight.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
