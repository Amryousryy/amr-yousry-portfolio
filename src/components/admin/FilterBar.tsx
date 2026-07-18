"use client";

import React from "react";
import { cn } from "@/lib/utils";

type FilterStatus = "" | "published" | "draft" | "featured" | "archived";

interface FilterBarProps {
  activeStatus: FilterStatus;
  activeSort: string;
  activeOrder: string;
  onStatusChange: (status: FilterStatus) => void;
  onSortChange: (sort: string, order: string) => void;
}

const STATUS_FILTERS: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Featured", value: "featured" },
  { label: "Archived", value: "archived" },
];

const SORT_OPTIONS: { label: string; sort: string; order: string }[] = [
  { label: "Newest", sort: "createdAt", order: "desc" },
  { label: "Oldest", sort: "createdAt", order: "asc" },
  { label: "Alphabetical", sort: "title", order: "asc" },
  { label: "Last Updated", sort: "updatedAt", order: "desc" },
];

const VIEW_MODES = ["Comfortable", "Compact", "Dense"] as const;

export default function FilterBar({
  activeStatus,
  activeSort,
  activeOrder,
  onStatusChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[9px] text-foreground/30 uppercase tracking-[0.2em] mr-1">
          Status
        </span>
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onStatusChange(filter.value)}
            className={cn(
              "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all",
              activeStatus === filter.value
                ? "border-accent bg-accent/10 text-accent"
                : "border-primary/10 text-foreground/40 hover:border-primary/30 hover:text-foreground/60"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-foreground/30 uppercase tracking-[0.2em]">
              Sort
            </span>
            <select
              value={`${activeSort}:${activeOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split(":");
                onSortChange(sort, order);
              }}
              className="bg-background border border-primary/20 text-xs px-3 py-1.5 text-foreground/60 outline-none focus:border-accent transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option
                  key={`${option.sort}:${option.order}`}
                  value={`${option.sort}:${option.order}`}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[9px] text-foreground/30 uppercase tracking-[0.2em] mr-1">
            View
          </span>
          {VIEW_MODES.map((mode, index) => (
            <button
              key={mode}
              disabled
              className={cn(
                "px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider border transition-all cursor-not-allowed",
                index === 0
                  ? "border-primary/20 text-foreground/30"
                  : "border-primary/10 text-foreground/15"
              )}
              title="Coming soon"
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
