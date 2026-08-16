import { describe, it, expect } from "vitest";
import { convertSiteContentToForm } from "@/lib/content-form";
import { contentDefaultValues } from "@/lib/validation";
import type { ContentCreateInput } from "@/lib/validation";
import type { SiteContent, ContentStatus } from "@/types";
import { getString } from "@/lib/text";

function legacyConvertToForm(content: SiteContent): ContentCreateInput {
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

const fullSiteContent: SiteContent = {
  _id: "content-1",
  about: { en: "About EN", ar: "نبذة" } as unknown as string,
  aboutTitle: "Title EN",
  aboutBadge: "Badge EN",
  aboutCtaLabel: "Start a Project",
  aboutCtaLink: "/#contact",
  aboutStats: [
    { label: "EXPERIENCE", value: "8+ YEARS" },
    { label: "", value: "" },
  ],
  aboutSkills: ["After Effects", "Premiere Pro"],
  aboutIndustries: ["Medical Sector", "Real Estate"],
  servicesTitle: "What I Deliver",
  servicesSubtitle: "Subtitle EN",
  servicesDescription: "Description EN",
  contactEmail: "amr@example.com",
  whatsappNumber: "201000000000",
  contactHeading: "Heading EN",
  contactSubheading: "Subheading EN",
  contactAvailability: "Usually replies within 24 hours",
  socialLinks: {
    instagram: "https://instagram.com/amr",
    facebook: "https://facebook.com/amr",
    behance: "https://behance.net/amr",
    twitter: "https://twitter.com/amr",
    youtube: "https://youtube.com/@amr",
    linkedin: "https://linkedin.com/in/amr",
  },
  status: "published",
  servicesCards: [
    { title: { en: "Video Editing", ar: "مونتاج" } as unknown as string, description: "Turn raw footage into content.", icon: "play-circle" },
    { title: "Motion Design", description: "Animated graphics.", icon: "sparkles" },
  ],
  publishedAt: new Date("2026-01-01"),
  lastStatusChangeAt: new Date("2026-01-02"),
};

const fullExpected: ContentCreateInput = {
  about: "About EN",
  aboutTitle: "Title EN",
  aboutBadge: "Badge EN",
  aboutCtaLabel: "Start a Project",
  aboutCtaLink: "/#contact",
  aboutStats: [
    { label: "EXPERIENCE", value: "8+ YEARS" },
    { label: "", value: "" },
  ],
  aboutSkills: ["After Effects", "Premiere Pro"],
  aboutIndustries: ["Medical Sector", "Real Estate"],
  servicesTitle: "What I Deliver",
  servicesSubtitle: "Subtitle EN",
  servicesDescription: "Description EN",
  contactEmail: "amr@example.com",
  whatsappNumber: "201000000000",
  contactHeading: "Heading EN",
  contactSubheading: "Subheading EN",
  contactAvailability: "Usually replies within 24 hours",
  socialLinks: {
    instagram: "https://instagram.com/amr",
    facebook: "https://facebook.com/amr",
    behance: "https://behance.net/amr",
    twitter: "https://twitter.com/amr",
    youtube: "https://youtube.com/@amr",
    linkedin: "https://linkedin.com/in/amr",
  },
  status: "published",
  servicesCards: [
    { title: "Video Editing", description: "Turn raw footage into content.", icon: "play-circle" },
    { title: "Motion Design", description: "Animated graphics.", icon: "sparkles" },
  ],
};

function minimalSiteContent(): SiteContent {
  return {
    _id: "min",
    about: "",
    servicesTitle: "",
    servicesDescription: "",
    contactEmail: "",
    whatsappNumber: "",
    socialLinks: {},
    status: "draft" as ContentStatus,
    servicesCards: [],
  };
}

describe("convertSiteContentToForm", () => {
  it("returns the shared default values when content is undefined", () => {
    expect(convertSiteContentToForm(undefined as unknown as SiteContent)).toBe(contentDefaultValues);
  });

  it("returns the shared default values when content is null", () => {
    expect(convertSiteContentToForm(null as unknown as SiteContent)).toBe(contentDefaultValues);
  });

  it("maps a complete Site Content object into the exact form shape", () => {
    expect(convertSiteContentToForm(fullSiteContent)).toEqual(fullExpected);
  });

  it("produces the same output as the legacy content-page mapper", () => {
    expect(convertSiteContentToForm(fullSiteContent)).toEqual(legacyConvertToForm(fullSiteContent));
  });

  it("produces the same output as the legacy contact-page mapper for a minimal object", () => {
    const minimal = minimalSiteContent();
    expect(convertSiteContentToForm(minimal)).toEqual(legacyConvertToForm(minimal));
  });

  it("maps English values of bilingual objects and does not fall back to Arabic", () => {
    const input = minimalSiteContent();
    input.about = { en: "", ar: "نبذة" } as unknown as string;
    input.servicesDescription = { en: "Desc EN", ar: "وصف" } as unknown as string;
    const output = convertSiteContentToForm(input);
    expect(output.about).toBe("");
    expect(output.servicesDescription).toBe("Desc EN");
  });

  it("returns empty strings for missing optional bilingual fields", () => {
    const input = minimalSiteContent();
    input.aboutTitle = undefined;
    input.contactHeading = undefined;
    const output = convertSiteContentToForm(input);
    expect(output.aboutTitle).toBe("");
    expect(output.contactHeading).toBe("");
  });

  it("maps aboutStats preserving values and defaulting missing label/value to empty strings", () => {
    const input = minimalSiteContent();
    input.aboutStats = [
      { label: "A", value: "1" },
      { label: undefined as unknown as string, value: "2" },
      { label: "B", value: undefined as unknown as string },
    ];
    const output = convertSiteContentToForm(input);
    expect(output.aboutStats).toEqual([
      { label: "A", value: "1" },
      { label: "", value: "2" },
      { label: "B", value: "" },
    ]);
  });

  it("defaults aboutStats to an empty array when absent", () => {
    const output = convertSiteContentToForm(minimalSiteContent());
    expect(output.aboutStats).toEqual([]);
  });

  it("passes through aboutSkills as-is", () => {
    const input = minimalSiteContent();
    input.aboutSkills = ["After Effects", ""];
    expect(convertSiteContentToForm(input).aboutSkills).toEqual(["After Effects", ""]);
  });

  it("defaults aboutSkills to an empty array when absent", () => {
    const output = convertSiteContentToForm(minimalSiteContent());
    expect(output.aboutSkills).toEqual([]);
  });

  it("passes through aboutIndustries as-is", () => {
    const input = minimalSiteContent();
    input.aboutIndustries = ["Medical", "Real Estate"];
    expect(convertSiteContentToForm(input).aboutIndustries).toEqual(["Medical", "Real Estate"]);
  });

  it("defaults aboutIndustries to an empty array when absent", () => {
    const output = convertSiteContentToForm(minimalSiteContent());
    expect(output.aboutIndustries).toEqual([]);
  });

  it("maps CTA fields via getString", () => {
    const input = minimalSiteContent();
    input.aboutCtaLabel = { en: "Start a Project", ar: "ابدأ" } as unknown as string;
    input.aboutCtaLink = "/#contact";
    const output = convertSiteContentToForm(input);
    expect(output.aboutCtaLabel).toBe("Start a Project");
    expect(output.aboutCtaLink).toBe("/#contact");
  });

  it("maps services fields and servicesCards via getString", () => {
    const input = minimalSiteContent();
    input.servicesTitle = "What I Deliver";
    input.servicesSubtitle = { en: "Subtitle", ar: "عنوان فرعي" } as unknown as string;
    input.servicesDescription = "";
    input.servicesCards = [
      { title: { en: "Video Editing", ar: "مونتاج" } as unknown as string, description: "desc en", icon: "play-circle" },
      { title: "Motion Design", description: "desc 2", icon: "sparkles" },
    ];
    expect(convertSiteContentToForm(input)).toMatchObject({
      servicesTitle: "What I Deliver",
      servicesSubtitle: "Subtitle",
      servicesDescription: "",
      servicesCards: [
        { title: "Video Editing", description: "desc en", icon: "play-circle" },
        { title: "Motion Design", description: "desc 2", icon: "sparkles" },
      ],
    });
  });

  it("defaults servicesCards to an empty array when absent", () => {
    const output = convertSiteContentToForm(minimalSiteContent());
    expect(output.servicesCards).toEqual([]);
  });

  it("maps contact and social fields, defaulting missing social links to empty strings", () => {
    const input = minimalSiteContent();
    input.contactEmail = "amr@example.com";
    input.whatsappNumber = "201000000000";
    input.contactHeading = "Heading";
    input.contactSubheading = "Subheading";
    input.contactAvailability = "Available";
    input.socialLinks = { instagram: "https://instagram.com/amr" };
    const output = convertSiteContentToForm(input);
    expect(output).toMatchObject({
      contactEmail: "amr@example.com",
      whatsappNumber: "201000000000",
      contactHeading: "Heading",
      contactSubheading: "Subheading",
      contactAvailability: "Available",
      socialLinks: {
        instagram: "https://instagram.com/amr",
        facebook: "",
        behance: "",
        twitter: "",
        youtube: "",
        linkedin: "",
      },
    });
  });

  it("falls back to draft status when status is missing", () => {
    const input = minimalSiteContent();
    input.status = undefined as unknown as ContentStatus;
    expect(convertSiteContentToForm(input).status).toBe("draft");
  });

  it("does not include publishedAt or lastStatusChangeAt in the output", () => {
    const output = convertSiteContentToForm(fullSiteContent);
    expect("publishedAt" in output).toBe(false);
    expect("lastStatusChangeAt" in output).toBe(false);
    expect(Object.keys(output)).toEqual(Object.keys(fullExpected));
  });
});
