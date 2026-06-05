import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Analytics from "@/models/Analytics";
import { toPlainText } from "@/lib/text";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalEvents,
      pageViews,
      projectDetailViews,
      projectCardClicks,
      categoryFilterClicks,
      contactCtaClicks,
      showreelClicks,
      recentEventsCount,
    ] = await Promise.all([
      Analytics.countDocuments({}),
      Analytics.countDocuments({ type: "page_view" }),
      Analytics.countDocuments({ interactionType: "project_detail_view" }),
      Analytics.countDocuments({ interactionType: "project_card_click" }),
      Analytics.countDocuments({ interactionType: "category_filter_click" }),
      Analytics.countDocuments({ interactionType: "contact_cta_click" }),
      Analytics.countDocuments({ interactionType: "showreel_click" }),
      Analytics.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    ]);

    const topProjects = await Analytics.aggregate([
      {
        $match: {
          interactionType: "project_detail_view",
        }
      },
      {
        $group: {
          _id: "$page",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "projects",
          localField: "page",
          foreignField: "slug",
          as: "project"
        }
      },
      {
        $addFields: {
          slug: { $arrayElemAt: ["$project.slug", 0] },
          title: { $arrayElemAt: ["$project.title", 0] },
        }
      },
      { $project: { slug: 1, title: 1, count: 1, _id: 0 } }
    ]);

    const topCategories = await Analytics.aggregate([
      {
        $match: {
          interactionType: "category_filter_click",
          category: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const dailyViews = await Analytics.aggregate([
      {
        $match: {
          type: "page_view",
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    return NextResponse.json({
      totalEvents,
      pageViews,
      projectDetailViews,
      projectCardClicks,
      categoryFilterClicks,
      contactCtaClicks,
      showreelClicks,
      recentEventsCount,
      topProjects: topProjects.map((p) => ({
        ...p,
        title: toPlainText(p.title),
        slug: toPlainText(p.slug),
      })),
      topCategories,
      dailyViews,
    });
  } catch (error) {
    console.error("SUMMARY_ERROR:", error);
    return NextResponse.json({
      totalEvents: 0,
      pageViews: 0,
      projectDetailViews: 0,
      projectCardClicks: 0,
      categoryFilterClicks: 0,
      contactCtaClicks: 0,
      showreelClicks: 0,
      recentEventsCount: 0,
      topProjects: [],
      topCategories: [],
      dailyViews: [],
    });
  }
}
