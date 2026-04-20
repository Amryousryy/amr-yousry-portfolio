"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/lib/api-client";
import { projectSchema } from "@/lib/validations";
import { toast } from "sonner";
import { NewProject, BilingualString, ContentStatus } from "@/types";
import BilingualInput from "@/components/admin/BilingualInput";
import Image from "next/image";

const categories = ["Real Estate", "UGC / Ads", "Social Media", "Corporate", "Brand Film"];

const emptyBilingual = (): BilingualString => ({ en: "", ar: "" });

export default function NewProjectPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<NewProject>({
    title: emptyBilingual(),
    shortDescription: emptyBilingual(),
    fullDescription: emptyBilingual(),
    category: "Real Estate",
    image: "",
    video: "",
    problem: emptyBilingual(),
    solution: emptyBilingual(),
    results: emptyBilingual(),
    featured: false,
    gallery: [],
    status: "draft" as ContentStatus,
    displayOrder: 0,
  });

  const mutation = useMutation({
    mutationFn: (data: NewProject) => ProjectService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project saved successfully!");
      router.push("/admin");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save project");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = projectSchema.safeParse(formData);
    if (!validation.success) {
      console.error(validation.error);
      toast.error("Please fill all required fields correctly.");
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="flex justify-between items-center mb-12">
          <Link href="/admin" className="flex items-center space-x-2 text-accent group">
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            <span className="pixel-text text-xs">Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-display font-bold">New Project</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <BilingualInput
                label="Project Title"
                value={formData.title}
                onChange={(val) => setFormData({ ...formData, title: val })}
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
            </div>

            <div className="space-y-6">
              <label className="pixel-text text-[10px] text-accent block mb-2 uppercase tracking-widest">Cover Media</label>
              <CldUploadWidget
                uploadPreset="amr_portfolio_preset"
                onSuccess={(result) => {
                  if (typeof result.info === 'object' && 'secure_url' in result.info) {
                    setFormData({ ...formData, image: result.info.secure_url as string });
                    toast.success("Image uploaded!");
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
                        <span className="text-xs text-foreground/40 font-bold uppercase">Upload Image</span>
                      </>
                    )}
                  </div>
                )}
              </CldUploadWidget>
            </div>
          </div>

          <div className="space-y-8">
            <BilingualInput
              label="Short Description"
              value={formData.shortDescription}
              onChange={(val) => setFormData({ ...formData, shortDescription: val })}
              type="textarea"
              rows={2}
            />
            
            <BilingualInput
              label="Full Description"
              value={formData.fullDescription}
              onChange={(val) => setFormData({ ...formData, fullDescription: val })}
              type="textarea"
              rows={5}
            />
          </div>

          <div className="space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent border-b border-primary/10 pb-4">Detailed Case Study</h3>
            
            <BilingualInput
              label="The Problem"
              value={formData.problem || emptyBilingual()}
              onChange={(val) => setFormData({ ...formData, problem: val })}
              type="textarea"
            />
            
            <BilingualInput
              label="The Solution"
              value={formData.solution || emptyBilingual()}
              onChange={(val) => setFormData({ ...formData, solution: val })}
              type="textarea"
            />
            
            <BilingualInput
              label="The Results"
              value={formData.results || emptyBilingual()}
              onChange={(val) => setFormData({ ...formData, results: val })}
              type="textarea"
            />
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-6 h-6 accent-accent"
            />
            <label htmlFor="featured" className="pixel-text text-xs uppercase cursor-pointer">Feature on Home Page</label>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-6 bg-accent text-background font-bold uppercase tracking-[0.3em] pixel-border hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center space-x-4"
          >
            {mutation.isPending && <Loader2 className="animate-spin" size={24} />}
            <span>{mutation.isPending ? "Saving..." : "Save Project"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
