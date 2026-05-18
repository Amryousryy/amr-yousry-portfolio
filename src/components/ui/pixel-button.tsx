import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  href?: string;
}

export function PixelButton({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: PixelButtonProps) {
  const variants = {
    primary: "bg-brand-cyan text-brand-blue border-brand-blue border-b-4 border-r-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:border-b-2 hover:border-r-2 active:translate-x-[4px] active:translate-y-[4px] active:border-b-0 active:border-r-0",
    secondary: "bg-brand-purple text-white border-brand-blue border-b-4 border-r-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:border-b-2 hover:border-r-2 active:translate-x-[4px] active:translate-y-[4px] active:border-b-0 active:border-r-0",
    outline: "bg-transparent border-2 border-slate-800 hover:bg-slate-800 text-text-dim hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-4 text-base",
    lg: "px-10 py-6 text-lg",
  };

  const classes = cn(
    "font-pixel uppercase transition-all duration-75 relative inline-flex min-h-[44px] max-w-full items-center justify-center text-center leading-tight whitespace-normal break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    const isAnchor = href.startsWith("#");
    const isInternal = href.startsWith("/") && !isAnchor;

    if (isAnchor) {
      return (
        <a href={href} className={classes} {...props as React.AnchorHTMLAttributes<HTMLAnchorElement>}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
