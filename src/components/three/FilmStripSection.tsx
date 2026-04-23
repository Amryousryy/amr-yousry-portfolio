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
  { id: "1", title: "Nike Campaign", category: "Commercial", thumbnail: "/projects/nike.jpg" },
  { id: "2", title: "Spotify Wrapped", category: "Music Video", thumbnail: "/projects/spotify.jpg" },
  { id: "3", title: "Tesla Launch", category: "Product", thumbnail: "/projects/tesla.jpg" },
  { id: "4", title: "Coca-Cola", category: "Commercial", thumbnail: "/projects/coke.jpg" },
  { id: "5", title: "Apple Event", category: "Corporate", thumbnail: "/projects/apple.jpg" },
  { id: "6", title: "Adidas Originals", category: "Fashion", thumbnail: "/projects/adidas.jpg" },
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
      <div className="absolute top-0 left-0 right-0 h-8 bg-[#0a0a0f] flex items-center px-4">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-6 h-4 border-2 border-[#1a1a2e] border-t-0 border-b-0 mx-1" />
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#0a0a0f] flex items-center px-4">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-6 h-4 border-2 border-[#1a1a2e] border-t-0 border-b-0 mx-1" />
        ))}
      </div>
      
      <div ref={stripRef} className="flex items-center h-full px-[50vw] gap-8">
        {PROJECTS.map((project, index) => (
          <div
            key={project.id}
            className="film-frame flex-shrink-0 w-[400px] h-[300px] bg-[#0a0a0f] border-4 border-[#1a1a2e] relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ffcc]/20 to-transparent group-hover:from-[#00ffcc]/40 transition-all" />
            <div className="absolute top-2 left-2 pixel-text text-[#00ffcc] text-xs">
              FRAME {String(index + 1).padStart(3, "0")}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0f] to-transparent">
              <h3 className="font-sora text-xl text-white mb-1">{project.title}</h3>
              <span className="pixel-text text-xs text-[#00ffcc]">{project.category}</span>
            </div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#00ffcc] transition-colors" />
          </div>
        ))}
      </div>
      
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20">
        <span className="pixel-text text-[#00ffcc] text-xs writing-vertical">
          SCROLL TO EXPLORE
        </span>
      </div>
    </section>
  );
}