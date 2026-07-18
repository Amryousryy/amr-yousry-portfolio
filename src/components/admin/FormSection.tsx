"use client";

import React from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  accent?: boolean;
}

export default function FormSection({ title, description, children, accent = false }: FormSectionProps) {
  return (
    <section className={`relative pl-4 border-l-2 ${accent ? "border-accent/60" : "border-primary/15"}`}>
      <div className="space-y-4">
        <div>
          <h2 className={`text-xs font-bold uppercase tracking-widest ${accent ? "text-accent" : "text-foreground/70"}`}>
            {title}
          </h2>
          {description && (
            <p className="text-[11px] text-foreground/40 mt-1 leading-relaxed">{description}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
