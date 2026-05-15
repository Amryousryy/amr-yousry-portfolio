"use client";

import { Loader2, Save, Clock } from "lucide-react";

interface ProjectFormActionsProps {
  isSaving: boolean;
  isSubmitting: boolean;
  lastSaved: string | null | undefined;
  onSave: () => void;
}

export default function ProjectFormActions({ isSaving, isSubmitting, lastSaved, onSave }: ProjectFormActionsProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-primary/20 p-4 -mx-6 px-6 -mt-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-xs text-foreground/40 flex items-center gap-1">
              <Clock size={12} />
              Saved at {lastSaved}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || isSubmitting}
          className="flex items-center space-x-3 px-8 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-transform disabled:opacity-50"
        >
          {isSaving || isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          <span>{isSaving || isSubmitting ? "Saving..." : "Save Project"}</span>
        </button>
      </div>
    </div>
  );
}
