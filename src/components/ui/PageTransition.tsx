"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 400);
    
    return () => clearTimeout(timer);
  }, [pathname, children]);

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[9999] bg-[#050508] pointer-events-none transition-transform duration-300 ${
          isTransitioning ? "translate-y-0" : "translate-y-full"
        }`}
      />
      <div
        className={`fixed inset-0 z-[9998] bg-black pointer-events-none transition-opacity duration-400 ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: "400ms" }}
      />
      {displayChildren}
    </>
  );
}