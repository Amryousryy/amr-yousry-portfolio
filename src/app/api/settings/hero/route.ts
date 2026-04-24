import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { heroSchema } from "@/lib/validations";

const DEFAULT_HERO = {
  headline: { en: "Creative Strategist & Video Editor", ar: "مبدع استراتيجي ومحرر فيديو" },
  subheadline: { en: "I turn content into clients for brands", ar: "أحول المحتوى إلى عملاء للعلامات التجارية" },
  primaryCTA: { en: "View Projects", ar: "عرض المشاريع" },
  primaryCTALink: "/#contact",
  secondaryCTA: { en: "Contact Me", ar: "تواصل معي" },
  secondaryCTALink: "/contact",
  status: "published"
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

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ success: true, data: { ...DEFAULT_HERO, _preview: isPreview } }, responseConfig);
    }

    await dbConnect();
    const settings = await Settings.findOne({}).lean() as any;
    
    if (!settings?.hero) {
      return NextResponse.json({ success: true, data: { ...DEFAULT_HERO, _preview: isPreview } }, responseConfig);
    }

    // Non-admin, non-preview requests only return published content
    if (!isAdmin && !isPreview && settings.hero.status !== "published") {
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
        ...settings.hero, 
        _preview: isPreview && settings.hero.status !== "published" 
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
    const validation = heroSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.format() }, { status: 400 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ success: true, data: validation.data });
    }

    await dbConnect();
    
    const currentSettings = await Settings.findOne({}).lean() as any;
    const currentStatus = currentSettings?.hero?.status || "draft";
    const newStatus = validation.data.status || "draft";
    
    const heroData = { ...validation.data };
    delete (heroData as any).status;
    
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
          ...heroData, 
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