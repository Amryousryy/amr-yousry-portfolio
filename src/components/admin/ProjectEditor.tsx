"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";
import { Project } from "@/types";
import { 
  projectCreateSchema, 
  projectUpdateSchema, 
  ProjectCreateInput,
  projectDefaultValues,
  generateSlugFromTitle,
} from "@/lib/validation";
import { useUnsavedChanges } from "@/lib/hooks";
import { getString } from "@/lib/text";
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
import {
  resolveSaveStatus,
  shouldRunReadinessCheck,
  type ProjectSaveIntent,
  type PersistedProjectStatus,
} from "@/lib/projects/save-intent";
import { resolveSaveState } from "@/lib/projects/save-state";
import { getCanonicalProjectPath } from "@/lib/projects/canonical-slugs";
import { useDeploymentStatus } from "@/hooks/useDeploymentStatus";
import { isDeploymentBlockingLive } from "@/lib/projects/deployment-status";

interface SaveEventHandlers {
  markSaved: () => void;
  markFailed: (message: string) => void;
}

interface ProjectEditorProps {
  initialData?: Project;
  onSave: (data: Partial<ProjectCreateInput>, options?: { isAutoSave?: boolean }) => void;
  isSaving: boolean;
  lastSaved?: string | null;
  /**
   * Lets the hosting page react to save completion. `markSaved` is called by
   * the page's mutation onSuccess, re-baselining the unsaved-changes guard so
   * staying in the editor after a save is safe. `markFailed` surfaces the
   * mutation's error persistently in the action bar.
   */
  registerSaveEvents?: (handlers: SaveEventHandlers) => void;
}

type FormData = ProjectCreateInput;

