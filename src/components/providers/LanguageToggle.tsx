"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const locale = useLocale();
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors"
      aria-label={`Switch to ${locale === "en" ? "Arabic" : "English"}`}
    >
      <Globe size={16} />
      <span>{locale === "en" ? "عربي" : "EN"}</span>
    </button>
  );
}