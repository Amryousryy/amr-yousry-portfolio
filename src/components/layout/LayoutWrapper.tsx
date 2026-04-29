"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import FloatingCTA from "@/components/ui/FloatingCTA";
import LoadingScreen from "@/components/ui/LoadingScreen";
import "@/styles/pixel-system.css";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingCTA />
      <div className="film-grain" />
    </>
  );
}