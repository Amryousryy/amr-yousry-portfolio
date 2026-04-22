"use client";

import React from "react";

export default function AdminLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-primary/20 rounded"></div>
          <div className="h-10 w-48 bg-primary/20 rounded"></div>
        </div>
        <div className="h-12 w-32 bg-primary/20 rounded pixel-border"></div>
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-primary/5 border border-primary/10 p-6 flex gap-8">
            <div className="w-48 aspect-video bg-primary/20 rounded pixel-border"></div>
            <div className="flex-1 space-y-3 pt-2">
              <div className="h-6 w-3/4 bg-primary/20 rounded"></div>
              <div className="h-4 w-1/2 bg-primary/20 rounded"></div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-primary/20 rounded"></div>
                <div className="h-6 w-20 bg-primary/20 rounded"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-primary/20 rounded"></div>
              <div className="h-10 w-10 bg-primary/20 rounded"></div>
              <div className="h-10 w-10 bg-primary/20 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminCardSkeleton() {
  return (
    <div className="bg-primary/5 border border-primary/10 p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 w-3/4 bg-primary/20 rounded"></div>
        <div className="h-4 w-1/2 bg-primary/20 rounded"></div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-primary/20 rounded"></div>
          <div className="h-6 w-20 bg-primary/20 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-primary/5 border border-primary/10 flex items-center px-4 animate-pulse">
          <div className="flex-1 h-4 bg-primary/20 rounded"></div>
          <div className="w-24 h-4 bg-primary/20 rounded ml-4"></div>
          <div className="w-24 h-4 bg-primary/20 rounded ml-4"></div>
        </div>
      ))}
    </div>
  );
}