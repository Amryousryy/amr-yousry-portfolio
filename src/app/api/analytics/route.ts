import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Analytics from "@/models/Analytics";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    return NextResponse.json({ data: { dailyViews: [], topProjects: [] } });
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const views = await Analytics.aggregate([
      {
        $match: {
          type: "page_view",
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
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
          foreignField: "slug",
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