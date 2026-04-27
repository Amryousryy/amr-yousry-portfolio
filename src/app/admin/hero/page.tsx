"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Play, Image as ImageIcon, Upload, Link as LinkIcon, Eye } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "@/lib/api-client";
import { heroCreateSchema } from "@/lib/validation";
import { toast } from "sonner";
import { HeroSettings } from "@/types";
import StringInput from "@/components/admin/BilingualInput";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import AdminLoadingSkeleton from "@/components/admin/AdminLoadingSkeleton";
import AdminErrorState from "@/components/admin/AdminErrorState";
import { mediaConfig } from "@/lib/media/config";

function getString(value: string | { en: string; ar: string } | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.en || "";
}

export default function HeroManagerPage() {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [videoMode, setVideoMode] = useState<"upload" | "url">("url");
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState<Partial<HeroSettings>>({
    headline: "",
    subheadline: "",
    primaryCTA: "Work With Me",
    primaryCTALink: "/#contact",
    secondaryCTA: "View Projects",
    secondaryCTALink: "/projects",
    posterImage: "",
    showreelVideo: "",
    status: "draft",
  });

  const { data: hero, isLoading, isError, refetch } = useQuery({
    queryKey: ["hero-settings"],
    queryFn: () => SettingsService.getHero(),
  });

  useEffect(() => {
    if (hero?.data && typeof hero.data === 'object' && Object.keys(hero.data).length > 0) {
      const data = hero.data as HeroSettings;
      setFormData({
        headline: getString(data.headline),
        subheadline: getString(data.subheadline),
        primaryCTA: getString(data.primaryCTA),
        primaryCTALink: data.primaryCTALink || "/#contact",
        secondaryCTA: getString(data.secondaryCTA),
        secondaryCTALink: data.secondaryCTALink || "/projects",
        posterImage: data.posterImage || "",
        showreelVideo: data.showreelVideo || "",
        status: data.status || "draft",
        publishedAt: data.publishedAt,
        lastStatusChangeAt: data.lastStatusChangeAt,
      });
    }
  }, [hero]);

  const mutation = useMutation({
    mutationFn: (data: Partial<HeroSettings>) => SettingsService.updateHero(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-settings"] });
      toast.success("Hero settings updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update hero settings");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = heroCreateSchema.safeParse(formData);
    if (!validation.success) {
      toast.error("Please fill all required fields correctly.");
      console.error(validation.error);
      return;
    }
    mutation.mutate(formData);
  };

  if (isLoading) {
    return <AdminLoadingSkeleton />;
  }

  if (isError) {
    return <AdminErrorState message="Failed to load hero settings" onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 uppercase tracking-tighter">Hero Manager</h1>
          <p className="text-foreground/50 pixel-text text-xs uppercase tracking-widest">
            Control your landing page entrance
          </p>
          {formData.status && (
            <div className="flex items-center gap-3 mt-2 text-[10px]">
              <span className={`px-2 py-1 font-bold uppercase ${formData.status === 'published' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                {formData.status}
              </span>
              {formData.publishedAt && mounted && (
                <span className="text-foreground/30">
                  Published: {new Date(formData.publishedAt).toLocaleDateString()}
                </span>
              )}
              {formData.lastStatusChangeAt && mounted && (
                <span className="text-foreground/30">
                  Updated: {new Date(formData.lastStatusChangeAt).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-primary/10 p-1 pixel-border">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: "draft" })}
              className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${formData.status === 'draft' ? 'bg-yellow-500 text-background' : 'text-foreground/40 hover:text-foreground'}`}
            >
              Draft
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: "published" })}
              className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${formData.status === 'published' ? 'bg-green-500 text-background' : 'text-foreground/40 hover:text-foreground'}`}
            >
              Published
            </button>
          </div>
          <a
            href="/preview?preview=true"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-3 bg-yellow-500/20 text-yellow-500 font-bold uppercase tracking-widest text-xs pixel-border hover:bg-yellow-500/30 transition-colors"
          >
            <Eye size={14} />
            <span>Preview</span>
          </a>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="flex items-center space-x-3 px-8 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-transform disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>Save Changes</span>
          </button>
        </div>
      </header> 

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-12">
          <div className="p-8 bg-primary/5 border border-primary/10 space-y-8">
             <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4 mb-4">Text Content</h3>
             <StringInput 
               label="Headline" 
               value={formData.headline || ""} 
               onChange={(val) => setFormData({ ...formData, headline: val })}
               type="textarea"
               rows={2}
             />
             <StringInput 
               label="Subheadline" 
               value={formData.subheadline || ""} 
               onChange={(val) => setFormData({ ...formData, subheadline: val })}
               type="textarea"
             />
          </div>

          <div className="p-8 bg-primary/5 border border-primary/10 space-y-8">
             <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4 mb-4">Call to Action Buttons</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6">
                 <StringInput 
                   label="Primary CTA Label" 
                   value={formData.primaryCTA || ""} 
                   onChange={(val) => setFormData({ ...formData, primaryCTA: val })}
                 />
                 <div>
                   <label className="pixel-text text-[10px] text-foreground/40 block mb-2 uppercase">Link</label>
                   <input 
                     type="text" 
                     value={formData.primaryCTALink} 
                     onChange={(e) => setFormData({ ...formData, primaryCTALink: e.target.value })}
                     className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent text-sm"
                   />
                 </div>
               </div>
               <div className="space-y-6">
                 <StringInput 
                   label="Secondary CTA Label" 
                   value={formData.secondaryCTA || ""} 
                   onChange={(val) => setFormData({ ...formData, secondaryCTA: val })}
                 />
                 <div>
                   <label className="pixel-text text-[10px] text-foreground/40 block mb-2 uppercase">Link</label>
                   <input 
                     type="text" 
                     value={formData.secondaryCTALink} 
                     onChange={(e) => setFormData({ ...formData, secondaryCTALink: e.target.value })}
                     className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent text-sm"
                   />
                 </div>
               </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-primary/5 border border-primary/10 space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4 mb-4">Cinematic Assets</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="pixel-text text-[10px] text-foreground/40 block uppercase">Showreel Video</label>
                <div className="flex bg-primary/10 p-1 pixel-border">
                  <button
                    type="button"
                    onClick={() => setVideoMode("url")}
                    className={`p-1.5 transition-all ${videoMode === 'url' ? 'bg-accent text-background' : 'text-foreground/40'}`}
                    title="External URL"
                  >
                    <LinkIcon size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoMode("upload")}
                    className={`p-1.5 transition-all ${videoMode === 'upload' ? 'bg-accent text-background' : 'text-foreground/40'}`}
                    title="Cloudinary Upload"
                  >
                    <Upload size={12} />
                  </button>
                </div>
              </div>

              {videoMode === "url" ? (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-black pixel-border flex items-center justify-center group overflow-hidden">
                    {formData.showreelVideo ? (
                      <video src={formData.showreelVideo} className="w-full h-full object-cover" muted />
                    ) : (
                      <Play size={40} className="text-primary/20" />
                    )}
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                       <input 
                       type="text" 
                       placeholder="Paste Direct Video URL (mp4)..."
                       value={formData.showreelVideo}
                       onChange={(e) => setFormData({ ...formData, showreelVideo: e.target.value })}
                       className="w-full bg-background border border-accent p-3 text-xs outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-[9px] text-foreground/30 uppercase tracking-tighter">Use direct .mp4 links for best performance</p>
                </div>
              ) : (
                <CldUploadWidget 
                  uploadPreset={mediaConfig.uploadPreset}
                  options={{ resourceType: "video" }}
                  onSuccess={(result) => {
                    if (typeof result.info === 'object' && 'secure_url' in result.info) {
                      setFormData({ ...formData, showreelVideo: result.info.secure_url as string });
                      toast.success("Showreel uploaded!");
                    }
                  }}
                >
                  {({ open }) => (
                    <div 
                      onClick={() => open()}
                      className="relative aspect-video bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors overflow-hidden"
                    >
                      {formData.showreelVideo ? (
                        <video src={formData.showreelVideo} className="w-full h-full object-cover" muted />
                      ) : (
                        <>
                          <Upload className="text-primary/40 mb-2" />
                          <span className="text-[10px] text-foreground/40 font-bold uppercase">Upload Showreel</span>
                        </>
                      )}
                    </div>
                  )}
                </CldUploadWidget>
              )}
            </div>

            <div className="space-y-4">
              <label className="pixel-text text-[10px] text-foreground/40 block uppercase">Background / Poster Image</label>
              <CldUploadWidget 
                uploadPreset={mediaConfig.uploadPreset}
                onSuccess={(result) => {
                  if (typeof result.info === 'object' && 'secure_url' in result.info) {
                    setFormData({ ...formData, posterImage: result.info.secure_url as string });
                    toast.success("Poster image updated!");
                  }
                }}
              >
                {({ open }) => (
                  <div 
                    onClick={() => open()}
                    className="relative aspect-video bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors overflow-hidden"
                  >
                    {formData.posterImage ? (
                      <Image src={formData.posterImage} alt="Poster" fill className="object-cover" />
                    ) : (
                      <>
                        <ImageIcon className="text-primary/40 mb-2" />
                        <span className="text-[10px] text-foreground/40 font-bold uppercase">Upload Poster</span>
                      </>
                    )}
                  </div>
                )}
              </CldUploadWidget>
            </div>
          </div>

          <div className="p-8 bg-accent text-background pixel-border">
             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Cinematic Preview</h3>
             <p className="text-xs mb-6 opacity-80">Check how your showreel looks with the entrance headlines.</p>
             <button 
               type="button"
               onClick={() => window.open('/', '_blank')}
               className="w-full py-3 border-2 border-background text-[10px] font-bold uppercase tracking-widest hover:bg-background hover:text-accent transition-all"
             >
                View Live Site
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}