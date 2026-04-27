import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { paginationSchema, getPagination } from "@/lib/pagination";
import { z } from "zod";

function successResponse<T>(data: T, pagination?: ReturnType<typeof getPagination>) {
  return NextResponse.json({
    success: true,
    data,
    ...(pagination && {
      meta: {
        current: pagination.page,
        pages: pagination.totalPages,
        total: pagination.total,
        hasNext: pagination.hasNextPage,
        hasPrev: pagination.hasPrevPage,
      }
    })
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, projectType, message, offerType, metadata } = body;

    if (!name || !email || !projectType || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailSchema = z.string().email();
    if (!emailSchema.safeParse(email).success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    await dbConnect();
    const lead = await Lead.create({
      name,
      email,
      phone,
      projectType,
      message,
      offerType: offerType || "general",
      metadata
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

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
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
    return successResponse([]);
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    
    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { projectType: { $regex: search, $options: "i" } }
      ];
    }
    
    const parsed = paginationSchema.safeParse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20,
    });
    const { page, limit } = parsed.success ? parsed.data : { page: 1, limit: 20 };
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Lead.countDocuments(query)
    ]);

    const pagination = getPagination(page, limit, total);
    return successResponse(leads, pagination);
  } catch (error) {
    console.error("LEAD_GET_ERROR:", error);
    return successResponse([]);
  }
}

export async function PATCH(req: Request) {
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
    const body = await req.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    await dbConnect();
    const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error("LEAD_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}