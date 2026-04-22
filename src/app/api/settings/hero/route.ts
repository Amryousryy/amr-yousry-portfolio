import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { heroSchema } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();
    const settings = await Settings.findOne({}).lean();
    
    // Return just the hero part or an empty object
    return NextResponse.json({ data: settings?.hero || {} });
  } catch (error) {
    console.error("GET_HERO_SETTINGS_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = heroSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    await dbConnect();
    
    const settings = await Settings.findOneAndUpdate(
      {}, 
      { $set: { hero: validation.data, updatedAt: new Date() } }, 
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ data: settings.hero });
  } catch (error) {
    console.error("PUT_HERO_SETTINGS_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
