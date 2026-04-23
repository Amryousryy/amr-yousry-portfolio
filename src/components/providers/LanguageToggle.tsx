"use client";

import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const segments = pathname.split('/');
    if (segments[1] === 'en') {
      segments[1] = 'ar';
    } else {
      segments[1] = 'en';
    }
    router.push(segments.join('/'));
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