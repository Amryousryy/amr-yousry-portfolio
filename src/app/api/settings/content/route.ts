import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { SiteContent } from "@/models/Settings";
import { siteContentSchema } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();
    const content = await SiteContent.findOne({}).lean();
    return NextResponse.json(content || {});
  } catch (error) {
    console.error("GET_SITE_CONTENT_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = siteContentSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    await dbConnect();
    
    const content = await SiteContent.findOneAndUpdate(
      {}, 
      validation.data, 
      { upsert: true, new: true }
    );
    
    return NextResponse.json(content);
  } catch (error) {
    console.error("PUT_SITE_CONTENT_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
