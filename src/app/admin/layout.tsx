import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // This layout is for everything inside /admin, but we must exclude /admin/login
  // Since this is a server component, we need a different approach or move the login page
  // Actually, standard Next.js pattern is to have login in a separate layout or route.
  
  // Checking path in a server layout is difficult/impossible directly.
  // Move /admin/login to /login instead.
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex" style={{ position: 'relative', zIndex: 1 }}>
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto" style={{ position: 'relative', zIndex: 1 }}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}