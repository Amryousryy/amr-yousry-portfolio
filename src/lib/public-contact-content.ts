import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { LeanSettings } from "@/models/Settings";
import {
  normalizeContactContent,
  PublicContactContent,
  FALLBACK_CONTACT,
} from "@/lib/contact-content-normalizer";

export type { PublicContactContent } from "@/lib/contact-content-normalizer";
export { normalizeContactContent, FALLBACK_CONTACT };

export async function getPublishedContactContent(): Promise<PublicContactContent> {
  if (!process.env.MONGODB_URI) return FALLBACK_CONTACT;

  try {
    await dbConnect();
    const settings = await Settings.findOne({}).lean() as unknown as LeanSettings | null;
    return normalizeContactContent(settings?.siteContent as Record<string, unknown> | undefined);
  } catch {
    return FALLBACK_CONTACT;
  }
}
