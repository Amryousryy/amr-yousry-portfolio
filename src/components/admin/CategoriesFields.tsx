"use client";

import { Control, Controller } from "react-hook-form";
import { ProjectCreateInput } from "@/lib/validation";

type FormData = ProjectCreateInput;

const PROJECT_CATEGORIES = [
  { value: "filmmaking", label: "Filmmaking" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "motion-graphic", label: "Motion Graphic" },
  { value: "video-editing", label: "Video Editing" },
  { value: "ai", label: "AI" },
] as const;

interface CategoriesFieldsProps {
  control: Control<FormData>;
}

export default function CategoriesFields({ control }: CategoriesFieldsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-display font-bold uppercase tracking-wider text-accent border-b border-primary/10 pb-2">Categories &amp; Filters</h2>
      <p className="text-[10px] text-foreground/40">These control which filter groups the project appears under on the public /projects page.</p>
      <div className="space-y-3 p-6 bg-primary/5 border border-primary/10">
        <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">
          Project Categories
        </label>
        <p className="text-[10px] text-foreground/40">
          Select one or more categories.
        </p>
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-4">
              {PROJECT_CATEGORIES.map((cat) => {
                const checked = (field.value || []).includes(cat.value);
                return (
                  <label
                    key={cat.value}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const current = field.value || [];
                        const updated = checked
                          ? current.filter((v) => v !== cat.value)
                          : [...current, cat.value];
                        field.onChange(updated);
                      }}
                      className="w-4 h-4 accent-accent"
                    />
                    <span
                      className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                        checked
                          ? "text-accent"
                          : "text-foreground/60 group-hover:text-foreground/80"
                      }`}
                    >
                      {cat.label}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        />
      </div>
    </div>
  );
}
