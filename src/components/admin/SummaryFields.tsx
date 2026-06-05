"use client";

import { UseFormRegister, Control, Controller, FieldErrors } from "react-hook-form";
import { ProjectCreateInput } from "@/lib/validation";

type FormData = ProjectCreateInput;

interface SummaryFieldsProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}

export default function SummaryFields({ register, control }: SummaryFieldsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-display font-bold uppercase tracking-wider text-accent border-b border-primary/10 pb-2">Project Summary</h2>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
          Short Description
        </label>
        <textarea
          {...register("shortDescription")}
          rows={3}
          className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
          Full Description
        </label>
        <textarea
          {...register("fullDescription")}
          rows={6}
          className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors resize-none"
        />
      </div>

      <div className="space-y-4 p-6 bg-primary/5 border border-primary/10">
        <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">
          Tags (comma-separated)
        </label>

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              value={field.value?.join(", ") || ""}
              onChange={(e) => {
                const tags = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                field.onChange(tags);
              }}
              className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
              placeholder="tag1, tag2, tag3"
            />
          )}
        />
      </div>
    </div>
  );
}
