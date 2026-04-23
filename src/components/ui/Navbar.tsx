"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import LanguageToggle from "@/components/providers/LanguageToggle";
import { Link } from '@/navigation';
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations('nav');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t('home'), href: "/" },
    { name: t('services'), href: "/services" },
    { name: t('projects'), href: "/projects" },
    { name: t('about'), href: "/about" },
    { name: t('contact'), href: "/contact" },
  ];

  const navClasses = [
    "fixed top-0 left-0 w-full z-50 transition-all duration-300",
    scrolled ? "py-4 bg-background/80 backdrop-blur-md border-b border-primary/20" : "py-8 bg-transparent"
  ].join(" ");

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="group flex items-center space-x-3">
          <div className="relative w-12 h-12 transition-transform group-hover:scale-105">
            <Image
              src="/Asset 4.png"
              alt="Amr Yousry Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-display font-bold tracking-tighter uppercase group-hover:text-accent transition-colors">
            Amr Yousry
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-sm font-medium uppercase tracking-widest hover:text-accent transition-colors group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
          ))}
          <Link
            href="/contact"
            className="px-6 py-2 bg-primary text-white text-xs font-bold uppercase tracking-widest pixel-border hover:bg-secondary transition-all"
          >
            {t('hireMe')}
          </Link>
          <LanguageToggle />
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[88px] bg-background z-40 md:hidden flex flex-col items-center justify-center space-y-8"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl font-display font-bold uppercase tracking-tighter hover:text-accent"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="px-8 py-3 bg-accent text-background font-bold uppercase tracking-widest pixel-border"
              onClick={() => setIsOpen(false)}
            >
              {t('hireMe')}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
