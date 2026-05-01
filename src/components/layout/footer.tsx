import Link from "next/link";
import { Container } from "@/components/ui/container";
import { footerContent } from "@/content/footer";

export function Footer() {
  return (
    <footer className="bg-brand-blue border-t border-slate-800 py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Brand & Tagline */}
          <div className="lg:col-span-5">
            <Link href="/" className="group flex items-center gap-3 mb-6">
              <div className="w-6 h-6 bg-brand-cyan flex items-center justify-center font-pixel text-brand-blue border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-white transition-colors">
                A
              </div>
              <span className="font-pixel text-white text-xs tracking-widest">{footerContent.wordmark}</span>
            </Link>
            <p className="font-modern text-text-dim text-base max-w-sm leading-relaxed antialiased">
              {footerContent.tagline}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="font-pixel text-[10px] text-brand-cyan tracking-widest mb-8 uppercase">Navigation</h4>
            <ul className="space-y-4">
              {footerContent.links.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="font-modern text-text-dim hover:text-white transition-colors text-sm uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-4">
            <h4 className="font-pixel text-[10px] text-brand-cyan tracking-widest mb-8 uppercase">Connect</h4>
            <ul className="space-y-4">
              {footerContent.socials.map((social) => (
                <li key={social.label}>
                  <a 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-modern text-text-dim hover:text-white transition-colors text-sm uppercase tracking-wider flex items-center gap-2 group"
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
        <div className="mt-24 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-pixel text-[8px] text-text-dim tracking-widest uppercase">
            {footerContent.copyright}
          </p>
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-brand-cyan animate-pulse" />
            <div className="w-2 h-2 bg-brand-purple animate-pulse delay-75" />
            <div className="w-2 h-2 bg-brand-pink animate-pulse delay-150" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
