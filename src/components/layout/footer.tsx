import Link from "next/link";
import { Container } from "@/components/ui/container";
import { footerContent } from "@/content/footer";
import { socialLinksArray } from "@/data/social-links";

export function Footer() {
  return (
    <footer className="bg-brand-blue border-t border-slate-800 py-14 md:py-24 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
            
          {/* Brand & Tagline */}
          <div className="lg:col-span-6">
            <Link href="/" className="group block mb-6">
              <img src="/images/footer-logo.svg" alt="AMR YOUSRY" width={120} height={28} className="w-30 md:w-36 h-auto transition-transform group-hover:scale-105" />
            </Link>
            <p className="font-modern text-text-dim text-sm sm:text-base max-w-[520px] leading-relaxed antialiased">
              {footerContent.tagline}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3">
            <h2 className="font-pixel text-[10px] text-brand-cyan tracking-widest mb-6 uppercase">Navigation</h2>
            <ul className="space-y-3">
              {footerContent.links.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="font-modern text-text-dim hover:text-brand-cyan transition-all duration-200 text-sm uppercase tracking-wider inline-block hover:translate-x-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-3">
            <h2 className="font-pixel text-[10px] text-brand-cyan tracking-widest mb-6 uppercase">Connect</h2>
            <ul className="space-y-3">
              {socialLinksArray.map((social) => (
                <li key={social.label}>
                  <a 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-modern text-text-dim hover:text-brand-cyan transition-all duration-200 text-sm uppercase tracking-wider inline-flex flex-wrap items-center gap-2 group hover:translate-x-0.5"
                  >
                    <span>{social.label}</span>
                    <span className="font-pixel text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">LVL. UP</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 md:mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="font-pixel text-[8px] text-text-dim tracking-widest uppercase leading-relaxed break-words">
            {footerContent.copyright}
          </p>
        </div>
      </Container>
    </footer>
  );
}
