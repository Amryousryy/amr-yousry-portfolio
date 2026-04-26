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
  
  if (!session) {
    redirect("/admin/login");
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