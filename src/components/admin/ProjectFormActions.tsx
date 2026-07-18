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
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-primary/15 -mx-6 px-6 -mt-6 mb-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-[11px] text-foreground/35 flex items-center gap-1.5">
              <Clock size={11} />
              Saved at {lastSaved}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || isSubmitting}
          className="flex items-center gap-2.5 px-6 py-2.5 bg-accent text-background text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSaving || isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
          <span>{isSaving || isSubmitting ? "Saving..." : "Save Project"}</span>
        </button>
      </div>
    </div>
  );
}
