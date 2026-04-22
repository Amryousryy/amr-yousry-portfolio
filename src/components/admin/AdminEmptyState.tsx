"use client";

import React from "react";
import { Plus } from "lucide-react";

interface AdminEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function AdminEmptyState({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  actionLabel = "Add New",
  actionHref
}: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 border border-dashed border-primary/20">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Plus size={32} className="text-foreground/30" />
      </div>
      <h2 className="text-xl font-display font-bold uppercase tracking-tight mb-2">{title}</h2>
      <p className="text-foreground/40 text-sm mb-6 text-center max-w-md">{description}</p>
      {actionHref && (
        <a
          href={actionHref}
          className="flex items-center space-x-2 px-6 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-all"
        >
          <Plus size={16} />
          <span>{actionLabel}</span>
        </a>
      )}
    </div>
  );
}