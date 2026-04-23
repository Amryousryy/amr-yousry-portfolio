"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section ref={sectionRef} className="min-h-screen bg-[#050508] py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="pixel-badge mb-4 mx-auto inline-flex">
            <span>LET&apos;S WORK TOGETHER</span>
          </div>
          
          <h2
            ref={headingRef}
            className="font-sora text-4xl md:text-6xl text-white mb-4"
          >
            <span data-text="CUT! LET&apos;S CREATE" className="glitch-text">
              CUT! LET&apos;S CREATE
            </span>
          </h2>
          
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Have a project in mind? Let&apos;s bring your vision to life with stunning visuals and compelling storytelling.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="pixel-box bg-[#0a0a0f] p-8">
            <div className="pixel-text text-[#00ffcc] text-xs mb-6">SEND A MESSAGE</div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">Your Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#050508] border border-[#1a1a2e] px-4 py-3 text-white placeholder-white/40 focus:border-[#00ffcc] focus:outline-none pixel-text text-xs"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Your Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#050508] border border-[#1a1a2e] px-4 py-3 text-white placeholder-white/40 focus:border-[#00ffcc] focus:outline-none pixel-text text-xs"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Tell me about your project</label>
                <textarea
                  id="message"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#050508] border border-[#1a1a2e] px-4 py-3 text-white placeholder-white/40 focus:border-[#00ffcc] focus:outline-none pixel-text text-xs h-32 resize-none"
                  required
                  aria-required="true"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="pixel-btn w-full flex items-center justify-center gap-2 disabled:opacity-50"
                aria-label={isSubmitting ? "Sending message..." : "Send message"}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin" aria-hidden="true">◌</span>
                    <span>SENDING...</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">▶</span>
                    <span>SEND MESSAGE</span>
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="space-y-6">
            <div className="pixel-box bg-[#0a0a0f] p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#00ffcc]/10 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#00ffcc]" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998 3.741-.322.791.313.18a9.865 9.865 0 001.218 2.469l-2.554 1.956.987.321c.794.144 1.616.217 2.429.217.813 0 1.606-.073 2.376-.218l.723.994 1.055-.497.998.998 1.098.79.816-.214-.722-1.075a9.83 9.83 0 01-1.137-2.265l1.155-1.155zm-2.107-2.727a8.065 8.065 0 00-.593-1.333 7.84 7.84 0 00-.657-.824c-.207-.24-.425-.357-.643-.357s-.436.117-.643.357c-.21.238-.4.52-.593.824a8.065 8.065 0 00-.593 1.333c-.118.46-.118 1.04-.118 1.537a3.5 3.5 0 001 2.07c.25.25.534.453.84.594.306.142.656.216.99.216.335 0 .683-.074.99-.216.306-.141.59-.344.84-.594a3.5 3.5 0 001-2.07c0-.497-.001-.987-.118-1.537"/>
                </svg>
              </div>
              <div>
                <div className="pixel-text text-[#00ffcc] text-xs mb-1">WHATSAPP</div>
                <div className="text-white">+20 1XX XXX XXXX</div>
              </div>
            </div>
            
            <div className="pixel-box bg-[#0a0a0f] p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#00ffcc]/10 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#00ffcc]" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <div>
                <div className="pixel-text text-[#00ffcc] text-xs mb-1">EMAIL</div>
                <div className="text-white">hello@amryousry.com</div>
              </div>
            </div>
            
            <div className="pixel-box bg-[#0a0a0f] p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#00ffcc]/10 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#00ffcc]" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div>
                <div className="pixel-text text-[#00ffcc] text-xs mb-1">LOCATION</div>
                <div className="text-white">Cairo, Egypt</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="pixel-box w-12 h-12 bg-[#0a0a0f] flex items-center justify-center hover:bg-[#00ffcc]/20 transition-colors" aria-label="Follow on Instagram">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#00ffcc]" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="pixel-box w-12 h-12 bg-[#0a0a0f] flex items-center justify-center hover:bg-[#00ffcc]/20 transition-colors" aria-label="Watch on YouTube">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#00ffcc]" fill="currentColor" aria-hidden="true">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a href="#" className="pixel-box w-12 h-12 bg-[#0a0a0f] flex items-center justify-center hover:bg-[#00ffcc]/20 transition-colors" aria-label="Connect on LinkedIn">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#00ffcc]" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.49 2.5s-2.49-1.119-2.49-2.5c0-1.38 1.11-2.5 2.49-2.5s2.49 1.12 2.49 2.5zm.02 4.5h-5v16h5v-16zm9.533 0h-4.933v16h4v-8.399c0-4.667 3.333-5.399 5.768-5.193 2.546 0 3.435 1.184 4.001 2.524 1.295.687 1.768 1.688 1.768 2.801v8.367h-4.933v-7.567c0-1.153-.02-2.64-1.609-2.64-1.617 0-1.867 1.259-1.867 2.558v7.649h4.833v-7.567c0-1.982-.334-3.985-2.331-3.985zm2.232 6.927c0 .447-.017.903-.049 1.359-.033.463-.1.916-.201 1.371-.105.455-.252.896-.443 1.327-.191.431-.421.842-.693 1.238a6.013 6.013 0 01-.924 1.086c-.347.327-.723.614-1.127.857-.405.243-.831.43-1.275.558-.444.128-.895.193-1.353.195h-.016c-.458 0-.909-.067-1.353-.195a5.75 5.75 0 01-1.275-.558 5.94 5.94 0 01-1.127-.857 6.013 6.013 0 01-.924-1.086 5.84 5.84 0 01-.693-1.238 5.91 5.91 0 01-.443-1.327 6.02 6.02 0 01-.201-1.371 5.93 5.93 0 01-.049-1.359c0-.447.017-.903.049-1.359.033-.463.1-.916.201-1.371.105-.455.252-.896.443-1.327.191-.431.421-.842.693-1.238a6.013 6.013 0 01.924-1.086c.347-.327.723-.614 1.127-.857.405-.243.831-.43 1.275-.558.444-.128.895-.193 1.353-.195h.016c.458 0 .909.067 1.353.195.444.128.87.315 1.275.558.404.243.78.53 1.127.857.351.352.657.716.924 1.086.272.396.502.807.693 1.238.143.431.248.872.322 1.327.032.456.049.912.049 1.359z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="pixel-text text-white/30 text-xs">
            © 2024 AMR YOUSRY — ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </section>
  );
}