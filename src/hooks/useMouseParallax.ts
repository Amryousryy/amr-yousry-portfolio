"use client";

import { useEffect, useRef } from "react";

export function useMouseParallax() {
  const mouse = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
  
  return mouse;
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}