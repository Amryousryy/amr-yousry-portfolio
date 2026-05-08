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
    <Tag className={cn("max-w-7xl mx-auto px-8 md:px-16", className)}>
      {children}
    </Tag>
  );
}
