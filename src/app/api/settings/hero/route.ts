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

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ success: true, data: DEFAULT_HERO });
    }

    await dbConnect();
    const settings = await Settings.findOne({}).lean();
    
    if (!settings?.hero) {
      return NextResponse.json({ success: true, data: DEFAULT_HERO });
    }

    return NextResponse.json({ success: true, data: settings.hero });
  } catch (error) {
    console.error("GET_HERO_SETTINGS_ERROR:", error);
    return NextResponse.json({ success: true, data: DEFAULT_HERO });
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
    
    const settings = await Settings.findOneAndUpdate(
      {}, 
      { $set: { hero: validation.data, updatedAt: new Date() } }, 
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ success: true, data: settings.hero });
  } catch (error) {
    console.error("PUT_HERO_SETTINGS_ERROR:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}