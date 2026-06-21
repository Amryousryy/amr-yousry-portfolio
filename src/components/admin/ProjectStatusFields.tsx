"use client";

import { UseFormRegister, Control, Controller } from "react-hook-form";
import { ProjectCreateInput } from "@/lib/validation";

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
    <div className="space-y-4">
      {showDraftFeaturedWarning && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] uppercase font-bold tracking-widest">
            Warning: Featured draft projects will not appear on the homepage until published.
        </div>
      )}
      <h2 className="text-sm font-display font-bold uppercase tracking-wider text-accent border-b border-primary/10 pb-2">Publishing &amp; Homepage</h2>
      <p className="text-xs text-foreground/40">
        Control where this project appears and whether it is publicly visible.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Featured */}
        <div className="border border-primary/10 p-4 bg-primary/5 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register("featured")} className="w-4 h-4 accent-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/70">
              Featured
            </span>
          </label>
          <p className="text-[10px] text-foreground/40 leading-relaxed">
            Show on homepage selected works.
          </p>
        </div>

        {/* Featured Order */}
        <div className="border border-primary/10 p-4 bg-primary/5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">
            Featured Order
          </label>
          <input
            type="number"
            {...register("featuredOrder", { valueAsNumber: true })}
            disabled={!featured}
            className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            placeholder="0"
          />
          <p className="text-[10px] text-foreground/40 leading-relaxed">
            {featured
              ? "Lower = first on homepage."
              : "Enable Featured to use homepage order."}
          </p>
        </div>

        {/* Status */}
        <div className="border border-primary/10 p-4 bg-primary/5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">
            Status
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors appearance-none text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            )}
          />
          <p className="text-[10px] text-foreground/40 leading-relaxed">
            Controls public visibility.
          </p>
        </div>

        {/* Display Order */}
        <div className="border border-primary/10 p-4 bg-primary/5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">
            Display Order
          </label>
          <input
            type="number"
            {...register("displayOrder", { valueAsNumber: true })}
            className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
            placeholder="0"
          />
          <p className="text-[10px] text-foreground/40 leading-relaxed">
            Sorting order within lists.
          </p>
        </div>
      </div>
    </div>
  );
}
