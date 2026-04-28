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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent text-xs font-semibold uppercase tracking-widest mb-4 block">Let&apos;s Work Together</span>
            <h2
              ref={headingRef}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Ready to Start Your Project?
            </h2>
            <p className="text-foreground/60 text-lg max-w-xl mx-auto">
              Book a free 15-minute call to discuss your project, or send me a message and I&apos;ll get back to you within 24 hours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <a 
              href="https://calendly.com/your-link" 
              target="_blank"
              rel="noopener noreferrer"
              className="group p-8 bg-zinc-900/30 border border-white/5 hover:border-accent/50 transition-all text-center"
            >
              <div className="w-14 h-14 bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Book a Call</h3>
              <p className="text-foreground/50 text-sm mb-4">Free 15-minute intro call</p>
              <span className="text-accent text-sm font-semibold flex items-center justify-center gap-2">
                Schedule Now <ArrowRight className="w-4 h-4" />
              </span>
            </a>

            <a 
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-8 bg-zinc-900/30 border border-white/5 hover:border-accent/50 transition-all text-center"
            >
              <div className="w-14 h-14 bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                <MessageCircle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
              <p className="text-foreground/50 text-sm mb-4">Quick response, no forms</p>
              <span className="text-accent text-sm font-semibold flex items-center justify-center gap-2">
                Message Me <ArrowRight className="w-4 h-4" />
              </span>
            </a>

            <a 
              href="mailto:hello@amryousry.com"
              className="group p-8 bg-zinc-900/30 border border-white/5 hover:border-accent/50 transition-all text-center"
            >
              <div className="w-14 h-14 bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Email</h3>
              <p className="text-foreground/50 text-sm mb-4">For detailed inquiries</p>
              <span className="text-accent text-sm font-semibold flex items-center justify-center gap-2">
                Send Email <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          </div>

          <div className="border-t border-white/5 pt-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-white mb-2">Or Send a Message</h3>
              <p className="text-foreground/50 text-sm">Tell me about your project and I&apos;ll get back to you within 24 hours.</p>
            </div>

            <div className="max-w-xl mx-auto">
              {submitSuccess && (
                <div className="mb-6 p-4 bg-accent/10 border border-accent/20 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <p className="text-white text-sm">
                    Message sent! I&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-2">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Ahmed Hassan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-900/30 border border-white/10 px-4 py-4 text-white placeholder-white/30 focus:border-accent focus:outline-none transition-colors"
                    required
                    aria-required="true"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="ahmed@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-900/30 border border-white/10 px-4 py-4 text-white placeholder-white/30 focus:border-accent focus:outline-none transition-colors"
                    required
                    aria-required="true"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground/80 mb-2">Project Details</label>
                  <textarea
                    id="message"
                    placeholder="What are you working on? What's your timeline? Any budget range?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-zinc-900/30 border border-white/10 px-4 py-4 text-white placeholder-white/30 focus:border-accent focus:outline-none transition-colors h-40 resize-none"
                    required
                    aria-required="true"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-accent text-background font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-accent/90 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">◌</span>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-foreground/50">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>24hr response</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-foreground/50">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Free consult</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-foreground/50">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>No spam</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}