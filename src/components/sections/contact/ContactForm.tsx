"use client";

import { motion } from "framer-motion";
import { PixelButton } from "@/components/ui/pixel-button";
import { contactContent } from "@/content/contact";
import { ChevronDown, Zap } from "lucide-react";
import { FormEvent } from "react";

interface ContactFormData {
  name: string;
  email: string;
  service: string;
  message: string;
}

interface ContactFormErrors {
  name?: boolean;
  email?: boolean;
  message?: boolean;
}

interface ContactFormProps {
  formData: ContactFormData;
  errors: ContactFormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function ContactForm({ formData, errors, onChange, onSubmit }: ContactFormProps) {
  return (
    <div className="lg:col-span-7">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative lg:mt-4"
      >
        {/* Form Status HUD */}
        <div className="absolute -top-3 left-0 right-0 flex flex-wrap justify-end gap-1.5 z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-blue/90 border border-slate-700/60">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-pixel text-[7px] text-emerald-400/80 tracking-[0.25em] uppercase">System Ready</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-blue/90 border border-slate-700/60">
            <Zap size={9} className="text-brand-cyan/70" />
            <span className="font-pixel text-[7px] text-brand-cyan/70 tracking-[0.25em] uppercase">Secure Link</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border-2 border-slate-800 p-5 sm:p-6 md:p-10 lg:p-10 pixel-shadow relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(var(--color-brand-cyan) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
          />

          <form 
            onSubmit={onSubmit}
            className="relative z-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="font-pixel text-[9px] text-brand-cyan/60 tracking-[0.2em] uppercase block px-1">
                  {contactContent.form.labels.name}
                </label>
                <input 
                  id="contact-name"
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  placeholder={contactContent.form.placeholders.name}
                  className={`w-full min-h-[48px] bg-slate-800/30 border-2 px-4 py-3.5 font-modern text-white placeholder:text-text-dim/40 outline-none transition-all duration-300 text-base
                    ${errors.name 
                      ? 'border-red-400/60 focus:border-red-400 focus:bg-slate-800/70' 
                      : 'border-slate-800 hover:border-slate-700 focus:border-brand-cyan/60 focus:bg-slate-800/60 focus:shadow-[0_0_12px_-4px_#22D3EE]'}`}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="font-pixel text-[9px] text-brand-cyan/60 tracking-[0.2em] uppercase block px-1">
                  {contactContent.form.labels.email}
                </label>
                <input 
                  id="contact-email"
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  placeholder={contactContent.form.placeholders.email}
                  className={`w-full min-h-[48px] bg-slate-800/30 border-2 px-4 py-3.5 font-modern text-white placeholder:text-text-dim/40 outline-none transition-all duration-300 text-base
                    ${errors.email 
                      ? 'border-red-400/60 focus:border-red-400 focus:bg-slate-800/70' 
                      : 'border-slate-800 hover:border-slate-700 focus:border-brand-cyan/60 focus:bg-slate-800/60 focus:shadow-[0_0_12px_-4px_#22D3EE]'}`}
                />
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <label htmlFor="contact-service" className="font-pixel text-[9px] text-brand-cyan/60 tracking-[0.2em] uppercase block px-1">
                {contactContent.form.labels.service}
              </label>
              <div className="relative">
                <select 
                  id="contact-service"
                  name="service"
                  value={formData.service}
                  onChange={onChange}
                  className="w-full min-h-[48px] bg-slate-800/30 border-2 border-slate-800 hover:border-slate-700 px-4 py-3.5 font-modern text-white focus:border-brand-cyan/60 focus:bg-slate-800/60 focus:shadow-[0_0_12px_-4px_#22D3EE] outline-none transition-all duration-300 appearance-none cursor-pointer text-base pr-12"
                >
                  {contactContent.form.services.map((service) => (
                    <option key={service} value={service} className="bg-slate-900">{service}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-cyan/50">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <label htmlFor="contact-message" className="font-pixel text-[9px] text-brand-cyan/60 tracking-[0.2em] uppercase block px-1">
                {contactContent.form.labels.message}
              </label>
              <textarea 
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={onChange}
                rows={5}
                placeholder={contactContent.form.placeholders.message}
                className={`w-full bg-slate-800/30 border-2 px-4 py-3.5 font-modern text-white placeholder:text-text-dim/40 outline-none transition-all duration-300 resize-none text-base leading-relaxed min-h-[140px]
                  ${errors.message 
                    ? 'border-red-400/60 focus:border-red-400 focus:bg-slate-800/70' 
                    : 'border-slate-800 hover:border-slate-700 focus:border-brand-cyan/60 focus:bg-slate-800/60 focus:shadow-[0_0_12px_-4px_#22D3EE]'}`}
              />
            </div>

            {(errors.name || errors.email || errors.message) && (
              <p className="font-pixel text-[10px] text-red-400 uppercase tracking-[0.25em] text-center mt-6">
                Complete the mission brief before launch.
              </p>
            )}

            <div className="mt-8">
              <PixelButton 
                type="submit" 
                variant="primary" 
                className="w-full py-5 text-xs tracking-[0.22em] sm:tracking-[0.3em] font-bold"
              >
                {contactContent.form.labels.submit.toUpperCase()}
              </PixelButton>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
