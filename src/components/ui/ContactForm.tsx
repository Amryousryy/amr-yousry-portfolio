"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { leadPublicSchema, LeadPublicInput, leadDefaultValues } from "@/lib/validation";

const projectTypes = [
  { value: "Commercial / Ad", label: "Commercial / Ad" },
  { value: "UGC Campaign", label: "UGC Campaign" },
  { value: "Corporate Video", label: "Corporate Video" },
  { value: "Brand Story", label: "Brand Story" },
  { value: "Social Media Package", label: "Social Media Package" },
];

const defaultProjectType = projectTypes[0].value;

function ContactForm({ isAuditOffer = false }: { isAuditOffer?: boolean }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadPublicInput>({
    resolver: zodResolver(leadPublicSchema),
    defaultValues: {
      ...leadDefaultValues,
      projectType: defaultProjectType,
      message: isAuditOffer ? "I would like to request a free content audit for my brand." : "",
    },
  });

  const onSubmit = async (data: LeadPublicInput) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          offerType: isAuditOffer ? "free_audit" : "general",
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        toast.success("Message received! I'll get back to you within 24 hours.");
        reset();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to connect. Please check your internet.");
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-12 bg-accent/10 border-2 border-accent text-center space-y-6 pixel-border"
      >
        <div className="w-20 h-20 bg-accent text-background rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={40} />
        </div>
        <h3 className="text-3xl font-display font-bold uppercase tracking-tighter">Mission Accepted!</h3>
        <p className="text-foreground/60 uppercase tracking-widest text-xs">
          I've received your request. Expect a response in your inbox very soon.
        </p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="text-accent text-[10px] font-bold uppercase tracking-widest hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-10 bg-primary/5 border border-primary/10 pixel-border relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <MessageSquare size={120} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="pixel-text text-[10px] text-accent uppercase tracking-widest font-bold">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            className="w-full bg-background/50 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm uppercase tracking-tight"
            placeholder="ALEX JOHNSON"
          />
          {errors.name && (
            <p className="text-[10px] text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="pixel-text text-[10px] text-accent uppercase tracking-widest font-bold">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full bg-background/50 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm uppercase tracking-tight"
            placeholder="ALEX@COMPANY.COM"
          />
          {errors.email && (
            <p className="text-[10px] text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="pixel-text text-[10px] text-accent uppercase tracking-widest font-bold">
          Project Category <span className="text-red-500">*</span>
        </label>
        <select
          {...register("projectType")}
          className="w-full bg-background/50 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm uppercase tracking-tight appearance-none"
        >
          {projectTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label.toUpperCase()}
            </option>
          ))}
        </select>
        {errors.projectType && (
          <p className="text-[10px] text-red-500">{errors.projectType.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="pixel-text text-[10px] text-accent uppercase tracking-widest font-bold">
          Your Vision / Project Details <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("message")}
          rows={4}
          className="w-full bg-background/50 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm uppercase tracking-tight resize-none"
          placeholder="TELL ME ABOUT YOUR GOALS..."
        />
        {errors.message && (
          <p className="text-[10px] text-red-500">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-5 bg-accent text-background font-bold uppercase tracking-[0.4em] text-xs pixel-border hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-4 disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            <span>{isAuditOffer ? "CLAIM MY FREE AUDIT" : "INITIATE TRANSFORMATION"}</span>
            <Send size={18} />
          </>
        )}
      </button>

      <p className="text-center text-[8px] text-foreground/20 uppercase tracking-[0.2em]">
        No spam. Only high-converting content strategy.
      </p>
    </form>
  );
}

export { ContactForm };
export default ContactForm;