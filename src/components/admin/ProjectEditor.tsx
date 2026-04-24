"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Loader2, Save, Plus, X, Clock } from "lucide-react";
import { toast } from "sonner";
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

// ============================================================================
// HELPER: Get nested validation error message
// ============================================================================

function getFieldError(errors: FieldErrors<FormData>, path: string): string | undefined {
  const parts = path.split(".");
  let current: any = errors;
  for (const part of parts) {
    if (current === undefined) return undefined;
    current = current[part];
  }
  return current?.message as string | undefined;
}

// ============================================================================
// COMPONENT: ProjectEditor
// ============================================================================

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

  // ============================================================================
  // FIELD ARRAYS - Sections (useFieldArray)
  // ============================================================================

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control,
    name: "sections",
  });

  // ============================================================================
  // WATCHED VALUES
  // ============================================================================

  const watchedTitleEn = watch("title.en");
  const watchedSlug = watch("slug");
  const watchedGallery = watch("gallery") || [];

  // ============================================================================
  // INITIAL DATA LOAD
  // ============================================================================

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || { en: "", ar: "" },
        slug: initialData.slug || "",
        shortDescription: initialData.shortDescription || { en: "", ar: "" },
        fullDescription: initialData.fullDescription || { en: "", ar: "" },
        category: initialData.category,
        image: initialData.image || "",
        video: initialData.video || "",
        problem: initialData.problem || { en: "", ar: "" },
        strategy: initialData.strategy || { en: "", ar: "" },
        solution: initialData.solution || { en: "", ar: "" },
        execution: initialData.execution || { en: "", ar: "" },
        results: initialData.results || { en: "", ar: "" },
        featured: initialData.featured || false,
        status: initialData.status || "draft",
        displayOrder: initialData.displayOrder || 0,
        year: initialData.year || new Date().getFullYear().toString(),
        clientName: initialData.clientName || "",
        seo: { title: "", description: "", keywords: [] },
        gallery: initialData.gallery || [],
        tags: initialData.tags || [],
        sections: initialData.sections || [],
      });
    }
  }, [initialData, reset]);

  // ============================================================================
  // SLUG BEHAVIOR
  // ============================================================================

  useEffect(() => {
    if (!isEditMode && watchedTitleEn && !watchedSlug) {
      const newSlug = generateSlugFromTitle(watchedTitleEn);
      setValue("slug", newSlug);
    }
  }, [watchedTitleEn, isEditMode, watchedSlug, setValue]);

  // ============================================================================
  // SUBMIT HANDLER
  // ============================================================================

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

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-8">
      {/* Sticky Action Bar */}
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
              Title EN <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title.en")}
              className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
              placeholder="Project title (English)"
            />
            {getFieldError(errors, "title.en") && (
              <p className="text-[10px] text-red-500 mt-1">{getFieldError(errors, "title.en")}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
              Title AR
            </label>
            <input
              {...register("title.ar")}
              className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
              placeholder="العنوان بالعربية"
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* ============================================================================
        SECTION: Descriptions
      ============================================================================ */}
      <div className="space-y-6 p-6 bg-primary/5 border border-primary/10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-accent">Descriptions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
              Short Description EN
            </label>
            <textarea
              {...register("shortDescription.en")}
              rows={3}
              className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors resize-none"
            />
            {getFieldError(errors, "shortDescription.en") && (
              <p className="text-[10px] text-red-500 mt-1">{getFieldError(errors, "shortDescription.en")}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
              Short Description AR
            </label>
            <textarea
              {...register("shortDescription.ar")}
              rows={3}
              className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors resize-none"
              dir="rtl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
              Full Description EN
            </label>
            <textarea
              {...register("fullDescription.en")}
              rows={6}
              className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
              Full Description AR
            </label>
            <textarea
              {...register("fullDescription.ar")}
              rows={6}
              className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors resize-none"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* ============================================================================
        SECTION: Tags (simple comma-separated)
      ============================================================================ */}
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
        <p className="text-[10px] text-foreground/40">Separate multiple tags with commas</p>
      </div>

      {/* ============================================================================
        SECTION: Sections (useFieldArray)
      ============================================================================ */}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  {...register(`sections.${sIndex}.title.en` as const)}
                  placeholder="Section title (EN)"
                  className="w-full bg-background/50 border border-primary/20 p-2 text-sm"
                />
                {getFieldError(errors, `sections.${sIndex}.title.en`) && (
                  <p className="text-[10px] text-red-500">{getFieldError(errors, `sections.${sIndex}.title.en`)}</p>
                )}
              </div>
              <div>
                <input
                  {...register(`sections.${sIndex}.title.ar` as const)}
                  placeholder="العنوان"
                  className="w-full bg-background/50 border border-primary/20 p-2 text-sm"
                  dir="rtl"
                />
              </div>
            </div>

            <textarea
              {...register(`sections.${sIndex}.content.en` as const)}
              placeholder="Section content (EN)"
              rows={3}
              className="w-full bg-background/50 border border-primary/20 p-2 text-sm resize-none"
            />

            <textarea
              {...register(`sections.${sIndex}.content.ar` as const)}
              placeholder="المحتوى"
              rows={3}
              className="w-full bg-background/50 border border-primary/20 p-2 text-sm resize-none"
              dir="rtl"
            />
          </div>
        ))}
      </div>

      {/* ============================================================================
        SECTION: Gallery (comma-separated URL input)
      ============================================================================ */}
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
                {(field.value || []).map((url, index) => (
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

      {/* ============================================================================
        SECTION: Meta Fields
      ============================================================================ */}
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

      {/* ============================================================================
        SUBMIT BUTTON
      ============================================================================ */}
      {/* Moved to sticky header above */}
    </div>
  );
}