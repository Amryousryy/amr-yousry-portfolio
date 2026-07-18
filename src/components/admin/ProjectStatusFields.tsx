"use client";

import { UseFormRegister, Control, Controller } from "react-hook-form";
import { ProjectCreateInput } from "@/lib/validation";
import FormSection from "@/components/admin/FormSection";
import FormField, { FormInput, FormSelect } from "@/components/admin/FormField";

type FormData = ProjectCreateInput;

interface ProjectStatusFieldsProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  featured: boolean;
  status: string;
}

export default function ProjectStatusFields({ register, control, featured, status }: ProjectStatusFieldsProps) {
  const isDraft = status === "draft";
  const showDraftFeaturedWarning = featured && isDraft;

  return (
    <FormSection title="Publishing & Homepage" description="Control where this project appears and whether it is publicly visible." accent>
      {showDraftFeaturedWarning && (
        <div className="p-3 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 text-[var(--color-warning)]/90 text-[11px] font-medium">
          Featured draft projects will not appear on the homepage until published.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <FormField label="Featured">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" {...register("featured")} className="w-4 h-4 accent-accent" />
            <span className="text-sm text-foreground/70">Show on homepage</span>
          </label>
        </FormField>

        <FormField label="Featured Order" description={featured ? "Lower = first on homepage." : "Enable Featured first."}>
          <FormInput
            type="number"
            {...register("featuredOrder", { valueAsNumber: true })}
            disabled={!featured}
            placeholder="0"
            className="disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </FormField>

        <FormField label="Status" description="Controls public visibility.">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormSelect {...field}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </FormSelect>
            )}
          />
        </FormField>

        <FormField label="Display Order" description="Sorting order within lists.">
          <FormInput
            type="number"
            {...register("displayOrder", { valueAsNumber: true })}
            placeholder="0"
          />
        </FormField>
      </div>
    </FormSection>
  );
}
