"use client";

import React from "react";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/ui/ContactForm";
import { Zap, Target, TrendingUp } from "lucide-react";

export default function CTA() {
  return (
    <section id="contact" className="py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 translate-x-1/2 z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="pixel-text text-accent text-xs tracking-[0.4em] uppercase font-bold"
              >
                Limited Opportunity
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-none"
              >
                Ready to <br />
                <span className="text-accent italic font-serif lowercase tracking-normal">Scale</span> Your Brand?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-lg text-foreground/50 uppercase tracking-widest leading-relaxed max-w-md"
              >
                Stop posting content that doesn't convert. Let's build a cinematic strategy that turns views into high-ticket clients.
              </motion.p>
            </div>

            <div className="space-y-8">
               {[
                 { icon: Zap, title: "Free Content Audit", desc: "I'll analyze your last 10 videos and tell you why they aren't converting." },
                 { icon: Target, title: "Custom Strategy", desc: "A tailored roadmap to reach your specific business goals." },
                 { icon: TrendingUp, title: "Scalable Results", desc: "Systems designed to grow your brand on autopilot." }
               ].map((item, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -30 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="flex items-start space-x-6 group"
                 >
                    <div className="p-3 bg-primary/10 pixel-border text-accent group-hover:bg-accent group-hover:text-background transition-all">
                       <item.icon size={20} />
                    </div>
                    <div>
                       <h4 className="font-display font-bold uppercase tracking-tight text-sm mb-1">{item.title}</h4>
                       <p className="text-xs text-foreground/40 leading-relaxed uppercase tracking-wider">{item.desc}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
             <div className="absolute -inset-4 bg-accent/10 blur-3xl rounded-full z-0 opacity-50" />
             <div className="relative z-10">
                <div className="mb-6 p-4 bg-accent text-background text-center pixel-border animate-pulse">
                   <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Next Audit Available: APRIL 2026</p>
                </div>
                <ContactForm isAuditOffer={true} />
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
