"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { ProjectService } from "@/lib/api-client";
import { buildQuickProjectShell } from "@/lib/projects/quick-create";
import { generateSlugFromTitle } from "@/lib/validation";
import FormField, { FormInput, FormSelect } from "@/components/admin/FormField";

const CATEGORY_SUGGESTIONS = ["Real Estate", "UGC / Ads", "Social Media", "Corporate", "Brand Film"];

interface QuickCreateProjectProps {
  onClose: () => void;
  onCreated: (id: string) => void;
}

export default function QuickCreateProject({ onClose, onCreated }: QuickCreateProjectProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [clientName, setClientName] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const canSubmit = title.trim().length > 0 && !isCreating;

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) {
      setSlug(generateSlugFromTitle(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    try {
      setIsCreating(true);
      const shell = buildQuickProjectShell({ title, slug, clientName, category, year, status });
      const project = await ProjectService.create(shell);
      onCreated(project._id);
    } catch (err) {
      setError((err as Error).message || "Failed to create project");
      setIsCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Quick create project"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-background border border-primary/25 shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_16px_48px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-primary/15 px-5 py-4">
          <h2 className="font-pixel text-[11px] uppercase tracking-widest">Quick Add Project</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quick add"
            className="p-1.5 text-foreground/40 hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <FormField label="Title" required>
            <FormInput
              autoFocus
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Project title"
              aria-label="Project title"
            />
          </FormField>

          <FormField label="Slug" description="Auto-filled from the title. Edit to override.">
            <FormInput
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="project-slug"
              aria-label="Project slug"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Client Name">
              <FormInput
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client"
                aria-label="Client name"
              />
            </FormField>

            <FormField label="Year">
              <FormInput
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder={String(new Date().getFullYear())}
                aria-label="Year"
              />
            </FormField>

            <FormField label="Category">
              <FormInput
                list="quick-create-category-suggestions"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Select or type"
                aria-label="Category"
              />
              <datalist id="quick-create-category-suggestions">
                {CATEGORY_SUGGESTIONS.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </FormField>

            <FormField label="Status" description="Published will apply the publish-readiness gate.">
              <FormSelect
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                aria-label="Status"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </FormSelect>
            </FormField>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-[11px]">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-primary/20 text-[11px] font-bold uppercase tracking-widest text-foreground/60 hover:text-foreground hover:border-primary/40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center gap-2 px-5 py-2 bg-accent text-on-accent text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isCreating && <Loader2 className="animate-spin" size={13} />}
              {isCreating ? "Creating…" : "Create Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}