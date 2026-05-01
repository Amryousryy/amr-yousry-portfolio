"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "WORK", href: "/projects" },
  { label: "ABOUT", href: "/#about" },
  { label: "CONTACT", href: "/#contact", isCTA: true },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-brand-blue/80 backdrop-blur-md border-b border-slate-800 py-4" : "bg-transparent py-8"
      )}
    >
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo / Wordmark */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-cyan flex items-center justify-center font-pixel text-brand-blue border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-white transition-colors">
              A
            </div>
            <span className="font-pixel text-white text-sm tracking-widest hidden sm:block">AMR YOUSRY</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className={cn(
                  "font-pixel text-[10px] tracking-[0.2em] transition-all duration-200 relative group",
                  link.isCTA 
                    ? "bg-brand-cyan text-brand-blue px-6 py-2 border-2 border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]" 
                    : "text-text-dim hover:text-brand-cyan"
                )}
              >
                {link.label}
                {!link.isCTA && (
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-cyan transition-all group-hover:w-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </nav>
      </Container>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-brand-blue border-b border-slate-800 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-8 items-center text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href}
                  className={cn(
                    "font-pixel text-sm tracking-widest",
                    link.isCTA ? "text-brand-cyan border-b-2 border-brand-cyan pb-1" : "text-text-dim"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
