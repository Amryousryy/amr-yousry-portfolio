"use client";

import { useEffect, useRef, useState } from "react";

export default function CinematicCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const [cursorState, setCursorState] = useState<"default" | "hover" | "click">("default");
  const [isVisible, setIsVisible] = useState(false);
  
  const positions = useRef<{ x: number; y: number }[]>(Array(8).fill({ x: 0, y: 0 }));
  
  useEffect(() => {
    let animationId: number;
    let currentX = 0;
    let currentY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      currentX = e.clientX;
      currentY = e.clientY;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      
      positions.current.push({ x: currentX, y: currentY });
      positions.current.shift();
      
      trailRefs.current.forEach((trail, i) => {
        if (trail) {
          const pos = positions.current[Math.min(i * 2, positions.current.length - 1)];
          trail.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
          trail.style.opacity = String(0.3 - i * 0.03);
        }
      });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a")) {
        setCursorState("hover");
      }
    };
    
    const handleMouseOut = () => {
      setCursorState("default");
    };
    
    const handleMouseDown = () => setCursorState("click");
    const handleMouseUp = () => setCursorState("hover");
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  
  if (typeof window === "undefined") return null;
  
  return (
    <>
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
      
      {trailRefs.current.map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRefs.current[i] = el; }}
          className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#00ffcc] pointer-events-none z-[9998] mix-blend-screen"
          style={{ transition: "transform 0.1s ease-out, opacity 0.1s" }}
        />
      ))}
      
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {cursorState === "default" && (
          <div className="w-8 h-8 border-2 border-[#00ffcc] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-[#00ffcc] rounded-full" />
          </div>
        )}
        
        {cursorState === "hover" && (
          <div className="w-16 h-16 border-2 border-[#00ffcc] rounded-full flex items-center justify-center bg-[#00ffcc]/10 animate-pulse">
            <span className="pixel-text text-[#00ffcc] text-[8px]">VIEW</span>
          </div>
        )}
        
        {cursorState === "click" && (
          <div className="w-6 h-6 bg-[#00ffcc] rounded-full animate-scale-in" />
        )}
      </div>
    </>
  );
}