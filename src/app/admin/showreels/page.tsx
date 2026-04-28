"use client";

import React, { useState } from "react";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, CheckCircle, Play, Image as ImageIcon, Save, Loader2, ArrowLeft } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { showreelCreateSchema, ShowreelCreateInput, showreelDefaultValues } from "@/lib/validation";
import { mediaConfig } from "@/lib/media/config";
import { ErrorSummary, scrollToFirstError } from "@/components/admin/ErrorSummary";
import { useUnsavedChanges } from "@/lib/hooks";

type FormData = ShowreelCreateInput;

function getFieldError(errors: FieldErrors<FormData>, path: string): string | undefined {
  const parts = path.split(".");
  let current: any = errors;
  for (const part of parts) {
    if (current === undefined) return undefined;
    current = current[part];
  }
  return current?.message as string | undefined;
}

function getString(value: string | { en: string; ar: string } | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.en || "";
}

export default function ShowreelManagerPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
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
    resolver: zodResolver(showreelCreateSchema),
    defaultValues: showreelDefaultValues,
  });

  const { data: showreelsResponse, isLoading } = useQuery({
    queryKey: ["showreels", "admin"],
    queryFn: async () => {
      const res = await fetch("/api/showreels?admin=true");
      const json = await res.json();
      return Array.isArray(json) ? json : json?.showreels ?? json?.data ?? [];
    },
  });

  const showreels = Array.isArray(showreelsResponse) ? showreelsResponse : [];

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/showreels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create showreel");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showreels"] });
      toast.success("Showreel created successfully!");
      setIsAdding(false);
      reset(showreelDefaultValues);
      markAsSaved();
    },
  });

  const { setSubmitting: setUnsavedSubmitting, markAsSaved } = useUnsavedChanges<FormData>({
    watch,
    reset,
    defaultValues: showreelDefaultValues,
    enabled: isAdding,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/showreels/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete showreel");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showreels"] });
      toast.success("Showreel deleted");
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/showreels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update showreel");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showreels"] });
      toast.success("Active showreel updated");
    },
  });

  const onSubmit = (data: FormData) => {
    setUnsavedSubmitting(true);
    createMutation.mutate(data);
  };

  const handleFormSubmit = () => {
    setSubmitAttempted(true);
    handleSubmit(onSubmit)();
    if (Object.keys(errors).length > 0) {
      scrollToFirstError(errors as unknown as Record<string, unknown>);
    }
  };

  const resetForm = () => {
    reset(showreelDefaultValues);
  };

  const watchedVideoUrl = watch("videoUrl");
  const watchedThumbnailUrl = watch("thumbnailUrl");

  if (isLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading Cinema...</div>;

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
           <Link href="/admin" className="flex items-center space-x-2 text-accent mb-4">
              <ArrowLeft size={16} />
              <span className="pixel-text text-[10px] uppercase">Back</span>
           </Link>
          <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">Showreel Cinema</h1>
          <p className="text-foreground/40 pixel-text text-[10px] uppercase tracking-widest">Primary Conversion Management</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-3 px-8 py-4 bg-accent text-background font-bold uppercase tracking-widest text-[10px] pixel-border hover:scale-105 transition-transform"
          >
            <Plus size={16} />
            <span>Upload New Reel</span>
          </button>
        )}
      </header>

      {isAdding && (
        <form className="p-10 bg-primary/5 border border-primary/10 space-y-10 animate-in fade-in slide-in-from-top duration-500">
          {submitAttempted && Object.keys(errors).length > 0 && (
            <ErrorSummary errors={errors as unknown as Record<string, unknown>} />
          )}
          
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-8">
                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
                     Title <span className="text-red-500">*</span>
                   </label>
                   <input
                     {...register("title")}
                     className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
                     placeholder="Showreel title"
                   />
                   {getFieldError(errors, "title") && (
                     <p className="text-[10px] text-red-500 mt-1">{getFieldError(errors, "title")}</p>
                   )}
                </div>

                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
                     Subtitle <span className="text-red-500">*</span>
                   </label>
                   <input
                     {...register("subtitle")}
                     className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
                     placeholder="Subtitle"
                   />
                   {getFieldError(errors, "subtitle") && (
                     <p className="text-[10px] text-red-500 mt-1">{getFieldError(errors, "subtitle")}</p>
                   )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">CTA Text</label>
                  <input 
                    {...register("ctaText")}
                    className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors"
                    placeholder="Work With Me"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">CTA Link</label>
                  <input 
                    {...register("ctaLink")}
                    className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent text-sm"
                    placeholder="/contact"
                  />
                </div>
             </div>

             <div className="space-y-8">
                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
                     Video URL <span className="text-red-500">*</span>
                   </label>
                   <CldUploadWidget 
                     uploadPreset={mediaConfig.uploadPreset}
                     options={{ resourceType: "video" }}
                     onSuccess={(result: any) => {
                       setValue("videoUrl", result.info.secure_url);
                     }}
                   >
                     {({ open }) => (
                       <div onClick={() => open()} className="aspect-video bg-black/40 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-all relative overflow-hidden">
                          {watchedVideoUrl ? <video src={watchedVideoUrl} className="w-full h-full object-cover" muted /> : <Play size={24} className="text-primary/40" />}
                          <span className="text-[8px] font-bold uppercase mt-2 text-foreground/40">Upload Video</span>
                       </div>
                     )}
                   </CldUploadWidget>
                   {getFieldError(errors, "videoUrl") && (
                     <p className="text-[10px] text-red-500 mt-1">{getFieldError(errors, "videoUrl")}</p>
                   )}
                </div>

                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-2">
                     Thumbnail <span className="text-red-500">*</span>
                   </label>
                   <CldUploadWidget 
                     uploadPreset={mediaConfig.uploadPreset}
                     onSuccess={(result: any) => {
                       setValue("thumbnailUrl", result.secure_url);
                     }}
                   >
                     {({ open }) => (
                       <div onClick={() => open()} className="aspect-video bg-black/40 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-all relative overflow-hidden">
                          {watchedThumbnailUrl ? <Image src={watchedThumbnailUrl} alt="Preview" fill className="object-cover" /> : <ImageIcon size={24} className="text-primary/40" />}
                          <span className="text-[8px] font-bold uppercase mt-2 text-foreground/40">Upload Image</span>
                       </div>
                     )}
                   </CldUploadWidget>
                   {getFieldError(errors, "thumbnailUrl") && (
                     <p className="text-[10px] text-red-500 mt-1">{getFieldError(errors, "thumbnailUrl")}</p>
                   )}
                </div>

                <div className="flex items-center space-x-4 p-6 bg-accent/10 border border-accent/20">
                    <input 
                      type="checkbox" 
                      id="isActive" 
                      {...register("isActive")}
                      className="w-5 h-5 accent-accent"
                    />
                    <label htmlFor="isActive" className="text-xs font-bold uppercase tracking-widest text-accent">Make this the live showreel</label>
                </div>
             </div>
          </div>

          <div className="flex justify-end space-x-6 pt-6 border-t border-primary/10">
              <button 
                type="button" 
                onClick={() => { setIsAdding(false); resetForm(); }} 
                className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground"
              >
                Cancel
              </button>
<button 
                type="button"
                onClick={handleFormSubmit}
                disabled={createMutation.isPending || isSubmitting}
                className="flex items-center space-x-3 px-10 py-4 bg-accent text-background font-bold uppercase tracking-widest text-[10px] pixel-border hover:scale-105 transition-transform disabled:opacity-50"
              >
                {createMutation.isPending || isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                <span>{createMutation.isPending || isSubmitting ? "Saving..." : "Save Showreel"}</span>
              </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {(showreels ?? []).map((reel: any) => (
          <div key={reel._id} className={`group bg-primary/5 border transition-all ${reel.isActive ? 'border-accent shadow-[0_0_30px_rgba(0,245,212,0.05)]' : 'border-primary/10 opacity-60 hover:opacity-100'}`}>
             <div className="relative aspect-video overflow-hidden">
                <Image src={reel.thumbnailUrl} alt={getString(reel.title)} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button className="w-12 h-12 rounded-full bg-accent text-background flex items-center justify-center">
                      <Play size={20} fill="currentColor" />
                   </button>
                </div>
                {reel.isActive && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2 px-3 py-1 bg-accent text-background text-[8px] font-bold uppercase tracking-widest pixel-border">
                    <CheckCircle size={10} />
                    <span>Active Now</span>
                  </div>
                )}
             </div>
             
             <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="font-display font-bold uppercase tracking-tight text-lg line-clamp-1">{getString(reel.title)}</h3>
                      <p className="text-[10px] text-foreground/40 uppercase tracking-widest">{getString(reel.subtitle)}</p>
                   </div>
                   <button 
                     onClick={() => {
                       if (window.confirm("Are you sure?")) deleteMutation.mutate(reel._id);
                     }}
                     className="p-2 text-foreground/20 hover:text-red-500 transition-colors"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                   <p className="text-[8px] text-foreground/20 uppercase tracking-widest">Added {new Date(reel.createdAt).toLocaleDateString()}</p>
                   {!reel.isActive && (
                      <button 
                        onClick={() => toggleActiveMutation.mutate({ id: reel._id, data: { ...reel, isActive: true }})}
                        className="text-[9px] font-bold uppercase tracking-widest text-accent hover:underline flex items-center space-x-2"
                      >
                         <CheckCircle size={12} />
                         <span>Activate</span>
                      </button>
                   )}
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}