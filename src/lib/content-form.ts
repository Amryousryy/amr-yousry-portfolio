import { getString } from "./text";
import { contentDefaultValues } from "./validation";
import type { ContentCreateInput } from "./validation";
import type { SiteContent } from "@/types";

export function convertSiteContentToForm(content: SiteContent): ContentCreateInput {
  if (!content) return contentDefaultValues;
  return {
    about: getString(content.about),
    aboutTitle: getString(content.aboutTitle),
    aboutBadge: getString(content.aboutBadge),
    aboutCtaLabel: getString(content.aboutCtaLabel),
    aboutCtaLink: getString(content.aboutCtaLink),
    aboutStats: content.aboutStats?.map(s => ({ label: s.label || "", value: s.value || "" })) || [],
    aboutSkills: content.aboutSkills?.map(s => s) || [],
    aboutIndustries: content.aboutIndustries?.map(s => s) || [],
    servicesTitle: getString(content.servicesTitle),
    servicesSubtitle: getString(content.servicesSubtitle),
    servicesDescription: getString(content.servicesDescription),
    contactEmail: content.contactEmail ?? "",
    whatsappNumber: content.whatsappNumber ?? "",
    contactHeading: getString(content.contactHeading),
    contactSubheading: getString(content.contactSubheading),
    contactAvailability: getString(content.contactAvailability),
    socialLinks: {
      instagram: content.socialLinks?.instagram ?? "",
      facebook: content.socialLinks?.facebook ?? "",
      behance: content.socialLinks?.behance ?? "",
      twitter: content.socialLinks?.twitter ?? "",
      youtube: content.socialLinks?.youtube ?? "",
      linkedin: content.socialLinks?.linkedin ?? "",
    },
    status: content.status || "draft",
    servicesCards: content.servicesCards?.map((card: SiteContent["servicesCards"][number]) => ({
      title: getString(card.title),
      description: getString(card.description),
      icon: card.icon
    })) || []
  };
}
