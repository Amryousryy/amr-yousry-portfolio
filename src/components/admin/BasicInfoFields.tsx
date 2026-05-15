"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProjectCreateInput } from "@/lib/validation";

type FormData = ProjectCreateInput;

const CATEGORY_SUGGESTIONS = ["Real Estate", "UGC / Ads", "Social Media", "Corporate", "Brand Film"];

interface BasicInfoFieldsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

function getFieldError(errors: FieldErrors<FormData>, path: string): string | undefined {
  const parts = path.split(".");
  let current: any = errors;
  for (const part of parts) {
    if (current === undefined) return undefined;
    current = current[part];
  }
  return current?.message as string | undefined;
}

export default function BasicInfoFields({ register, errors }: BasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-display font-bold uppercase tracking-wider text-accent border-b border-primary/10 pb-2">Basic Information</h2>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title")}
          className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
          placeholder="Project title"
        />
        {getFieldError(errors, "title") && (
          <p className="text-[10px] text-red-500 mt-1">{getFieldError(errors, "title")}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            {...register("slug")}
            className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
            placeholder="project-slug"
          />
          {getFieldError(errors, "slug") && (
            <p className="text-[10px] text-red-500 mt-1">{getFieldError(errors, "slug")}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">Client Name</label>
          <input
            {...register("clientName")}
            className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
            placeholder="Client Name"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">Year</label>
          <input
            {...register("year")}
            className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
            placeholder="2024"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            list="category-suggestions"
            {...register("category")}
            className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
            placeholder="Select or type a category"
          />
          <datalist id="category-suggestions">
            {CATEGORY_SUGGESTIONS.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
          {getFieldError(errors, "category") && (
            <p className="text-[10px] text-red-500 mt-1">{getFieldError(errors, "category")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
