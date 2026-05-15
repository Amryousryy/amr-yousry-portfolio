"use client";

import { UseFormRegister } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { ProjectCreateInput, createEmptyProjectSection } from "@/lib/validation";

type FormData = ProjectCreateInput;

interface CaseStudyFieldsProps {
  register: UseFormRegister<FormData>;
  detailFields: Array<{ id: string }>;
  appendDetail: (value: { label: string; value: string }) => void;
  removeDetail: (index: number) => void;
  sectionFields: Array<{ id: string }>;
  appendSection: (value: {
    id: string;
    title: string;
    content: string;
    media: { type: "image" | "video"; url: string }[];
  }) => void;
  removeSection: (index: number) => void;
}

export default function CaseStudyFields({
  register,
  detailFields,
  appendDetail,
  removeDetail,
  sectionFields,
  appendSection,
  removeSection,
}: CaseStudyFieldsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-display font-bold uppercase tracking-wider text-accent border-b border-primary/10 pb-2">Case Study Story</h2>
      <p className="text-[10px] text-foreground/40">Describe the project narrative — the challenge, approach, and outcome.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
            Problem
          </label>
          <textarea
            {...register("problem")}
            rows={3}
            className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
            Strategy / Idea
          </label>
          <textarea
            {...register("strategy")}
            rows={3}
            className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
            Solution
          </label>
          <textarea
            {...register("solution")}
            rows={3}
            className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
            Execution
          </label>
          <textarea
            {...register("execution")}
            rows={3}
            className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors resize-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
          Results
        </label>
        <textarea
          {...register("results")}
          rows={3}
          className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors resize-none"
        />
      </div>

      <div className="space-y-4 p-6 bg-primary/5 border border-primary/10">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">
            Detailed Results
          </label>
          <button
            type="button"
            onClick={() => appendDetail({ label: "", value: "" })}
            className="flex items-center gap-1 px-3 py-1 bg-accent text-background text-xs font-bold uppercase"
          >
            <Plus size={14} /> Add Result
          </button>
        </div>
        <p className="text-[10px] text-foreground/40">Add key result pairs shown on the public case study page.</p>

        {detailFields.map((field, dIndex) => (
          <div key={field.id} className="flex items-start gap-3 p-3 border border-primary/10">
            <div className="flex-1 space-y-2">
              <input
                {...register(`detailedResults.${dIndex}.label` as const)}
                placeholder="Label (e.g. Client Approval)"
                className="w-full bg-background/50 border border-primary/20 p-2 text-sm outline-none focus:border-accent transition-colors"
              />
              <input
                {...register(`detailedResults.${dIndex}.value` as const)}
                placeholder="Value (e.g. 98%)"
                className="w-full bg-background/50 border border-primary/20 p-2 text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
            <button type="button" onClick={() => removeDetail(dIndex)} className="mt-1 text-red-500">
              <X size={16} />
            </button>
          </div>
        ))}
        {detailFields.length === 0 && (
          <p className="text-[10px] text-foreground/30 italic">No detailed results added yet.</p>
        )}
      </div>

      <div className="space-y-4 p-6 bg-primary/5 border border-primary/10">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">
            Sections
          </label>
          <button
            type="button"
            onClick={() => appendSection(createEmptyProjectSection())}
            className="flex items-center gap-1 px-3 py-1 bg-accent text-background text-xs font-bold uppercase"
          >
            <Plus size={14} /> Add Section
          </button>
        </div>

        {sectionFields.map((section, sIndex) => (
          <div key={section.id} className="border border-primary/20 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase">Section {sIndex + 1}</span>
              <button type="button" onClick={() => removeSection(sIndex)} className="text-red-500">
                <X size={14} />
              </button>
            </div>

            <div>
              <input
                {...register(`sections.${sIndex}.title` as const)}
                placeholder="Section title"
                className="w-full bg-background/50 border border-primary/20 p-2 text-sm"
              />
            </div>

            <textarea
              {...register(`sections.${sIndex}.content` as const)}
              placeholder="Section content"
              rows={3}
              className="w-full bg-background/50 border border-primary/20 p-2 text-sm resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
