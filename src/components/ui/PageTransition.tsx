"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, children, isClient]);

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  if (!isClient) return <>{children}</>;

  return (
    <>
      <div
        className={`fixed inset-0 z-[9999] bg-[#050508] pointer-events-none transition-transform duration-300 ${
          isTransitioning ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden="true"
      />
      <div
        className={`fixed inset-0 z-[9998] bg-black pointer-events-none transition-opacity duration-400 ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: "400ms" }}
        aria-hidden="true"
      />
      {displayChildren}
    </>
  );
}
