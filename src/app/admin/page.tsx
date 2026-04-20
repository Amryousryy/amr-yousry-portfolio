"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FolderKanban, 
  Video, 
  Filter as FilterIcon, 
  CheckCircle, 
  Eye,
  FileText
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ProjectService, FilterService, SettingsService } from "@/lib/api-client";
import Link from "next/link";

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

  const stats = [
    { 
      name: "Total Projects", 
      value: projects?.data?.length || 0, 
      icon: FolderKanban, 
      color: "text-blue-500",
      href: "/admin/projects"
    },
    { 
      name: "Featured Works", 
      value: projects?.data?.filter((p: any) => p.featured).length || 0, 
      icon: CheckCircle, 
      color: "text-green-500",
      href: "/admin/projects"
    },
    { 
      name: "Draft Projects", 
      value: projects?.data?.filter((p: any) => p.status === "draft").length || 0, 
      icon: Eye, 
      color: "text-yellow-500",
      href: "/admin/projects"
    },
    { 
      name: "Active Filters", 
      value: filters?.data?.length || 0, 
      icon: FilterIcon, 
      color: "text-purple-500",
      href: "/admin/filters"
    },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-display font-bold mb-2 uppercase tracking-tighter">Command Center</h1>
        <p className="text-foreground/50 pixel-text text-xs uppercase tracking-widest">
          Website Status & Analytics Overview
        </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Hero Status */}
        <div className="p-8 bg-primary/5 border border-primary/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display font-bold uppercase tracking-tight flex items-center gap-3">
              <Video className="text-accent" />
              Hero Section Status
            </h3>
            <span className={`text-[10px] px-2 py-1 pixel-border ${hero?.data?.status === 'published' ? 'bg-green-500/20 text-green-500 border-green-500/50' : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50'}`}>
              {hero?.data?.status?.toUpperCase() || "NO DATA"}
            </span>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-background/50 border border-primary/5">
              <p className="text-[10px] text-accent pixel-text mb-1">Current Headline (EN)</p>
              <p className="text-sm font-medium">{hero?.data?.headline?.en || "Not set"}</p>
            </div>
          </div>

          <Link 
            href="/admin/hero"
            className="inline-block w-full py-4 bg-primary text-white text-center font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-background transition-all"
          >
            Manage Hero Content
          </Link>
        </div>

        {/* Recent Activity / Quick Actions */}
        <div className="p-8 bg-primary/5 border border-primary/10">
          <h3 className="font-display font-bold uppercase tracking-tight flex items-center gap-3 mb-8">
            <FileText className="text-accent" />
            System Shortcuts
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <Link href="/admin/projects/new" className="p-4 bg-background/50 border border-primary/5 hover:border-accent transition-all flex items-center justify-between group">
              <span className="text-xs uppercase tracking-widest font-bold">Create New Project</span>
              <FolderKanban size={16} className="text-foreground/40 group-hover:text-accent" />
            </Link>
            <Link href="/admin/content" className="p-4 bg-background/50 border border-primary/5 hover:border-accent transition-all flex items-center justify-between group">
              <span className="text-xs uppercase tracking-widest font-bold">Update About Text</span>
              <FileText size={16} className="text-foreground/40 group-hover:text-accent" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
