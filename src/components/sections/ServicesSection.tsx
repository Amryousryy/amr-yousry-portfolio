"use client";

import { useRef, useEffect } from "react";

const SERVICES = [
  {
    number: "01",
    title: "Video Editing",
    subtitle: "TURNING RAW INTO REEL",
    description: "Cinematic edits that stop the scroll and drive action. From raw footage to a story that sells.",
    features: [
      "Short-form content (Reels, TikTok, YouTube Shorts)",
      "Brand films & commercial edits",
      "Documentary & event coverage",
      "Color grading & sound design",
    ],
    icon: (
      <svg viewBox="0 0 32 32" className="w-12 h-12">
        <rect x="4" y="8" width="24" height="16" fill="#00ffcc" rx="2" />
        <rect x="8" y="12" width="12" height="8" fill="#050508" />
        <circle cx="24" cy="10" r="2" fill="#050508" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Motion Design",
    subtitle: "MOTION THAT GRABS",
    description: "Animated logos, kinetic typography, and motion graphics that make your brand impossible to ignore.",
    features: [
      "Logo animation & brand intros",
      "Kinetic typography videos",
      "UI/UX motion for apps & websites",
      "Explainer animations",
    ],
    icon: (
      <svg viewBox="0 0 32 32" className="w-12 h-12">
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
    number: "03",
    title: "Content Strategy",
    subtitle: "DATA-DRIVEN GROWTH",
    description: "Data-driven content plans that grow your audience and turn followers into paying customers.",
    features: [
      "Monthly content calendar planning",
      "Platform-specific content (IG, TikTok, YouTube)",
      "Content audit & performance analysis",
      "Scripting & creative direction",
    ],
    icon: (
      <svg viewBox="0 0 32 32" className="w-12 h-12">
        <rect x="4" y="4" width="24" height="24" fill="#00ffcc" rx="2" />
        <circle cx="16" cy="16" r="8" fill="#050508" />
        <circle cx="16" cy="16" r="4" fill="#00ffcc" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Brand Storytelling",
    subtitle: "NARRATIVE THAT SELLS",
    description: "Full brand narrative — from concept to final cut. I help brands find their voice and tell it cinematically.",
    features: [
      "Brand documentary films",
      "Founder story videos",
      "Company culture content",
      "Campaign creative direction",
    ],
    icon: (
      <svg viewBox="0 0 32 32" className="w-12 h-12">
        <rect x="2" y="6" width="28" height="20" fill="#00ffcc" rx="2" />
        <rect x="6" y="10" width="20" height="12" fill="#050508" />
        <rect x="10" y="2" width="12" height="4" fill="#00ffcc" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll(".service-card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        if (isVisible) {
          card.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} data-frame="02" className="relative min-h-screen w-full bg-[#050508] section-padding">
      {/* Frame Logic - Timeline markers */}
      <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-[#00ffcc]/10 hidden lg:block" />
      <div className="absolute right-8 top-0 bottom-0 w-[1px] bg-[#00ffcc]/10 hidden lg:block" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header - Frame Logic */}
        <div className="frame-header reveal">
          <div className="frame-number mb-2">FRAME 02</div>
          <div className="frame-divider" />
          <h2 className="text-section text-white">
            <span className="frame-label">BLUEPRINTS</span>
            <br />
            What I Deliver
          </h2>
        </div>

        {/* Services grid - Frame-styled cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service, i) => (
            <div
              key={i}
              className="service-card reveal group relative bg-[#0a0a0f] p-8 md:p-12 border border-white/5 hover:border-[#00ffcc]/30 transition-all duration-500"
            >
              {/* Service number - HUGE background */}
              <div className="absolute -top-4 -right-4 text-[120px] font-black text-white/[0.03] leading-none pointer-events-none">
                {service.number}
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6 text-[#00ffcc]">
                  {service.icon}
                </div>

                {/* Subtitle */}
                <div className="text-mono text-[#00ffcc]/60 text-[10px] tracking-[0.2em] mb-2">
                  {service.subtitle}
                </div>

                {/* Title */}
                <h3 className="text-display text-white mb-4">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-white/60 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm text-white/70">
                      <span className="text-[#00ffcc] text-[10px]">◆</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="#projects"
                  className="inline-flex items-center text-[#00ffcc] text-mono text-[11px] tracking-wider hover:text-white transition-colors duration-300 group"
                >
                  <span>Learn more</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right vertical text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="writing-vertical text-mono text-white/20 text-[10px] tracking-[0.3em]">
          EXPERTISE
        </div>
      </div>
    </section>
  );
}
