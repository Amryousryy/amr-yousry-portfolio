"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FolderKanban, 
  BarChart3, 
  LogOut,
  ExternalLink,
  Plus,
  Globe,
  Home,
  User,
  Mail
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuGroups = [
  {
    title: "Home",
    items: [
      { name: "Hero", icon: Home, href: "/admin/content/hero" },
      { name: "About", icon: User, href: "/admin/content" },
    ]
  },
  {
    title: "Projects",
    items: [
      { name: "Projects", icon: FolderKanban, href: "/admin/projects" },
    ]
  },
  {
    title: "Contact",
    items: [
      { name: "Contact", icon: Mail, href: "/admin/content/contact" },
    ]
  },
  {
    title: "Insights",
    items: [
      { name: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--color-surface-sidebar)]/80 backdrop-blur-xl border-r border-[var(--color-border-sidebar)]/30 flex flex-col z-[var(--z-sidebar)]">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-sm bg-accent flex items-center justify-center">
            <Globe className="text-background" size={20} />
          </div>
          <div>
            <span className="font-display font-bold uppercase tracking-widest text-xs block">Website</span>
            <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Control Center</span>
          </div>
        </div>

        <Link 
          href="/admin/projects/new"
          className="flex items-center justify-center space-x-2 w-full py-3 bg-accent text-background font-bold uppercase tracking-widest text-[10px] hover:bg-accent/90 transition-colors mb-8"
        >
          <Plus size={14} />
          <span>New Project</span>
        </Link>

        <nav className="space-y-8">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <p className="text-[9px] text-foreground/30 uppercase tracking-[0.2em] mb-3 px-3">{group.title}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2.5 transition-all group ${
                        isActive 
                          ? "bg-accent/10 text-accent border-l-2 border-accent" 
                          : "text-foreground/50 hover:text-foreground hover:bg-primary/5 border-l-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon size={16} className={isActive ? "text-accent" : "group-hover:text-accent transition-colors"} />
                        <span className="text-[11px] font-medium uppercase tracking-tight">{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-[var(--color-border-sidebar)]/30 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2.5 text-foreground/50 hover:text-foreground hover:bg-primary/5 transition-all group"
        >
          <span className="text-[11px] font-medium uppercase tracking-tight">View Site</span>
          <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center justify-between px-3 py-2.5 w-full text-foreground/50 hover:text-red-500 hover:bg-red-500/5 transition-all group"
        >
          <span className="text-[11px] font-medium uppercase tracking-tight">Logout</span>
          <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
    </aside>
  );
}
