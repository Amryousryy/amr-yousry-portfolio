"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Plus, X, Video, VideoOff, ImageIcon, Link, ChevronUp, ChevronDown } from "lucide-react";
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
import { mediaConfig, getMediaKind, isValidMediaUrl, type MediaKind } from "@/lib/media/config";
import MediaUploader from "@/components/admin/MediaUploader";
import { useUnsavedChanges } from "@/lib/hooks";
import { ErrorSummary, scrollToFirstError } from "@/components/admin/ErrorSummary";
import ProjectFormActions from "@/components/admin/ProjectFormActions";
import BasicInfoFields from "@/components/admin/BasicInfoFields";
import ProjectStatusFields from "@/components/admin/ProjectStatusFields";
import VideoPreview from "@/components/admin/VideoPreview";
import VideoPosterCard from "@/components/admin/VideoPosterCard";
import CategoriesFields from "@/components/admin/CategoriesFields";
import SummaryFields from "@/components/admin/SummaryFields";

interface ProjectEditorProps {
  initialData?: Project;
  onSave: (data: Partial<ProjectCreateInput>, options?: { isAutoSave?: boolean }) => void;
  isSaving: boolean;
  lastSaved?: string | null;
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

export default function ProjectEditor({ initialData, onSave, isSaving, lastSaved }: ProjectEditorProps) {
  const isEditMode = !!initialData?._id;
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [enableVideo, setEnableVideo] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    getValues,
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
  const watchedVideo = watch("video");
  const watchedFeatured = watch("featured");
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
        seo: initialData.seo || { title: "", description: "", keywords: [] },
        gallery: initialData.gallery || [],
        tags: initialData.tags || [],
        detailedResults: initialData.detailedResults || [],
        caseStudyMedia: initialData.caseStudyMedia || [],
        services: initialData.services || [],
        idea: getString(initialData.idea),
        mainResult: getString(initialData.mainResult),
        client: initialData.client || "",
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
    if (data.caseStudyMedia) {
      data.caseStudyMedia = data.caseStudyMedia.filter(
        item => item.src && item.src.trim().length > 0
      );
    }
    if (data.gallery) {
      data.gallery = data.gallery.filter(url => url && url.trim().length > 0);
    }
    onSave(data);
  };

  const handleSubmitClick = () => {
    setSubmitAttempted(true);
    handleSubmit(onSubmit)();
    setTimeout(() => {
      if (Object.keys(errors).length > 0) {
        scrollToFirstError(errors as unknown as Record<string, unknown>);
      }
    }, 0);
  };

  return (
    <div className="space-y-8">
      <ProjectFormActions
        isSaving={isSaving}
        isSubmitting={isSubmitting}
        lastSaved={lastSaved}
        onSave={handleSubmitClick}
      />

      {submitAttempted && Object.keys(errors).length > 0 && (
        <ErrorSummary errors={errors as unknown as Record<string, unknown>} />
      )}

      <div className="space-y-12">
        <BasicInfoFields register={register} errors={errors} />

        <CategoriesFields control={control} />

        <SummaryFields register={register} control={control} errors={errors} />

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
                  {watchedVideo && isValidMediaUrl(watchedVideo) && (
                    <div className="mt-2 aspect-video bg-primary/5 relative overflow-hidden rounded">
                      <VideoPreview src={watchedVideo} />
                    </div>
                  )}
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">
                  Gallery
                </label>
                <span className="text-[9px] text-foreground/40 uppercase tracking-wider">
                  {watchedGallery.length} item{watchedGallery.length !== 1 ? "s" : ""}
                </span>
              </div>

              <Controller
                name="gallery"
                control={control}
                render={({ field }) => {
                  const items: string[] = field.value || [];
                  const appendUrl = (url: string) => {
                    const current = getValues("gallery") || [];
                    setValue("gallery", [...current, url], { shouldDirty: true });
                  };
                  const removeAt = (index: number) => {
                    const current = getValues("gallery") || [];
                    setValue("gallery", current.filter((_, i) => i !== index), { shouldDirty: true });
                  };
                  const moveItem = (from: number, to: number) => {
                    const current = getValues("gallery") || [];
                    if (to < 0 || to >= current.length) return;
                    const next = [...current];
                    const [moved] = next.splice(from, 1);
                    next.splice(to, 0, moved);
                    setValue("gallery", next, { shouldDirty: true });
                  };
                  return (
                    <>
                      {items.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {items.map((url: string, index: number) => {
                            const kind = url ? getMediaKind(url) : null;
                            const typeLabel = kind === "video" ? "Video" : kind === "image" ? "Image" : kind === "embed" ? "Embed" : kind === "external" ? "External" : "Unknown";
                            const typeIcon = kind === "video" ? <Video size={10} /> : kind === "image" ? <ImageIcon size={10} /> : <Link size={10} />;
                            return (
                              <div key={index} className="group relative bg-primary/5 border border-primary/10 overflow-hidden">
                                <div className="aspect-video relative">
                                  {kind === "video" ? (
                                    <VideoPosterCard src={url} />
                                  ) : kind === "image" ? (
                                    <Image src={url} alt="" fill className="object-cover" />
                                  ) : kind === "embed" ? (
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-primary/10 text-accent text-[9px] font-bold uppercase tracking-wider">
                                      External video
                                    </a>
                                  ) : url ? (
                                    <span className="absolute inset-0 flex items-center justify-center text-[7px] text-foreground/30 p-2 break-all">{url}</span>
                                  ) : (
                                    <span className="absolute inset-0 flex items-center justify-center text-[7px] text-foreground/30">Invalid URL</span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between gap-1 px-1.5 py-1 bg-background/80 border-t border-primary/10">
                                  <span className="flex items-center gap-1 text-[7px] text-foreground/40 uppercase tracking-wider">
                                    {typeIcon}
                                    {typeLabel}
                                  </span>
                                  <span className="text-[7px] text-foreground/30">#{index + 1}</span>
                                </div>
                                <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {items.length > 1 && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => moveItem(index, index - 1)}
                                        disabled={index === 0}
                                        className="p-1 bg-background/80 border border-primary/20 text-foreground/50 hover:text-accent disabled:opacity-30"
                                      >
                                        <ChevronUp size={10} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => moveItem(index, index + 1)}
                                        disabled={index === items.length - 1}
                                        className="p-1 bg-background/80 border border-primary/20 text-foreground/50 hover:text-accent disabled:opacity-30"
                                      >
                                        <ChevronDown size={10} />
                                      </button>
                                    </>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => removeAt(index)}
                                    className="p-1 bg-red-500/80 text-white hover:bg-red-600"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-primary/10 p-8 text-center">
                          <p className="text-[10px] text-foreground/30 uppercase tracking-wider">
                            No gallery media added yet.
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3">
                        {mediaConfig.isUploadConfigured ? (
                          <>
                            <CldUploadWidget
                              uploadPreset={mediaConfig.uploadPreset}
                              onSuccess={(result: any) => {
                                const url = result.info?.secure_url || result.secure_url;
                                if (url) appendUrl(url);
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
                                const url = result.info?.secure_url || result.secure_url;
                                if (url) appendUrl(url);
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
                            if (url?.trim()) appendUrl(url.trim());
                          }}
                          className="px-4 py-2 bg-accent/10 text-accent text-xs font-bold uppercase"
                        >
                          <Upload size={14} className="inline mr-2" /> Add Media URL
                        </button>
                      </div>
                    </>
                  );
                }}
              />
            </div>
          </div>
        </div>

        <ProjectStatusFields register={register} control={control} featured={watchedFeatured} />
      </div>
    </div>
  );
}