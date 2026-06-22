import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { LeanSettings } from "@/models/Settings";
import {
  normalizeHeroContent,
  PublicHeroContent,
  FALLBACK_HERO,
} from "@/lib/hero-content-normalizer";
import {
  normalizeAboutContent,
  PublicAboutContent,
  CmsAboutInput,
} from "@/lib/about-content-normalizer";
import { aboutContent as staticAboutContent } from "@/content/about";

export type { PublicHeroContent } from "@/lib/hero-content-normalizer";
export { normalizeHeroContent, FALLBACK_HERO };

export type { PublicAboutContent, CmsAboutInput } from "@/lib/about-content-normalizer";
export { normalizeAboutContent };

export async function getPublishedHeroContent(): Promise<PublicHeroContent> {
  if (!process.env.MONGODB_URI) return FALLBACK_HERO;

  try {
    await dbConnect();
    const settings = await Settings.findOne({}).lean() as unknown as LeanSettings | null;
    return normalizeHeroContent(settings?.hero as Record<string, unknown> | undefined);
  } catch {
    return FALLBACK_HERO;
  }
}

export async function getPublishedAboutContent(): Promise<PublicAboutContent> {
  if (!process.env.MONGODB_URI) return staticAboutContent;

  try {
    await dbConnect();
    const settings = await Settings.findOne({}).lean() as unknown as LeanSettings | null;
    if (!settings) return staticAboutContent;

    const cmsAbout: CmsAboutInput = {};

    const rootAbout = (settings as Record<string, unknown>).about as Record<string, unknown> | undefined;
    if (rootAbout) {
      if (typeof rootAbout.content === "string" && rootAbout.content.trim()) {
        cmsAbout.content = rootAbout.content;
      }
      if (Array.isArray(rootAbout.stats) && rootAbout.stats.length > 0) {
        cmsAbout.stats = rootAbout.stats as CmsAboutInput["stats"];
      }
    }

    if (!cmsAbout.content && settings.siteContent?.about) {
      cmsAbout.content = settings.siteContent.about;
    }

    if (settings.siteContent?.aboutTitle?.trim()) {
      cmsAbout.heading = settings.siteContent.aboutTitle;
    }

    if (settings.siteContent?.aboutBadge?.trim()) {
      cmsAbout.badge = settings.siteContent.aboutBadge;
    }

    if (settings.siteContent?.aboutCtaLabel?.trim()) {
      cmsAbout.ctaLabel = settings.siteContent.aboutCtaLabel;
    }

    if (settings.siteContent?.aboutCtaLink?.trim()) {
      cmsAbout.ctaLink = settings.siteContent.aboutCtaLink;
    }

    if (settings.siteContent?.aboutStats?.length) {
      const validStats = settings.siteContent.aboutStats.filter(s => s.label && s.value);
      if (validStats.length > 0) {
        cmsAbout.stats = validStats;
      }
    }

    if (settings.siteContent?.aboutSkills?.length) {
      const filtered = settings.siteContent.aboutSkills.filter(s => s.trim());
      if (filtered.length > 0) {
        cmsAbout.skills = filtered;
      }
    }

    if (settings.siteContent?.aboutIndustries?.length) {
      const filtered = settings.siteContent.aboutIndustries.filter(s => s.trim());
      if (filtered.length > 0) {
        cmsAbout.industries = filtered;
      }
    }

    return normalizeAboutContent(
      Object.keys(cmsAbout).length > 0 ? cmsAbout : null,
      staticAboutContent,
    );
  } catch {
    return staticAboutContent;
  }
}
