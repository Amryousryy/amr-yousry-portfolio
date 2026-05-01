"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PixelButton } from "@/components/ui/pixel-button";
import { contactContent } from "@/content/contact";
import { MessageSquare } from "lucide-react";

export function ContactSection() {
  return (
    <Section id="contact" className="bg-brand-blue/30 relative">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Content & Socials */}
          <div className="lg:col-span-5">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-pixel text-brand-cyan text-sm tracking-widest mb-4 block"
            >
              NEXT STEPS: CONTACT
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl mb-6"
            >
              {contactContent.heading}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-modern text-text-dim text-lg leading-relaxed mb-12"
            >
              {contactContent.subheading}
            </motion.p>

            {/* Direct & Socials */}
            <div className="space-y-8">
              <div className="pt-8 border-t border-slate-800">
                <h3 className="font-pixel text-xs text-brand-cyan mb-6 tracking-widest">COMMUNICATION CHANNELS</h3>
                <div className="flex flex-col gap-4">
                  <motion.a 
                    whileHover={{ x: 4 }}
                    href={`https://wa.me/${contactContent.whatsapp.number}`}
                    target="_blank"
                    className="flex items-center gap-3 text-white font-pixel text-sm group"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan group-hover:bg-brand-cyan group-hover:text-brand-blue transition-colors">
                      <MessageSquare size={16} />
                    </span>
                    {contactContent.whatsapp.label}
                  </motion.a>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {contactContent.socials.map((social) => (
                      <motion.a
                        key={social.label}
                        whileHover={{ x: 4 }}
                        href={social.href}
                        className="font-pixel text-[10px] text-text-dim hover:text-white tracking-[0.2em] transition-colors"
                      >
                        {social.label}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 border-4 border-slate-800 p-8 md:p-12 pixel-shadow"
            >
            <form 
              className="space-y-8" 
              action="https://formspree.io/f/xvgzvzvz" // Placeholder - user should replace with real Formspree ID or I will use email if possible
              method="POST"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-pixel text-[10px] text-brand-cyan tracking-widest uppercase">
                    {contactContent.form.labels.name}
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder={contactContent.form.placeholders.name}
                    className="w-full bg-slate-800/50 border-2 border-slate-700 px-4 py-4 font-modern text-white focus:border-brand-cyan outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-pixel text-[10px] text-brand-cyan tracking-widest uppercase">
                    {contactContent.form.labels.email}
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder={contactContent.form.placeholders.email}
                    className="w-full bg-slate-800/50 border-2 border-slate-700 px-4 py-4 font-modern text-white focus:border-brand-cyan outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-pixel text-[10px] text-brand-cyan tracking-widest uppercase">
                  {contactContent.form.labels.service}
                </label>
                <select 
                  name="service"
                  required
                  className="w-full bg-slate-800/50 border-2 border-slate-700 px-4 py-4 font-modern text-white focus:border-brand-cyan outline-none transition-colors appearance-none"
                >
                  {contactContent.form.services.map((service) => (
                    <option key={service} value={service.toLowerCase()}>{service}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-pixel text-[10px] text-brand-cyan tracking-widest uppercase">
                  {contactContent.form.labels.message}
                </label>
                <textarea 
                  name="message"
                  required
                  rows={4}
                  placeholder={contactContent.form.placeholders.message}
                  className="w-full bg-slate-800/50 border-2 border-slate-700 px-4 py-4 font-modern text-white focus:border-brand-cyan outline-none transition-colors resize-none"
                />
              </div>

              <PixelButton type="submit" variant="primary" size="lg" className="w-full py-6 text-lg">
                {contactContent.form.labels.submit}
              </PixelButton>
            </form>
            </motion.div>
          </div>

        </div>
      </Container>
    </Section>
  );
}
