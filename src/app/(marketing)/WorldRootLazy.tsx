"use client";

import dynamic from "next/dynamic";

const WorldRoot = dynamic(() => import("@/components/world/WorldRoot"), {
  ssr: false,
  loading: () => null,
});

export default WorldRoot;
