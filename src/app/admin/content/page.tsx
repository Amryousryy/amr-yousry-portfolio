"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Save, Loader2, Info, Mail, Clock, Plus, Trash2, Eye } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "@/lib/api-client";
import { contentCreateSchema, ContentCreateInput, contentDefaultValues } from "@/lib/validation";
import { convertSiteContentToForm } from "@/lib/content-form";
import { toast } from "sonner";
import StringInput from "@/components/admin/BilingualInput";
import { ErrorSummary, scrollToFirstError } from "@/components/admin/ErrorSummary";
import { useUnsavedChanges } from "@/lib/hooks";
import ContactIntroFields from "@/components/admin/ContactIntroFields";
import DirectContactFields from "@/components/admin/DirectContactFields";
import SocialLinksFields from "@/components/admin/SocialLinksFields";

type FormData = ContentCreateInput;

export default function SiteContentManagerPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"about" | "contact">("about");
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

  const { fields: aboutStatsFields, append: appendAboutStat, remove: removeAboutStat } = useFieldArray({
    control,
    name: "aboutStats",
  });

  const { fields: aboutSkillsFields, append: appendAboutSkill, remove: removeAboutSkill } = useFieldArray({
    control,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: "aboutSkills" as any,
  }) as unknown as { fields: { id: string }[]; append: (val: string) => void; remove: (index: number) => void };

  const { fields: aboutIndustriesFields, append: appendAboutIndustry, remove: removeAboutIndustry } = useFieldArray({
    control,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: "aboutIndustries" as any,
  }) as unknown as { fields: { id: string }[]; append: (val: string) => void; remove: (index: number) => void };

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
      toast.success("Site content updated successfully!");
      setLastSaved(new Date().toLocaleTimeString());
      markAsSaved();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update site content");
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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-red-500 text-2xl font-bold">!</span>
        </div>
        <h2 className="text-xl font-display font-bold uppercase tracking-tight mb-2">Failed to Load Content</h2>
        <p className="text-foreground/50 text-sm mb-6 text-center max-w-md">
          {(error as Error)?.message || "Could not fetch site content. Please try again."}
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

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  const tabs = [
    { id: "about", name: "About Section", icon: Info },
    { id: "contact", name: "Contact & Social", icon: Mail },
  ];

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 uppercase tracking-tighter">Site Content</h1>
          <p className="text-foreground/50 pixel-text text-xs uppercase tracking-widest">
            Manage landing page text and information
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
            <span>{mutation.isPending || isSubmitting ? "Saving..." : "Save All Content"}</span>
          </button>
        </div>
      </header>

      <div className="flex bg-primary/5 p-1 pixel-border w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "about" | "contact")}
            className={`flex items-center space-x-3 px-6 py-3 text-[10px] font-bold uppercase transition-all ${activeTab === tab.id ? 'bg-accent text-background' : 'text-foreground/40 hover:text-foreground'}`}
          >
            <tab.icon size={14} />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="p-8 bg-primary/5 border border-primary/10">
        <form className="space-y-12">
          {submitAttempted && Object.keys(errors).length > 0 && (
            <ErrorSummary errors={errors as unknown as Record<string, unknown>} />
          )}
          
          {activeTab === "about" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4 mb-4">About / Player Profile</h3>

              <Controller
                name="aboutBadge"
                control={control}
                render={({ field }) => (
                  <StringInput
                    label="Badge / Eyebrow"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="MISSION LOG: PLAYER PROFILE"
                  />
                )}
              />
              
              <Controller
                name="aboutTitle"
                control={control}
                render={({ field }) => (
                  <StringInput
                    label="Professional Title"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="SENIOR\nMULTIMEDIA DESIGNER."
                  />
                )}
              />

              <Controller
                name="about"
                control={control}
                render={({ field }) => (
                  <StringInput 
                    label="About Story / Body"
                    value={field.value} 
                    onChange={field.onChange}
                    type="textarea"
                    rows={10}
                  />
                )}
              />

              <div className="border-t border-primary/10 pt-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/70 mb-4">CTA Button</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="aboutCtaLabel"
                    control={control}
                    render={({ field }) => (
                      <StringInput
                        label="CTA Label"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Start a Project"
                      />
                    )}
                  />
                  <Controller
                    name="aboutCtaLink"
                    control={control}
                    render={({ field }) => (
                      <StringInput
                        label="CTA Link"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="/#contact"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="border-t border-primary/10 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/70">Stats</h4>
                  <button
                    type="button"
                    onClick={() => appendAboutStat({ label: "", value: "" })}
                    className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent text-xs font-bold uppercase hover:bg-accent/30 transition-colors"
                  >
                    <Plus size={14} />
                    Add Stat
                  </button>
                </div>
                <div className="space-y-4">
                  {aboutStatsFields.map((stat, index) => (
                    <div key={stat.id} className="flex items-start gap-3 p-4 bg-background/50 border border-primary/10">
                      <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold uppercase text-foreground/40">Label</label>
                        <input
                          {...register(`aboutStats.${index}.label`)}
                          className="w-full bg-background border border-primary/20 p-2 text-sm"
                          placeholder="EXPERIENCE"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold uppercase text-foreground/40">Value</label>
                        <input
                          {...register(`aboutStats.${index}.value`)}
                          className="w-full bg-background border border-primary/20 p-2 text-sm"
                          placeholder="8+ YEARS"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAboutStat(index)}
                        className="mt-6 p-2 text-foreground/30 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-primary/10 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/70">Creative Loadout (Skills)</h4>
                  <button
                    type="button"
                    onClick={() => appendAboutSkill("")}
                    className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent text-xs font-bold uppercase hover:bg-accent/30 transition-colors"
                  >
                    <Plus size={14} />
                    Add Skill
                  </button>
                </div>
                <div className="space-y-2">
                  {aboutSkillsFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        {...register(`aboutSkills.${index}`)}
                        className="flex-1 bg-background border border-primary/20 p-2 text-sm"
                        placeholder="After Effects"
                      />
                      <button
                        type="button"
                        onClick={() => removeAboutSkill(index)}
                        className="p-2 text-foreground/30 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-primary/10 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/70">Mission Sectors (Industries)</h4>
                  <button
                    type="button"
                    onClick={() => appendAboutIndustry("")}
                    className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent text-xs font-bold uppercase hover:bg-accent/30 transition-colors"
                  >
                    <Plus size={14} />
                    Add Sector
                  </button>
                </div>
                <div className="space-y-2">
                  {aboutIndustriesFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        {...register(`aboutIndustries.${index}`)}
                        className="flex-1 bg-background border border-primary/20 p-2 text-sm"
                        placeholder="Medical Sector"
                      />
                      <button
                        type="button"
                        onClick={() => removeAboutIndustry(index)}
                        className="p-2 text-foreground/30 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div>
                <ContactIntroFields control={control} />
              </div>
              <div>
                <DirectContactFields register={register} errors={errors} />
              </div>
              <div>
                <SocialLinksFields register={register} errors={errors} />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
