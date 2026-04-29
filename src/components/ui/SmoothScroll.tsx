"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

export default function SmoothScroll({ children }: { children: any }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.15,
        duration: 0.8,
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
