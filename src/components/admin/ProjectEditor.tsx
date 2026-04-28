"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Loader2, Save, Plus, X, Clock } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Project } from "@/types";
import { 
  projectCreateSchema, 
  projectUpdateSchema, 
  ProjectCreateInput,
  projectDefaultValues,
  generateSlugFromTitle,
  createEmptyProjectSection,
} from "@/lib/validation";
import { mediaConfig } from "@/lib/media/config";
import { useUnsavedChanges } from "@/lib/hooks";
import { ErrorSummary, scrollToFirstError } from "@/components/admin/ErrorSummary";

const categories = ["Real Estate", "UGC / Ads", "Social Media", "Corporate", "Brand Film"];

interface ProjectEditorProps {
  initialData?: Project;
  onSave: (data: Partial<ProjectCreateInput>, options?: { isAutoSave?: boolean }) => void;
  onSaveSuccess?: () => void;
  isSaving: boolean;
}

type FormData = ProjectCreateInput;

function getFieldError(errors: FieldErrors<FormData>, path: string): string | undefined {
  const parts = path.split(".");
  let current: any = errors;
  for (const part of parts) {
    if (current === undefined) return undefined;
    current = current[part];
  }
  return current?.message as string | undefined;
}

export default function ProjectEditor({ initialData, onSave, onSaveSuccess, isSaving }: ProjectEditorProps) {
  const isEditMode = !!initialData?._id;
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(isEditMode ? projectUpdateSchema : projectCreateSchema),
    defaultValues: projectDefaultValues,
  });

  const { setSubmitting: setUnsavedSubmitting, markAsSaved } = useUnsavedChanges<FormData>({
    watch,
    reset,
    defaultValues: projectDefaultValues,
    enabled: true,
  });

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control,
    name: "sections",
  });

  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");
  const watchedGallery = watch("gallery") || [];

  useEffect(() => {
    if (initialData) {
      const getString = (val: string | { en: string; ar: string } | undefined): string => {
        if (!val) return "";
        if (typeof val === "string") return val;
        return val.en || "";
      };
      reset({
        title: getString(initialData.title),
        slug: initialData.slug || "",
        shortDescription: getString(initialData.shortDescription),
        fullDescription: getString(initialData.fullDescription),
        category: initialData.category,
        image: initialData.image || "",
        video: initialData.video || "",
        problem: getString(initialData.problem),
        strategy: getString(initialData.strategy),
        solution: getString(initialData.solution),
        execution: getString(initialData.execution),
        results: getString(initialData.results),
        featured: initialData.featured || false,
        status: initialData.status || "draft",
        displayOrder: initialData.displayOrder || 0,
        year: initialData.year || new Date().getFullYear().toString(),
        clientName: initialData.clientName || "",
        seo: { title: "", description: "", keywords: [] },
        gallery: initialData.gallery || [],
        tags: initialData.tags || [],
        sections: initialData.sections?.map(s => ({
          ...s,
          title: typeof s.title === "string" ? s.title : (s.title as any)?.en || "",
          content: typeof s.content === "string" ? s.content : (s.content as any)?.en || ""
        })) || [],
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (!isEditMode && watchedTitle && !watchedSlug) {
      const newSlug = generateSlugFromTitle(watchedTitle);
      setValue("slug", newSlug);
    }
  }, [watchedTitle, isEditMode, watchedSlug, setValue]);

  const onSubmit = (data: FormData) => {
    setUnsavedSubmitting(true);
    onSave(data);
    setLastSaved(new Date().toLocaleTimeString());
    if (!isEditMode && onSaveSuccess) {
      onSaveSuccess();
    }
  };

  const handleSubmitClick = () => {
    setSubmitAttempted(true);
    handleSubmit(onSubmit)();
    if (Object.keys(errors).length > 0) {
      scrollToFirstError(errors as unknown as Record<string, unknown>);
    }
  };

  return (
    <div className="space-y-8">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-primary/20 p-4 -mx-6 px-6 -mt-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {lastSaved && (
              <span className="text-xs text-foreground/40 flex items-center gap-1">
                <Clock size={12} />
                Saved at {lastSaved}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleSubmitClick}
            disabled={isSaving || isSubmitting}
            className="flex items-center space-x-3 px-8 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-transform disabled:opacity-50"
          >
            {isSaving || isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>{isSaving || isSubmitting ? "Saving..." : "Save Project"}</span>
          </button>
        </div>
      </div>

      {submitAttempted && Object.keys(errors).length > 0 && (
        <ErrorSummary errors={errors as unknown as Record<string, unknown>} />
      )}

      <div className="space-y-8">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("category")}
              className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors appearance-none"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {getFieldError(errors, "category") && (
              <p className="text-[10px] text-red-500 mt-1">{getFieldError(errors, "category")}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
              Display Order
            </label>
            <input
              type="number"
              {...register("displayOrder", { valueAsNumber: true })}
              className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("featured")} className="w-4 h-4 accent-accent" />
            <span className="text-xs font-bold uppercase">Featured</span>
          </label>

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select {...field} className="bg-primary/5 border border-primary/20 p-2 text-xs font-bold">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            )}
          />
        </div>

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
              Strategy
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

        <div className="space-y-4 p-6 bg-primary/5 border border-primary/10">
          <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">
            Gallery
          </label>

          <Controller
            name="gallery"
            control={control}
            render={({ field }) => (
              <>
                <div className="grid grid-cols-4 gap-4">
                  {(field.value || []).map((url: string, index: number) => (
                    <div key={index} className="relative aspect-video bg-primary/5">
                      {url && <Image src={url} alt="" fill className="object-cover" />}
                      <button
                        type="button"
                        onClick={() => {
                          const newGallery = [...field.value];
                          newGallery.splice(index, 1);
                          field.onChange(newGallery);
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <CldUploadWidget
                  uploadPreset={mediaConfig.uploadPreset}
                  onSuccess={(result: any) => {
                    field.onChange([...(field.value || []), result.secure_url]);
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="px-4 py-2 bg-accent/10 text-accent text-xs font-bold uppercase"
                    >
                      <Upload size={14} className="inline mr-2" /> Add Image
                    </button>
                  )}
                </CldUploadWidget>
              </>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-primary/5 border border-primary/10">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">Year</label>
            <input
              {...register("year")}
              className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
              placeholder="2024"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">Client Name</label>
            <input
              {...register("clientName")}
              className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
              placeholder="Client Name"
            />
          </div>
        </div>
      </div>
    </div>
  );
}