"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Info, Target, Mail } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "@/lib/api-client";
import { siteContentSchema } from "@/lib/validations";
import { toast } from "sonner";
import { SiteContent } from "@/types";
import BilingualInput from "@/components/admin/BilingualInput";

export default function SiteContentManagerPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"about" | "services" | "contact">("about");
  const [formData, setFormData] = useState<Partial<SiteContent>>({
    about: { en: "", ar: "" },
    servicesTitle: { en: "", ar: "" },
    servicesDescription: { en: "", ar: "" },
    contactEmail: "",
    whatsappNumber: "",
    socialLinks: {
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: "",
    },
  });

  const { data: content, isLoading } = useQuery({
    queryKey: ["site-content"],
    queryFn: () => SettingsService.getContent(),
  });

  useEffect(() => {
    if (content?.data && Object.keys(content.data).length > 0) {
      setFormData(content.data);
    }
  }, [content]);

  const mutation = useMutation({
    mutationFn: (data: Partial<SiteContent>) => SettingsService.updateContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Site content updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update site content");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = siteContentSchema.safeParse(formData);
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

  const tabs = [
    { id: "about", name: "About Section", icon: Info },
    { id: "services", name: "Services Section", icon: Target },
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
        </div>
        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="flex items-center space-x-3 px-8 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-transform disabled:opacity-50"
        >
          {mutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          <span>Save All Content</span>
        </button>
      </header>

      <div className="flex bg-primary/5 p-1 pixel-border w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-3 px-6 py-3 text-[10px] font-bold uppercase transition-all ${activeTab === tab.id ? 'bg-accent text-background' : 'text-foreground/40 hover:text-foreground'}`}
          >
            <tab.icon size={14} />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="p-8 bg-primary/5 border border-primary/10">
        <form onSubmit={handleSubmit} className="space-y-12">
          {activeTab === "about" && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4 mb-4">About Story</h3>
               <BilingualInput 
                  label="About Description" 
                  value={formData.about as any} 
                  onChange={(val) => setFormData({ ...formData, about: val })}
                  type="textarea"
                  rows={10}
               />
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4 mb-4">Services Introduction</h3>
               <BilingualInput 
                  label="Services Section Title" 
                  value={formData.servicesTitle as any} 
                  onChange={(val) => setFormData({ ...formData, servicesTitle: val })}
               />
               <BilingualInput 
                  label="Services Section Description" 
                  value={formData.servicesDescription as any} 
                  onChange={(val) => setFormData({ ...formData, servicesDescription: val })}
                  type="textarea"
               />
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4 mb-8">Direct Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="pixel-text text-[10px] text-foreground/40 block uppercase">Public Contact Email</label>
                      <input 
                        type="email" 
                        value={formData.contactEmail} 
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent text-sm"
                        placeholder="amr@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="pixel-text text-[10px] text-foreground/40 block uppercase">WhatsApp Number (with country code)</label>
                      <input 
                        type="text" 
                        value={formData.whatsappNumber} 
                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                        className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent text-sm"
                        placeholder="201000000000"
                      />
                    </div>
                  </div>
               </div>

               <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4 mb-8">Social Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {["instagram", "twitter", "youtube", "linkedin"].map((platform) => (
                      <div key={platform} className="space-y-2">
                        <label className="pixel-text text-[10px] text-foreground/40 block uppercase">{platform}</label>
                        <input 
                          type="url" 
                          value={(formData.socialLinks as any)?.[platform] || ""} 
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            socialLinks: { ...formData.socialLinks, [platform]: e.target.value } 
                          })}
                          className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent text-sm"
                          placeholder={`https://${platform}.com/yourprofile`}
                        />
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
