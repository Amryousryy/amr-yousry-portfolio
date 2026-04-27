"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type CursorState = "default" | "hover-link" | "hover-project" | "hover-cta" | "click";

export default function CinematicCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rippleContainerRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isVisible, setIsVisible] = useState(false);
  
  const currentPos = useRef({ x: 0, y: 0 });
  const lastState = useRef<CursorState>("default");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Use GSAP for high-performance positioning (bypasses React)
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power3" });

    const trailSetters = trailRefs.current.map((trail, i) => {
      if (!trail) return null;
      return {
        x: gsap.quickTo(trail, "x", { duration: 0.2 + i * 0.05, ease: "power2" }),
        y: gsap.quickTo(trail, "y", { duration: 0.2 + i * 0.05, ease: "power2" })
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      const { clientX, clientY } = e;
      currentPos.current = { x: clientX, y: clientY };
      
      xTo(clientX);
      yTo(clientY);
      
      trailSetters.forEach((setter) => {
        if (setter) {
          setter.x(clientX);
          setter.y(clientY);
        }
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      let newState: CursorState = "default";

      if (target.closest("button")) {
        newState = "hover-cta";
      } else if (target.closest("a")) {
        newState = "hover-link";
      } else if (target.closest("[data-project]")) {
        newState = "hover-project";
      }

      if (newState !== lastState.current) {
        lastState.current = newState;
        setCursorState(newState);
      }
    };

    const createRipple = (x: number, y: number) => {
      if (!rippleContainerRef.current) return;
      
      const ripple = document.createElement("div");
      ripple.className = "absolute w-4 h-4 rounded-full border-2 border-[#00ffcc] pointer-events-none z-[9997]";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.transform = "translate(-50%, -50%)";
      ripple.style.animation = "ripple 0.6s ease-out forwards";
      
      rippleContainerRef.current.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    };

    const handleMouseDown = () => {
      setCursorState("click");
      createRipple(currentPos.current.x, currentPos.current.y);
    };

    const handleMouseUp = () => {
      setCursorState(lastState.current);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isVisible]);

  if (typeof window === "undefined") return null;

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { trailRefs.current[i] = el; }}
            className="absolute top-0 left-0 rounded-full bg-[#00ffcc] will-change-transform"
            style={{
              opacity: 0.4 - i * 0.04,
              width: `${12 - i * 1}px`,
              height: `${12 - i * 1}px`,
              marginLeft: `-${(12 - i * 1) / 2}px`,
              marginTop: `-${(12 - i * 1) / 2}px`,
            }}
          />
        ))}
      </div>
      
      {/* Ripple Container (Native DOM) */}
      <div ref={rippleContainerRef} className="fixed inset-0 pointer-events-none z-[9997]" />
      
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative">
          {cursorState === "default" && (
            <div className="w-5 h-5 border-2 border-[#00ffcc] rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
              <div className="w-1.5 h-1.5 bg-[#00ffcc] rounded-full" />
            </div>
          )}

          {cursorState === "hover-link" && (
            <div className="w-12 h-12 -translate-x-1/2 -translate-y-1/2">
              <svg viewBox="0 0 48 48" className="w-full h-full animate-spin-slow">
                {[...Array(6)].map((_, i) => (
                  <line
                    key={i}
                    x1="24"
                    y1="24"
                    x2={24 + Math.cos((i / 6) * Math.PI * 2) * 18}
                    y2={24 + Math.sin((i / 6) * Math.PI * 2) * 18}
                    stroke="#00ffcc"
                    strokeWidth="2"
                    style={{ transformOrigin: "24px 24px" }}
                  />
                ))}
                <circle cx="24" cy="24" r="20" fill="none" stroke="#00ffcc" strokeWidth="2" />
              </svg>
            </div>
          )}

          {cursorState === "hover-project" && (
            <div className="w-20 h-20 rounded-full border-2 border-[#00ffcc] bg-[#00ffcc]/10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col scale-110">
              <span className="pixel-text text-[#00ffcc] text-[8px]">PLAY</span>
              <span className="text-[#00ffcc] text-sm">▶</span>
            </div>
          )}

          {cursorState === "hover-cta" && (
            <div className="w-8 h-8 rounded-full bg-[#00ffcc] -translate-x-1/2 -translate-y-1/2 scale-125" />
          )}

          {cursorState === "click" && (
            <div className="w-6 h-6 rounded-full bg-white -translate-x-1/2 -translate-y-1/2 scale-150 opacity-50" />
          )}
        </div>
      </div>

      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        @keyframes ripple {
          0% { width: 4px; height: 4px; opacity: 1; }
          100% { width: 60px; height: 60px; opacity: 0; }
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
