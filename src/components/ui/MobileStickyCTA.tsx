"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 300;
      setIsVisible(scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="border-t border-[#00ffcc]/20 bg-[#050508]/95 backdrop-blur-sm p-4">
        <div className="flex gap-3">
          <Link
            href="/contact"
            className="pixel-button-primary flex-1"
          >
            GET A QUOTE
          </Link>
          <a
            href="https://calendly.com/your-link"
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-button-secondary flex-1"
          >
            BOOK CALL
          </a>
        </div>
        <div className="text-center mt-2">
          <span className="frame-number text-[8px]">FRAMED FOR CONVERSION</span>
        </div>
      </div>
    </div>
  );
}
