"use client";

import { useRef, useEffect } from "react";

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discovery",
    subtitle: "UNDERSTANDING YOUR VISION",
    description: "I dive deep into your brand, audience, and goals. Every frame will serve a purpose.",
    details: ["Brand audit", "Audience analysis", "Competitor research", "Goal alignment"],
  },
  {
    number: "02",
    title: "Strategy",
    subtitle: "BLUEPRINT FOR SUCCESS",
    description: "Data-driven content plans that align with your brand voice and drive measurable growth.",
    details: ["Content calendar", "Platform strategy", "KPI definition", "Creative direction"],
  },
  {
    number: "03",
    title: "Creation",
    subtitle: "WHERE MAGIC HAPPENS",
    description: "From raw footage to cinematic story — every cut, transition, and effect is intentional.",
    details: ["Video editing", "Motion graphics", "Sound design", "Color grading"],
  },
  {
    number: "04",
    title: "Delivery",
    subtitle: "RESULTS THAT MATTER",
    description: "Optimized exports, performance tracking, and iterative improvements based on real data.",
    details: ["Multi-format export", "Performance tracking", "A/B testing", "Iterative optimization"],
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const steps = sectionRef.current.querySelectorAll(".process-step");
      steps.forEach((step) => {
        const rect = step.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85;
        if (isVisible) {
          step.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full bg-[#050508] section-padding">
      {/* Frame Logic - Timeline markers */}
      <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-[#00ffcc]/10 hidden lg:block" />
      <div className="absolute right-8 top-0 bottom-0 w-[1px] bg-[#00ffcc]/10 hidden lg:block" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header - Frame Logic */}
        <div className="frame-header reveal">
          <div className="frame-number mb-2">FRAME 05</div>
          <div className="frame-divider" />
          <h2 className="text-section text-white">
            <span className="frame-label">EDITORIAL</span>
            <br />
            My Process
          </h2>
        </div>

        {/* Process steps - Frame Logic numbered */}
        <div className="space-y-16 md:space-y-24">
          {PROCESS_STEPS.map((step, i) => (
            <div
              key={i}
              className={`process-step reveal flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-16`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Number - HUGE background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-[200px] md:text-[300px] font-black text-white/[0.03] leading-none select-none">
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 relative z-10">
                <div className="text-mono text-[#00ffcc]/60 text-[10px] tracking-[0.2em] mb-2">
                  {step.subtitle}
                </div>
                <h3 className="text-display text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-white/60 leading-relaxed mb-6">
                  {step.description}
                </p>
                <div className="space-y-3">
                  {step.details.map((detail, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm text-white/70">
                      <span className="text-[#00ffcc] text-[10px]">◆</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual indicator */}
              <div className="relative z-10 w-full md:w-64 aspect-square bg-[#0a0a0f] border border-white/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-hero font-black text-[#00ffcc]/20 mb-2">
                    {step.number}
                  </div>
                  <div className="w-16 h-[1px] bg-[#00ffcc]/20 mx-auto" />
                </div>
                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-8 h-[1px] bg-[#00ffcc]/20" />
                <div className="absolute top-4 left-4 w-[1px] h-8 bg-[#00ffcc]/20" />
                <div className="absolute bottom-4 right-4 w-8 h-[1px] bg-[#00ffcc]/20" />
                <div className="absolute bottom-4 right-4 w-[1px] h-8 bg-[#00ffcc]/20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right vertical text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="writing-vertical text-mono text-white/20 text-[10px] tracking-[0.3em]">
          WORKFLOW
        </div>
      </div>
    </section>
  );
}
