"use client";

import { Loader2 } from "lucide-react";

export default function AdminLoadingSpinner() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2 className="animate-spin text-accent" size={48} />
    </div>
  );
}
