"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { TestimonialService } from "@/lib/api-client";
import { testimonialCreateSchema, testimonialDefaultValues } from "@/lib/validation/testimonial";
import { toast } from "sonner";

type FormData = typeof testimonialDefaultValues;

export default function EditTestimonialPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<FormData>(testimonialDefaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: testimonial, isLoading } = useQuery({
    queryKey: ["testimonial", id],
    queryFn: () => TestimonialService.getById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (testimonial?.data) {
      const t = testimonial.data;
      const newStatus: "draft" | "published" = t.status === "published" ? "published" : "draft";
      setFormData({
        name: t.name || "",
        role: t.role || "",
        company: t.company || "",
        quote: t.quote || "",
        projectSlug: t.projectSlug || "",
        avatar: t.avatar || "",
        rating: t.rating || 5,
        isFeatured: t.isFeatured || false,
        status: newStatus,
        displayOrder: t.displayOrder || 0,
      });
    }
  }, [testimonial]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => TestimonialService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial updated");
      router.push("/admin/testimonials");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = testimonialCreateSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setErrors({});
    mutation.mutate(formData);
  };

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <header className="flex items-center gap-4">
        <Link 
          href="/admin/testimonials" 
          className="p-2 hover:text-accent transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-tighter">
            Edit Testimonial
          </h1>
          <p className="text-foreground/50 pixel-text text-xs uppercase tracking-widest">
            Update testimonial details
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-primary/5 border border-primary/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-accent">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-accent">Role *</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => updateField("role", e.target.value)}
              className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-accent">Company *</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => updateField("company", e.target.value)}
              className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-accent">Project Slug</label>
            <input
              type="text"
              value={formData.projectSlug}
              onChange={(e) => updateField("projectSlug", e.target.value)}
              className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold uppercase text-accent">Quote *</label>
            <textarea
              value={formData.quote}
              onChange={(e) => updateField("quote", e.target.value)}
              className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent h-32 resize-none"
            />
            {errors.quote && <p className="text-red-500 text-xs">{errors.quote}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-accent">Display Order</label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => updateField("displayOrder", parseInt(e.target.value) || 0)}
              className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-accent">Status</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateField("status", "draft")}
                className={`flex-1 py-3 text-xs font-bold uppercase ${
                  formData.status === "draft" 
                    ? "bg-yellow-500 text-background" 
                    : "bg-background border border-primary/20"
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => updateField("status", "published")}
                className={`flex-1 py-3 text-xs font-bold uppercase ${
                  formData.status === "published" 
                    ? "bg-green-500 text-background" 
                    : "bg-background border border-primary/20"
                }`}
              >
                Published
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => updateField("isFeatured", e.target.checked)}
                className="w-5 h-5 accent-accent"
              />
              <span className="text-sm font-medium">Featured Testimonial</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-primary/10">
          <Link
            href="/admin/testimonials"
            className="px-6 py-3 border border-primary/20 text-foreground/60 font-bold uppercase tracking-widest text-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-3 px-8 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}