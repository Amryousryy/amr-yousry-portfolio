"use client";

import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: any;
}

export function Container({ children, className, as: Component = "div" }: ContainerProps) {
  const Tag = Component as any;
  return (
    <Tag className={cn("w-full max-w-7xl min-w-0 mx-auto px-4 sm:px-6 md:px-16", className)}>
      {children}
    </Tag>
  );
}
