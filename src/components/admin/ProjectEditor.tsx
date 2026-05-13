"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Loader2, Save, Plus, X, Clock, Video, VideoOff } from "lucide-react";
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
import { mediaConfig, getMediaKind, type MediaKind } from "@/lib/media/config";
import MediaUploader from "@/components/admin/MediaUploader";
import { useUnsavedChanges } from "@/lib/hooks";
import { ErrorSummary, scrollToFirstError } from "@/components/admin/ErrorSummary";

const categories = ["Real Estate", "UGC / Ads", "Social Media", "Corporate", "Brand Film"];

const PROJECT_CATEGORIES = [
  { value: "filmmaking", label: "Filmmaking" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "motion-graphic", label: "Motion Graphic" },
  { value: "video-editing", label: "Video Editing" },
  { value: "ai", label: "AI" },
] as const;

interface ProjectEditorProps {
  initialData?: Project;
  onSave: (data: Partial<ProjectCreateInput>, options?: { isAutoSave?: boolean }) => void;
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

function VideoPreview({ src }: { src: string }) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  if (state === "error") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary/5 p-3">
        <VideoOff size={24} className="text-foreground/30" />
        <span className="text-[8px] text-foreground/40 uppercase tracking-wider text-center">
          Video preview unavailable
        </span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] text-accent hover:text-accent/80 underline"
        >
          Open video
        </a>
      </div>
    );
  }

  return (
    <>
      {state === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/5 z-10">
          <Loader2 size={20} className="animate-spin text-accent" />
        </div>
      )}
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        onError={() => setState("error")}
        onLoadedMetadata={(e) => {
          const vid = e.target as HTMLVideoElement;
          setState(!vid.duration || isNaN(vid.duration) ? "error" : "loaded");
        }}
        onCanPlay={() => setState("loaded")}
      />
    </>
  );
}

