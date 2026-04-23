"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect x="4" y="6" width="24" height="18" fill="#00ffcc" />
        <rect x="8" y="10" width="16" height="10" fill="#050508" />
        <circle cx="24" cy="8" r="2" fill="#050508" />
        <rect x="6" y="2" width="4" height="4" fill="#00ffcc" />
        <rect x="12" y="2" width="4" height="4" fill="#00ffcc" />
      </svg>
    ),
    title: "Video Editing",
    description: "Professional editing for commercials, films, music videos, and social media content.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect x="2" y="8" width="28" height="16" fill="#00ffcc" />
        <rect x="6" y="12" width="8" height="8" fill="#050508" />
        <rect x="16" y="12" width="4" height="8" fill="#050508" />
        <rect x="22" y="12" width="4" height="8" fill="#050508" />
        <rect x="6" y="4" width="2" height="4" fill="#00ffcc" />
        <rect x="10" y="4" width="2" height="4" fill="#00ffcc" />
        <rect x="14" y="4" width="2" height="4" fill="#00ffcc" />
      </svg>
    ),
    title: "Motion Design",
    description: "Eye-catching animations, titles, transitions, and visual effects that bring stories to life.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect x="4" y="4" width="24" height="24" fill="#00ffcc" />
        <circle cx="16" cy="16" r="8" fill="#050508" />
        <circle cx="16" cy="16" r="4" fill="#00ffcc" />
        <rect x="14" y="2" width="4" height="4" fill="#050508" />
        <rect x="26" y="14" width="4" height="4" fill="#050508" />
      </svg>
    ),
    title: "Photography",
    description: "Captivating product, portrait, and lifestyle photography for brands and campaigns.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect x="4" y="4" width="24" height="24" fill="#00ffcc" />
        <rect x="8" y="8" width="6" height="6" fill="#050508" />
        <rect x="18" y="8" width="6" height="6" fill="#050508" />
        <rect x="8" y="18" width="16" height="2" fill="#050508" />
        <rect x="8" y="22" width="12" height="2" fill="#050508" />
      </svg>
    ),
    title: "Content Strategy",
    description: "Strategic content planning and optimization for maximum engagement and growth.",
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
            onEnter: () => setVisibleCards(prev => {
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
            <span>WHAT I DO</span>
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
              className={`pixel-box bg-[#0a0a0f] p-6 transition-all duration-300 ${
                visibleCards[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transition: "all 0.3s" }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">{service.icon}</div>
                <div>
                  <h3 className="font-sora text-xl text-white mb-2">{service.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}