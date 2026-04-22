import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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

    return NextResponse.json({ data: lead }, { status: 201 });
  } catch (error) {
    console.error("LEAD_POST_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("SESSION_ERROR:", error);
  }

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error("DB_CONNECT_ERROR:", error);
    return NextResponse.json({ data: [] });
  }

  try {
    const leads = await Lead.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: Array.isArray(leads) ? leads : [] });
  } catch (error) {
    console.error("LEAD_GET_ERROR:", error);
    return NextResponse.json({ data: [] });
  }
}