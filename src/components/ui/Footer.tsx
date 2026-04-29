"use client";

import Link from "next/link";

const footerLinks = {
  navigation: [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  social: [
    { name: "Instagram", href: "https://instagram.com/amryousry" },
    { name: "LinkedIn", href: "https://linkedin.com/in/amryousry" },
    { name: "YouTube", href: "https://youtube.com/@amryousry" },
    { name: "Twitter", href: "https://twitter.com/amryousry" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#050508] border-t border-white/5 py-16">
      <div className="container mx-auto px-6">
        {/* Pixel divider */}
        <div className="frame-divider mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand block */}
          <div>
            <div className="text-hero font-black text-white mb-4">
              <span className="text-[#00ffcc]">Frame</span> Logic
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Multimedia Designer & Film Maker turning content into growth for ambitious brands.
            </p>
            <div className="frame-number text-[8px]">
              © {new Date().getFullYear()} Amr Yousry
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="frame-label text-sm mb-6">NAVIGATION</div>
            <div className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#00ffcc] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Social & Contact */}
          <div>
            <div className="frame-label text-sm mb-6">CONNECT</div>
            <div className="space-y-3 mb-6">
              {footerLinks.social.map((link) => (
                <div key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-[#00ffcc] transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </div>
              ))}
            </div>
            <div className="text-sm text-white/40">
              <a href="mailto:amr@amryousry.com" className="hover:text-[#00ffcc] transition-colors">
                amr@amryousry.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="frame-number text-[8px]">
            FRAME 00: CREDITS
          </div>
          <div className="text-white/30 text-[10px]">
            Built with Next.js 16 • Designed with Frame Logic
          </div>
        </div>
      </div>
    </footer>
  );
}
