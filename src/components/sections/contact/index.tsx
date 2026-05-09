"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PixelButton } from "@/components/ui/pixel-button";
import ContactIconImage from "@/components/ui/contact-icon-image";
import { contactContent } from "@/content/contact";
import { CheckCircle2, Zap, ChevronDown } from "lucide-react";
import { useState, FormEvent } from "react";

export default function ContactSection() {
  const shouldReduceMotion = useReducedMotion();
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const whatsappNumber = contactContent.whatsapp.number;
    const message = `Hi Amr, I want to start a project.\n\nName: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service}\n\nProject Brief:\n${formData.message}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setSucceeded(true);
  };

  if (succeeded) {
    return (
      <Section id="contact" className="bg-brand-blue/95 relative py-32">
        <Container>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl mx-auto text-center space-y-8 py-20 bg-slate-900/40 border-2 border-brand-cyan/30 pixel-shadow p-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 bg-brand-cyan/10 text-brand-cyan rounded-full flex items-center justify-center mx-auto border-2 border-brand-cyan/20"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter text-white">MISSION ACCEPTED!</h3>
              <div className="h-[2px] w-24 bg-brand-cyan mx-auto" />
              <p className="font-modern text-text-dim uppercase tracking-[0.2em] text-[10px] max-w-sm mx-auto leading-relaxed">
                Mission link opened in WhatsApp. I'll respond to your coordinates within 24 hours.
              </p>
            </div>
            <PixelButton 
              variant="outline" 
              className="px-10 py-4 text-xs tracking-widest"
              onClick={() => {
                setSucceeded(false);
                setFormData({ name: "", email: "", service: "Creative Direction", message: "" });
                setErrors({});
              }}
            >
              Return to Base
            </PixelButton>
          </motion.div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="contact" className="bg-brand-blue/95 relative pb-36 pt-24 md:pt-32">
      {/* Atmospheric overlay - action-oriented lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/95 via-brand-cyan/2 to-brand-blue/95 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/25 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent pointer-events-none" />
      
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
          {/* Left Column: Content & Socials */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-[2px] w-12 bg-brand-cyan" />
              <span className="font-pixel text-brand-cyan text-[10px] tracking-[0.3em] uppercase">
                Next Steps: Contact
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-bold tracking-tighter text-white mb-6"
              style={{ fontSize: 'clamp(2rem, 3.8vw, 3.4rem)', lineHeight: '0.95' }}
            >
              START YOUR<br/>PROJECT.
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-modern text-foreground/70 text-sm md:text-base leading-relaxed max-w-[420px]"
            >
              {contactContent.subheading}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="font-pixel text-[8px] text-brand-cyan/60 tracking-[0.15em] mt-4 mb-10"
            >
              Usually replies within 24 hours — WhatsApp is the fastest route.
            </motion.p>

            {/* Communication Channels */}
            <div className="pt-8 border-t border-slate-800/60">
              <h3 className="font-pixel text-[9px] text-brand-cyan/70 mb-8 tracking-[0.3em] uppercase">Communication Channels</h3>
              
              {/* WhatsApp - Primary */}
              <motion.a 
                whileHover={shouldReduceMotion ? {} : { x: 8 }}
                href={`https://wa.me/${contactContent.whatsapp.number}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp - Fastest response"
                className="flex items-center gap-4 text-white font-pixel text-xs group transition-colors mb-8"
              >
                <ContactIconImage 
                  src="/images/social/whatsapp-pixel-v2.png" 
                  wrapperSize={56} 
                  scale={1.3} 
                  imgClassName="hover:scale-105 transition-transform duration-200" 
                />
                <div>
                  <span className="group-hover:text-brand-cyan transition-colors tracking-widest block">WHATSAPP</span>
                  <span className="font-modern text-[10px] text-brand-cyan/75 tracking-wider">Fastest response</span>
                </div>
              </motion.a>

              {/* Email */}
              <motion.a 
                whileHover={shouldReduceMotion ? {} : { x: 8 }}
                href="mailto:amryousryy@gmail.com"
                aria-label="Email - Business inquiries"
                className="flex items-center gap-4 text-white font-pixel text-xs group transition-colors mb-8"
              >
                <ContactIconImage 
                  src="/images/social/email-pixel-v2.png" 
                  wrapperSize={56} 
                  scale={1.25} 
                  imgClassName="hover:scale-105 transition-transform duration-200" 
                />
                <div>
                  <span className="group-hover:text-brand-cyan transition-colors tracking-widest block">EMAIL</span>
                  <span className="font-modern text-[10px] text-brand-cyan/75 tracking-wider">Business inquiries</span>
                </div>
              </motion.a>

              {/* Pixel Icon Buttons for Socials */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800/40">
                {contactContent.socials.map((social) => {
                  const iconPaths: Record<string, { src: string; scale: number }> = {
                    ig: { src: "/images/social/instagram-pixel-v2.png", scale: 1.25 },
                    be: { src: "/images/social/behance-pixel-v2.png", scale: 1.28 },
                    fb: { src: "/images/social/facebook-pixel-v2.png", scale: 1.35 },
                    in: { src: "/images/social/linkedin-pixel-v2.png", scale: 1.3 },
                  };
                  const cfg = iconPaths[social.icon] || { src: "", scale: 1.25 };
                  return (
                    <motion.a
                      key={social.label}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="bg-slate-800/20 hover:bg-slate-800/40 border border-slate-700/30 rounded-sm"
                    >
                      <ContactIconImage 
                        src={cfg.src} 
                        wrapperSize={48} 
                        scale={cfg.scale} 
                        imgClassName="hover:scale-105 transition-transform duration-200" 
                      />
                      <span className="sr-only">{social.label}</span>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative lg:mt-4"
            >
              {/* Form Status HUD */}
              <div className="absolute -top-3 right-0 flex items-center gap-2 z-10">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-blue/90 border border-slate-700/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-pixel text-[7px] text-emerald-400/80 tracking-[0.25em] uppercase">System Ready</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-blue/90 border border-slate-700/60">
                  <Zap size={9} className="text-brand-cyan/70" />
                  <span className="font-pixel text-[7px] text-brand-cyan/70 tracking-[0.25em] uppercase">Secure Link</span>
                </div>
              </div>

              <div className="bg-slate-900/40 border-2 border-slate-800 p-8 md:p-10 lg:p-10 pixel-shadow relative overflow-hidden">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(var(--color-brand-cyan) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
                />

                <form 
                  onSubmit={handleSubmit}
                  className="relative z-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-pixel text-[9px] text-brand-cyan/60 tracking-[0.2em] uppercase block px-1">
                        {contactContent.form.labels.name}
                      </label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={contactContent.form.placeholders.name}
                        className={`w-full bg-slate-800/30 border-2 px-4 py-3.5 font-modern text-white placeholder:text-text-dim/40 outline-none transition-all duration-300 text-base
                          ${errors.name 
                            ? 'border-red-400/60 focus:border-red-400 focus:bg-slate-800/70' 
                            : 'border-slate-800 hover:border-slate-700 focus:border-brand-cyan/60 focus:bg-slate-800/60 focus:shadow-[0_0_12px_-4px_#22D3EE]'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-pixel text-[9px] text-brand-cyan/60 tracking-[0.2em] uppercase block px-1">
                        {contactContent.form.labels.email}
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={contactContent.form.placeholders.email}
                        className={`w-full bg-slate-800/30 border-2 px-4 py-3.5 font-modern text-white placeholder:text-text-dim/40 outline-none transition-all duration-300 text-base
                          ${errors.email 
                            ? 'border-red-400/60 focus:border-red-400 focus:bg-slate-800/70' 
                            : 'border-slate-800 hover:border-slate-700 focus:border-brand-cyan/60 focus:bg-slate-800/60 focus:shadow-[0_0_12px_-4px_#22D3EE]'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <label className="font-pixel text-[9px] text-brand-cyan/60 tracking-[0.2em] uppercase block px-1">
                      {contactContent.form.labels.service}
                    </label>
                    <div className="relative">
                      <select 
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full bg-slate-800/30 border-2 border-slate-800 hover:border-slate-700 px-4 py-3.5 font-modern text-white focus:border-brand-cyan/60 focus:bg-slate-800/60 focus:shadow-[0_0_12px_-4px_#22D3EE] outline-none transition-all duration-300 appearance-none cursor-pointer text-base pr-12"
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
                    <label className="font-pixel text-[9px] text-brand-cyan/60 tracking-[0.2em] uppercase block px-1">
                      {contactContent.form.labels.message}
                    </label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
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
                      className="w-full py-5 text-xs tracking-[0.3em] font-bold"
                    >
                      {contactContent.form.labels.submit.toUpperCase()}
                    </PixelButton>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

        </div>
      </Container>
    </Section>
  );
}
