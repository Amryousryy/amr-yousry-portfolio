"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Settings, 
  MonitorPlay, 
  BarChart3, 
  LogOut,
  ExternalLink,
  Plus,
  Clapperboard,
  Users
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/admin" },
  { name: "Leads", icon: Users, href: "/admin/leads" },
  { name: "Projects", icon: FolderKanban, href: "/admin/projects" },
  { name: "Hero", icon: MonitorPlay, href: "/admin/hero" },
  { name: "Showreel", icon: Clapperboard, href: "/admin/showreels" },
  { name: "Content", icon: Settings, href: "/admin/content" },
  { name: "Analytics", icon: BarChart3, href: "/admin/analytics" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary/5 border-r border-primary/10 flex flex-col z-[100]">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-10">
           <Image src="/Asset 4.png" alt="Logo" width={32} height={32} />
           <span className="font-display font-bold uppercase tracking-widest text-xs">Admin Panel</span>
        </div>

        <Link 
          href="/admin/projects/new"
          className="flex items-center justify-center space-x-3 w-full py-4 bg-accent text-background font-bold uppercase tracking-widest text-[10px] pixel-border hover:scale-[1.02] transition-transform mb-12"
        >
          <Plus size={14} />
          <span>New Project</span>
        </Link>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-4 px-6 py-4 transition-all group ${
                  isActive ? "bg-accent text-background" : "text-foreground/40 hover:text-foreground hover:bg-primary/5"
                }`}
              >
                <item.icon size={18} className={isActive ? "" : "group-hover:text-accent transition-colors"} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-6 py-4 bg-primary/5 border border-primary/10 text-[9px] uppercase font-bold tracking-widest text-foreground/40 hover:text-foreground transition-all"
        >
          <span>View Site</span>
          <ExternalLink size={12} />
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center space-x-4 px-6 py-4 w-full text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Logout</span>
        </button>
      </div>
    </aside>
  );
}
