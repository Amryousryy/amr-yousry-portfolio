import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Settings, { type LeanSettings } from "@/models/Settings";
import { heroUpdateSchema } from "@/lib/validation";
import { resolveStatusMetadata } from "@/lib/status-metadata";
import { getString } from "@/lib/text";

const DEFAULT_HERO = {
  headline: "Creative Strategist & Video Editor",
  subheadline: "I turn content into clients for brands",
  primaryCTA: "View Projects",
  primaryCTALink: "/contact",
  secondaryCTA: "Contact Me",
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

    const body = await req.json() as Record<string, unknown>;

    const parsed = heroUpdateSchema.safeParse(body);
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
    const currentHero = currentSettings?.hero ?? {};
    const currentStatus = currentSettings?.hero?.status || "draft";
    const newStatus = Object.prototype.hasOwnProperty.call(body, "status")
      ? validated.status || "draft"
      : currentStatus;

    const statusMetadata = resolveStatusMetadata(newStatus, currentStatus);

    const fieldsToApply = Object.fromEntries(
      Object.entries(validated).filter(([key]) =>
        Object.prototype.hasOwnProperty.call(body, key)
      )
    );

    const mergedHero = {
      ...currentHero,
      ...fieldsToApply,
      status: newStatus,
      ...statusMetadata,
    };

    const settings = await Settings.findOneAndUpdate(
      {}, 
      { $set: { 
        hero: mergedHero,
        updatedAt: new Date() 
      } }, 
      { upsert: true, new: true }
    );
    
    revalidatePath("/");
    return NextResponse.json({ success: true, data: settings.hero });
  } catch (error) {
    console.error("PUT_HERO_SETTINGS_ERROR:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}