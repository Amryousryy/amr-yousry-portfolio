"use client";

import { motion } from "framer-motion";
import { PixelButton } from "@/components/ui/pixel-button";
import { contactContent as staticContactContent } from "@/content/contact";
import { trackEvent } from "@/lib/tracker";
import { event } from "@/lib/analytics";
import { ChevronDown } from "lucide-react";
import { FormEvent, useState } from "react";
import SuccessState from "./SuccessState";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [errors, setErrors] = useState<{name?: boolean; email?: boolean; message?: boolean}>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "Creative Direction",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim(),
      message: !formData.message.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleReset = () => {
    setSucceeded(false);
    setFormData({ name: "", email: "", service: "Creative Direction", message: "" });
    setErrors({});
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    const whatsappNumber = staticContactContent.whatsapp.number;
    const message = `Hi Amr, I want to start a project.\n\nName: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service}\n\nProject Brief:\n${formData.message}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    setSucceeded(true);
    trackEvent("contact_cta_click", { path: window.location.pathname, label: formData.service });
    trackEvent("form_submit", { path: window.location.pathname, label: formData.service });
    event("contact_cta_click", { service: formData.service });
    event("contact_form_submit", { service: formData.service });

    setSubmitting(false);
  };

  if (succeeded) {
    return <SuccessState onReset={handleReset} />;
  }

  return (
    <div id="project-inquiry" className="lg:col-span-7">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative lg:mt-4"
      >
        <div className="absolute -top-3 left-0 right-0 flex flex-wrap justify-end gap-1.5 z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface/90 border border-line-soft">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
            <span className="font-pixel text-[8px] text-accent/80 tracking-[0.25em] uppercase">Terminal Active</span>
          </div>
        </div>

        <div className="bg-panel border-2 border-line p-5 sm:p-6 md:p-10 lg:p-10 pixel-shadow relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(var(--color-brand-cyan) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />

          <form
            onSubmit={handleSubmit}
            className="relative z-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="font-pixel text-[10px] text-accent/80 tracking-[0.2em] uppercase block px-1">
                  {staticContactContent.form.labels.name}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={staticContactContent.form.placeholders.name}
                  aria-invalid={errors.name ? "true" : undefined}
                  aria-describedby={errors.name ? "contact-error" : undefined}
                   className={`w-full min-h-[48px] bg-field border-2 px-4 py-3.5 font-modern text-strong placeholder:text-text-dim/40 outline-none transition-all duration-300 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${errors.name
                      ? 'border-red-400/60 focus:border-red-400 focus:bg-field-focus'
                      : 'border-line hover:border-line-soft active:border-line-soft focus:border-accent/60 focus:bg-field-focus focus:shadow-[0_0_12px_-4px_var(--color-accent)]'}`}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="font-pixel text-[10px] text-accent/80 tracking-[0.2em] uppercase block px-1">
                  {staticContactContent.form.labels.email}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={staticContactContent.form.placeholders.email}
                  aria-invalid={errors.email ? "true" : undefined}
                  aria-describedby={errors.email ? "contact-error" : undefined}
                  className={`w-full min-h-[48px] bg-field border-2 px-4 py-3.5 font-modern text-strong placeholder:text-text-dim/40 outline-none transition-all duration-300 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${errors.email
                      ? 'border-red-400/60 focus:border-red-400 focus:bg-field-focus'
                      : 'border-line hover:border-line-soft active:border-line-soft focus:border-accent/60 focus:bg-field-focus focus:shadow-[0_0_12px_-4px_var(--color-accent)]'}`}
                />
              </div>
            </div>

            <div className="space-y-2 mt-6">
                <label htmlFor="contact-service" className="font-pixel text-[10px] text-accent/80 tracking-[0.2em] uppercase block px-1">
                {staticContactContent.form.labels.service}
              </label>
              <div className="relative">
                <select
                  id="contact-service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full min-h-[48px] bg-field border-2 border-line hover:border-line-soft active:border-line-soft px-4 py-3.5 font-modern text-strong focus:border-accent/60 focus:bg-field-focus focus:shadow-[0_0_12px_-4px_var(--color-accent)] outline-none transition-all duration-300 appearance-none cursor-pointer text-base pr-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {staticContactContent.form.services.map((service) => (
                    <option key={service} value={service} className="bg-option text-strong">{service}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-accent/50">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-6">
                <label htmlFor="contact-message" className="font-pixel text-[10px] text-accent/80 tracking-[0.2em] uppercase block px-1">
                {staticContactContent.form.labels.message}
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder={staticContactContent.form.placeholders.message}
                aria-invalid={errors.message ? "true" : undefined}
                aria-describedby={errors.message ? "contact-error" : undefined}
                   className={`w-full bg-field border-2 px-4 py-3.5 font-modern text-strong placeholder:text-text-dim/40 outline-none transition-all duration-300 resize-none text-base leading-relaxed min-h-[140px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${errors.message
                      ? 'border-red-400/60 focus:border-red-400 focus:bg-field-focus'
                      : 'border-line hover:border-line-soft active:border-line-soft focus:border-accent/60 focus:bg-field-focus focus:shadow-[0_0_12px_-4px_var(--color-accent)]'}`}
              />
            </div>

            {(errors.name || errors.email || errors.message) && (
              <p id="contact-error" className="font-pixel text-[10px] text-red-400 uppercase tracking-[0.25em] text-center mt-6" role="alert">
                Complete all fields before initiating mission.
              </p>
            )}

            <div className="mt-10">
              <PixelButton
                type="submit"
                variant="primary"
                className="w-full py-6 text-xs tracking-[0.22em] sm:tracking-[0.3em] font-bold"
              >
                {submitting ? "Preparing your creative brief…" : staticContactContent.form.labels.submit.toUpperCase()}
              </PixelButton>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
