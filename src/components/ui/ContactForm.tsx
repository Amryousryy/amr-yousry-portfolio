"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const projectTypes = ["Commercial / Ad", "UGC Campaign", "Corporate Video", "Brand Story", "Social Media Package"];

export default function ContactForm({ isAuditOffer = false }: { isAuditOffer?: boolean }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: projectTypes[0],
    message: isAuditOffer ? "I would like to request a free content audit for my brand." : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          offerType: isAuditOffer ? "free_audit" : "general"
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        toast.success("Message received! I'll get back to you within 24 hours.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to connect. Please check your internet.");
    } finally {
      setIsSubmitting(false);
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
    <form onSubmit={handleSubmit} className="space-y-8 p-10 bg-primary/5 border border-primary/10 pixel-border relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <MessageSquare size={120} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="pixel-text text-[10px] text-accent uppercase tracking-widest font-bold">Your Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-background/50 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm uppercase tracking-tight"
            placeholder="ALEX JOHNSON"
          />
        </div>
        <div className="space-y-2">
          <label className="pixel-text text-[10px] text-accent uppercase tracking-widest font-bold">Email Address</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-background/50 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm uppercase tracking-tight"
            placeholder="ALEX@COMPANY.COM"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="pixel-text text-[10px] text-accent uppercase tracking-widest font-bold">Project Category</label>
        <select
          value={formData.projectType}
          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
          className="w-full bg-background/50 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm uppercase tracking-tight appearance-none"
        >
          {projectTypes.map(type => <option key={type} value={type}>{type.toUpperCase()}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className="pixel-text text-[10px] text-accent uppercase tracking-widest font-bold">Your Vision / Project Details</label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-background/50 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm uppercase tracking-tight resize-none"
          placeholder="TELL ME ABOUT YOUR GOALS..."
        />
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
