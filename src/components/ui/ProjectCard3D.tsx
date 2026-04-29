"use client";

import { useRef, useState, useEffect } from "react";
import { animate, createAnimatable } from "animejs";

interface ProjectCard3DProps {
  title: string;
  category: string;
  thumbnail: string;
  views?: string;
  onClick?: () => void;
}

export default function ProjectCard3D({ title, category, thumbnail, views, onClick }: ProjectCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // anime.js createAnimatable for smooth tilt (replaces GSAP)
  const tiltRef = useRef<ReturnType<typeof createAnimatable> | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    // Initialize animatable on first use
    if (!tiltRef.current) {
      tiltRef.current = createAnimatable(cardRef.current, { rotateX: 0, rotateY: 0, duration: 300, ease: "outQuint" });
    }

    // Use anime.js createAnimatable for efficient tracking
    if (tiltRef.current) {
      tiltRef.current.rotateX(rotateX);
      tiltRef.current.rotateY(rotateY);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    // Revert to default position
    if (tiltRef.current) {
      tiltRef.current.rotateX(0);
      tiltRef.current.rotateY(0);
    }
  };

  // Cleanup animatable on unmount
  useEffect(() => {
    return () => {
      if (tiltRef.current) tiltRef.current.revert();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative w-full aspect-video bg-[#0a0a0f] border-2 border-[#1a1a2e] cursor-pointer overflow-hidden transition-shadow duration-300"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        boxShadow: isHovered ? "0 20px 40px rgba(0, 255, 204, 0.2)" : "0 4px 20px rgba(0, 0, 0, 0.5)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick?.(); }}
    >
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${
          isHovered ? "scale-110 grayscale" : "scale-100 grayscale-0"
        }`}
        style={{ backgroundImage: `url(${thumbnail})` }}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-70"
        }`}
      />

      <div
        className={`absolute inset-0 flex flex-col justify-end p-4 transition-all duration-300 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="pixel-text text-[#00ffcc] text-xs mb-2">
          {category}
        </div>
        <h3 className="font-sora text-xl text-white mb-2">{title}</h3>
        {views && (
          <div className="pixel-text text-white/60 text-xs">
            {views} VIEWS
          </div>
        )}
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-[#00ffcc]/20 border-2 border-[#00ffcc] flex items-center justify-center">
          <svg className="w-8 h-8 text-[#00ffcc]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <div
        className={`absolute inset-0 border-2 transition-colors duration-300 ${
          isHovered ? "border-[#00ffcc]" : "border-transparent"
        }`}
      />
    </div>
  );
}
