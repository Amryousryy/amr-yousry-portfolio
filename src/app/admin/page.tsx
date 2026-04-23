"use client";

import React from "react";
import Link from "next/link";
import { 
  FolderKanban, 
  Video, 
  Filter as FilterIcon, 
  CheckCircle, 
  Eye,
  FileText,
  Clock,
  User,
  Plus,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  MousePointer2,
  TrendingUp,
  Layers,
  MessageSquare,
  BarChart3
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ProjectService, FilterService, SettingsService } from "@/lib/api-client";
import StatsChart from "@/components/admin/StatsChart";

function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function AdminOverview() {
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects", "admin"],
    queryFn: () => ProjectService.getAll(true),
  });

  const { data: filters } = useQuery({
    queryKey: ["filters", "admin"],
    queryFn: () => FilterService.getAll(true),
  });

  const { data: hero } = useQuery({
    queryKey: ["hero-settings"],
    queryFn: () => SettingsService.getHero(),
  });

  const { data: leads } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const res = await fetch("/api/leads");
      return res.json();
    },
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      if (!res.ok) return { data: { dailyViews: [], topProjects: [] } };
      return await res.json();
    },
  });

  const { data: activityData } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const res = await fetch("/api/activity");
      if (!res.ok) return { data: [] };
      return await res.json();
    },
  });

  const projectsData = projects?.data ?? [];
  const filtersData = filters?.data ?? [];
  const analyticsData = analytics?.data ?? { dailyViews: [], topProjects: [] };
  const activityList = activityData?.data ?? [];
  const leadsData = leads?.data ?? [];

  const totalViews = analyticsData.dailyViews?.reduce((sum: number, d: any) => sum + d.count, 0) ?? 0;
  const leadsThisWeek = leadsData.filter((l: any) => {
    try {
      const d = new Date(l.createdAt);
      const now = new Date();
      return (now.getTime() - d.getTime()) < (7 * 24 * 60 * 60 * 1000);
    } catch { return false; }
  }).length;

  const stats = [
    { 
      name: "Total Projects", 
      value: Array.isArray(projectsData) ? projectsData.length : 0, 
      change: null,
      icon: FolderKanban, 
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      href: "/admin/projects",
      description: "Portfolio pieces"
    },
    { 
      name: "Featured", 
      value: Array.isArray(projectsData) ? projectsData.filter((p: any) => p.featured).length : 0, 
      change: null,
      icon: CheckCircle, 
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      href: "/admin/projects",
      description: "Showcase items"
    },
    { 
      name: "Total Views", 
      value: formatNumber(totalViews), 
      change: "+12%",
      trend: "up",
      icon: Eye, 
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      href: "/admin/analytics",
      description: "Last 7 days"
    },
    { 
      name: "New Leads", 
      value: leadsThisWeek, 
      change: leadsThisWeek > 0 ? "+" + leadsThisWeek : null,
      trend: leadsThisWeek > 0 ? "up" : null,
      icon: Target, 
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      href: "/admin/leads",
      description: "This week"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 pb-6 border-b border-primary/10">
        <div className="space-y-1">
          <h1 className="text-xl font-display font-bold uppercase tracking-tight">Command Center</h1>
          <p className="text-[11px] text-foreground/40 uppercase tracking-wider">
            {Array.isArray(projectsData) ? projectsData.length : 0} projects · {Array.isArray(filtersData) ? filtersData.length : 0} filters
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-background text-xs font-medium uppercase tracking-tight hover:bg-accent/90 transition-colors"
          >
            <Plus size={14} />
            <span>Add Project</span>
          </Link>
          <Link
            href="/admin/leads"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary/20 border border-primary/10 text-foreground/60 text-xs font-medium uppercase tracking-tight hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <User size={14} />
            <span>Leads</span>
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary/20 border border-primary/10 text-foreground/60 text-xs font-medium uppercase tracking-tight hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <BarChart3 size={14} />
            <span>Analytics</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link 
            key={stat.name} 
            href={stat.href}
            className="group p-5 bg-primary/20 border border-primary/10 hover:border-accent/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-sm ${stat.bg}`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              {stat.change && (
                <div className={`flex items-center text-[10px] font-bold ${
                  stat.trend === "up" ? "text-emerald-400" : "text-red-400"
                }`}>
                  {stat.trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
            <p className="text-2xl font-display font-bold mb-1">{stat.value}</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-foreground/50 group-hover:text-foreground/70 transition-colors">
              {stat.name}
            </p>
            <p className="text-[9px] text-foreground/30 mt-1">{stat.description}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {analyticsData.dailyViews && analyticsData.dailyViews.length > 0 && (
            <div className="p-6 bg-primary/20 border border-primary/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-sm uppercase tracking-tight">Traffic Momentum</h3>
                  <p className="text-[10px] text-foreground/40 mt-1">Daily views over the last 7 days</p>
                </div>
                <Link href="/admin/analytics" className="flex items-center text-accent text-[10px] font-medium uppercase tracking-wide hover:underline">
                  <span>Details</span>
                  <ArrowRight size={12} className="ml-1" />
                </Link>
              </div>
              <StatsChart data={analyticsData.dailyViews} title="Views" />
            </div>
          )}

          <div className="p-6 bg-primary/20 border border-primary/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-sm">
                  <Clock size={16} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm uppercase tracking-tight">Recent Activity</h3>
                  <p className="text-[10px] text-foreground/40 mt-0.5">Latest changes across your portfolio</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {Array.isArray(activityList) && activityList.length > 0 ? activityList.slice(0, 6).map((log: any) => (
                <div key={log._id} className="flex items-center justify-between p-3 bg-background/30 border border-primary/5 hover:border-primary/20 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-sm ${
                      log.action === 'delete' ? 'bg-red-500/10 text-red-400' :
                      log.action === 'create' ? 'bg-emerald-500/10 text-emerald-400' :
                      'bg-accent/10 text-accent'
                    }`}>
                      <User size={12} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[11px] font-medium">
                        <span className="text-foreground/40">{log.adminEmail.split('@')[0]}</span>
                        <span className="text-foreground/30"> {log.action}ed </span>
                        <span className="text-foreground/70">{log.targetName}</span>
                      </p>
                      <p className="text-[9px] text-foreground/25">{getTimeAgo(log.timestamp)}</p>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-primary/20 text-foreground/40 uppercase">
                    {log.targetType}
                  </span>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                  <div className="p-3 bg-primary/20 rounded-full mb-4">
                    <Zap size={20} className="text-foreground/20" />
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wide text-foreground/30 mb-1">No Recent Activity</p>
                  <p className="text-[10px] text-foreground/20 mb-4">Your actions will appear here after you make changes</p>
                  <Link href="/admin/projects/new" className="px-4 py-2 bg-accent/10 text-accent text-[10px] font-medium uppercase tracking-wide hover:bg-accent/20 transition-colors">
                    Create your first project
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 bg-primary/20 border border-primary/10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-sm">
                  <MousePointer2 size={16} className="text-accent" />
                </div>
                <h3 className="font-display font-bold text-sm uppercase tracking-tight">Top Projects</h3>
              </div>
              <Link href="/admin/projects" className="text-[9px] text-accent font-medium uppercase tracking-wide hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {Array.isArray(analyticsData.topProjects) && analyticsData.topProjects.length > 0 ? analyticsData.topProjects.slice(0, 4).map((item: any, idx: number) => (
                <div key={item._id} className="flex items-center gap-3 p-3 bg-background/30 border border-primary/5 hover:border-primary/20 transition-colors group">
                  <span className="text-[10px] font-bold text-foreground/20 w-4">{idx + 1}</span>
                  <div className="w-10 h-10 bg-primary/20 rounded-sm overflow-hidden flex-shrink-0">
                    {item.project?.image && (
                      <img src={item.project.image} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium truncate">{item.project?.title?.en || 'Untitled'}</p>
                    <p className="text-[9px] text-foreground/30">{item.count || 0} views</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6">
                  <p className="text-[10px] text-foreground/30">No project data yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 bg-primary/20 border border-primary/10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-sm">
                  <Video size={16} className="text-accent" />
                </div>
                <h3 className="font-display font-bold text-sm uppercase tracking-tight">Hero Section</h3>
              </div>
              <Link href="/admin/hero" className="text-[9px] text-accent font-medium uppercase tracking-wide hover:underline">
                Edit
              </Link>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background/30 border border-primary/5">
                <span className="text-[10px] text-foreground/40 uppercase tracking-wide">Status</span>
                <span className={`text-[9px] px-2 py-0.5 font-bold uppercase ${
                  hero?.data?.status === 'published' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {hero?.data?.status ?? 'Unknown'}
                </span>
              </div>
              <div className="p-3 bg-background/30 border border-primary/5">
                <p className="text-[9px] text-foreground/30 uppercase tracking-wide mb-1">Headline</p>
                <p className="text-xs font-medium line-clamp-2">{hero?.data?.headline?.en || "Not configured"}</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-primary/20 border border-primary/10">
            <h3 className="font-display font-bold text-sm uppercase tracking-tight mb-5">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/admin/content" className="flex items-center justify-between p-3 bg-background/30 border border-primary/5 hover:border-accent/30 transition-colors group">
                <span className="text-[11px] font-medium">Update Content</span>
                <ArrowRight size={14} className="text-foreground/20 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/admin/filters" className="flex items-center justify-between p-3 bg-background/30 border border-primary/5 hover:border-accent/30 transition-colors group">
                <span className="text-[11px] font-medium">Smart Filters</span>
                <ArrowRight size={14} className="text-foreground/20 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/admin/showreels" className="flex items-center justify-between p-3 bg-background/30 border border-primary/5 hover:border-accent/30 transition-colors group">
                <span className="text-[11px] font-medium">Manage Showreels</span>
                <ArrowRight size={14} className="text-foreground/20 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}