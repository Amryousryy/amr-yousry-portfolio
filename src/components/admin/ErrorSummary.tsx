"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { FieldErrors } from "react-hook-form";

interface ErrorSummaryProps {
  errors: Record<string, unknown>;
  title?: string;
}

function getAllErrors(errors: Record<string, unknown>, prefix = ""): string[] {
  const messages: string[] = [];
  
  for (const [key, value] of Object.entries(errors)) {
    const path = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === "object") {
      if ("message" in value && typeof (value as any).message === "string" && (value as any).message) {
        messages.push((value as any).message);
      } else {
        messages.push(...getAllErrors(value as Record<string, unknown>, path));
      }
    }
  }
  
  return messages;
}

export function ErrorSummary({ errors, title = "Please fix the following errors:" }: ErrorSummaryProps) {
  const errorMessages = getAllErrors(errors);
  
  if (errorMessages.length === 0) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 animate-in slide-in-from-top-2">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
        <div>
          <h4 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-2">{title}</h4>
          <ul className="space-y-1">
            {errorMessages.slice(0, 5).map((msg, index) => (
              <li key={index} className="text-xs text-red-400">
                • {msg}
              </li>
            ))}
            {errorMessages.length > 5 && (
              <li className="text-xs text-red-400 italic">
                And {errorMessages.length - 5} more errors...
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function scrollToFirstError(errors: Record<string, unknown>) {
  const errorMessages = getAllErrors(errors);
  if (errorMessages.length > 0) {
    const firstErrorElement = document.querySelector(".text-red-500:not(:empty)");
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}