"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Video, 
  FolderKanban, 
  Filter, 
  FileText, 
  LogOut,
  ExternalLink,
  Globe
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Hero Manager", href: "/admin/hero", icon: Video },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Filters", href: "/admin/filters", icon: Filter },
  { name: "Site Content", href: "/admin/content", icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-primary/20 z-50 flex flex-col">
      <div className="p-6 border-b border-primary/20">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-8 h-8">
            <Image src="/Asset 4.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="font-display font-bold uppercase tracking-tighter text-sm group-hover:text-accent transition-colors">
            CMS Terminal
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-none border transition-all ${
                isActive 
                  ? "bg-accent text-background border-accent font-bold" 
                  : "text-foreground/60 border-transparent hover:border-primary/20 hover:text-foreground"
              }`}
            >
              <item.icon size={18} />
              <span className="text-xs uppercase tracking-widest">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary/20 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-4 py-3 text-foreground/60 hover:text-accent transition-colors text-xs uppercase tracking-widest border border-transparent hover:border-primary/10"
        >
          <div className="flex items-center space-x-3">
            <Globe size={16} />
            <span>Public Site</span>
          </div>
          <ExternalLink size={14} />
        </Link>
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-3 w-full px-4 py-3 text-red-500/60 hover:text-red-500 transition-colors text-xs uppercase tracking-widest border border-transparent hover:border-red-500/10"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
