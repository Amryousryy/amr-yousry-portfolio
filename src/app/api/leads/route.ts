import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";
import { leadUpdateSchema } from "@/lib/validation/lead";
import { paginationSchema, getPagination } from "@/lib/pagination";

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
    
    const query: Record<string, any> = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ];
    }
    
    const parsed = paginationSchema.safeParse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20,
    });
    const { page, limit } = parsed.success ? parsed.data : { page: 1, limit: 20 };
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(query)
    ]);

    const pagination = getPagination(page, limit, total);
    return successResponse(leads, pagination);
  } catch (error) {
    console.error("GET_LEADS_ERROR:", error);
    return successResponse([]);
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const validation = leadUpdateSchema.safeParse(updateData);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    await dbConnect();
    const lead = await Lead.findByIdAndUpdate(id, validation.data, { new: true });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ data: lead });
  } catch (error) {
    console.error("PATCH_LEAD_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
