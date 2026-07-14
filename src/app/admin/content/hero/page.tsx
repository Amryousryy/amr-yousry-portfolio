"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Save, Loader2, Eye, Clock } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "@/lib/api-client";
import { heroCreateSchema, HeroCreateInput, heroDefaultValues } from "@/lib/validation";
import { toast } from "sonner";
import { ErrorSummary, scrollToFirstError } from "@/components/admin/ErrorSummary";
import { useUnsavedChanges } from "@/lib/hooks";
import type { HeroSettings } from "@/types";

type FormData = HeroCreateInput;

function getFieldError(errors: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let current: Record<string, unknown> = errors;
  for (const part of parts) {
    if (current === undefined) return undefined;
    current = current[part] as Record<string, unknown>;
  }
  return current?.message as string | undefined;
}

function convertToForm(content: HeroSettings): FormData {
  if (!content) return heroDefaultValues;
  return {
    headline: content.headline || "",
    subheadline: content.subheadline || "",
    primaryCTA: content.primaryCTA || "",
    primaryCTALink: content.primaryCTALink || "",
    secondaryCTA: content.secondaryCTA || "",
    secondaryCTALink: content.secondaryCTALink || "",
    posterImage: content.posterImage || "",
    showreelVideo: content.showreelVideo || "",
    status: (content.status as "draft" | "published") || "draft",
  };
}

export default function HeroSettingsPage() {
  const queryClient = useQueryClient();
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: standardSchemaResolver(heroCreateSchema),
    defaultValues: heroDefaultValues,
  });

  const { data: heroResponse, isLoading, isError, error } = useQuery({
    queryKey: ["hero-settings", "admin"],
    queryFn: () => SettingsService.getHero(true),
  });

  const content = heroResponse?.data;

  React.useEffect(() => {
    if (content && Object.keys(content).length > 0) {
      const formValues = convertToForm(content);
      reset(formValues);
    }
  }, [content, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => SettingsService.updateHero(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-settings"] });
      toast.success("Hero settings updated successfully!");
      setLastSaved(new Date().toLocaleTimeString());
      markAsSaved();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update hero settings");
    }
  });

  const { setSubmitting: setUnsavedSubmitting, markAsSaved } = useUnsavedChanges<FormData>({
    watch,
    defaultValues: heroDefaultValues,
    enabled: true,
  });

  const handleSubmitWithValidation = (data: FormData) => {
    setSubmitAttempted(false);
    mutation.mutate(data);
  };

  const handleFormSubmit = () => {
    setSubmitAttempted(true);
    setUnsavedSubmitting(true);
    handleSubmit(handleSubmitWithValidation)();
    if (Object.keys(errors).length > 0) {
      scrollToFirstError(errors as unknown as Record<string, unknown>);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-red-500 text-2xl font-bold">!</span>
        </div>
        <h2 className="text-xl font-display font-bold uppercase tracking-tight mb-2">Failed to Load Hero Settings</h2>
        <p className="text-foreground/50 text-sm mb-6 text-center max-w-md">
          {error?.message || "Could not fetch hero settings. Please try again."}
        </p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["hero-settings"] })}
          className="flex items-center space-x-2 px-6 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 uppercase tracking-tighter">Hero Settings</h1>
          <p className="text-foreground/50 pixel-text text-xs uppercase tracking-widest">
            Manage homepage hero headline, CTAs, and media
          </p>
          {content?.status && (
            <div className="flex items-center gap-3 mt-2 text-[10px]">
              <span className={`px-2 py-1 font-bold uppercase ${content.status === 'published' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                {content.status}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="flex bg-primary/10 p-1 pixel-border">
                <button
                  type="button"
                  onClick={() => field.onChange("draft")}
                  className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${field.value === "draft" ? "bg-yellow-500 text-background" : "text-foreground/40 hover:text-foreground"}`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("published")}
                  className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${field.value === "published" ? "bg-green-500 text-background" : "text-foreground/40 hover:text-foreground"}`}
                >
                  Published
                </button>
              </div>
            )}
          />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-3 bg-yellow-500/20 text-yellow-500 font-bold uppercase tracking-widest text-xs pixel-border hover:bg-yellow-500/30 transition-colors"
          >
            <Eye size={14} />
            <span>View Site</span>
          </a>
          {lastSaved && (
            <span className="text-xs text-foreground/40 flex items-center gap-1">
              <Clock size={12} />
              Saved at {lastSaved}
            </span>
          )}
          <button
            type="button"
            onClick={handleFormSubmit}
            disabled={mutation.isPending || isSubmitting}
            className="flex items-center space-x-3 px-8 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-transform disabled:opacity-50"
          >
            {mutation.isPending || isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>{mutation.isPending || isSubmitting ? "Saving..." : "Save Hero Settings"}</span>
          </button>
        </div>
      </header>

      <div className="p-8 bg-primary/5 border border-primary/10">
        <form className="space-y-10">
          {submitAttempted && Object.keys(errors).length > 0 && (
            <ErrorSummary errors={errors as unknown as Record<string, unknown>} />
          )}

          <div className="space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4">Headline & Subheadline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">
                  Headline <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("headline")}
                  className="w-full bg-primary/5 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm"
                  placeholder="MAKE IDEAS MATTER"
                />
                {getFieldError(errors as unknown as Record<string, unknown>, "headline") && (
                  <p className="text-[10px] text-red-500">{getFieldError(errors as unknown as Record<string, unknown>, "headline")}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">
                  Subheadline <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("subheadline")}
                  className="w-full bg-primary/5 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm"
                  placeholder="Creative Direction and High-Impact Video Production"
                />
                {getFieldError(errors as unknown as Record<string, unknown>, "subheadline") && (
                  <p className="text-[10px] text-red-500">{getFieldError(errors as unknown as Record<string, unknown>, "subheadline")}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4">Call to Action Buttons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">
                    Primary CTA Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("primaryCTA")}
                    className="w-full bg-primary/5 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm"
                    placeholder="Start a Project"
                  />
                  {getFieldError(errors as unknown as Record<string, unknown>, "primaryCTA") && (
                    <p className="text-[10px] text-red-500">{getFieldError(errors as unknown as Record<string, unknown>, "primaryCTA")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">
                    Primary CTA Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("primaryCTALink")}
                    className="w-full bg-primary/5 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm"
                    placeholder="/#contact"
                  />
                  {getFieldError(errors as unknown as Record<string, unknown>, "primaryCTALink") && (
                    <p className="text-[10px] text-red-500">{getFieldError(errors as unknown as Record<string, unknown>, "primaryCTALink")}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">
                    Secondary CTA Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("secondaryCTA")}
                    className="w-full bg-primary/5 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm"
                    placeholder="View Missions"
                  />
                  {getFieldError(errors as unknown as Record<string, unknown>, "secondaryCTA") && (
                    <p className="text-[10px] text-red-500">{getFieldError(errors as unknown as Record<string, unknown>, "secondaryCTA")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">
                    Secondary CTA Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("secondaryCTALink")}
                    className="w-full bg-primary/5 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm"
                    placeholder="/projects"
                  />
                  {getFieldError(errors as unknown as Record<string, unknown>, "secondaryCTALink") && (
                    <p className="text-[10px] text-red-500">{getFieldError(errors as unknown as Record<string, unknown>, "secondaryCTALink")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4">Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">Showreel Video URL</label>
                <input
                  {...register("showreelVideo")}
                  className="w-full bg-primary/5 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">Poster / Hero Image URL</label>
                <input
                  {...register("posterImage")}
                  className="w-full bg-primary/5 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
