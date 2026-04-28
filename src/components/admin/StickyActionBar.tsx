"use client";

import React from "react";
import { Loader2, Save } from "lucide-react";

interface StickyActionBarProps {
  isSubmitting: boolean;
  isPending?: boolean;
  onSubmit: () => void;
  submitLabel?: string;
  secondaryActions?: React.ReactNode;
  className?: string;
  lastSaved?: string | null;
}

export function StickyActionBar({
  isSubmitting,
  isPending,
  onSubmit,
  submitLabel = "Save Changes",
  secondaryActions,
  className = "",
  lastSaved,
}: StickyActionBarProps) {
  const isLoading = isSubmitting || isPending;

  return (
    <div
      className={`sticky bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-primary/20 p-4 ${className}`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-xs text-foreground/40">
          {lastSaved && <span>Last saved: {lastSaved}</span>}
        </div>
        
        <div className="flex items-center gap-4">
          {secondaryActions}
          
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="flex items-center space-x-3 px-8 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            <span>{isLoading ? "Saving..." : submitLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}