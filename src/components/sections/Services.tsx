"use client";

import { useRef, useEffect } from "react";
import { Target, Video, Users, Clapperboard } from "lucide-react";
import { useReveal, useStagger, useAmbient, useInteraction } from "@/hooks/behavior";

/**
 * Sprint 08: Services Section — Platform Migration
 * Sprint 09: Refactored to use improved Behavior API
 *
 * Migrated from direct framer-motion usage to Behavior API.
 * Refactored to use Sprint 09 improvements:
 * - useInteraction now accepts external ref (consistent pattern)
 * - useInteraction now returns declarative handlers property
 *
 * Behavior API Usage:
 * - useReveal: Section entrance, title reveal
 * - useStagger: Sequential service card reveals
 * - useAmbient: Subtle background glow
 * - useInteraction: Service card hover states (ref-passing pattern)
 */

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
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);

  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  // Section entrance reveal
  useReveal({
    ref: sectionRef,
    variant: "fade",
    duration: "large",
    easing: "ease-out",
    autoPlay: true,
  });

  // Title reveal with focus-pull
  useReveal({
    ref: titleRef,
    variant: "focus-pull",
    duration: "large",
    easing: "ease-out",
    delay: 200,
    autoPlay: true,
  });

  // Staggered service card reveals
  const stagger = useStagger({
    refs: [card1Ref, card2Ref, card3Ref, card4Ref],
    variant: "focus-pull",
    duration: "medium",
    easing: "ease-out",
    stagger: 150,
  });

  // Ambient glow on background
  const ambient = useAmbient({
    ref: bgGlowRef,
    variant: "glow",
    duration: "large",
    easing: "ease-in-out",
    intensity: 0.3,
    properties: ["glow"],
    loop: true,
  });

  // useInteraction with ref-passing pattern (Sprint 09 improvement)
  useInteraction({
    ref: card1Ref,
    variant: "hover",
    duration: "small",
    easing: "ease-out",
    scale: 1.02,
  });

  useInteraction({
    ref: card2Ref,
    variant: "hover",
    duration: "small",
    easing: "ease-out",
    scale: 1.02,
  });

  useInteraction({
    ref: card3Ref,
    variant: "hover",
    duration: "small",
    easing: "ease-out",
    scale: 1.02,
  });

  useInteraction({
    ref: card4Ref,
    variant: "hover",
    duration: "small",
    easing: "ease-out",
    scale: 1.02,
  });

  useEffect(() => {
    // Start staggered reveals after section entrance
    const timer = setTimeout(() => {
      stagger.play();
    }, 500);

    // Start ambient glow
    ambient.start();

    return () => {
      clearTimeout(timer);
      ambient.stop();
    };
  }, [stagger, ambient]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        ref={bgGlowRef}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.03)_0%,transparent_70%)] pointer-events-none"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
          <div className="max-w-2xl min-w-0">
            <h2 ref={titleRef} className="pixel-text text-accent text-sm mb-4">
              My Services
            </h2>
            <h3
              className="text-[clamp(1.75rem,6.5vw,3.25rem)] md:text-6xl font-display font-bold leading-tight break-words"
              style={{ textWrap: "balance", maxWidth: "16ch" }}
            >
              Scaling brands with <br />
              <span className="text-primary italic">high-performance</span> content.
            </h3>
          </div>
          <div className="pixel-border p-4 bg-primary/10 w-full sm:w-auto">
            <span className="text-sm font-sans text-foreground/70">
              Expertise built on results, <br /> not just views.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const refs = [card1Ref, card2Ref, card3Ref, card4Ref];

            return (
              <div
                key={service.title}
                ref={refs[index]}
                className="group relative p-6 md:p-8 bg-background border border-primary/20 hover:border-accent transition-all duration-500 overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors" />

                <div className="relative z-10">
                  <div className="w-16 h-16 mb-8 flex items-center justify-center bg-primary/10 pixel-border group-hover:bg-accent transition-colors">
                    <service.icon className="w-8 h-8 text-accent group-hover:text-background transition-colors" />
                  </div>
                  <h4
                    className="text-lg md:text-xl font-display font-bold mb-4 group-hover:text-accent transition-colors break-words leading-snug"
                    style={{ textWrap: "balance" }}
                  >
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

                <div className="absolute bottom-4 right-4 w-2 h-2 bg-primary group-hover:bg-accent group-hover:animate-ping" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
