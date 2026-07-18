"use client";

import React from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormField({ label, required, error, description, htmlFor, children, className = "" }: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block text-[11px] font-medium text-foreground/60 mb-1.5"
      >
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-[10px] text-[var(--color-danger-light)] mt-1">{error}</p>
      )}
      {description && !error && (
        <p className="text-[10px] text-foreground/35 mt-1">{description}</p>
      )}
    </div>
  );
}

const inputClasses = "w-full bg-background/50 border border-primary/20 px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors placeholder:text-foreground/25";

export function FormInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClasses} ${className || ""}`} />;
}

export function FormTextarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClasses} resize-none ${className || ""}`} />;
}

export function FormSelect({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputClasses} appearance-none ${className || ""}`}>
      {children}
    </select>
  );
}
