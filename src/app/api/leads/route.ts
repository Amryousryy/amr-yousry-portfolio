import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, projectType, message, offerType } = body;

    if (!name || !email || !projectType || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    const lead = await Lead.create({
      name,
      email,
      phone,
      projectType,
      message,
      offerType: offerType || "general"
    });

    // Track as a conversion interaction
    try {
      await fetch(`${process.env.NEXTAUTH_URL}/api/analytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "interaction",
          page: "contact_form",
          interactionType: "lead_conversion",
          metadata: { leadId: lead._id, offerType }
        })
      });
    } catch (e) {
      console.error("Analytics conversion tracking failed");
    }

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("LEAD_POST_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const leads = await Lead.find({}).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
