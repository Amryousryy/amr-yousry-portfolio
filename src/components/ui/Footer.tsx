"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 bg-[#050508] border-t border-[#1a1a2e]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="mb-4 group">
              <span className="text-lg font-sora font-bold text-white">AMR YOUSRY</span>
            </Link>
            <p className="text-white/30 text-sm pixel-text">© 2026 AMR YOUSRY — All Rights Reserved</p>
            <p className="text-[#00ffcc]/30 text-xs pixel-text mt-2">CRAFTED FRAME BY FRAME</p>
          </div>

          <div className="flex gap-4">
            <a href="#" className="pixel-box w-10 h-10 bg-[#0a0a0f] flex items-center justify-center hover:bg-[#00ffcc]/20 transition-colors" aria-label="Instagram">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#00ffcc]" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="pixel-box w-10 h-10 bg-[#0a0a0f] flex items-center justify-center hover:bg-[#00ffcc]/20 transition-colors" aria-label="YouTube">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#00ffcc]" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
            <a href="#" className="pixel-box w-10 h-10 bg-[#0a0a0f] flex items-center justify-center hover:bg-[#00ffcc]/20 transition-colors" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#00ffcc]" fill="currentColor">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.49 2.5s-2.49-1.119-2.49-2.5c0-1.38 1.11-2.5 2.49-2.5s2.49 1.12 2.49 2.5zm.02 4.5h-5v16h5v-16zm9.533 0h-4.933v16h4v-8.399c0-4.667 3.333-5.399 5.768-5.193 2.546 0 3.435 1.184 4.001 2.524 1.295.687 1.768 1.688 1.768 2.801v8.367h-4.933v-7.567c0-1.153-.02-2.64-1.609-2.64-1.617 0-1.867 1.259-1.867 2.558v7.649h4.833v-7.567c0-1.982-.334-3.985-2.331-3.985zm2.232 6.927c0 .447-.017.903-.049 1.359-.033.463-.1.916-.201 1.371-.105.455-.252.896-.443 1.327-.191.431-.421.842-.693 1.238a6.013 6.013 0 01-.924 1.086c-.347.327-.723.614-1.127.857-.405.243-.831.43-1.275.558-.444.128-.895.193-1.353.195h-.016c-.458 0-.909-.067-1.353-.195a5.75 5.75 0 01-1.275-.558 5.94 5.94 0 01-1.127-.857 6.013 6.013 0 01-.924-1.086 5.84 5.84 0 01-.693-1.238 5.91 5.91 0 01-.443-1.327 6.02 6.02 0 01-.201-1.371 5.93 5.93 0 01-.049-1.359c0-.447.017-.903.049-1.359.033-.463.1-.916.201-1.371.105-.455.252-.896.443-1.327.191-.431.421-.842.693-1.238a6.013 6.013 0 01.924-1.086c.347-.327.723-.614 1.127-.857.405-.243.831-.43 1.275-.558.444-.128.895-.193 1.353-.195h.016c.458 0 .909.067 1.353.195.444.128.87.315 1.275.558.404.243.78.53 1.127.857.351.352.657.716.924 1.086.272.396.502.807.693 1.238.143.431.248.872.322 1.327.032.456.049.912.049 1.359z"/>
              </svg>
            </a>
            <a href="#" className="pixel-box w-10 h-10 bg-[#0a0a0f] flex items-center justify-center hover:bg-[#00ffcc]/20 transition-colors" aria-label="Behance">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#00ffcc]" fill="currentColor">
                <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.974-5.564-5.354 0-3.626 2.745-5.439 5.658-5.439 3.017 0 4.85 1.732 5.044 5.066h-2.139c-.28-.78-1.559-1.645-2.905-1.645-2.273 0-3.768 1.667-3.768 3.912 0 2.356 1.453 3.815 3.77 3.815 2.008 0 3.302-1.245 3.302-3.085h2.141c.155 2.655 2.157 2.885 3.168 2.885.522 0 2.098-.2 2.372-1.535h1.424zm-8.682-.5c1.62.012 2.522-1.08 2.522-2.454 0-1.394-.902-2.46-2.522-2.46s-2.522 1.066-2.522 2.46c0 1.374.902 2.442 2.522 2.454zm-7.048 2.5h6.796v-1.26h-6.796v1.26z"/>
              </svg>
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="pixel-text text-white/30 text-xs mb-2">BACK TO TOP</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="pixel-box w-10 h-10 flex items-center justify-center hover:bg-[#00ffcc]/20 transition-colors mx-auto md:ml-auto"
              aria-label="Scroll to top"
            >
              <span className="text-[#00ffcc]">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}