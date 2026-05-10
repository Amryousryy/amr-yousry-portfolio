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
        "fixed top-0 inset-x-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-brand-blue/90 backdrop-blur-md border-b border-slate-800/50 py-3" : "bg-transparent py-6"
      )}
    >
      <Container>
        <nav className="flex min-w-0 items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <img src="/images/logo.svg" alt="AMR YOUSRY" className="w-9 h-9 md:w-10 md:h-10 transition-transform group-hover:scale-105" />
            <span className="font-pixel text-sm text-brand-cyan tracking-[0.2em] hidden sm:inline-block">AMR YOUSRY</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className={cn(
                  "font-pixel text-[10px] tracking-[0.2em] transition-all duration-200 relative group",
                  link.isCTA 
                    ? "bg-brand-cyan text-brand-blue px-5 py-2 border-2 border-brand-cyan shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none" 
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
            className="md:hidden text-white p-3 hover:text-brand-cyan transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </Container>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-brand-blue/95 backdrop-blur-sm border-b border-slate-800/50 md:hidden"
          >
            <div className="flex flex-col p-5 gap-4 items-center text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href}
                  className={cn(
                    "font-pixel text-sm tracking-widest py-3 min-h-[44px] flex items-center justify-center w-full",
                    link.isCTA ? "text-brand-cyan" : "text-text-dim hover:text-brand-cyan transition-colors"
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
