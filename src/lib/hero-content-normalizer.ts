export interface PublicHeroContent {
  headline: string;
  subheadline: string;
  primaryCTA: string;
  primaryCTALink: string;
  secondaryCTA: string;
  secondaryCTALink: string;
}

import { toPlainText } from "./text";

export const FALLBACK_HERO: PublicHeroContent = {
  headline: "MAKE IDEAS\nMATTER",
  subheadline: "Creative Direction and High-Impact Video Production for brands that need content built for attention, trust, and conversion.",
  primaryCTA: "Start a Project",
  primaryCTALink: "/projects",
  secondaryCTA: "View Missions",
  secondaryCTALink: "#contact",
};

export function normalizeHeroAlias(value: string, type: 'primary' | 'secondary'): string {
  const normalized = value.toLowerCase().trim();
  if (type === 'primary') {
    if (normalized === 'projects' || normalized === 'show projects' || normalized === 'show-projects') return '/projects';
    if (normalized === '/contact') return '/projects'; // Force fallback for primary
  } else {
    if (normalized === 'contact' || normalized === 'contact me' || normalized === 'contact-me' || normalized === '/contact') return '#contact';
  }
  return value;
}

export function isSafeHeroLink(value: string): boolean {
  if (!value) return false;
  if (value.startsWith('/') || value.startsWith('#')) return true;
  if (value.startsWith('http://') || value.startsWith('https://')) return true;
  return false;
}

export function normalizeHeroCtaLink(value: string, fallback: string, type: 'primary' | 'secondary'): string {
  const normalizedAlias = normalizeHeroAlias(value, type);
  if (isSafeHeroLink(normalizedAlias)) return normalizedAlias;
  return fallback;
}

export function normalizeHeroContent(
  hero: Record<string, unknown> | null | undefined,
  fallback: PublicHeroContent = FALLBACK_HERO,
): PublicHeroContent {
  if (!hero) return fallback;

  const status = toPlainText(hero.status);
  if (status !== "published") return fallback;

  const headline = toPlainText(hero.headline).trim();
  const subheadline = toPlainText(hero.subheadline).trim();
  const primaryCTA = toPlainText(hero.primaryCTA).trim();
  const rawPrimaryCTALink = toPlainText(hero.primaryCTALink).trim();
  const secondaryCTA = toPlainText(hero.secondaryCTA).trim();
  const rawSecondaryCTALink = toPlainText(hero.secondaryCTALink).trim();

  const primaryCTALink = normalizeHeroCtaLink(rawPrimaryCTALink, "/projects", 'primary');
  const secondaryCTALink = normalizeHeroCtaLink(rawSecondaryCTALink, "#contact", 'secondary');

  if (!headline || !subheadline || !primaryCTA || !secondaryCTA) {
    return fallback;
  }

  return { headline, subheadline, primaryCTA, primaryCTALink, secondaryCTA, secondaryCTALink };
}
