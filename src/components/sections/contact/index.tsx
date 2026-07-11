"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { contactContent as staticContactContent } from "@/content/contact";
import { useState, FormEvent } from "react";
import { trackEvent } from "@/lib/tracker";
import SuccessState from "@/components/sections/contact/SuccessState";
import CommunicationChannels from "@/components/sections/contact/CommunicationChannels";
import ContactForm from "@/components/sections/contact/ContactForm";
import type { PublicContactContent } from "@/lib/contact-content-normalizer";

interface ContactSectionProps {
  contactData?: PublicContactContent;
}

export default function ContactSection({ contactData }: ContactSectionProps) {
  const [succeeded, setSucceeded] = useState(false);
  const contactContent = contactData
    ? {
        ...staticContactContent,
        heading: contactData.heading || staticContactContent.heading,
        subheading: contactData.subheading || staticContactContent.subheading,
        availability: contactData.availability || staticContactContent.availability,
        socials: contactData.socials,
        whatsapp: { ...staticContactContent.whatsapp, number: contactData.whatsappNumber },
      }
    : staticContactContent;
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
    trackEvent("contact_cta_click", { path: window.location.pathname, label: formData.service });
    trackEvent("form_submit", { path: window.location.pathname, label: formData.service });
  };

  const handleReset = () => {
    setSucceeded(false);
    setFormData({ name: "", email: "", service: "Creative Direction", message: "" });
    setErrors({});
  };

  if (succeeded) {
    return <SuccessState onReset={handleReset} />;
  }

  return (
    <Section id="contact" className="bg-brand-blue/95 relative pb-16 sm:pb-36 pt-14 sm:pt-20 md:pt-32 overflow-hidden">
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
              className="flex min-w-0 items-center gap-3 sm:gap-4 mb-8"
            >
              <div className="h-[2px] w-8 sm:w-12 bg-brand-cyan shrink-0" />
              <span className="font-pixel text-brand-cyan text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.3em] uppercase">
                Mission Control
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-bold tracking-tighter text-white mb-6 break-words"
              style={{ fontSize: 'clamp(1.6rem, 5.5vw, 3rem)', lineHeight: '1.1', maxWidth: '14ch' }}
            >
              {contactContent.heading.split("\n").map((line, i, arr) => (
                <span key={i} className="block">
                  <span className={i === arr.length - 1 ? "text-brand-cyan" : "text-white"}>{line}</span>
                </span>
              ))}
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-modern text-foreground/70 text-sm md:text-base leading-relaxed max-w-[420px]"
              style={{ textWrap: 'pretty' }}
            >
              {contactContent.subheading}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="font-pixel text-[8px] text-brand-cyan/80 tracking-[0.15em] mt-4 mb-10"
            >
              {contactContent.availability}
            </motion.p>

            <CommunicationChannels
              email={contactData?.email}
              whatsappNumber={contactData?.whatsappNumber}
              socials={contactData?.socials}
            />
          </div>

          <ContactForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

        </div>
      </Container>
    </Section>
  );
}
