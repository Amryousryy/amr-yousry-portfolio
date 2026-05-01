import { cn } from "@/lib/utils";
import React from "react";

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function PixelButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: PixelButtonProps) {
  const variants = {
    primary: "bg-brand-cyan text-brand-blue border-brand-blue border-b-4 border-r-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:border-b-2 hover:border-r-2 active:translate-x-[4px] active:translate-y-[4px] active:border-b-0 active:border-r-0",
    secondary: "bg-brand-purple text-white border-brand-blue border-b-4 border-r-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:border-b-2 hover:border-r-2 active:translate-x-[4px] active:translate-y-[4px] active:border-b-0 active:border-r-0",
    outline: "bg-transparent border-4 border-slate-800 hover:bg-slate-800 text-text-dim hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-4 text-base",
    lg: "px-10 py-6 text-lg",
  };

  return (
    <button
      className={cn(
        "font-pixel uppercase transition-all duration-75 relative inline-block",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
