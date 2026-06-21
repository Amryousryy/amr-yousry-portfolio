import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { LeanSettings } from "@/models/Settings";
import {
  normalizeHeroContent,
  PublicHeroContent,
  FALLBACK_HERO,
} from "@/lib/hero-content-normalizer";

export type { PublicHeroContent } from "@/lib/hero-content-normalizer";
export { normalizeHeroContent, FALLBACK_HERO };

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
