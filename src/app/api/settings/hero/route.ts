import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";

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

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ success: true, data: { ...DEFAULT_HERO, _preview: isPreview } }, responseConfig);
    }

    await dbConnect();
    const settings = await Settings.findOne({}).lean() as any;
    
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
    
    if (!body.headline) {
      return NextResponse.json({ success: false, error: "Headline is required" }, { status: 400 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ success: true, data: body });
    }

    await dbConnect();
    
    const currentSettings = await Settings.findOne({}).lean() as any;
    const currentStatus = currentSettings?.hero?.status || "draft";
    const newStatus = body.status || "draft";
    
    const heroData = { ...body };
    delete heroData.status;
    
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
          headline: heroData.headline,
          subheadline: heroData.subheadline,
          primaryCTA: heroData.primaryCTA,
          primaryCTALink: heroData.primaryCTALink || "/contact",
          secondaryCTA: heroData.secondaryCTA,
          secondaryCTALink: heroData.secondaryCTALink || "/projects",
          posterImage: heroData.posterImage || "",
          showreelVideo: heroData.showreelVideo || "",
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