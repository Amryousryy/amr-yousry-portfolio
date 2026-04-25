import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";

const DEFAULT_CONTENT = {
  about: "",
  servicesTitle: "What I Deliver",
  servicesSubtitle: "Premium video content that drives real business results.",
  servicesDescription: "",
  contactEmail: "",
  whatsappNumber: "",
  socialLinks: {
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
  },
  servicesCards: [],
  status: "draft"
};

function getString(value: string | { en: string; ar: string } | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.en || "";
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

    await dbConnect();
    const settings = await Settings.findOne({}).lean() as any;
    
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
      servicesTitle: getString(content?.servicesTitle) || "What I Deliver",
      servicesSubtitle: getString(content?.servicesSubtitle) || "Premium video content that drives real business results.",
      servicesDescription: getString(content?.servicesDescription),
      contactEmail: content?.contactEmail || "",
      whatsappNumber: content?.whatsappNumber || "",
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
    
    if (!body.about) {
      return NextResponse.json({ success: false, error: "About content is required" }, { status: 400 });
    }

    if (!body.contactEmail) {
      return NextResponse.json({ success: false, error: "Contact email is required" }, { status: 400 });
    }

    await dbConnect();
    
    const currentSettings = await Settings.findOne({}).lean() as any;
    const currentStatus = currentSettings?.siteContent?.status || "draft";
    const newStatus = body.status || "draft";
    
    const statusMetadata: Record<string, Date> = {
      lastStatusChangeAt: new Date(),
    };
    
    if (newStatus === "published" && currentStatus !== "published") {
      statusMetadata.publishedAt = new Date();
    }
    
    const settings = await Settings.findOneAndUpdate(
      {}, 
      { 
        $set: { 
          siteContent: {
            about: body.about,
            servicesTitle: body.servicesTitle || "Services",
            servicesDescription: body.servicesDescription,
            contactEmail: body.contactEmail,
            whatsappNumber: body.whatsappNumber || "",
            socialLinks: body.socialLinks || {
              instagram: "",
              twitter: "",
              youtube: "",
              linkedin: "",
            },
            servicesCards: body.servicesCards || [],
            status: newStatus,
            ...statusMetadata,
          },
          updatedAt: new Date()
        } 
      }, 
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ success: true, data: settings.siteContent });
  } catch (error) {
    console.error("PUT_CONTENT_SETTINGS_ERROR:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}