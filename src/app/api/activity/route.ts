import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ActivityLog from "@/models/ActivityLog";

export async function GET() {
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
    const logs = await ActivityLog.find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();
    
    return NextResponse.json({ data: Array.isArray(logs) ? logs : [] });
  } catch (error) {
    console.error("GET_ACTIVITY_ERROR:", error);
    return NextResponse.json({ data: [] });
  }
}