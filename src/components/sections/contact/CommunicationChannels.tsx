"use client";

import { motion, useReducedMotion } from "framer-motion";
import ContactIconImage from "@/components/ui/contact-icon-image";
import { contactContent as staticContactContent } from "@/content/contact";
import { SocialLinkItem } from "@/lib/contact-content-normalizer";
import { trackEvent } from "@/lib/tracker";

interface CommunicationChannelsProps {
  email?: string;
  whatsappNumber?: string;
  socials?: SocialLinkItem[];
}

export default function CommunicationChannels({
  email,
  whatsappNumber,
  socials,
}: CommunicationChannelsProps) {
  const shouldReduceMotion = useReducedMotion();
  const whatsapp = whatsappNumber || staticContactContent.whatsapp.number;
  const contactEmail = email || "amryousryy@gmail.com";
  const socialLinks = socials || staticContactContent.socials;

  return (
    <div className="pt-6 border-t border-slate-800/60">
      <h3 className="font-pixel text-[10px] text-brand-cyan/85 mb-6 tracking-[0.3em] uppercase">Communication Channels</h3>
      
      {/* WhatsApp - Primary */}
      <motion.a 
        whileHover={shouldReduceMotion ? {} : { x: 8 }}
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp - Fastest response"
        onClick={() => trackEvent("whatsapp_click", { path: window.location.pathname })}
        className="flex min-h-[56px] items-center gap-4 text-white font-pixel text-xs group transition-colors mb-5 md:mb-6"
      >
        <ContactIconImage 
          src="/images/social/whatsapp-pixel-v2.png" 
          wrapperSize={56} 
          scale={1.3} 
          imgClassName="group-hover:scale-105 group-active:scale-105 transition-transform duration-200" 
        />
        <div>
          <span className="group-hover:text-brand-cyan group-active:text-brand-cyan transition-colors tracking-widest block">WHATSAPP</span>
          <span className="font-modern text-[10px] text-brand-cyan/75 tracking-wider">Fastest response</span>
        </div>
      </motion.a>

      {/* Email */}
      <motion.a 
        whileHover={shouldReduceMotion ? {} : { x: 8 }}
        href={`mailto:${contactEmail}`}
        aria-label="Email - Business inquiries"
        onClick={() => trackEvent("email_click", { path: window.location.pathname })}
        className="flex min-h-[56px] items-center gap-4 text-white font-pixel text-xs group transition-colors mb-5 md:mb-6"
      >
        <ContactIconImage 
          src="/images/social/email-pixel-v2.png" 
          wrapperSize={56} 
          scale={1.25} 
          imgClassName="group-hover:scale-105 group-active:scale-105 transition-transform duration-200" 
        />
        <div>
          <span className="group-hover:text-brand-cyan group-active:text-brand-cyan transition-colors tracking-widest block">EMAIL</span>
          <span className="font-modern text-[10px] text-brand-cyan/75 tracking-wider">Business inquiries</span>
        </div>
      </motion.a>

      {/* Pixel Icon Buttons for Socials */}
      <div className="flex flex-wrap gap-4 pt-4">
        {socialLinks.map((social) => {
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
              className="bg-slate-800/20 hover:bg-slate-800/40 active:bg-slate-800/40 border border-slate-700/30 rounded-sm group"
            >
              <ContactIconImage 
                src={cfg.src} 
                wrapperSize={48} 
                scale={cfg.scale} 
                imgClassName="group-hover:scale-105 group-active:scale-105 transition-transform duration-200" 
              />
              <span className="sr-only">{social.label}</span>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
