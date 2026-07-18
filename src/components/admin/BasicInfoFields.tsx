"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProjectCreateInput } from "@/lib/validation";
import FormSection from "@/components/admin/FormSection";
import FormField, { FormInput } from "@/components/admin/FormField";

type FormData = ProjectCreateInput;

const CATEGORY_SUGGESTIONS = ["Real Estate", "UGC / Ads", "Social Media", "Corporate", "Brand Film"];

interface BasicInfoFieldsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

function getFieldError(errors: FieldErrors<FormData>, path: string): string | undefined {
  const parts = path.split(".");
  let current: Record<string, unknown> = errors;
  for (const part of parts) {
    if (current === undefined) return undefined;
    current = current[part] as Record<string, unknown>;
  }
  return current?.message as string | undefined;
}

export default function BasicInfoFields({ register, errors }: BasicInfoFieldsProps) {
  return (
    <FormSection title="Basic Information" accent>
      <FormField label="Title" required error={getFieldError(errors, "title")}>
        <FormInput
          {...register("title")}
          placeholder="Project title"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormField label="Slug" required error={getFieldError(errors, "slug")}>
          <FormInput
            {...register("slug")}
            placeholder="project-slug"
          />
        </FormField>

        <FormField label="Client Name">
          <FormInput
            {...register("clientName")}
            placeholder="Client Name"
          />
        </FormField>

        <FormField label="Year">
          <FormInput
            {...register("year")}
            placeholder="2024"
          />
        </FormField>

        <FormField label="Category" required error={getFieldError(errors, "category")}>
          <FormInput
            list="category-suggestions"
            {...register("category")}
            placeholder="Select or type"
          />
          <datalist id="category-suggestions">
            {CATEGORY_SUGGESTIONS.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </FormField>
      </div>
    </FormSection>
  );
}
