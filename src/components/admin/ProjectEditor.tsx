"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "@/types";
import { 
  projectCreateSchema, 
  projectUpdateSchema, 
  ProjectCreateInput,
  projectDefaultValues,
  generateSlugFromTitle,
} from "@/lib/validation";
import { useUnsavedChanges } from "@/lib/hooks";
import { ErrorSummary, scrollToFirstError } from "@/components/admin/ErrorSummary";
import ProjectFormActions from "@/components/admin/ProjectFormActions";
import BasicInfoFields from "@/components/admin/BasicInfoFields";
import ProjectStatusFields from "@/components/admin/ProjectStatusFields";
import CategoriesFields from "@/components/admin/CategoriesFields";
import SummaryFields from "@/components/admin/SummaryFields";
import CaseStudyFields from "@/components/admin/CaseStudyFields";
import MediaFields from "@/components/admin/MediaFields";
import ProjectReadinessPanel from "@/components/admin/ProjectReadinessPanel";
import { checkReadiness, type ReadinessResult } from "@/lib/validation/project-readiness";

interface ProjectEditorProps {
  initialData?: Project;
  onSave: (data: Partial<ProjectCreateInput>, options?: { isAutoSave?: boolean }) => void;
  isSaving: boolean;
  lastSaved?: string | null;
}

type FormData = ProjectCreateInput;

export default function ProjectEditor({ initialData, onSave, isSaving, lastSaved }: ProjectEditorProps) {
  const isEditMode = !!initialData?._id;
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [enableVideo, setEnableVideo] = useState(false);
  const [readinessResult, setReadinessResult] = useState<ReadinessResult | null>(null);
  
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

  const { setSubmitting: setUnsavedSubmitting } = useUnsavedChanges<FormData>({
    watch,
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
          title: typeof s.title === "string" ? s.title : (s.title as { en?: string })?.en || "",
          content: typeof s.content === "string" ? s.content : (s.content as { en?: string })?.en || ""
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
    const isPublishing = data.status === "published";
    const result = checkReadiness(data as unknown as Record<string, unknown>);
    setReadinessResult(result);
    if (isPublishing && !result.isPublishReady) {
      setSubmitAttempted(true);
      setUnsavedSubmitting(false);
      return;
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

      {readinessResult && readinessResult.issues.length > 0 && (
        <ProjectReadinessPanel result={readinessResult} onClose={() => setReadinessResult(null)} />
      )}

      <div className="space-y-12">
        <BasicInfoFields register={register} errors={errors} />

        <CategoriesFields control={control} />

        <SummaryFields register={register} control={control} errors={errors} />

        <CaseStudyFields
          register={register}
          detailFields={detailFields}
          appendDetail={appendDetail}
          removeDetail={removeDetail}
          sectionFields={sectionFields}
          appendSection={appendSection}
          removeSection={removeSection}
        />

        <MediaFields
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
          getValues={getValues}
          watchedImage={watchedImage}
          watchedVideo={watchedVideo}
          watchedGallery={watchedGallery}
          watchedCaseStudyMedia={watchedCaseStudyMedia}
          mediaFields={mediaFields}
          appendMedia={appendMedia}
          removeMedia={removeMedia}
          enableVideo={enableVideo}
          setEnableVideo={setEnableVideo}
        />

        <ProjectStatusFields register={register} control={control} featured={watchedFeatured} />
      </div>
    </div>
  );
}