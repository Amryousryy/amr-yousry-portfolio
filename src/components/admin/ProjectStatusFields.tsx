"use client";

import { UseFormRegister } from "react-hook-form";
import Link from "next/link";
import { ProjectCreateInput } from "@/lib/validation";
import FormSection from "@/components/admin/FormSection";
import FormField from "@/components/admin/FormField";

type FormData = ProjectCreateInput;

interface ProjectStatusFieldsProps {
  register: UseFormRegister<FormData>;
  featured: boolean;
  status: string;
}

export default function ProjectStatusFields({ register, featured, status }: ProjectStatusFieldsProps) {
  const isDraft = status !== "published";
  const showDraftFeaturedWarning = featured && isDraft;

  return (
    <FormSection title="Publishing & Homepage" description="Control whether this project is publicly visible and whether it appears on the homepage." accent>
      {showDraftFeaturedWarning && (
        <div className="p-3 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 text-[var(--color-warning)]/90 text-[11px] font-medium">
          Featured draft projects will not appear on the homepage until published.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
        <FormField label="Homepage Visibility" description="Ordering is managed with drag-and-drop on the Homepage screen.">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" {...register("featured")} className="w-4 h-4 accent-accent" />
            <span className="text-sm text-foreground/70">Show on homepage</span>
          </label>
          <Link
            href="/admin/homepage"
            className="mt-2 inline-block text-[10px] font-bold uppercase tracking-widest text-accent hover:underline"
          >
            Manage homepage →
          </Link>
        </FormField>

        <FormField label="Status" description="Publish / unpublish from the action bar above.">
          <div
            className={`flex items-center gap-2 px-3 py-2.5 border text-[11px] font-bold uppercase tracking-widest ${
              isDraft
                ? "border-primary/20 text-foreground/60 bg-primary/10"
                : "border-emerald-400/30 text-emerald-300 bg-emerald-400/10"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isDraft ? "bg-foreground/40" : "bg-emerald-400"}`} />
            {isDraft ? "Draft" : "Published"}
          </div>
        </FormField>
      </div>
    </FormSection>
  );
}