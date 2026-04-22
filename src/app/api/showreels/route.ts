import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Showreel from "@/models/Showreel";
import { showreelSchema } from "@/lib/validations";
import { logActivity } from "@/lib/activity";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    
    await dbConnect();
    
    const query = isAdmin ? {} : { isActive: true };
    const showreels = await Showreel.find(query).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json(showreels);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch showreels" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = showreelSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    await dbConnect();
    const showreel = await Showreel.create(validation.data);

    await logActivity({
      action: "create",
      targetType: "showreel",
      targetName: validation.data.title.en,
      adminEmail: session.user?.email || "unknown",
      metadata: { id: showreel._id }
    });

    return NextResponse.json(showreel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
