"use client";

import React from "react";
import { motion } from "framer-motion";
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
  ArrowRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ProjectService, FilterService, SettingsService } from "@/lib/api-client";
import Link from "next/link";
import StatsChart from "@/components/admin/StatsChart";

export default function AdminOverview() {
  const { data: projects } = useQuery({
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

  const { data: analytics } = useQuery({
    queryKey: ["analytics-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      if (!res.ok) return { data: { dailyViews: [], topProjects: [] } };
      return res.json();
    },
  });

  const { data: activityData } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const res = await fetch("/api/activity");
      if (!res.ok) return { data: [] };
      return res.json();
    },
  });

  const projectsData = projects?.data ?? [];
  const filtersData = filters?.data ?? [];
  const analyticsData = analytics?.data ?? { dailyViews: [], topProjects: [] };
  const activityList = activityData?.data ?? [];

  const stats = [
    { 
      name: "Total Projects", 
      value: Array.isArray(projectsData) ? projectsData.length : 0, 
      icon: FolderKanban, 
      color: "text-blue-500",
      href: "/admin/projects"
    },
    { 
      name: "Featured Works", 
      value: Array.isArray(projectsData) ? projectsData.filter((p: any) => p.featured).length : 0, 
      icon: CheckCircle, 
      color: "text-green-500",
      href: "/admin/projects"
    },
    { 
      name: "Draft Projects", 
      value: Array.isArray(projectsData) ? projectsData.filter((p: any) => p.status === "draft").length : 0, 
      icon: Eye, 
      color: "text-yellow-500",
      href: "/admin/projects"
    },
    { 
      name: "Active Filters", 
      value: Array.isArray(filtersData) ? filtersData.length : 0, 
      icon: FilterIcon, 
      color: "text-purple-500",
      href: "/admin/filters"
    },
  ];

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 uppercase tracking-tighter">Command Center</h1>
          <p className="text-foreground/50 pixel-text text-xs uppercase tracking-widest">
            Website Status & Audit Trail
          </p>
        </div>
        <Link 
          href="/admin/projects/new"
          className="flex items-center space-x-2 px-6 py-3 bg-accent text-background text-[10px] font-bold uppercase tracking-widest pixel-border hover:scale-105 transition-transform"
        >
          <Plus size={14} />
          <span>New Project</span>
        </Link>
      </header> 

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link 
            key={stat.name} 
            href={stat.href}
            className="p-6 bg-primary/5 border border-primary/10 hover:border-accent transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={24} className={stat.color} />
              <span className="text-3xl font-display font-bold">{stat.value}</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 group-hover:text-foreground transition-colors">
              {stat.name}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {analyticsData.dailyViews && analyticsData.dailyViews.length > 0 && (
            <StatsChart data={analyticsData.dailyViews} title="Traffic Overview" />
          )}

          <div className="p-8 bg-primary/5 border border-primary/10 h-full">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-display font-bold uppercase tracking-tight flex items-center gap-3">
                 <Clock className="text-accent" size={20} />
                 Recent Activity Log
               </h3>
            </div>
            
            <div className="space-y-4">
              {Array.isArray(activityList) && activityList.length > 0 ? activityList.slice(0, 8).map((log: any) => (
                <div key={log._id} className="flex items-center justify-between p-4 bg-background/40 border border-primary/5 hover:border-primary/20 transition-colors">
                   <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-sm ${
                        log.action === 'delete' ? 'bg-red-500/10 text-red-500' :
                        log.action === 'create' ? 'bg-green-500/10 text-green-500' :
                        'bg-accent/10 text-accent'
                      }`}>
                         <User size={14} />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold uppercase tracking-tight">
                           {log.adminEmail} <span className="text-foreground/40 font-normal">{log.action}d</span> {log.targetName}
                         </p>
                         <p className="text-[8px] text-foreground/30 uppercase">{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}</p>
                      </div>
                   </div>
                   <span className="text-[8px] px-2 py-0.5 border border-primary/10 text-foreground/40 uppercase">
                     {log.targetType}
                   </span>
                </div>
              )) : (
                <div className="text-center py-12 text-foreground/20 text-[10px] uppercase tracking-widest">
                  No activity recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-primary/5 border border-primary/10">
            <h3 className="font-display font-bold uppercase tracking-tight flex items-center gap-3 mb-8">
              <Eye className="text-accent" size={20} />
              Top Projects
            </h3>
            <div className="space-y-4">
              {Array.isArray(analyticsData.topProjects) && analyticsData.topProjects.length > 0 ? analyticsData.topProjects.map((item: any) => (
                <div key={item._id} className="p-4 bg-background/50 border border-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 pixel-border overflow-hidden">
                      {item.project?.image && <img src={item.project.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase truncate max-w-[120px]">{item.project?.title?.en || 'Untitled'}</p>
                      <p className="text-[8px] text-accent pixel-text">{item.project?.category || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{item.count || 0}</p>
                    <p className="text-[8px] text-foreground/30 uppercase">Views</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-foreground/20 text-[10px] uppercase">No data</div>
              )}
            </div>
          </div>

          <div className="p-8 bg-primary/5 border border-primary/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display font-bold uppercase tracking-tight flex items-center gap-3">
                <Video className="text-accent" size={20} />
                Hero
              </h3>
              <span className={`text-[8px] px-2 py-1 font-bold ${hero?.data?.status === 'published' ? 'text-green-500' : 'text-yellow-500'}`}>
                {hero?.data?.status?.toUpperCase() || "NO DATA"}
              </span>
            </div>
            
            <div className="p-4 bg-background/50 border border-primary/5 mb-6">
              <p className="text-[9px] text-accent font-bold uppercase tracking-widest mb-1">Headline</p>
              <p className="text-xs italic line-clamp-2">{hero?.data?.headline?.en || "Not set"}</p>
            </div>

            <Link 
              href="/admin/hero"
              className="flex items-center justify-center space-x-2 w-full py-3 bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-background transition-all"
            >
              <span>Manage Hero</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="p-8 bg-primary/5 border border-primary/10">
            <h3 className="font-display font-bold uppercase tracking-tight flex items-center gap-3 mb-8">
              <FileText className="text-accent" size={20} />
              Shortcuts
            </h3>
            <div className="space-y-3">
              <Link href="/admin/content" className="p-4 bg-background/50 border border-primary/5 hover:border-accent transition-all flex items-center justify-between group">
                <span className="text-[10px] uppercase tracking-widest font-bold">Update Content</span>
                <ArrowRight size={14} className="text-foreground/20 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/admin/filters" className="p-4 bg-background/50 border border-primary/5 hover:border-accent transition-all flex items-center justify-between group">
                <span className="text-[10px] uppercase tracking-widest font-bold">Smart Filters</span>
                <ArrowRight size={14} className="text-foreground/20 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}