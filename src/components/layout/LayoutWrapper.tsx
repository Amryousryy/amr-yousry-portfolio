"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import FloatingCTA from "@/components/ui/FloatingCTA";
import MobileStickyCTA from "@/components/ui/MobileStickyCTA";
import LoadingScreen from "@/components/ui/PremiumLoadingScreen";
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
      <main className="min-h-screen pb-20 md:pb-0">{children}</main>
      <Footer />
      <FloatingCTA />
      <MobileStickyCTA />
      <div className="film-grain" />
    </>
  );
}