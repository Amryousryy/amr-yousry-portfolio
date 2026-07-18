"use client";

import { UseFormRegister } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { ProjectCreateInput, createEmptyProjectSection } from "@/lib/validation";
import FormSection from "@/components/admin/FormSection";
import FormField, { FormTextarea, FormInput } from "@/components/admin/FormField";

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
    <FormSection title="Case Study Story" description="Describe the project narrative — the challenge, approach, and outcome.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Problem">
          <FormTextarea {...register("problem")} rows={3} placeholder="What challenge did the client face?" />
        </FormField>
        <FormField label="Strategy / Idea">
          <FormTextarea {...register("strategy")} rows={3} placeholder="What was the strategic approach?" />
        </FormField>
        <FormField label="Solution">
          <FormTextarea {...register("solution")} rows={3} placeholder="What solution was delivered?" />
        </FormField>
        <FormField label="Execution">
          <FormTextarea {...register("execution")} rows={3} placeholder="How was it executed?" />
        </FormField>
      </div>

      <FormField label="Results">
        <FormTextarea {...register("results")} rows={3} placeholder="What were the outcomes?" />
      </FormField>

      <div className="space-y-3 p-4 bg-primary/[0.04] border border-primary/10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-foreground/60">Detailed Results</span>
          <button
            type="button"
            onClick={() => appendDetail({ label: "", value: "" })}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent text-[11px] font-medium hover:bg-accent/20 transition-colors"
          >
            <Plus size={12} /> Add Result
          </button>
        </div>
        <p className="text-[10px] text-foreground/35">Key result pairs shown on the public case study page.</p>

        {detailFields.map((field, dIndex) => (
          <div key={field.id} className="flex items-start gap-2 p-3 bg-background/50 border border-primary/10">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <FormInput
                {...register(`detailedResults.${dIndex}.label` as const)}
                placeholder="Label (e.g. Client Approval)"
              />
              <FormInput
                {...register(`detailedResults.${dIndex}.value` as const)}
                placeholder="Value (e.g. 98%)"
              />
            </div>
            <button type="button" onClick={() => removeDetail(dIndex)} className="mt-2 text-foreground/30 hover:text-[var(--color-danger-light)] transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
        {detailFields.length === 0 && (
          <p className="text-[10px] text-foreground/25 italic">No detailed results added yet.</p>
        )}
      </div>

      <div className="space-y-3 p-4 bg-primary/[0.04] border border-primary/10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-foreground/60">Sections</span>
          <button
            type="button"
            onClick={() => appendSection(createEmptyProjectSection())}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent text-[11px] font-medium hover:bg-accent/20 transition-colors"
          >
            <Plus size={12} /> Add Section
          </button>
        </div>

        {sectionFields.map((section, sIndex) => (
          <div key={section.id} className="border border-primary/10 p-4 space-y-3 bg-background/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-foreground/50">Section {sIndex + 1}</span>
              <button type="button" onClick={() => removeSection(sIndex)} className="text-foreground/30 hover:text-[var(--color-danger-light)] transition-colors">
                <X size={14} />
              </button>
            </div>
            <FormInput
              {...register(`sections.${sIndex}.title` as const)}
              placeholder="Section title"
            />
            <FormTextarea
              {...register(`sections.${sIndex}.content` as const)}
              placeholder="Section content"
              rows={3}
            />
          </div>
        ))}
        {sectionFields.length === 0 && (
          <p className="text-[10px] text-foreground/25 italic">No sections added yet.</p>
        )}
      </div>
    </FormSection>
  );
}
