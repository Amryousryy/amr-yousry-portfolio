import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";

const DEFAULT_CONTENT = {
  about: { en: "", ar: "" },
  servicesTitle: { en: "Our Services", ar: "خدماتنا" },
  servicesDescription: { en: "", ar: "" },
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

    const content = settings.siteContent as typeof DEFAULT_CONTENT;

    // Non-admin, non-preview requests only return published content
    if (!isAdmin && !isPreview && content.status !== "published") {
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
        ...content, 
        _preview: isPreview && content.status !== "published" 
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
    
    // Validate required fields
    if (!body.about?.en || !body.about?.ar) {
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
            servicesTitle: body.servicesTitle || { en: "Our Services", ar: "خدماتنا" },
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