export default function ProjectEditor({
  initialData,
  onSave,
  isSaving,
  lastSaved,
  registerSaveEvents,
}: ProjectEditorProps) {
  const isEditMode = !!initialData?._id;
  const persistedStatus: PersistedProjectStatus =
    isEditMode && initialData?.status === "published" ? "published" : "draft";
  const isPublished = persistedStatus === "published";

  const deploymentStatus = useDeploymentStatus(isEditMode ? initialData?._id : undefined, {
    enabled: isEditMode && isPublished,
    initialDeployment: initialData?.deployment ?? null,
  });
  const canViewLive = !isDeploymentBlockingLive(deploymentStatus.state);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [enableVideo, setEnableVideo] = useState(false);
  const [readinessResult, setReadinessResult] = useState<ReadinessResult | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const slugTouchedRef = useRef(false);

  // Stable baseline: the loaded project for edit mode, the empty defaults for
  // new projects. Passing this into useUnsavedChanges fixes the "every loaded
  // project is dirty" problem — the guard only arms once the user actually
  // diverges from the loaded/saved state.
  const formDefaultValues = useMemo<FormData>(() => {
    if (!initialData) return projectDefaultValues;
    const hasVideo = !!initialData.video;
    return {
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
      seo: {
        title: initialData.seo?.title || "",
        description: initialData.seo?.description || "",
        keywords: initialData.seo?.keywords || [],
      },
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
    };
  }, [initialData]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    watch,
    getValues,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: standardSchemaResolver(isEditMode ? projectUpdateSchema : projectCreateSchema) as unknown as Resolver<FormData>,
    defaultValues: formDefaultValues,
  });

  const { setSubmitting: setUnsavedSubmitting, markAsSaved } = useUnsavedChanges<FormData>({
    watch,
    defaultValues: formDefaultValues,
    enabled: true,
  });

  // When a save attempt concludes (mutation resolves to success, error, or
  // timeout) the submission flag must be released, otherwise the
  // unsaved-changes beforeunload protection stays permanently disabled after
  // a failed save. Released unconditionally so failure/timeout paths are safe;
  // success also re-baselines via markAsSaved.
  const prevIsSavingRef = useRef(isSaving);
  useEffect(() => {
    if (prevIsSavingRef.current && !isSaving) {
      setUnsavedSubmitting(false);
    }
    prevIsSavingRef.current = isSaving;
  }, [isSaving, setUnsavedSubmitting]);

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

  // React Hook Form's watch() returns a function that can't be safely memoized by React Compiler.
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");
  const watchedImage = watch("image");
  const watchedVideo = watch("video");
  const watchedFeatured = watch("featured");
  const watchedStatus = watch("status");
  const watchedGallery = watch("gallery") || [];
  const watchedCaseStudyMedia = watch("caseStudyMedia") || [];

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!initialData) return;
    const hasVideo = !!initialData.video;
    setEnableVideo(hasVideo);

    if (didMountRef.current && isDirty) {
      // The query refetched after a save and the user may have typed in the
      // meantime — never clobber unsaved edits. On first mount (or when clean)
      // the form is re-synced with the server state instead.
      return;
    }
    reset(formDefaultValues);
  }, [initialData, reset, formDefaultValues, isDirty]);

  useEffect(() => {
    didMountRef.current = true;
  }, []);

  // Slug auto-suggest for NEW projects: keep syncing the slug from the title
  // while the slug field is still untouched (fixes stale suggestions after the
  // title changes). The moment the user focuses/edits the slug, suggestions
  // stop permanently. Edit mode NEVER auto-changes the slug.
  useEffect(() => {
    if (isEditMode) return;
    if (slugTouchedRef.current) return;
    if (!watchedTitle) return;
    const newSlug = generateSlugFromTitle(watchedTitle);
    if (newSlug && newSlug !== watchedSlug) {
      setValue("slug", newSlug);
    }
  }, [watchedTitle, isEditMode, watchedSlug, setValue]);

  const registerSaveEventsRef = useRef(registerSaveEvents);
  useEffect(() => {
    registerSaveEventsRef.current = registerSaveEvents;
  });

  // Expose save-completion handlers to the hosting page (mutation onSuccess /
  // onError), so the persistent action-bar state stays accurate when the save
  // does NOT navigate away.
  useEffect(() => {
    const handlers: SaveEventHandlers = {
      markSaved: () => {
        setSaveError(null);
        // Clears RHF's dirty flag immediately (before the post-save refetch
        // lands) so the bar flips to "Saved at …" without waiting.
        reset(getValues(), { keepValues: true });
        markAsSaved();
      },
      markFailed: (message: string) => setSaveError(message),
    };
    registerSaveEventsRef.current?.(handlers);
  }, [markAsSaved, reset, getValues]);

  const runAction = (intent: ProjectSaveIntent) => {
    setSubmitAttempted(true);
    handleSubmit(
      (data) => {
        setSaveError(null);
        const resolvedStatus = resolveSaveStatus(persistedStatus, intent);
        setUnsavedSubmitting(true);
        data.status = resolvedStatus;
        if (!enableVideo) {
          data.video = undefined;
        }
        // Ordering is owned by the Homepage screen (drag-and-drop), never by a
        // number the editor might carry around. Stripped so a stale value can
        // never fight the curated homepage order on the server.
        (data as Partial<ProjectCreateInput> & Record<string, unknown>).featuredOrder = undefined;
        (data as Record<string, unknown>).displayOrder = undefined;
        const optionalStringFields = ["problem", "strategy", "solution", "execution", "results", "idea", "mainResult", "client"] as const;
        for (const field of optionalStringFields) {
          if (data[field] === "") {
            (data as Record<string, unknown>)[field] = undefined;
          }
        }
        if (data.caseStudyMedia) {
          data.caseStudyMedia = data.caseStudyMedia.filter(
            item => item.src && item.src.trim().length > 0
          );
        }
        if (data.gallery) {
          data.gallery = data.gallery.filter(url => url && url.trim().length > 0);
        }
        const result = checkReadiness(data as unknown as Record<string, unknown>);
        // The readiness gate only applies to the explicit PUBLISH action (the
        // transition that makes content public). Save Draft and Save Changes
        // persist regardless of missing content and never flash a "not ready"
        // panel — warnings stay advisory and can be handled at the owner's pace.
        if (shouldRunReadinessCheck(intent)) {
          setReadinessResult(result);
          if (!result.isPublishReady) {
            setSubmitAttempted(true);
            setUnsavedSubmitting(false);
            return;
          }
        }
        onSave(data);
      },
      (validationErrors) => {
        scrollToFirstError(validationErrors as unknown as Record<string, unknown>);
      },
    )();
  };

  const handleSave = () => {
    runAction(isPublished ? "save-changes" : "save-draft");
  };

  const handlePublish = () => {
    if (!window.confirm("Publish this project? It will become publicly visible on the live site.")) return;
    runAction("publish");
  };

  const handleUnpublish = () => {
    if (!window.confirm("Unpublish this project? It will be removed from the live site and saved as a draft.")) return;
    runAction("save-draft");
  };

  const handlePreview = () => {
    if (!isEditMode || !initialData?._id) {
      toast.error("Save the project first to preview it.");
      return;
    }
    if (isDirty) {
      toast.info("Previewing your last saved draft. Unsaved changes are not included.");
    }
    window.open(`/preview/project/${initialData._id}`, "_blank", "noopener,noreferrer");
  };

  const handleViewLive = () => {
    if (!initialData?.slug) return;
    window.open(getCanonicalProjectPath(initialData.slug), "_blank", "noopener,noreferrer");
  };

  const saveState = resolveSaveState({
    isSaving: isSaving || isSubmitting,
    hasSaveError: !!saveError,
    isDirty,
    lastSaved,
  });

  return (
    <div className="space-y-6">
      <ProjectFormActions
        isEditMode={isEditMode}
        isPublished={isPublished}
        pending={isSaving || isSubmitting}
        saveState={saveState}
        onSaveDraft={handleSave}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onPreview={handlePreview}
        onViewLive={handleViewLive}
        deployment={deploymentStatus.deployment}
        deploymentRetrying={deploymentStatus.isRetrying}
        onRetryDeployment={deploymentStatus.retry}
        canViewLive={canViewLive}
      />

      {submitAttempted && Object.keys(errors).length > 0 && (
        <ErrorSummary errors={errors as unknown as Record<string, unknown>} />
      )}

      {readinessResult && readinessResult.issues.length > 0 && (
        <ProjectReadinessPanel result={readinessResult} onClose={() => setReadinessResult(null)} />
      )}

      <div className="space-y-8">
        <BasicInfoFields
          register={register}
          errors={errors}
          onSlugTouched={() => {
            slugTouchedRef.current = true;
          }}
        />

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

        <CategoriesFields control={control} />

        <ProjectStatusFields register={register} featured={watchedFeatured} status={watchedStatus} />
      </div>
    </div>
  );
}