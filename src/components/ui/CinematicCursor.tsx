"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = "default" | "hover-link" | "hover-project" | "hover-cta" | "click";

export default function CinematicCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const positions = useRef<{ x: number; y: number }[]>(Array(8).fill({ x: 0, y: 0 }));
  const currentPos = useRef({ x: 0, y: 0 });
  const lastMoveTime = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTime.current < 16) return; // ~60fps
      lastMoveTime.current = now;
      
      setIsVisible(true);
      currentPos.current = { x: e.clientX, y: e.clientY };
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      
      positions.current.push({ x: e.clientX, y: e.clientY });
      positions.current.shift();
      
      trailRefs.current.forEach((trail, i) => {
        if (trail) {
          const posIndex = Math.min(i * 2, positions.current.length - 1);
          const pos = positions.current[posIndex];
          trail.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
          trail.style.opacity = String(0.4 - i * 0.04);
          trail.style.width = `${12 - i * 1}px`;
          trail.style.height = `${12 - i * 1}px`;
        }
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button")) {
        setCursorState("hover-cta");
      } else if (target.closest("a")) {
        setCursorState("hover-link");
      } else if (target.closest("[data-project]")) {
        setCursorState("hover-project");
      } else {
        setCursorState("default");
      }
    };

    const handleMouseLeave = () => {
      setCursorState("default");
    };

    const handleMouseDown = () => {
      setCursorState("click");
      setRipples((prev) => [
        ...prev,
        { id: Date.now(), x: currentPos.current.x, y: currentPos.current.y },
      ]);
    };

    const handleMouseUp = () => {
      setRipples([]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (typeof window === "undefined") return null;

  return (
    <>
      {trailRefs.current.map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="fixed top-0 left-0 rounded-full bg-[#00ffcc] pointer-events-none z-[9998]"
          style={{
            transition: "transform 0.08s ease-out, opacity 0.1s",
          }}
        />
      ))}
      
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {cursorState === "default" && (
          <div className="w-5 h-5 border-2 border-[#00ffcc] rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            <div className="w-1.5 h-1.5 bg-[#00ffcc] rounded-full" />
          </div>
        )}

        {cursorState === "hover-link" && (
          <div className="w-12 h-12 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              {[...Array(6)].map((_, i) => (
                <line
                  key={i}
                  x1="24"
                  y1="24"
                  x2={24 + Math.cos((i / 6) * Math.PI * 2) * 18}
                  y2={24 + Math.sin((i / 6) * Math.PI * 2) * 18}
                  stroke="#00ffcc"
                  strokeWidth="2"
                  className="origin-center animate-aperture"
                  style={{
                    animation: "rotate 2s linear infinite",
                    transformOrigin: "24px 24px",
                  }}
                />
              ))}
              <circle cx="24" cy="24" r="20" fill="none" stroke="#00ffcc" strokeWidth="2" />
            </svg>
          </div>
        )}

        {cursorState === "hover-project" && (
          <div className="w-20 h-20 rounded-full border-2 border-[#00ffcc] bg-[#00ffcc]/10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col">
            <span className="pixel-text text-[#00ffcc] text-[8px]">PLAY</span>
            <span className="text-[#00ffcc] text-sm">▶</span>
          </div>
        )}

        {cursorState === "hover-cta" && (
          <div className="w-8 h-8 rounded-full bg-[#00ffcc] -translate-x-1/2 -translate-y-1/2 animate-shutter" />
        )}

        {cursorState === "click" && (
          <div className="w-6 h-6 rounded-full bg-white -translate-x-1/2 -translate-y-1/2 animate-click-flash" />
        )}
      </div>

      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed w-4 h-4 rounded-full border-2 border-[#00ffcc] pointer-events-none z-[9997]"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
            animation: "ripple 0.5s ease-out forwards",
          }}
        />
      ))}

      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        @keyframes ripple {
          0% {
            width: 4px;
            height: 4px;
            opacity: 1;
          }
          100% {
            width: 60px;
            height: 60px;
            opacity: 0;
          }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes shutter {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.5); background: white; }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes click-flash {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(2); opacity: 0.5; background: white; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
        
        .animate-shutter {
          animation: shutter 0.3s ease-out;
        }
        
        .animate-click-flash {
          animation: click-flash 0.3s ease-out;
        }
        
        .animate-aperture {
          transform-origin: 24px 24px;
        }
      `}</style>
    </>
  );
}