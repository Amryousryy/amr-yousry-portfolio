"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import FloatingCTA from "@/components/ui/FloatingCTA";
import LoadingScreen from "@/components/ui/LoadingScreen";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CinematicCursor from "@/components/ui/CinematicCursor";
import PageTransition from "@/components/ui/PageTransition";
import dynamic from "next/dynamic";

const SceneProvider = dynamic(() => import("@/components/three/SceneProvider"), {
  ssr: false,
});

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <SceneProvider />
      <CinematicCursor />
      <LoadingScreen />
      <PageTransition>
        <SmoothScroll>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingCTA />
        </SmoothScroll>
      </PageTransition>
    </>
  );
}