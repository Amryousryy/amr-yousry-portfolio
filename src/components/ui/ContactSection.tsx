"use client";

import { useRef, useEffect, useState } from "react";
import { Calendar, Mail, MessageCircle, CheckCircle, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ContactSectionProps {
  projectId?: string;
  projectTitle?: string;
}

export default function ContactSection({ projectId, projectTitle }: ContactSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ... existing GSAP code
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          projectType: projectTitle ? `Project Inquiry: ${projectTitle}` : "General Inquiry",
          offerType: "general",
          metadata: projectId ? { projectId } : undefined
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      toast.success("Message sent successfully!");
      
      setTimeout(() => setSubmitSuccess(false), 8000);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 md:py-32 bg-[#050508]">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            ref={headingRef}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Ready to Scale Your Brand?
          </h2>
          <p className="text-foreground/60 text-lg mb-8">
            Book a free 15-minute strategy call. I'll audit your current content and show you exactly how to improve it.
          </p>

          {/* Primary CTA - Single strong action */}
          <a
            href="https://calendly.com/your-link"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full md:w-auto md:inline-block px-12 py-5 bg-[#00ffcc] text-[#050508] font-bold uppercase tracking-[0.2em] text-sm hover:shadow-[0_0_50px_rgba(0,245,212,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mb-6"
          >
            Book Free Strategy Call
          </a>

          {/* Urgency */}
          <p className="text-[#00ffcc]/60 text-[10px] font-mono tracking-wider mb-8">
            ⏳ Only 2 new projects accepted for May 2026
          </p>

          {/* Alternative */}
          <p className="text-foreground/40 text-sm">
            Or email me directly at{" "}
            <a href="mailto:hello@amryousry.com" className="text-[#00ffcc] hover:underline">
              hello@amryousry.com
            </a>
          </p>

          {/* Trust signals */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-foreground/50">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00ffcc]" />
                <span>24hr response</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00ffcc]" />
                <span>Free consult</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00ffcc]" />
                <span>No spam</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}