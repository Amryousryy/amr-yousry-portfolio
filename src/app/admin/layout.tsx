import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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