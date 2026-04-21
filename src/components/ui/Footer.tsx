"use client";

import React from "react";
import Link from "next/link";
import { Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <span className="text-lg font-display font-bold uppercase tracking-tighter">Amr Yousry</span>
            </Link>
            <p className="text-foreground/40 text-sm uppercase">© 2026 Amr Yousry. Built with Next.js & GSAP.</p>
          </div>

          <div className="flex space-x-6">
            <a href="#" className="w-12 h-12 flex items-center justify-center border border-border hover:border-accent hover:text-accent transition-all rounded-full">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-12 h-12 flex items-center justify-center border border-border hover:border-accent hover:text-accent transition-all rounded-full">
              <Twitter size={20} />
            </a>
            <a href="#" className="w-12 h-12 flex items-center justify-center border border-border hover:border-accent hover:text-accent transition-all rounded-full">
              <Youtube size={20} />
            </a>
            <a href="#" className="w-12 h-12 flex items-center justify-center border border-border hover:border-accent hover:text-accent transition-all rounded-full">
              <Linkedin size={20} />
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/40 mb-2">Back to Top</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-10 h-10 border border-accent flex items-center justify-center rounded-full hover:bg-accent hover:text-background transition-all mx-auto md:ml-auto"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}