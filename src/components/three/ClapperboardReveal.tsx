"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ClapperboardReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !topRef.current || !bottomRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(contentRef.current, { opacity: 0, y: 50 });
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "center center",
          scrub: 1,
        },
      });

      tl.to(topRef.current, {
        rotationX: -120,
        transformOrigin: "top center",
        ease: "power2.in",
      })
      .to(bottomRef.current, {
        rotationX: 120,
        transformOrigin: "bottom center",
        ease: "power2.in",
      }, 0)
      .to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
      }, 0.8);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="min-h-screen bg-[#050508] flex items-center justify-center perspective-1000">
      <div className="relative w-full max-w-4xl mx-auto" style={{ transformStyle: "preserve-3d" }}>
        <div
          ref={topRef}
          className="clapperboard-top bg-[#1a1a2e] p-6 text-center relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="flex justify-between items-center border-b-2 border-[#00ffcc] pb-4">
            <span className="pixel-text text-white text-xs">SCENE 01</span>
            <span className="pixel-text text-[#00ffcc] text-xs">TAKE 01</span>
            <span className="pixel-text text-white text-xs">DIRECTOR: AMR</span>
          </div>
          <div className="h-8 mt-4 bg-[#0a0a0f] flex items-center justify-center">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-12 h-full border-r border-l border-[#1a1a2e]"
                style={{ 
                  background: i % 2 === 0 ? "#050508" : "#0a0a0f",
                  clipPath: i % 2 === 0 ? "polygon(0 0, 100% 30%, 100% 100%, 0 70%)" : "none"
                }}
              />
            ))}
          </div>
        </div>
        
        <div
          ref={bottomRef}
          className="clapperboard-bottom bg-[#0a0a0f] p-8 border-t-4 border-[#00ffcc]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div ref={contentRef} className="space-y-8">
            <h2 className="font-sora text-4xl md:text-6xl text-white text-center">
              Featured Work
            </h2>
            <div className="pixel-text text-[#00ffcc] text-center text-sm">
              ★ PORTFOLIO SHOWCASE ★
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-video bg-[#1a1a2e] border-2 border-[#00ffcc]/30 hover:border-[#00ffcc] transition-colors flex items-center justify-center"
                >
                  <span className="pixel-text text-[#00ffcc]/50 text-xs">PROJECT {i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}