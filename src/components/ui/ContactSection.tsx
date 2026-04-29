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
    <section id="contact" ref={sectionRef} data-frame="07" className="py-24 md:py-32 bg-[#050508]">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Frame Logic Header */}
          <div className="mb-12">
            <div className="frame-number mb-2">FRAME 07</div>
            <div className="frame-divider" />
            <h2
              ref={headingRef}
              className="text-hero font-black text-white mt-6 mb-6 tracking-tighter"
            >
              Ready to turn your<br />
              <span className="text-[#00ffcc]">multimedia into growth?</span>
            </h2>
            <p className="text-display text-white/60 mb-8">
              Book a free 15-minute strategy call to discuss your project and discover how I can help you scale.
            </p>
          </div>

          {/* CTA Hierarchy */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {/* Primary CTA */}
            <a
              href="/contact"
              className="px-12 py-5 bg-[#00ffcc] text-[#050508] font-bold uppercase tracking-[0.15em] text-[11px] hover:bg-[#00ffcc]/90 transition-all duration-300"
            >
              Get a Quote
            </a>

            {/* Secondary CTA */}
            <a
              href="https://calendly.com/your-link"
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-5 border border-[#00ffcc]/30 text-[#00ffcc] font-bold uppercase tracking-[0.15em] text-[11px] hover:bg-[#00ffcc]/10 transition-all duration-300"
            >
              Book Free Strategy Call
            </a>
          </div>

          {/* Tertiary CTA */}
          <div className="mb-8">
            <a
              href="/projects"
              className="text-[#00ffcc]/60 text-[11px] uppercase tracking-[0.15em] hover:text-[#00ffcc] transition-colors"
            >
              View My Work
            </a>
          </div>

          {/* Urgency */}
          <p className="text-[#00ffcc]/60 text-[10px] font-mono tracking-wider mb-12">
            Only 2 new projects accepted for May 2026
          </p>

          {/* Trust Indicators - Frame-styled */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { value: "50M+", label: "Views", context: "Across campaigns" },
              { value: "3.5X", label: "Avg ROI", context: "Increase proven" },
              { value: "100+", label: "Brands", context: "Scaled to 6 figs" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#0a0a0f] p-6 border border-white/5">
                <div className="text-hero text-[#00ffcc] font-black mb-1">{stat.value}</div>
                <div className="text-mono text-white/80 text-[10px] tracking-[0.15em] mb-1">{stat.label}</div>
                <div className="text-mono text-white/30 text-[8px]">{stat.context}</div>
              </div>
            ))}
          </div>

          {/* Geographic Trust */}
          <div className="text-mono text-white/30 text-[10px] tracking-wider mb-8">
            TRUSTED IN EGYPT & SAUDI ARABIA
          </div>

          {/* Email Fallback */}
          <p className="text-foreground/40 text-sm">
            Prefer email?{" "}
            <a href="mailto:amr@amryousry.com" className="text-[#00ffcc] hover:underline">
              amr@amryousry.com
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