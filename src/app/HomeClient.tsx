"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "@/styles/pixel-system.css";

const SceneCanvas = dynamic(() => import("@/components/three/SceneCanvas"), {
  ssr: false,
});
const CinematicCursor = dynamic(() => import("@/components/ui/CinematicCursor"), {
  ssr: false,
});
const LoadingScreen = dynamic(() => import("@/components/ui/LoadingScreen"), {
  ssr: false,
});

export default function HomeClient() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="bg-[#050508] min-h-screen selection:bg-teal-500/30 selection:text-teal-200 overflow-hidden">
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      
      <CinematicCursor />
      
      {/* 3D Scene + Scrollable Content */}
      <SceneCanvas />
    </main>
  );
}
