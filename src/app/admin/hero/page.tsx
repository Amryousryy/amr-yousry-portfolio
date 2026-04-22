"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Play, Image as ImageIcon, Upload, Link as LinkIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "@/lib/api-client";
import { heroSchema } from "@/lib/validations";
import { toast } from "sonner";
import { HeroSettings } from "@/types";
import BilingualInput from "@/components/admin/BilingualInput";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

export default function HeroManagerPage() {
  const queryClient = useQueryClient();
  const [videoMode, setVideoMode] = useState<"upload" | "url">("url");
  const [formData, setFormData] = useState<Partial<HeroSettings>>({
    headline: { en: "", ar: "" },
    subheadline: { en: "", ar: "" },
    primaryCTA: { en: "Work With Me", ar: "أعمل معي" },
    primaryCTALink: "/#contact",
    secondaryCTA: { en: "Watch Showreel", ar: "شاهد أعمالي" },
    secondaryCTALink: "/projects",
    posterImage: "",
    showreelVideo: "",
    status: "draft",
  });

  const { data: hero, isLoading } = useQuery({
    queryKey: ["hero-settings"],
    queryFn: () => SettingsService.getHero(),
  });

  useEffect(() => {
    if (hero?.data && Object.keys(hero.data).length > 0) {
      setFormData(hero.data);
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
    const validation = heroSchema.safeParse(formData);
    if (!validation.success) {
      toast.error("Please fill all required fields correctly.");
      console.error(validation.error);
      return;
    }
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 uppercase tracking-tighter">Hero Manager</h1>
          <p className="text-foreground/50 pixel-text text-xs uppercase tracking-widest">
            Control your landing page entrance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-primary/10 p-1 pixel-border">
            <button
              onClick={() => setFormData({ ...formData, status: "draft" })}
              className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${formData.status === 'draft' ? 'bg-yellow-500 text-background' : 'text-foreground/40 hover:text-foreground'}`}
            >
              Draft
            </button>
            <button
              onClick={() => setFormData({ ...formData, status: "published" })}
              className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${formData.status === 'published' ? 'bg-green-500 text-background' : 'text-foreground/40 hover:text-foreground'}`}
            >
              Published
            </button>
          </div>
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
          {/* Headlines */}
          <div className="p-8 bg-primary/5 border border-primary/10 space-y-8">
             <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4 mb-4">Text Content</h3>
             <BilingualInput 
                label="Headline" 
                value={formData.headline as any} 
                onChange={(val) => setFormData({ ...formData, headline: val })}
                type="textarea"
                rows={2}
             />
             <BilingualInput 
                label="Subheadline" 
                value={formData.subheadline as any} 
                onChange={(val) => setFormData({ ...formData, subheadline: val })}
                type="textarea"
             />
          </div>

          {/* CTA Settings */}
          <div className="p-8 bg-primary/5 border border-primary/10 space-y-8">
             <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4 mb-4">Call to Action Buttons</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <BilingualInput 
                    label="Primary CTA Label" 
                    value={formData.primaryCTA as any} 
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
                  <BilingualInput 
                    label="Secondary CTA Label" 
                    value={formData.secondaryCTA as any} 
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
          {/* Media Assets */}
          <div className="p-8 bg-primary/5 border border-primary/10 space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4 mb-4">Cinematic Assets</h3>
            
            {/* Showreel Video */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="pixel-text text-[10px] text-foreground/40 block uppercase">Showreel Video</label>
                <div className="flex bg-primary/10 p-1 pixel-border">
                  <button
                    onClick={() => setVideoMode("url")}
                    className={`p-1.5 transition-all ${videoMode === 'url' ? 'bg-accent text-background' : 'text-foreground/40'}`}
                    title="External URL"
                  >
                    <LinkIcon size={12} />
                  </button>
                  <button
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
                  uploadPreset="amr_portfolio_preset"
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

            {/* Poster Image */}
            <div className="space-y-4">
              <label className="pixel-text text-[10px] text-foreground/40 block uppercase">Background / Poster Image</label>
              <CldUploadWidget 
                uploadPreset="amr_portfolio_preset"
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

          {/* Quick Preview */}
          <div className="p-8 bg-accent text-background pixel-border">
             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Cinematic Preview</h3>
             <p className="text-xs mb-6 opacity-80">Check how your showreel looks with the entrance headlines.</p>
             <button 
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
