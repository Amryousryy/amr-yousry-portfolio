import dbConnect from "./db";
import Analytics from "@/models/Analytics";
import Project from "@/models/Project";

export interface Insight {
  type: "positive" | "negative" | "opportunity";
  title: string;
  description: string;
  impact: string;
  action: string;
}

export async function generateBusinessInsights() {
  await dbConnect();

  const insights: Insight[] = [];

  // 1. Page view tracking status
  const totalViews = await Analytics.countDocuments({ type: "page_view" });

  if (totalViews === 0) {
    insights.push({
      type: "opportunity",
      title: "Analytics Tracking Not Wired",
      description: "No page views recorded yet. Client-side tracking middleware needs to be implemented to capture visitor data.",
      impact: "Cannot measure audience engagement or conversion without page view data.",
      action: "Add a lightweight analytics middleware or layout effect to POST page_view events to /api/analytics on every route change."
    });
  }

  // 2. Showreel Engagement Analysis
  const showreelPlays = await Analytics.countDocuments({ interactionType: "showreel_play" });
  const showreelCompletions = await Analytics.countDocuments({ interactionType: "showreel_complete" });
  const completionRate = showreelPlays > 0 ? (showreelCompletions / showreelPlays) * 100 : 0;

  if (showreelPlays > 0 && completionRate < 30 && showreelPlays > 10) {
    insights.push({
      type: "negative",
      title: "Showreel Drop-off",
      description: `Only ${completionRate.toFixed(1)}% of viewers watch your full showreel.`,
      impact: "High-value work at the end of your reel is being missed.",
      action: "Front-load your most impressive clips in the first 10 seconds."
    });
  } else if (showreelPlays > 0 && completionRate > 50) {
    insights.push({
      type: "positive",
      title: "Showreel Mastery",
      description: "Over half of your viewers watch the entire reel.",
      impact: "Exceptional retention and brand interest.",
      action: "Add a secondary CTA midway through the video for even higher conversion."
    });
  }

  // 3. Underperforming Content
  const projectViews = await Analytics.aggregate([
    { $match: { type: "page_view", projectId: { $ne: null } } },
    { $group: { _id: "$projectId", views: { $sum: 1 } } }
  ]);

  for (const p of projectViews) {
    if (p.views > 50) {
        const project = await Project.findById(p._id);
        insights.push({
            type: "opportunity",
            title: "Popular Project",
            description: `'${project?.title?.en}' is attracting significant views.`,
            impact: "This project is your best converting asset — leverage it.",
            action: "Add a clear CTA or link to your services at the end of this project page."
        });
        break;
    }
  }

  return {
    metrics: {
      completionRate,
      totalViews
    },
    insights
  };
}
