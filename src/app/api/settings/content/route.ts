import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { siteContentSchema } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();
    const settings = await Settings.findOne({}).lean();
    
    // Construct the SiteContent-like object from global settings
    const content = {
       about: settings?.about?.content || { en: "", ar: "" },
       servicesTitle: settings?.services?.[0]?.title || { en: "", ar: "" }, // This mapping might need adjustment based on how the UI uses it
       servicesDescription: settings?.services?.[0]?.description || { en: "", ar: "" },
       // ... other fields if they exist in Settings model
    };

    return NextResponse.json({ data: content });
  } catch (error) {
    console.error("GET_CONTENT_SETTINGS_ERROR:", error);
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
    const validation = siteContentSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    await dbConnect();
    
    // Update specific fields in the single settings document
    const settings = await Settings.findOneAndUpdate(
      {}, 
      { 
        $set: { 
          "about.content": validation.data.about,
          updatedAt: new Date()
        } 
      }, 
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error("PUT_CONTENT_SETTINGS_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
