"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Video, Users, Clapperboard } from "lucide-react";

const services = [
  {
    title: "Content Strategy",
    description: "Data-driven strategies that align your content with business goals for maximum impact.",
    icon: Target,
    color: "#2D1B69",
  },
  {
    title: "High-converting Reels",
    description: "Short-form content designed to grab attention and drive engagement in the first 3 seconds.",
    icon: Video,
    color: "#6C4AB6",
  },
  {
    title: "UGC Ads Production",
    description: "Authentic user-generated content that builds trust and converts viewers into customers.",
    icon: Users,
    color: "#00F5D4",
  },
  {
    title: "Brand Video Editing",
    description: "Professional editing that tells your brand story with cinematic quality and precision.",
    icon: Clapperboard,
    color: "#2D1B69",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-accent text-sm uppercase tracking-widest mb-4">My Services</h2>
            <h3 className="text-4xl md:text-6xl font-display font-bold leading-tight">
              Scaling brands with <br />
              <span className="text-accent italic">high-performance</span> content.
            </h3>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-border">
            <span className="text-sm font-sans text-foreground/70">
              Expertise built on results, <br /> not just views.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-8 bg-surface border border-border hover:border-accent/30 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors" />   

              <div className="relative z-10">
                <div className="w-16 h-16 mb-8 flex items-center justify-center bg-accent/10 rounded-xl border border-accent/20 group-hover:bg-accent group-hover:text-background transition-colors">
                  <service.icon className="w-8 h-8 text-accent group-hover:text-background transition-colors" />
                </div>
                <h4 className="text-xl font-display font-bold mb-4 group-hover:text-accent transition-colors">
                  {service.title}
                </h4>
                <p className="text-foreground/60 leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity"> 
                  <span>Learn More</span>
                  <div className="w-4 h-[1px] bg-accent" />
                </div>
              </div>

              <div className="absolute bottom-4 right-4 w-2 h-2 bg-accent group-hover:animate-ping" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}