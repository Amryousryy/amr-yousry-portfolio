import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Showreel from "@/models/Showreel";
import { showreelCreateSchema } from "@/lib/validation";
import { logActivity } from "@/lib/activity";

const DEFAULT_SHOWREEL = {
  _id: "default",
  title: "Showreel 2024",
  subtitle: "Recent work highlights",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  thumbnailUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800",
  isActive: true,
  ctaText: "Work With Me",
  ctaLink: "/contact",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export async function GET(req: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ success: true, data: [DEFAULT_SHOWREEL] });
    }

    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    
    await dbConnect();
    
    const query = isAdmin ? {} : { isActive: true };
    const showreels = await Showreel.find(query).sort({ createdAt: -1 }).lean();
    
    if (!showreels || showreels.length === 0) {
      return NextResponse.json({ success: true, data: [DEFAULT_SHOWREEL] });
    }

    return NextResponse.json({ success: true, data: showreels });
  } catch (error) {
    console.error("GET_SHOWREELS_ERROR:", error);
    return NextResponse.json({ success: true, data: [DEFAULT_SHOWREEL] });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = showreelCreateSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.format() }, { status: 400 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ success: true, data: { ...validation.data, _id: "temp" } }, { status: 201 });
    }

    await dbConnect();
    const showreel = await Showreel.create(validation.data);

    await logActivity({
      action: "create",
      targetType: "showreel",
      targetName: validation.data.title || "Untitled",
      adminEmail: session.user?.email || "unknown",
      metadata: { id: showreel._id }
    });

    return NextResponse.json({ success: true, data: showreel }, { status: 201 });
  } catch (error) {
    console.error("POST_SHOWREELS_ERROR:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}