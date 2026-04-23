"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    problem: "YOUR VIDEOS AREN'T CONVERTING?",
    title: "Video Editing",
    description: "Cinematic edits that stop the scroll and drive action. From raw footage to a story that sells.",
    features: [
      "Short-form content (Reels, TikTok, YouTube Shorts)",
      "Brand films & commercial edits",
      "Documentary & event coverage",
      "Color grading & sound design",
    ],
    cta: "SEE VIDEO PROJECTS →",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect x="4" y="8" width="24" height="16" fill="#00ffcc" rx="2" />
        <rect x="8" y="12" width="12" height="8" fill="#050508" />
        <circle cx="24" cy="10" r="2" fill="#050508" />
        <rect x="6" y="4" width="4" height="4" fill="#00ffcc" />
        <rect x="12" y="4" width="4" height="4" fill="#00ffcc" />
        <rect x="18" y="4" width="4" height="4" fill="#00ffcc" />
      </svg>
    ),
  },
  {
    problem: "YOUR BRAND LOOKS FORGETTABLE?",
    title: "Motion Design",
    description: "Animated logos, kinetic typography, and motion graphics that make your brand impossible to ignore.",
    features: [
      "Logo animation & brand intros",
      "Kinetic typography videos",
      "UI/UX motion for apps & websites",
      "Explainer animations",
    ],
    cta: "SEE MOTION PROJECTS →",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect x="4" y="4" width="24" height="24" fill="#00ffcc" rx="2" />
        <rect x="8" y="8" width="6" height="6" fill="#050508" />
        <rect x="16" y="8" width="4" height="6" fill="#050508" />
        <rect x="22" y="8" width="4" height="6" fill="#050508" />
        <rect x="8" y="16" width="4" height="6" fill="#050508" />
        <rect x="14" y="16" width="6" height="6" fill="#050508" />
        <rect x="22" y="16" width="4" height="6" fill="#050508" />
      </svg>
    ),
  },
  {
    problem: "YOUR CONTENT STRATEGY ISN'T WORKING?",
    title: "Content Strategy",
    description: "Data-driven content plans that grow your audience and turn followers into paying customers.",
    features: [
      "Monthly content calendar planning",
      "Platform-specific content (IG, TikTok, YouTube)",
      "Content audit & performance analysis",
      "Scripting & creative direction",
    ],
    cta: "LEARN MORE →",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect x="4" y="4" width="24" height="24" fill="#00ffcc" rx="2" />
        <circle cx="16" cy="16" r="8" fill="#050508" />
        <circle cx="16" cy="16" r="4" fill="#00ffcc" />
        <rect x="14" y="2" width="4" height="4" fill="#050508" />
        <rect x="26" y="14" width="4" height="4" fill="#050508" />
      </svg>
    ),
  },
  {
    problem: "YOUR SOCIAL MEDIA FEELS DEAD?",
    title: "Brand Storytelling",
    description: "Full brand narrative — from concept to final cut. I help brands find their voice and tell it cinematically.",
    features: [
      "Brand documentary films",
      "Founder story videos",
      "Company culture content",
      "Campaign creative direction",
    ],
    cta: "SEE BRAND FILMS →",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect x="2" y="6" width="28" height="20" fill="#00ffcc" rx="2" />
        <rect x="6" y="10" width="20" height="12" fill="#050508" />
        <rect x="10" y="2" width="12" height="4" fill="#00ffcc" />
        <rect x="6" y="2" width="4" height="4" fill="#00ffcc" />
        <rect x="22" y="2" width="4" height="4" fill="#00ffcc" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(4).fill(false));

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.from(card, {
          opacity: 0,
          y: 50,
          duration: 0.6,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            onEnter: () => setVisibleCards((prev) => {
              const newState = [...prev];
              newState[i] = true;
              return newState;
            }),
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen bg-[#050508] py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="pixel-badge mb-4 mx-auto">
            <span>HOW I CAN HELP</span>
          </div>
          <h2 className="font-sora text-4xl md:text-5xl text-white mb-4">
            Creative Services
          </h2>
          <div className="h-1 w-24 bg-[#00ffcc] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`pixel-box bg-[#0a0a0f] p-6 transition-all duration-500 ${
                visibleCards[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">{service.icon}</div>
                <div className="flex-1">
                  <div className="pixel-text text-[#00ffcc] text-xs mb-1">{service.problem}</div>
                  <h3 className="font-sora text-xl text-white mb-2">{service.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {service.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-[#00ffcc]" aria-hidden="true">◆</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <a href="#projects" className="pixel-text text-[#00ffcc] text-xs hover:text-white transition-colors">
                {service.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}