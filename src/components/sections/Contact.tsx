"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail, Linkedin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".contact-info", {
          scrollTrigger: {
            trigger: ".contact-info",
            start: "top 80%",
          },
          x: -40,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out"
        });

        gsap.from(".contact-form", {
          scrollTrigger: {
            trigger: ".contact-form",
            start: "top 80%",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out"
        });
      }, sectionRef);

      return () => ctx.revert();
    });
  }, { scope: sectionRef });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: "", email: "", subject: "", message: "" });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    setSubmitted(false);
  };

  return (
    <section 
      ref={sectionRef}
      id="contact"
      className="py-32 bg-surface relative"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16">
          <span className="text-accent text-sm uppercase tracking-widest mb-4 block">
            07 — Contact
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium">
            Let&apos;s Work Together
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="contact-info">
            <p className="text-muted text-lg mb-12 max-w-md">
              I&apos;m always interested in hearing about new projects and opportunities. 
              Let&apos;s connect and discuss how I can help bring your vision to life.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted">Location</p>
                  <p className="font-medium">Cairo, Egypt</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted">Email</p>
                  <p className="font-medium">amryousry.dev</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                  <Linkedin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted">LinkedIn</p>
                  <a href="https://linkedin.com/in/amryousry" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-accent transition-colors">
                    linkedin.com/in/amryousry
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm mb-2">Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-transparent border-0 border-b border-border py-3 focus:outline-none focus:border-accent transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-transparent border-0 border-b border-border py-3 focus:outline-none focus:border-accent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm mb-2">Subject</label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={formState.subject}
                  onChange={(e) => setFormState(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full bg-transparent border-0 border-b border-border py-3 focus:outline-none focus:border-accent transition-colors"
                  placeholder="Project inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm mb-2">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-transparent border-0 border-b border-border py-3 focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-4 bg-accent text-background font-medium rounded-full hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
                  />
                ) : submitted ? (
                  <span>Sent!</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}