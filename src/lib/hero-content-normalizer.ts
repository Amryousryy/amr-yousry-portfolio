export interface PublicHeroContent {
  headline: string;
  subheadline: string;
  primaryCTA: string;
  primaryCTALink: string;
  secondaryCTA: string;
  secondaryCTALink: string;
}

export function toStr(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const o = value as { en?: unknown };
    if (typeof o.en === "string") return o.en;
  }
  return "";
}

export const FALLBACK_HERO: PublicHeroContent = {
  headline: "MAKE IDEAS\nMATTER",
  subheadline: "Creative Direction and High-Impact Video Production for brands that need content built for attention, trust, and conversion.",
  primaryCTA: "Start a Project",
  primaryCTALink: "/#contact",
  secondaryCTA: "View Missions",
  secondaryCTALink: "/projects",
};

export function normalizeHeroContent(
  hero: Record<string, unknown> | null | undefined,
  fallback: PublicHeroContent = FALLBACK_HERO,
): PublicHeroContent {
  if (!hero) return fallback;

  const status = toStr(hero.status);
  if (status !== "published") return fallback;

  const headline = toStr(hero.headline).trim();
  const subheadline = toStr(hero.subheadline).trim();
  const primaryCTA = toStr(hero.primaryCTA).trim();
  const primaryCTALink = toStr(hero.primaryCTALink).trim();
  const secondaryCTA = toStr(hero.secondaryCTA).trim();
  const secondaryCTALink = toStr(hero.secondaryCTALink).trim();

  if (!headline || !subheadline || !primaryCTA || !primaryCTALink || !secondaryCTA || !secondaryCTALink) {
    return fallback;
  }

  return { headline, subheadline, primaryCTA, primaryCTALink, secondaryCTA, secondaryCTALink };
}
