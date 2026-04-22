"use client";

import React, { useState, useEffect } from "react";
import { Upload, Loader2, Save, Settings2, FileText, Layout, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { NewProject, Project, BilingualString } from "@/types";
import BilingualInput from "@/components/admin/BilingualInput";
import { projectSchema } from "@/lib/validations";
import RichTextEditor from "./RichTextEditor";
import DraggableGallery from "./DraggableGallery";
import TagsInput from "./TagsInput";
import SectionsEditor from "./SectionsEditor";

const categories = ["Real Estate", "UGC / Ads", "Social Media", "Corporate", "Brand Film"];

interface ProjectEditorProps {
  initialData?: Project;
  onSave: (data: NewProject | Partial<Project>, options?: { isAutoSave?: boolean }) => void;
  isSaving: boolean;
}

const emptyBilingual = (): BilingualString => ({ en: "", ar: "" });

export default function ProjectEditor({ initialData, onSave, isSaving }: ProjectEditorProps) {
  const [activeTab, setActiveTab] = useState<"general" | "case-study" | "sections" | "media">("general");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasRecoveredData, setHasRecoveredData] = useState(false);
  const [formData, setFormData] = useState<NewProject>({
    title: emptyBilingual(),
    shortDescription: emptyBilingual(),
    fullDescription: emptyBilingual(),
    category: "Real Estate",
    image: "",
    video: "",
    problem: emptyBilingual(),
    strategy: emptyBilingual(),
    solution: emptyBilingual(),
    execution: emptyBilingual(),
    results: emptyBilingual(),
    featured: false,
    gallery: [],
    tags: [],
    sections: [],
    status: "draft",
    displayOrder: 0,
  });

  // Track the last successfully saved data to avoid redundant auto-saves
  const lastSavedRef = React.useRef<string>(JSON.stringify(formData));

  // Recovery logic: check for local storage data on mount
  useEffect(() => {
    if (!initialData?._id) return;
    
    const storageKey = `recovered_project_${initialData._id}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Compare with current database state
        const currentDbState = JSON.stringify({
           ...initialData,
           createdAt: undefined, // ignore dates for comparison
           _id: undefined
        });
        const recoveredState = JSON.stringify({
           ...parsed,
           createdAt: undefined,
           _id: undefined
        });

        if (currentDbState !== recoveredState) {
          setHasRecoveredData(true);
        }
      } catch (e) {
        localStorage.removeItem(storageKey);
      }
    }
  }, [initialData]);

  const restoreData = () => {
    const storageKey = `recovered_project_${initialData?._id}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      setFormData(JSON.parse(savedData));
      setHasRecoveredData(false);
      toast.success("Progress restored from local cache.");
    }
  };

  const clearRecoveredData = () => {
    const storageKey = `recovered_project_${initialData?._id}`;
    localStorage.removeItem(storageKey);
    setHasRecoveredData(false);
  };

  useEffect(() => {
    if (initialData) {
      const data = {
        title: initialData.title || emptyBilingual(),
        shortDescription: initialData.shortDescription || emptyBilingual(),
        fullDescription: initialData.fullDescription || emptyBilingual(),
        category: initialData.category,
        image: initialData.image,
        video: initialData.video || "",
        problem: initialData.problem || emptyBilingual(),
        strategy: initialData.strategy || initialData.solution || emptyBilingual(),
        solution: initialData.solution || emptyBilingual(),
        execution: initialData.execution || emptyBilingual(),
        results: initialData.results || emptyBilingual(),
        featured: initialData.featured,
        gallery: initialData.gallery || [],
        tags: initialData.tags || [],
        sections: initialData.sections || [],
        status: initialData.status || "draft",
        displayOrder: initialData.displayOrder || 0,
      };
      setFormData(data);
      lastSavedRef.current = JSON.stringify(data);
    }
  }, [initialData]);

  // Auto-save logic
  useEffect(() => {
    if (!initialData?._id) return;

    const storageKey = `recovered_project_${initialData._id}`;

    const timer = setTimeout(() => {
      const currentDataStr = JSON.stringify(formData);
      if (currentDataStr !== lastSavedRef.current) {
        // Save to local storage first (instant protection)
        localStorage.setItem(storageKey, currentDataStr);

        // Attempt background sync with DB
        const validation = projectSchema.safeParse(formData);
        if (validation.success) {
          onSave(formData, { isAutoSave: true });
          lastSavedRef.current = currentDataStr;
          setLastSavedAt(new Date());
          // Clear recovery data only after successful DB save is handled via parent if needed,
          // but for safety we keep it until manual save or next successful auto-save
        }
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [formData, initialData?._id, onSave]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = projectSchema.safeParse(formData);
    if (!validation.success) {
      console.error(validation.error);
      const firstError = validation.error.issues[0];
      toast.error(`${firstError.path.join(".")}: ${firstError.message}`);
      return;
    }
    onSave(formData, { isAutoSave: false });
    lastSavedRef.current = JSON.stringify(formData);
    setLastSavedAt(new Date());
    
    // Clear recovery data on manual save
    if (initialData?._id) {
       localStorage.removeItem(`recovered_project_${initialData._id}`);
    }
  };

  return (
    <div className="space-y-12">
      {/* Recovery Alert */}
      <AnimatePresence>
        {hasRecoveredData && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-accent/10 border border-accent p-6 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden"
          >
            <div className="flex items-center space-x-3 text-accent">
              <AlertCircle size={24} />
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Unsaved Session Detected</p>
                <p className="text-xs text-foreground/60">You have changes from a previous session that weren't finalized.</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={restoreData}
                className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest bg-accent text-background px-6 py-3 hover:scale-105 transition-transform pixel-border"
              >
                <RefreshCw size={14} />
                <span>Restore Progress</span>
              </button>
              <button 
                onClick={clearRecoveredData}
                className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors"
              >
                Discard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs Navigation */}
      <div className="flex bg-primary/5 p-1 pixel-border w-fit overflow-x-auto max-w-full">
        {[
          { id: "general", label: "General", icon: Settings2 },
          { id: "case-study", label: "Case Study", icon: FileText },
          { id: "sections", label: "Sections", icon: Layout },
          { id: "media", label: "Media", icon: Upload },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === tab.id ? "bg-accent text-background" : "hover:bg-primary/10"
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-12 pb-20">
        {activeTab === "general" && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <BilingualInput
                  label="Project Title"
                  value={formData.title}
                  onChange={(val) => setFormData({ ...formData, title: val })}
                  required
                />
                
                <div>
                  <label className="pixel-text text-[10px] text-accent block mb-2 uppercase tracking-widest">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-primary/5 border border-primary/20 p-4 outline-none focus:border-accent transition-colors appearance-none text-sm"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="flex items-center space-x-8 p-4 bg-primary/5 border border-primary/10">
                   <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-6 h-6 accent-accent"
                      />
                      <label htmlFor="featured" className="pixel-text text-[10px] uppercase cursor-pointer">Featured</label>
                   </div>
                   <div className="flex items-center space-x-4">
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="bg-transparent border-none outline-none pixel-text text-[10px] uppercase font-bold text-accent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-4">
                  <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">Tags</label>
                  <TagsInput
                    tags={formData.tags}
                    onChange={(tags) => setFormData({ ...formData, tags })}
                  />
                </div>
              </div>

              <div className="space-y-8">
                <BilingualInput
                  label="Short Description (Summary)"
                  value={formData.shortDescription}
                  onChange={(val) => setFormData({ ...formData, shortDescription: val })}
                  type="textarea"
                  rows={3}
                  required
                />
                
                <div className="space-y-4">
                  <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">English Full Description</label>
                  <RichTextEditor
                    content={formData.fullDescription.en}
                    onChange={(val) => setFormData({ ...formData, fullDescription: { ...formData.fullDescription, en: val } })}
                  />
                </div>

                <div className="space-y-4">
                  <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">Arabic Full Description</label>
                  <RichTextEditor
                    content={formData.fullDescription.ar}
                    onChange={(val) => setFormData({ ...formData, fullDescription: { ...formData.fullDescription, ar: val } })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "case-study" && (
          <div className="space-y-12 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 gap-12">
                <BilingualInput
                  label="The Problem"
                  value={formData.problem || emptyBilingual()}
                  onChange={(val) => setFormData({ ...formData, problem: val })}
                  type="textarea"
                />
                <BilingualInput
                  label="The Strategy"
                  value={formData.strategy || emptyBilingual()}
                  onChange={(val) => setFormData({ ...formData, strategy: val })}
                  type="textarea"
                />
                <BilingualInput
                  label="Execution"
                  value={formData.execution || emptyBilingual()}
                  onChange={(val) => setFormData({ ...formData, execution: val })}
                  type="textarea"
                />
                <BilingualInput
                  label="The Results"
                  value={formData.results || emptyBilingual()}
                  onChange={(val) => setFormData({ ...formData, results: val })}
                  type="textarea"
                />
             </div>
          </div>
        )}

        {activeTab === "sections" && (
          <div className="animate-in fade-in duration-500">
            <SectionsEditor
              sections={formData.sections}
              onChange={(sections) => setFormData({ ...formData, sections })}
            />
          </div>
        )}

        {activeTab === "media" && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Cover Image */}
               <div className="space-y-4">
                  <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">Cover Image</label>
                  <CldUploadWidget
                    uploadPreset="amr_portfolio_preset"
                    onSuccess={(result) => {
                      if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                        setFormData({ ...formData, image: (result.info as any).secure_url });
                        toast.success("Cover image uploaded!");
                      }
                    }}
                  >
                    {({ open }) => (
                      <div
                        onClick={() => open()}
                        className="aspect-video bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors overflow-hidden relative pixel-border"
                      >
                        {formData.image ? (
                          <Image src={formData.image} alt="Preview" fill className="object-cover" />
                        ) : (
                          <>
                            <Upload className="text-primary/40 mb-2" />
                            <span className="text-[10px] text-foreground/40 font-bold uppercase">Upload Cover</span>
                          </>
                        )}
                      </div>
                    )}
                  </CldUploadWidget>
               </div>

               {/* Video Link */}
               <div className="space-y-4">
                  <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">Featured Video URL</label>
                  <input
                    type="text"
                    value={formData.video}
                    onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    className="w-full bg-primary/5 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm"
                    placeholder="https://vimeo.com/..."
                  />
                  <p className="text-[9px] text-foreground/30 uppercase">Direct link to mp4 or Vimeo/YouTube URL</p>
               </div>
            </div>

            {/* Gallery */}
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">Gallery Assets (Drag to reorder)</label>
                  <CldUploadWidget
                    uploadPreset="amr_portfolio_preset"
                    onSuccess={(result) => {
                      if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                        setFormData(prev => ({ 
                          ...prev, 
                          gallery: [...prev.gallery, (result.info as any).secure_url] 
                        }));
                        toast.success("Asset added to gallery!");
                      }
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-background transition-all"
                      >
                        <Plus size={14} />
                        <span>Add Asset</span>
                      </button>
                    )}
                  </CldUploadWidget>
               </div>

               <DraggableGallery
                 items={formData.gallery}
                 onChange={(gallery) => setFormData({ ...formData, gallery })}
                 onRemove={(url) => setFormData(prev => ({
                   ...prev,
                   gallery: prev.gallery.filter(item => item !== url)
                 }))}
               />
            </div>
          </div>
        )}

        {/* Global Action Bar */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 p-6 bg-background/80 backdrop-blur-md border-t border-primary/10 z-50 flex items-center justify-between">
           <div className="flex items-center space-x-4">
              {lastSavedAt && (
                <div className="flex items-center space-x-2 text-foreground/40">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="pixel-text text-[9px] uppercase tracking-widest font-bold">
                    Last Saved: {lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
           </div>
           
           <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-3 px-12 py-4 bg-accent text-background font-bold uppercase tracking-[0.3em] text-xs pixel-border hover:scale-105 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>{initialData ? "Update Project" : "Publish Project"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
