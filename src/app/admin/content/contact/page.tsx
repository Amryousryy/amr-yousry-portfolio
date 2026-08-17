"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Save, Loader2, Clock, Eye } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "@/lib/api-client";
import { contentCreateSchema, ContentCreateInput, contentDefaultValues } from "@/lib/validation";
import { convertSiteContentToForm } from "@/lib/content-form";
import { toast } from "sonner";
import { ErrorSummary, scrollToFirstError } from "@/components/admin/ErrorSummary";
import { useUnsavedChanges } from "@/lib/hooks";
import ContactIntroFields from "@/components/admin/ContactIntroFields";
import DirectContactFields from "@/components/admin/DirectContactFields";
import SocialLinksFields from "@/components/admin/SocialLinksFields";

type FormData = ContentCreateInput;

export default function ContactSettingsPage() {
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
    resolver: standardSchemaResolver(contentCreateSchema),
    defaultValues: contentDefaultValues,
  });

  const { data: contentResponse, isLoading, isError, error } = useQuery({
    queryKey: ["site-content", "admin"],
    queryFn: () => SettingsService.getContent(true),
  });

  const content = contentResponse?.data;

  React.useEffect(() => {
    if (content && Object.keys(content).length > 0) {
      const formValues = convertSiteContentToForm(content);
      reset(formValues);
    }
  }, [content, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => SettingsService.updateContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Contact settings updated successfully!");
      setLastSaved(new Date().toLocaleTimeString());
      markAsSaved();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update contact settings");
    }
  });

  const { setSubmitting: setUnsavedSubmitting, markAsSaved } = useUnsavedChanges<FormData>({
    watch,
    defaultValues: contentDefaultValues,
    enabled: true,
  });

  const handleSubmitWithValidation = (data: FormData) => {
    setSubmitAttempted(false);
    mutation.mutate(data);
  };

  const handleSubmitClick = () => {
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
        <h2 className="text-xl font-display font-bold uppercase tracking-tight mb-2">Failed to Load Contact Settings</h2>
        <p className="text-foreground/50 text-sm mb-6 text-center max-w-md">
          {error?.message || "Could not fetch contact settings. Please try again."}
        </p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["site-content"] })}
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
          <h1 className="text-4xl font-display font-bold mb-2 uppercase tracking-tighter">Contact & Social</h1>
          <p className="text-foreground/50 pixel-text text-xs uppercase tracking-widest">
            Manage contact information and social media links
          </p>
          {content?.status && (
            <div className="flex items-center gap-3 mt-2 text-[10px]">
              <span className={`px-2 py-1 font-bold uppercase ${content.status === 'published' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                {content.status}
              </span>
              {content.publishedAt && (
                <span className="text-foreground/30">
                  Published: {new Date(content.publishedAt).toLocaleDateString()}
                </span>
              )}
              {content.lastStatusChangeAt && (
                <span className="text-foreground/30">
                  Updated: {new Date(content.lastStatusChangeAt).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/preview?preview=true"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-3 bg-yellow-500/20 text-yellow-500 font-bold uppercase tracking-widest text-xs pixel-border hover:bg-yellow-500/30 transition-colors"
          >
            <Eye size={14} />
            <span>Preview</span>
          </a>
          {lastSaved && (
            <span className="text-xs text-foreground/40 flex items-center gap-1">
              <Clock size={12} />
              Saved at {lastSaved}
            </span>
          )}
          <button
            type="button"
            onClick={handleSubmitClick}
            disabled={mutation.isPending || isSubmitting}
            className="flex items-center space-x-3 px-8 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-transform disabled:opacity-50"
          >
            {mutation.isPending || isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>{mutation.isPending || isSubmitting ? "Saving..." : "Save Contact Settings"}</span>
          </button>
        </div>
      </header>

      <div className="p-8 bg-primary/5 border border-primary/10">
        <form className="space-y-12">
          {submitAttempted && Object.keys(errors).length > 0 && (
            <ErrorSummary errors={errors as unknown as Record<string, unknown>} />
          )}

          <div className="space-y-8">
            <ContactIntroFields control={control} />
          </div>
          <div>
            <DirectContactFields register={register} errors={errors} />
          </div>
          <div>
            <SocialLinksFields register={register} errors={errors} />
          </div>
        </form>
      </div>
    </div>
  );
}
