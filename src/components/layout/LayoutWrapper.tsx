"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import FloatingCTA from "@/components/ui/FloatingCTA";
import LoadingScreen from "@/components/ui/LoadingScreen";
import SmoothScroll from "@/components/ui/SmoothScroll";
import dynamic from "next/dynamic";
import "@/styles/pixel-system.css";

const CinematicCursor = dynamic(() => import("@/components/ui/CinematicCursor"), {
  ssr: false,
});

const SceneCanvas = dynamic(() => import("@/components/three/FilmStudioIsland"), {
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
      <SceneCanvas />
      <CinematicCursor />
      <LoadingScreen />
      <SmoothScroll>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingCTA />
      </SmoothScroll>
      <div className="film-grain" />
    </>
  );
}