import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Analytics from "@/models/Analytics";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    return NextResponse.json({ data: { dailyViews: [], topProjects: [] } });
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const views = await Analytics.aggregate([
      {
        $match: {
          type: "page_view",
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const topProjects = await Analytics.aggregate([
      {
        $match: {
          type: "page_view",
          projectId: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$projectId",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project"
        }
      },
      { $unwind: "$project" }
    ]);

    return NextResponse.json({
      data: {
        dailyViews: Array.isArray(views) ? views : [],
        topProjects: Array.isArray(topProjects) ? topProjects : []
      }
    });
  } catch (error) {
    console.error("GET_ANALYTICS_ERROR:", error);
    return NextResponse.json({ data: { dailyViews: [], topProjects: [] } });
  }
}

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { type, page, projectId, interactionType, metadata } = body;

  try {
    await dbConnect();
  } catch (error) {
    console.error("DB_CONNECT_ERROR:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  try {
    const entry = await Analytics.create({
      type,
      page,
      projectId,
      interactionType,
      metadata
    });

    return NextResponse.json({ data: entry });
  } catch (error) {
    console.error("POST_ANALYTICS_ERROR:", error);
    return NextResponse.json({ error: "Failed to log analytics" }, { status: 500 });
  }
}