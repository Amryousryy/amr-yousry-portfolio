export interface SocialLinkItem {
  label: string;
  href: string;
  icon: string;
}

export interface PublicContactContent {
  email: string;
  whatsappNumber: string;
  socials: SocialLinkItem[];
  heading: string;
  subheading: string;
  availability: string;
}

const ICON_MAP: Record<string, string> = {
  instagram: "ig",
  linkedin: "in",
  facebook: "fb",
  behance: "be",
  twitter: "tw",
  youtube: "yt",
  github: "gh",
  dribbble: "db",
  tiktok: "tt",
};

const LABEL_MAP: Record<string, string> = {
  instagram: "INSTAGRAM",
  linkedin: "LINKEDIN",
  facebook: "FACEBOOK",
  behance: "BEHANCE",
  twitter: "TWITTER",
  youtube: "YOUTUBE",
  github: "GITHUB",
  dribbble: "DRIBBBLE",
  tiktok: "TIKTOK",
};

const ALLOWED_PROTOCOLS = ["http:", "https:"];

export function toStr(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const o = value as { en?: unknown };
    if (typeof o.en === "string") return o.en;
  }
  return "";
}

export function getPublishedStatus(siteContent: Record<string, unknown> | null | undefined): string {
  if (!siteContent) return "";
  return toStr(siteContent.status);
}

export function isPublished(siteContent: Record<string, unknown> | null | undefined): boolean {
  return getPublishedStatus(siteContent) === "published";
}

export function isValidEmail(value: string): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.length > 254) return false;
  if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

export function isValidUrl(value: string): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) return false;
  try {
    const url = new URL(trimmed);
    return ALLOWED_PROTOCOLS.includes(url.protocol);
  } catch {
    return false;
  }
}

export const FALLBACK_EMAIL = "amryousryy@gmail.com";
export const FALLBACK_WHATSAPP = "201021213533";

export const FALLBACK_SOCIALS: SocialLinkItem[] = [
  { label: "INSTAGRAM", href: "https://www.instagram.com/amryusryy/?hl=ar", icon: "ig" },
  { label: "BEHANCE", href: "https://www.behance.net/amryousry3", icon: "be" },
  { label: "FACEBOOK", href: "https://www.facebook.com/amryusryy/", icon: "fb" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/%D9%90amr-yousry/", icon: "in" },
];

export const FALLBACK_CONTACT: PublicContactContent = {
  email: FALLBACK_EMAIL,
  whatsappNumber: FALLBACK_WHATSAPP,
  socials: FALLBACK_SOCIALS,
  heading: "START\nMISSION.",
  subheading: "Ready to turn an idea into a memorable digital experience? Complete the mission brief and let's build something worth remembering.",
  availability: "Usually responds within 24 hours — WhatsApp is the fastest route.",
};

export function normalizeSocialLinks(
  socialLinks: Record<string, unknown> | null | undefined,
): SocialLinkItem[] {
  if (!socialLinks) return FALLBACK_SOCIALS;

  const result: SocialLinkItem[] = [];
  const seenIcons = new Set<string>();

  const orderedKeys = ["instagram", "facebook", "behance", "linkedin", "twitter", "youtube", "tiktok", "github", "dribbble"];

  for (const key of orderedKeys) {
    const raw = socialLinks[key];
    const href = toStr(raw).trim();
    if (!href) continue;
    if (!isValidUrl(href)) continue;

    const icon = ICON_MAP[key];
    if (!icon || seenIcons.has(icon)) continue;
    seenIcons.add(icon);

    const label = LABEL_MAP[key] || key.toUpperCase();
    result.push({ label, href, icon });
  }

  if (result.length === 0) return FALLBACK_SOCIALS;
  return result;
}

export function normalizeContactContent(
  siteContent: Record<string, unknown> | null | undefined,
  fallback: PublicContactContent = FALLBACK_CONTACT,
): PublicContactContent {
  if (!siteContent) return fallback;
  if (!isPublished(siteContent)) return fallback;

  const email = toStr(siteContent.contactEmail).trim();
  const whatsappNumber = toStr(siteContent.whatsappNumber).trim();
  const socialLinks = siteContent.socialLinks as Record<string, unknown> | undefined;

  const heading = toStr(siteContent.contactHeading).trim() || fallback.heading;
  const subheading = toStr(siteContent.contactSubheading).trim() || fallback.subheading;
  const availability = toStr(siteContent.contactAvailability).trim() || fallback.availability;

  const validEmail = isValidEmail(email) ? email : fallback.email;
  const validWhatsapp = whatsappNumber || fallback.whatsappNumber;
  const socials = normalizeSocialLinks(socialLinks);

  return {
    email: validEmail,
    whatsappNumber: validWhatsapp,
    socials,
    heading,
    subheading,
    availability,
  };
}
