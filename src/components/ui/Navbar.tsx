"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import LanguageToggle from "@/components/providers/LanguageToggle";

const navLabels = {
  home: "Home",
  services: "Services",
  projects: "Projects",
  about: "About",
  contact: "Contact",
  hireMe: "Hire Me",
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: navLabels.home, href: "/", frame: "01" },
    { name: navLabels.services, href: "/services", frame: "02" },
    { name: navLabels.projects, href: "/projects", frame: "03" },
    { name: navLabels.about, href: "/about", frame: "04" },
    { name: navLabels.contact, href: "/contact", frame: "05" },
  ];

  const [activeFrame, setActiveFrame] = useState("01");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "01";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          const frame = section.getAttribute("data-frame");
          if (frame) current = frame;
        }
      });
      setActiveFrame(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 will-change-[transform,opacity] ${
        scrolled 
          ? "py-4 bg-background/80 backdrop-blur-md border-b border-white/5" 
          : "py-8 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="group flex items-center space-x-3">
          <div className="relative w-12 h-12 transition-transform duration-500 group-hover:scale-105">
            <Image 
              src="/Asset 4.png" 
              alt="Amr Yousry Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-display font-bold tracking-tighter uppercase group-hover:text-accent transition-colors duration-300">
            Amr Yousry
          </span>
        </Link>

        {/* Timeline-style nav - Frame Logic */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <div key={link.name} className="flex items-center">
              <Link
                href={link.href}
                className={`relative text-[10px] font-bold uppercase tracking-[0.25em] transition-colors duration-300 px-3 py-2 group ${
                  activeFrame === link.frame ? "text-accent pixel-border" : "hover:text-accent"
                }`}
              >
                <span className={`frame-number !text-[0.6rem] !static !mb-1 block ${
                  activeFrame === link.frame ? "!text-accent/80" : "!text-accent/40"
                }`}>
                  {link.frame}
                </span>
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
              {link.frame !== "05" && (
                <div className="timeline-marker ml-1" />
              )}
            </div>
          ))}
          <div className="ml-4 flex items-center space-x-2">
            <Link 
              href="/contact"
              className="px-6 py-2.5 bg-accent text-background text-[10px] font-bold uppercase tracking-[0.2em] pixel-border hover:bg-accent/90 transition-all duration-300"
            >
              {navLabels.hireMe}
            </Link>
            <LanguageToggle />
          </div>
        </div>

        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 top-0 bg-[#050508] z-40 md:hidden flex flex-col items-center justify-center space-y-8"
          >
            {/* Close button with pixel border */}
            <button 
              className="absolute top-8 right-6 text-white p-2 pixel-border"
              onClick={() => setIsOpen(false)}
            >
              <X size={32} />
            </button>

            {/* Navigation links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-3xl font-display font-bold uppercase tracking-tighter hover:text-accent transition-colors min-h-[44px] flex items-center ${
                  activeFrame === link.frame ? "text-accent pixel-border" : ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className={`frame-number !static block mb-1 ${
                  activeFrame === link.frame ? "!text-accent/80" : "!text-accent/60 !text-[0.8rem]"
                }`}>
                  FRAME {link.frame}
                </span>
                {link.name}
              </Link>
            ))}

            {/* Hire Me button with pixel styling */}
            <Link
              href="/contact"
              className="pixel-button-primary text-2xl px-12 py-4"
              onClick={() => setIsOpen(false)}
            >
              {navLabels.hireMe}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
