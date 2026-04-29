"use client";

import { useRef, useEffect } from "react";

const TECH_STACK = [
  { category: "WEB2", items: ["Next.js 16", "TypeScript", "React 19", "Tailwind CSS", "Node.js"] },
  { category: "CREATIVE", items: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Blender", "Figma"] },
  { category: "TOOLS", items: ["Cloudinary", "Vercel", "MongoDB", "NextAuth", "GitHub"] },
  { category: "AI & AUTOMATION", items: ["OpenAI API", "Cursor", "Claude", "n8n", "V0.dev"] },
];

export default function TechStackSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll(".tech-card");
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85;
        if (isVisible) {
          setTimeout(() => card.classList.add("visible"), i * 100);
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
          <div className="frame-number mb-2">FRAME 06</div>
          <div className="frame-divider" />
          <h2 className="text-section text-white">
            <span className="frame-label">TOOLKIT</span>
            <br />
            Tech Stack
          </h2>
        </div>

        {/* Frame-styled tech grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TECH_STACK.map((group, i) => (
            <div
              key={i}
              className="tech-card reveal bg-[#0a0a0f] frame-border p-8 hover:border-[#00ffcc]/30 transition-all duration-500"
            >
              <div className="text-mono text-[#00ffcc]/60 text-[10px] tracking-[0.2em] mb-6">
                {group.category}
              </div>
              <div className="flex flex-wrap gap-3">
                {group.items.map((tech, j) => (
                  <div
                    key={j}
                    className="px-4 py-2 border border-white/10 bg-white/[0.02] text-white/70 text-sm hover:border-[#00ffcc]/30 hover:text-[#00ffcc] transition-all duration-300"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-16 pt-8 border-t border-white/5 reveal">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "3+", label: "Years", desc: "Experience" },
              { value: "50+", label: "Projects", desc: "Delivered" },
              { value: "1M+", label: "Views", desc: "Generated" },
              { value: "100%", label: "Client", desc: "Satisfaction" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-display font-black text-[#00ffcc] mb-1">{stat.value}</div>
                <div className="text-mono text-white/40 text-[10px]">{stat.label}</div>
                <div className="text-mono text-white/20 text-[8px]">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right vertical text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="writing-vertical text-mono text-white/20 text-[10px] tracking-[0.3em]">
          TOOLS
        </div>
      </div>
    </section>
  );
}
