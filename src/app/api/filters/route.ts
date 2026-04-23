import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Filter from "@/models/Filter";
import { filterSchema } from "@/lib/validations";
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
  try {
    await dbConnect();
  } catch (error) {
    console.error("DB_CONNECT_ERROR:", error);
    return successResponse([]);
  }

  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    const query = isAdmin ? {} : { active: true };
    
    const parsed = paginationSchema.safeParse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 50,
    });
    const { page, limit } = parsed.success ? parsed.data : { page: 1, limit: 50 };
    const skip = (page - 1) * limit;

    const [filters, total] = await Promise.all([
      Filter.find(query).sort({ order: 1 }).skip(skip).limit(limit).lean(),
      Filter.countDocuments(query)
    ]);

    const pagination = getPagination(page, limit, total);
    return successResponse(filters, pagination);
  } catch (error) {
    console.error("GET_FILTERS_ERROR:", error);
    return successResponse([]);
  }
}

export async function POST(req: Request) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("SESSION_ERROR:", error);
  }

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const validation = filterSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.format() }, { status: 400 });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error("DB_CONNECT_ERROR:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  try {
    const filter = await Filter.create(validation.data);
    return NextResponse.json({ data: filter }, { status: 201 });
  } catch (error) {
    console.error("POST_FILTER_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}