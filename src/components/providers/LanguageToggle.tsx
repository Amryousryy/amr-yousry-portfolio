"use client";

import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    // Normalize path into segments without empty strings
    const raw = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    const parts = raw.length ? raw.split('/') : [];

    // Detect current locale if present as first segment
    const currentLocale = parts[0] === 'en' || parts[0] === 'ar' ? parts[0] : null;
    const rest = currentLocale ? parts.slice(1) : parts;

    // Compute the next locale (default to 'en' if not determinable)
    const nextLocale = currentLocale === 'ar' ? 'en' : 'ar';

    // Build new path: /<locale>/<rest...>
    const newParts = currentLocale ? [nextLocale, ...rest] : [nextLocale, ...rest];
    const newPath = '/' + newParts.filter(Boolean).join('/');

    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors"
      aria-label="Toggle language"
    >
      <Globe size={16} />
      <span>عربي / EN</span>
    </button>
  );
}
