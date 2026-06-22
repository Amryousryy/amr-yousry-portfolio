import { aboutContent as staticAboutContent } from "../content/about";

export interface PublicAboutContent {
  badge: string;
  heading: string;
  story: string[];
  stats: { label: string; value: string }[];
  skillClusters: { title: string; skills: string[] }[];
  industries: string[];
  ctaLabel: string;
  ctaLink: string;
}

export interface CmsAboutInput {
  content?: string;
  story?: string | string[];
  stats?: { label: string; value: string }[];
  heading?: string;
  badge?: string;
  ctaLabel?: string;
  ctaLink?: string;
  skills?: string[];
  industries?: string[];
}

export function normalizeAboutContent(
  cmsAbout: CmsAboutInput | null | undefined,
  fallback: PublicAboutContent = staticAboutContent,
): PublicAboutContent {
  if (!cmsAbout) return fallback;

  let story: string[] = fallback.story;
  const source = cmsAbout.story ?? (cmsAbout.content ? [cmsAbout.content] : undefined);
  if (source) {
    if (typeof source === "string") {
      const split = source.split("\n").map(s => s.trim()).filter(Boolean);
      if (split.length > 0) story = split;
    } else if (Array.isArray(source)) {
      const filtered = source.map(s => s.trim()).filter(Boolean);
      if (filtered.length > 0) story = filtered;
    }
  }

  let stats = fallback.stats;
  if (Array.isArray(cmsAbout.stats) && cmsAbout.stats.length > 0) {
    const valid = cmsAbout.stats.filter(s => s.label && s.value);
    if (valid.length > 0) stats = valid;
  }

  let heading = fallback.heading;
  if (cmsAbout.heading && cmsAbout.heading.trim()) {
    heading = cmsAbout.heading.trim();
  }

  let badge = fallback.badge;
  if (cmsAbout.badge && cmsAbout.badge.trim()) {
    badge = cmsAbout.badge.trim();
  }

  let ctaLabel = fallback.ctaLabel;
  if (cmsAbout.ctaLabel && cmsAbout.ctaLabel.trim()) {
    ctaLabel = cmsAbout.ctaLabel.trim();
  }

  let ctaLink = fallback.ctaLink;
  if (cmsAbout.ctaLink && cmsAbout.ctaLink.trim()) {
    const link = cmsAbout.ctaLink.trim();
    const safe = link.startsWith("http://") || link.startsWith("https://") || link.startsWith("/") || link.startsWith("#");
    if (safe) ctaLink = link;
  }

  let skillClusters = fallback.skillClusters;
  if (Array.isArray(cmsAbout.skills) && cmsAbout.skills.length > 0) {
    const filtered = cmsAbout.skills.map(s => s.trim()).filter(Boolean);
    if (filtered.length > 0) {
      skillClusters = [{ title: fallback.skillClusters[0]?.title || "CREATIVE LOADOUT", skills: filtered }];
    }
  }

  let industries = fallback.industries;
  if (Array.isArray(cmsAbout.industries) && cmsAbout.industries.length > 0) {
    const filtered = cmsAbout.industries.map(s => s.trim()).filter(Boolean);
    if (filtered.length > 0) industries = filtered;
  }

  return { ...fallback, story, stats, heading, badge, ctaLabel, ctaLink, skillClusters, industries };
}
