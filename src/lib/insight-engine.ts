import dbConnect from "./db";
import Analytics from "@/models/Analytics";
import Lead from "@/models/Lead";
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

  // 1. Calculate Global Conversion Rate
  const totalViews = await Analytics.countDocuments({ type: "page_view" });
  const totalLeads = await Lead.countDocuments({});
  const globalCR = totalViews > 0 ? (totalLeads / totalViews) * 100 : 0;

  insights.push({
    type: globalCR > 2 ? "positive" : "opportunity",
    title: "Global Conversion Rate",
    description: `Your site is currently converting at ${globalCR.toFixed(1)}%.`,
    impact: globalCR > 2 ? "Healthy performance." : "Below industry average for premium portfolios.",
    action: globalCR > 2 ? "Maintain current strategy." : "Optimize project case studies with more results-focused copy."
  });

  // 2. Showreel Engagement Analysis
  const showreelPlays = await Analytics.countDocuments({ interactionType: "showreel_play" });
  const showreelCompletions = await Analytics.countDocuments({ interactionType: "showreel_complete" });
  const completionRate = showreelPlays > 0 ? (showreelCompletions / showreelPlays) * 100 : 0;

  if (completionRate < 30 && showreelPlays > 10) {
    insights.push({
      type: "negative",
      title: "Showreel Drop-off",
      description: `Only ${completionRate.toFixed(1)}% of viewers watch your full showreel.`,
      impact: "High-value work at the end of your reel is being missed.",
      action: "Front-load your most impressive clips in the first 10 seconds."
    });
  } else if (completionRate > 50) {
    insights.push({
      type: "positive",
      title: "Showreel Mastery",
      description: `Over half of your viewers watch the entire reel.`,
      impact: "Exceptional retention and brand interest.",
      action: "Add a secondary CTA midway through the video for even higher conversion."
    });
  }

  // 3. Top Converting Project Category
  const categoryLeads = await Lead.aggregate([
    { $group: { _id: "$projectType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  if (categoryLeads.length > 0) {
    insights.push({
      type: "opportunity",
      title: "Market Demand Identified",
      description: `Clients are most interested in '${categoryLeads[0]._id}' services.`,
      impact: "This category drives the majority of your revenue pipeline.",
      action: `Create a dedicated case study or landing page focused exclusively on ${categoryLeads[0]._id}.`
    });
  }

  // 4. Underperforming Content
  const projectViews = await Analytics.aggregate([
    { $match: { type: "page_view", projectId: { $ne: null } } },
    { $group: { _id: "$projectId", views: { $sum: 1 } } }
  ]);

  for (const p of projectViews) {
    const pLeads = await Lead.countDocuments({ metadata: { projectId: p._id } }); // Assuming we track attribution
    if (p.views > 50 && pLeads === 0) {
        const project = await Project.findById(p._id);
        insights.push({
            type: "opportunity",
            title: "Project Optimization Needed",
            description: `'${project?.title?.en}' has high views but zero lead generation.`,
            impact: "Users are interested but aren't being convinced to act.",
            action: "Add more social proof or a clearer 'Free Audit' CTA to this specific project."
        });
        break; // Only one negative project insight at a time to avoid clutter
    }
  }

  return {
    metrics: {
      globalCR,
      completionRate,
      totalViews,
      totalLeads
    },
    insights
  };
}
