"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Amr delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise are outstanding.",
    name: "Sarah Ahmed",
    role: "CEO, TechStart Egypt",
    rating: 5,
  },
  {
    id: 2,
    quote: "Working with Amr on our AI integration was a game-changer. He transformed our business with intelligent automation solutions.",
    name: "Mohamed Hassan",
    role: "Founder, SmartSolutions",
    rating: 5,
  },
  {
    id: 3,
    quote: "Professional, responsive, and highly skilled. Amr delivered our project on time and with exceptional quality.",
    name: "Lina Mostafa",
    role: "Marketing Director, AutoConnect",
    rating: 5,
  },
];

function TestimonialCard({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) {
  return (
    <motion.div
      className="flex-shrink-0 w-[380px] bg-surface border border-border rounded-xl p-8 cursor-grab"
      whileDrag={{ scale: 1.02 }}
    >
      <Quote className="w-8 h-8 text-accent/30 mb-4" />
      
      <p className="text-base leading-relaxed mb-6 italic">
        &quot;{testimonial.quote}&quot;
      </p>

      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} size={14} className="fill-accent text-accent" />
        ))}
      </div>

      <div>
        <p className="font-medium">{testimonial.name}</p>
        <p className="text-sm text-muted">{testimonial.role}</p>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const containerRef = useRef<HTMLElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".testimonial-card", {
          scrollTrigger: {
            trigger: ".testimonials-container",
            start: "top 80%",
          },
          x: -40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out"
        });
      }, containerRef);

      return () => ctx.revert();
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      id="testimonials"
      className="py-32 bg-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-accent text-sm uppercase tracking-widest mb-4 block">
            06 — Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium">
            Client Feedback
          </h2>
        </div>

        <div className="testimonials-container" ref={constraintsRef}>
          <motion.div
            className="flex gap-6 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0.1}
          >
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>

        <p className="text-center text-sm text-muted mt-8">
          ← Drag to see more →
        </p>
      </div>
    </section>
  );
}