export default function ProjectEditor({ initialData, onSave, isSaving }: ProjectEditorProps) {
  const isEditMode = !!initialData?._id;
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [enableVideo, setEnableVideo] = useState(false);
  
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

  const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({
    control,
    name: "detailedResults",
  });

  const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
    control,
    name: "caseStudyMedia",
  });

  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");
  const watchedImage = watch("image");
  const watchedGallery = watch("gallery") || [];
  const watchedCaseStudyMedia = watch("caseStudyMedia") || [];

  useEffect(() => {
    if (initialData) {
      const getString = (val: string | { en: string; ar: string } | undefined): string => {
        if (!val) return "";
        if (typeof val === "string") return val;
        return val.en || "";
      };
      const hasVideo = !!initialData.video;
      setEnableVideo(hasVideo);
      reset({
        title: getString(initialData.title),
        slug: initialData.slug || "",
        shortDescription: getString(initialData.shortDescription),
        fullDescription: getString(initialData.fullDescription),
        category: initialData.category,
        categories: initialData.categories || [],
        image: initialData.image || "",
        video: hasVideo ? initialData.video : "",
        problem: getString(initialData.problem),
        strategy: getString(initialData.strategy),
        solution: getString(initialData.solution),
        execution: getString(initialData.execution),
        results: getString(initialData.results),
        featured: initialData.featured || false,
        featuredOrder: initialData.featuredOrder ?? 0,
        status: initialData.status || "draft",
        displayOrder: initialData.displayOrder || 0,
        year: initialData.year || new Date().getFullYear().toString(),
        clientName: initialData.clientName || "",
        seo: { title: "", description: "", keywords: [] },
        gallery: initialData.gallery || [],
        tags: initialData.tags || [],
        detailedResults: initialData.detailedResults || [],
        caseStudyMedia: initialData.caseStudyMedia || [],
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
    if (!enableVideo) {
      data.video = undefined;
    }
    onSave(data);
    setLastSaved(new Date().toLocaleTimeString());
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

      <div className="space-y-12">
        {/* Section 1: Basic Information */}
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
        </div>

        {/* Section 2: Categories & Filters */}
        <div className="space-y-4">
          <h2 className="text-sm font-display font-bold uppercase tracking-wider text-accent border-b border-primary/10 pb-2">Categories &amp; Filters</h2>
          <p className="text-[10px] text-foreground/40">These control which filter groups the project appears under on the public /projects page.</p>
          <div className="space-y-3 p-6 bg-primary/5 border border-primary/10">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">
              Project Categories
            </label>
            <p className="text-[10px] text-foreground/40">
              Select one or more categories.
            </p>
            <Controller
              name="categories"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-4">
                  {PROJECT_CATEGORIES.map((cat) => {
                    const checked = (field.value || []).includes(cat.value);
                    return (
                      <label
                        key={cat.value}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const current = field.value || [];
                            const updated = checked
                              ? current.filter((v) => v !== cat.value)
                              : [...current, cat.value];
                            field.onChange(updated);
                          }}
                          className="w-4 h-4 accent-accent"
                        />
                        <span
                          className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                            checked
                              ? "text-accent"
                              : "text-foreground/60 group-hover:text-foreground/80"
                          }`}
                        >
                          {cat.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            />
          </div>
        </div>

        {/* Section 3: Project Summary */}
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

        {/* Section 4: Case Study Story */}
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

        {/* Section 5: Media & Gallery */}
        <div className="space-y-4">
          <h2 className="text-sm font-display font-bold uppercase tracking-wider text-accent border-b border-primary/10 pb-2">Media &amp; Gallery</h2>
          <p className="text-[10px] text-foreground/40">Add project media — cover image, video, and gallery images.</p>

          <div className="space-y-6 p-6 bg-primary/5 border border-primary/10">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70">
                Main Image / Thumbnail <span className="text-red-500">*</span>
              </label>
              <MediaUploader
                value={watchedImage}
                onChange={(url) => setValue("image", url)}
                label=""
                accept="image"
                mode="both"
              />
              {getFieldError(errors, "image") && (
                <p className="text-[10px] text-red-500 mt-1">{getFieldError(errors, "image")}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableVideo}
                  onChange={(e) => {
                    setEnableVideo(e.target.checked);
                    if (!e.target.checked) {
                      setValue("video", undefined);
                    }
                  }}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-xs font-bold uppercase tracking-widest text-foreground/70">
                  Enable project video
                </span>
                {enableVideo ? <Video size={14} className="text-accent" /> : <VideoOff size={14} className="text-foreground/30" />}
              </label>
              {enableVideo && (
                <div className="mt-3 space-y-2">
                  <input
                    {...register("video")}
                    className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-[10px] text-foreground/40">YouTube, Vimeo, Cloudinary, or direct video URL.</p>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-primary/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">
                  Case Study Media
                </label>
                <button
                  type="button"
                  onClick={() => appendMedia({ type: "image", src: "", alt: "", caption: "" })}
                  className="flex items-center gap-1 px-3 py-1 bg-accent text-background text-xs font-bold uppercase"
                >
                  <Plus size={14} /> Add Media
                </button>
              </div>
              <p className="text-[10px] text-foreground/40">Add images or videos shown inside the public project case study. Use alt text and captions for clarity.</p>

              {mediaFields.map((field, mIndex) => (
                <div key={field.id} className="border border-primary/10 p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold uppercase text-foreground/50">Media {mIndex + 1}</span>
                    <button type="button" onClick={() => removeMedia(mIndex)} className="text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                  <select
                    {...register(`caseStudyMedia.${mIndex}.type` as const)}
                    className="w-full bg-background/50 border border-primary/20 p-2 text-sm outline-none focus:border-accent transition-colors"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="process">Process</option>
                    <option value="before-after">Before / After</option>
                    <option value="result">Result</option>
                  </select>
                  <div className="flex gap-2 items-start">
                    <input
                      {...register(`caseStudyMedia.${mIndex}.src` as const)}
                      placeholder="Media URL"
                      className="flex-1 bg-background/50 border border-primary/20 p-2 text-sm outline-none focus:border-accent transition-colors"
                    />
                    {mediaConfig.isUploadConfigured && (
                      <div className="flex gap-1 shrink-0">
                        <CldUploadWidget
                          uploadPreset={mediaConfig.uploadPreset}
                          onSuccess={(result: any) => {
                            const url = result.info?.secure_url || result.secure_url;
                            if (url) setValue(`caseStudyMedia.${mIndex}.src`, url);
                          }}
                        >
                          {({ open }) => (
                            <button type="button" onClick={() => open()} className="p-2 bg-accent/10 text-accent hover:bg-accent/20" title="Upload Image">
                              <Upload size={14} />
                            </button>
                          )}
                        </CldUploadWidget>
                        <CldUploadWidget
                          uploadPreset={mediaConfig.uploadPreset}
                          onSuccess={(result: any) => {
                            const url = result.info?.secure_url || result.secure_url;
                            if (url) setValue(`caseStudyMedia.${mIndex}.src`, url);
                          }}
                          options={{ resourceType: "video" }}
                        >
                          {({ open }) => (
                            <button type="button" onClick={() => open()} className="p-2 bg-accent/10 text-accent hover:bg-accent/20" title="Upload Video">
                              <Video size={14} />
                            </button>
                          )}
                        </CldUploadWidget>
                      </div>
                    )}
                  </div>
                  {(() => {
                    const src = watchedCaseStudyMedia[mIndex]?.src;
                    const itemType = watchedCaseStudyMedia[mIndex]?.type;
                    if (!src) return null;
                    const kind = getMediaKind(src);
                    return (
                      <div className="mt-2 aspect-video bg-primary/5 relative overflow-hidden">
                        {itemType === "video" && kind === "embed" ? (
                          <a href={src} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-accent/10 text-accent text-[9px] font-bold uppercase tracking-wider">
                            Open external video
                          </a>
                        ) : kind === "video" ? (
                          <VideoPreview src={src} />
                        ) : kind === "image" ? (
                          <Image src={src} alt="" fill className="object-cover" />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-[8px] text-foreground/30 p-2 break-all">{src}</span>
                        )}
                      </div>
                    );
                  })()}
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      {...register(`caseStudyMedia.${mIndex}.alt` as const)}
                      placeholder="Alt text"
                      className="w-full bg-background/50 border border-primary/20 p-2 text-sm outline-none focus:border-accent transition-colors"
                    />
                    <input
                      {...register(`caseStudyMedia.${mIndex}.caption` as const)}
                      placeholder="Caption"
                      className="w-full bg-background/50 border border-primary/20 p-2 text-sm outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              ))}
              {mediaFields.length === 0 && (
                <p className="text-[10px] text-foreground/30 italic">No case study media added yet.</p>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-primary/10">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">
                Gallery
              </label>

              <Controller
                name="gallery"
                control={control}
                render={({ field }) => (
                  <>
                    <div className="grid grid-cols-4 gap-4">
                      {(field.value || []).map((url: string, index: number) => {
                        const kind = url ? getMediaKind(url) : null;
                        return (
                          <div key={index} className="relative aspect-video bg-primary/5">
                            {kind === "video" ? (
                              <VideoPreview src={url} />
                            ) : kind === "image" ? (
                              <Image src={url} alt="" fill className="object-cover" />
                            ) : kind === "embed" ? (
                              <a href={url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-primary/10 text-accent text-[9px] font-bold uppercase tracking-wider">
                                External video
                              </a>
                            ) : url ? (
                              <span className="absolute inset-0 flex items-center justify-center text-[8px] text-foreground/30 p-2 break-all">{url}</span>
                            ) : (
                              <span className="absolute inset-0 flex items-center justify-center text-[8px] text-foreground/30">Invalid URL</span>
                            )}
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
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {mediaConfig.isUploadConfigured ? (
                        <>
                          <CldUploadWidget
                            uploadPreset={mediaConfig.uploadPreset}
                            onSuccess={(result: any) => {
                              field.onChange([...(field.value || []), result.info?.secure_url || result.secure_url]);
                            }}
                          >
                            {({ open }) => (
                              <button
                                type="button"
                                onClick={() => open()}
                                className="px-4 py-2 bg-accent/10 text-accent text-xs font-bold uppercase"
                              >
                                <Upload size={14} className="inline mr-2" /> Upload Image
                              </button>
                            )}
                          </CldUploadWidget>
                          <CldUploadWidget
                            uploadPreset={mediaConfig.uploadPreset}
                            onSuccess={(result: any) => {
                              field.onChange([...(field.value || []), result.info?.secure_url || result.secure_url]);
                            }}
                            options={{ resourceType: "video" }}
                          >
                            {({ open }) => (
                              <button
                                type="button"
                                onClick={() => open()}
                                className="px-4 py-2 bg-accent/10 text-accent text-xs font-bold uppercase"
                              >
                                <Upload size={14} className="inline mr-2" /> Upload Video
                              </button>
                            )}
                          </CldUploadWidget>
                        </>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          const url = window.prompt("Enter media URL (image or video)");
                          if (url) field.onChange([...(field.value || []), url]);
                        }}
                        className="px-4 py-2 bg-accent/10 text-accent text-xs font-bold uppercase"
                      >
                        <Upload size={14} className="inline mr-2" /> Add Media URL
                      </button>
                    </div>
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Section 6: Publishing & Homepage */}
        <div className="space-y-4">
          <h2 className="text-sm font-display font-bold uppercase tracking-wider text-accent border-b border-primary/10 pb-2">Publishing &amp; Homepage</h2>
          <p className="text-[10px] text-foreground/40">Control visibility and homepage featured placement.</p>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("featured")} className="w-4 h-4 accent-accent" />
              <span className="text-xs font-bold uppercase">Featured</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase">Featured Order</label>
              <input
                type="number"
                {...register("featuredOrder", { valueAsNumber: true })}
                className="w-16 bg-background/50 border border-primary/20 p-2 outline-none focus:border-accent transition-colors"
                placeholder="0"
              />
              <span className="text-[10px] text-foreground/40">
                (Lower = first on homepage)
              </span>
            </div>

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

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase">Display Order</label>
            <input
              type="number"
              {...register("displayOrder", { valueAsNumber: true })}
              className="w-20 bg-background/50 border border-primary/20 p-2 outline-none focus:border-accent transition-colors"
              placeholder="0"
            />
            <span className="text-[10px] text-foreground/40">
              (Sorting order within lists)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}