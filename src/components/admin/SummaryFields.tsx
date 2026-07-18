"use client";

import { UseFormRegister, Control, Controller, FieldErrors } from "react-hook-form";
import { ProjectCreateInput } from "@/lib/validation";
import FormSection from "@/components/admin/FormSection";
import FormField, { FormTextarea, FormInput } from "@/components/admin/FormField";

type FormData = ProjectCreateInput;

interface SummaryFieldsProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}

export default function SummaryFields({ register, control }: SummaryFieldsProps) {
  return (
    <FormSection title="Project Summary" description="Describe the project for public display.">
      <FormField label="Short Description">
        <FormTextarea
          {...register("shortDescription")}
          rows={3}
          placeholder="One-line project summary..."
        />
      </FormField>

      <FormField label="Full Description">
        <FormTextarea
          {...register("fullDescription")}
          rows={6}
          placeholder="Detailed project description..."
        />
      </FormField>

      <FormField label="Tags" description="Comma-separated tags for search and filtering.">
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              value={field.value?.join(", ") || ""}
              onChange={(e) => {
                const tags = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                field.onChange(tags);
              }}
              placeholder="tag1, tag2, tag3"
            />
          )}
        />
      </FormField>
    </FormSection>
  );
}
