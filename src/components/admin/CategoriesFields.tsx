"use client";

import { Control, Controller } from "react-hook-form";
import { ProjectCreateInput } from "@/lib/validation";
import FormSection from "@/components/admin/FormSection";

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
    <FormSection title="Categories & Filters" description="Control which filter groups the project appears under on the public /projects page.">
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
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const current = field.value || [];
                      const updated = checked
                        ? current.filter((v: string) => v !== cat.value)
                        : [...current, cat.value];
                      field.onChange(updated);
                    }}
                    className="w-4 h-4 accent-accent"
                  />
                  <span
                    className={`text-xs font-medium transition-colors ${
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
    </FormSection>
  );
}
