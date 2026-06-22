import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Settings, { type LeanSettings } from "@/models/Settings";

const DEFAULT_CONTENT = {
  about: "",
  aboutTitle: "",
  aboutBadge: "",
  aboutCtaLabel: "",
  aboutCtaLink: "",
  aboutStats: [],
  aboutSkills: [],
  aboutIndustries: [],
  servicesTitle: "What I Deliver",
  servicesSubtitle: "Premium video content that drives real business results.",
  servicesDescription: "",
  contactEmail: "",
  whatsappNumber: "",
  contactHeading: "",
  contactSubheading: "",
  contactAvailability: "",
  socialLinks: {
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
  },
  servicesCards: [],
  status: "draft"
};

const ALLOWED_PROTOCOLS = ["http:", "https:"];

function getString(value: string | { en: string; ar: string } | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.en || "";
}

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed.length > 254) return false;
  if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function isValidSocialUrl(value: string): boolean {
  if (!value) return true;
  if (/^javascript:/i.test(value) || /^data:/i.test(value)) return false;
  try {
    const url = new URL(value);
    return ALLOWED_PROTOCOLS.includes(url.protocol);
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const responseConfig: ResponseInit = {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  };

  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    const isPreview = searchParams.get("preview") === "true";

    if (isAdmin || isPreview) {
      let session = null;
      try { session = await getServerSession(authOptions); } catch {}
      if (!session) {
        return NextResponse.json({
          success: true,
          data: { ...DEFAULT_CONTENT, status: "published", _preview: false }
        }, responseConfig);
      }
    }

    await dbConnect();
    const settings = await Settings.findOne({}).lean() as unknown as LeanSettings | null;
    
    if (!settings?.siteContent) {
      return NextResponse.json({ 
        success: true, 
        data: { 
          ...DEFAULT_CONTENT, 
          status: (isAdmin || isPreview) ? "draft" : "published" 
        } 
      }, responseConfig);
    }

    const content = settings.siteContent;

    const sanitized = {
      about: getString(content?.about),
      aboutTitle: getString(content?.aboutTitle),
      aboutBadge: getString(content?.aboutBadge),
      aboutCtaLabel: getString(content?.aboutCtaLabel),
      aboutCtaLink: getString(content?.aboutCtaLink),
      aboutStats: content?.aboutStats || [],
      aboutSkills: content?.aboutSkills || [],
      aboutIndustries: content?.aboutIndustries || [],
      servicesTitle: getString(content?.servicesTitle) || "What I Deliver",
      servicesSubtitle: getString(content?.servicesSubtitle) || "Premium video content that drives real business results.",
      servicesDescription: getString(content?.servicesDescription),
      contactEmail: content?.contactEmail || "",
      whatsappNumber: content?.whatsappNumber || "",
      contactHeading: getString(content?.contactHeading),
      contactSubheading: getString(content?.contactSubheading),
      contactAvailability: getString(content?.contactAvailability),
      socialLinks: content?.socialLinks || {},
      servicesCards: content?.servicesCards?.map((card: { title: string | { en: string; ar: string }, description: string | { en: string; ar: string }, icon: string }) => ({
        title: getString(card.title),
        description: getString(card.description),
        icon: card.icon
      })) || [],
      status: content?.status || "draft"
    };

    if (!isAdmin && !isPreview && sanitized.status !== "published") {
      return NextResponse.json({ 
        success: true, 
        data: { 
          ...DEFAULT_CONTENT, 
          status: "published",
          _preview: false 
        } 
      }, responseConfig);
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        ...sanitized, 
        _preview: isPreview && sanitized.status !== "published" 
      } 
    }, responseConfig);
  } catch (error) {
    console.error("GET_CONTENT_SETTINGS_ERROR:", error);
    return NextResponse.json({ 
      success: true, 
      data: { 
        ...DEFAULT_CONTENT, 
        status: "published",
        _preview: false 
      } 
    }, responseConfig);
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const errors: Record<string, string> = {};

    if (body.contactEmail !== undefined && !isValidEmail(body.contactEmail)) {
      errors.contactEmail = "Invalid email format";
    }

    if (body.socialLinks && typeof body.socialLinks === "object") {
      for (const [platform, url] of Object.entries(body.socialLinks)) {
        if (typeof url === "string" && url && !isValidSocialUrl(url)) {
          errors[`socialLinks.${platform}`] = `Invalid URL for ${platform}`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors, error: "Validation failed" }, { status: 400 });
    }

    await dbConnect();
    
    const currentSettings = await Settings.findOne({}).lean() as unknown as LeanSettings | null;
    const currentContent = (currentSettings?.siteContent || {}) as Record<string, unknown>;
    const currentStatus = currentSettings?.siteContent?.status || "draft";
    const newStatus = body.status || currentStatus;
    
    const statusMetadata: Record<string, Date> = {
      lastStatusChangeAt: new Date(),
    };
    
    if (newStatus === "published" && currentStatus !== "published") {
      statusMetadata.publishedAt = new Date();
    }

    const mergedSocialLinks = {
      ...(currentContent.socialLinks || {}),
      ...(body.socialLinks || {}),
    };
    
    const merged: Record<string, unknown> = {
      about: body.about !== undefined ? body.about : (currentContent.about || ""),
      aboutTitle: body.aboutTitle !== undefined ? body.aboutTitle : (currentContent.aboutTitle || ""),
      aboutBadge: body.aboutBadge !== undefined ? body.aboutBadge : (currentContent.aboutBadge || ""),
      aboutCtaLabel: body.aboutCtaLabel !== undefined ? body.aboutCtaLabel : (currentContent.aboutCtaLabel || ""),
      aboutCtaLink: body.aboutCtaLink !== undefined ? body.aboutCtaLink : (currentContent.aboutCtaLink || ""),
      aboutStats: body.aboutStats !== undefined ? body.aboutStats : (currentContent.aboutStats || []),
      aboutSkills: body.aboutSkills !== undefined ? body.aboutSkills : (currentContent.aboutSkills || []),
      aboutIndustries: body.aboutIndustries !== undefined ? body.aboutIndustries : (currentContent.aboutIndustries || []),
      servicesTitle: body.servicesTitle !== undefined ? body.servicesTitle : (currentContent.servicesTitle || "Services"),
      servicesDescription: body.servicesDescription !== undefined ? body.servicesDescription : (currentContent.servicesDescription || ""),
      contactEmail: body.contactEmail !== undefined ? body.contactEmail : (currentContent.contactEmail || ""),
      whatsappNumber: body.whatsappNumber !== undefined ? body.whatsappNumber : (currentContent.whatsappNumber || ""),
      contactHeading: body.contactHeading !== undefined ? body.contactHeading : (currentContent.contactHeading || ""),
      contactSubheading: body.contactSubheading !== undefined ? body.contactSubheading : (currentContent.contactSubheading || ""),
      contactAvailability: body.contactAvailability !== undefined ? body.contactAvailability : (currentContent.contactAvailability || ""),
      socialLinks: mergedSocialLinks,
      servicesCards: body.servicesCards !== undefined ? body.servicesCards : (currentContent.servicesCards || []),
      status: newStatus,
      ...statusMetadata,
    };

    const settings = await Settings.findOneAndUpdate(
      {}, 
      { 
        $set: { 
          siteContent: merged,
          updatedAt: new Date()
        } 
      }, 
      { upsert: true, new: true }
    );
    
    revalidatePath("/");
    return NextResponse.json({ success: true, data: settings.siteContent });
  } catch (error) {
    console.error("PUT_CONTENT_SETTINGS_ERROR:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}