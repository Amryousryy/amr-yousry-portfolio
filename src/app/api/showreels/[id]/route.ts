import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Showreel from "@/models/Showreel";
import { showreelSchema } from "@/lib/validations";
import { deleteCloudinaryResources } from "@/lib/cloudinary";
import { logActivity } from "@/lib/activity";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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
    const showreel = await Showreel.findByIdAndUpdate(id, validation.data, { new: true });
    
    if (!showreel) {
      return NextResponse.json({ error: "Showreel not found" }, { status: 404 });
    }

    await logActivity({
      action: "update",
      targetType: "showreel",
      targetName: validation.data.title.en,
      adminEmail: session.user?.email || "unknown",
      metadata: { id }
    });
    
    return NextResponse.json(showreel);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const showreel = await Showreel.findById(id);
    if (!showreel) {
      return NextResponse.json({ error: "Showreel not found" }, { status: 404 });
    }

    // Delete assets from Cloudinary
    await deleteCloudinaryResources([showreel.videoUrl, showreel.thumbnailUrl]);

    await Showreel.findByIdAndDelete(id);

    await logActivity({
      action: "delete",
      targetType: "showreel",
      targetName: showreel.title.en,
      adminEmail: session.user?.email || "unknown",
      metadata: { id }
    });
    
    return NextResponse.json({ message: "Showreel deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
