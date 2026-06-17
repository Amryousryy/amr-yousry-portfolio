import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Settings, { type LeanSettings } from "@/models/Settings";
import { heroCreateSchema } from "@/lib/validation";

const DEFAULT_HERO = {
  headline: "Creative Strategist & Video Editor",
  subheadline: "I turn content into clients for brands",
  primaryCTA: "View Projects",
  primaryCTALink: "/contact",
  secondaryCTA: "Contact Me",
  secondaryCTALink: "/contact",
  status: "published"
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

    if (isAdmin || isPreview) {
      let session = null;
      try { session = await getServerSession(authOptions); } catch {}
      if (!session) {
        return NextResponse.json({
          success: true,
          data: { ...DEFAULT_HERO, status: "published", _preview: false }
        }, responseConfig);
      }
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ success: true, data: { ...DEFAULT_HERO, _preview: isPreview } }, responseConfig);
    }

    await dbConnect();
    const settings = await Settings.findOne({}).lean() as unknown as LeanSettings | null;
    
    if (!settings?.hero) {
      return NextResponse.json({ success: true, data: { ...DEFAULT_HERO, _preview: isPreview } }, responseConfig);
    }

    const hero = settings.hero;
    const sanitized = {
      headline: getString(hero?.headline),
      subheadline: getString(hero?.subheadline),
      primaryCTA: getString(hero?.primaryCTA),
      primaryCTALink: hero?.primaryCTALink || "/contact",
      secondaryCTA: getString(hero?.secondaryCTA),
      secondaryCTALink: hero?.secondaryCTALink || "/projects",
      posterImage: hero?.posterImage || "",
      showreelVideo: hero?.showreelVideo || "",
      status: hero?.status || "draft"
    };

    if (!isAdmin && !isPreview && sanitized.status !== "published") {
      return NextResponse.json({ 
        success: true, 
        data: { 
          ...DEFAULT_HERO, 
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
    console.error("GET_HERO_SETTINGS_ERROR:", error);
    return NextResponse.json({ 
      success: true, 
      data: { 
        ...DEFAULT_HERO, 
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
    
    const parsed = heroCreateSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const validated = parsed.data;

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ success: true, data: validated });
    }

    await dbConnect();
    
    const currentSettings = await Settings.findOne({}).lean() as unknown as LeanSettings | null;
    const currentStatus = currentSettings?.hero?.status || "draft";
    const newStatus = validated.status || "draft";
    
    const statusMetadata: Record<string, Date> = {
      lastStatusChangeAt: new Date(),
    };
    
    if (newStatus === "published" && currentStatus !== "published") {
      statusMetadata.publishedAt = new Date();
    }
    
    const settings = await Settings.findOneAndUpdate(
      {}, 
      { $set: { 
        hero: { 
          headline: validated.headline,
          subheadline: validated.subheadline,
          primaryCTA: validated.primaryCTA,
          primaryCTALink: validated.primaryCTALink,
          secondaryCTA: validated.secondaryCTA,
          secondaryCTALink: validated.secondaryCTALink,
          posterImage: validated.posterImage || "",
          showreelVideo: validated.showreelVideo || "",
          status: newStatus,
          ...statusMetadata,
        }, 
        updatedAt: new Date() 
      } }, 
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ success: true, data: settings.hero });
  } catch (error) {
    console.error("PUT_HERO_SETTINGS_ERROR:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}