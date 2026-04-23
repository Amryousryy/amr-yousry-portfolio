"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
}

const PROJECTS: Project[] = [
  { id: "1", title: "Nike Air Max", category: "Commercial", thumbnail: "" },
  { id: "2", title: "Spotify Wrapped", category: "Music Video", thumbnail: "" },
  { id: "3", title: "Tesla Model S", category: "Product", thumbnail: "" },
  { id: "4", title: "Coca-Cola Summer", category: "Commercial", thumbnail: "" },
  { id: "5", title: "Apple Event", category: "Corporate", thumbnail: "" },
  { id: "6", title: "Adidas Originals", category: "Fashion", thumbnail: "" },
];

export default function FilmStripSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !stripRef.current) return;

    const ctx = gsap.context(() => {
      const stripWidth = stripRef.current?.scrollWidth || 0;
      const viewportWidth = window.innerWidth;

      gsap.to(stripRef.current, {
        x: -(stripWidth - viewportWidth + 100),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${stripWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="h-screen overflow-hidden bg-[#050508]">
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#0a0a0f] flex items-center px-4 z-10">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="w-8 h-6 border-2 border-[#1a1a2e] border-t-0 border-b-0 mx-1 flex-shrink-0" />
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#0a0a0f] flex items-center px-4 z-10">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="w-8 h-6 border-2 border-[#1a1a2e] border-t-0 border-b-0 mx-1 flex-shrink-0" />
        ))}
      </div>
      
      <div ref={stripRef} className="flex items-center h-full px-[50vw] gap-12 py-10">
        {PROJECTS.map((project, index) => (
          <div
            key={project.id}
            data-project
            className="film-frame flex-shrink-0 w-[450px] h-[320px] bg-[#0a0a0f] border-4 border-[#1a1a2e] relative group cursor-pointer"
            style={{
              background: "linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 100%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ffcc]/10 to-transparent group-hover:from-[#00ffcc]/30 transition-all" />
            <div className="absolute top-3 left-3 pixel-text text-[#00ffcc] text-xs">
              SCENE {String(index + 1).padStart(2, "0")}
            </div>
            <div className="absolute top-3 right-3 pixel-text text-white/50 text-xs">
              00:{String(20 + index * 5).padStart(2, "0")}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-[#00ffcc]/30 flex items-center justify-center group-hover:border-[#00ffcc] transition-colors">
                <span className="text-[#00ffcc] text-2xl opacity-50 group-hover:opacity-100 transition-opacity">▶</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent">
              <span className="pixel-text text-[#00ffcc] text-xs mb-2 block">{project.category}</span>
              <h3 className="font-sora text-2xl text-white mb-1">{project.title}</h3>
              <div className="flex items-center gap-2">
                <span className="pixel-text text-white/50 text-[10px]">DIRECTED BY AMR</span>
              </div>
            </div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#00ffcc]/50 transition-colors" />
          </div>
        ))}
      </div>
      
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20">
        <span className="pixel-text text-[#00ffcc] text-xs writing-vertical">
          DRAG TO EXPLORE
        </span>
      </div>
      
      <div className="absolute right-8 top-8 z-20">
        <div className="pixel-text text-white/50 text-xs">
          SCROLL TO CONTINUE
        </div>
      </div>
    </section>
  );
}