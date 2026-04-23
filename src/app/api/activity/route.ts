import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ActivityLog from "@/models/ActivityLog";
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
    const parsed = paginationSchema.safeParse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 50,
    });
    const { page, limit } = parsed.success ? parsed.data : { page: 1, limit: 50 };
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLog.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments({})
    ]);

    const pagination = getPagination(page, limit, total);
    return successResponse(logs, pagination);
  } catch (error) {
    console.error("GET_ACTIVITY_ERROR:", error);
    return successResponse([]);
  }
}