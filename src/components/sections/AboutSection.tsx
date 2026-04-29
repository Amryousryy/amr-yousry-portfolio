"use client";

import { useRef, useEffect } from "react";

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        sectionRef.current.classList.add("visible");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center bg-[#050508] section-padding"
    >
      {/* Frame Logic - Timeline markers */}
      <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-[#00ffcc]/10 hidden lg:block" />
      <div className="absolute right-8 top-0 bottom-0 w-[1px] bg-[#00ffcc]/10 hidden lg:block" />

      {/* Right vertical text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="writing-vertical text-mono text-white/20 text-[10px] tracking-[0.3em]">
          STRATEGY
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header - Frame Logic */}
        <div className="mb-12 reveal">
          <div className="frame-number mb-2">FRAME 04</div>
          <div className="frame-divider" />
          <h2 className="text-section text-white mb-8">
            <span className="frame-label">PROFILE</span>
            <br />
            Creative Strategist
            <br />
            <span className="text-[#00ffcc]">& Filmmaker</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <div className="reveal">
            <div className="w-16 h-[1px] bg-[#00ffcc]/40 mb-8" />

            <p className="text-lg text-white/60 leading-relaxed mb-6">
              I don't just edit videos — I craft visual stories that convert viewers into
              loyal customers. Every frame serves a purpose: to stop the scroll,
              evoke emotion, and drive action.
            </p>

            <p className="text-lg text-white/60 leading-relaxed mb-8">
              With 3+ years in the industry and 50+ projects delivered,
              I've helped brands across Egypt and Saudi Arabia scale their content
              from forgettable to unforgettable.
            </p>

            <div className="flex flex-wrap gap-4">
              {[
                { label: "Video Editing", icon: "▶" },
                { label: "Motion Design", icon: "◆" },
                { label: "Content Strategy", icon: "★" },
              ].map((skill, i) => (
                <div
                  key={i}
                  className="px-6 py-3 border border-[#00ffcc]/20 bg-[#00ffcc]/5 text-[#00ffcc] text-mono text-[11px] tracking-wider hover:bg-[#00ffcc]/10 transition-colors duration-300"
                >
                  <span className="mr-2">{skill.icon}</span>
                  {skill.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Stats & Visual */}
          <div className="reveal">
            <div className="relative">
              {/* Cinematic frame */}
              <div className="absolute -inset-4 border border-[#00ffcc]/10 pointer-events-none" />
              <div className="absolute -top-4 -left-4 w-16 h-[1px] bg-[#00ffcc]/20" />
              <div className="absolute -top-4 -left-4 w-[1px] h-16 bg-[#00ffcc]/20" />

              <div className="bg-[#0a0a0f] p-8 md:p-12 border border-white/5">
                <div className="text-mono text-[#00ffcc]/40 text-[10px] mb-6 tracking-widest">
                  POSITIONING
                </div>

                <h3 className="text-display text-white mb-6">
                  Your Content<br />
                  <span className="text-[#00ffcc]">Strategist</span>
                </h3>

                <div className="space-y-6">
                  {[
                    { number: "50+", label: "Projects Delivered", desc: "Across industries" },
                    { number: "3+", label: "Years Experience", desc: "In video production" },
                    { number: "1M+", label: "Views Generated", desc: "Across campaigns" },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-end gap-4 pb-6 border-b border-white/5 last:border-0">
                      <div className="text-hero text-[#00ffcc]/80 font-black leading-none">
                        {stat.number}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{stat.label}</div>
                        <div className="text-mono text-white/30 text-[10px]">{stat.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
