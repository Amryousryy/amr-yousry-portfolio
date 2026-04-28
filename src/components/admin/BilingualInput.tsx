"use client";

import React from "react";

interface StringInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "textarea";
  required?: boolean;
  rows?: number;
  error?: string;
  placeholder?: string;
}

export default function StringInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  rows = 4,
  error,
  placeholder
}: StringInputProps) {
  const InputComponent = type === "textarea" ? "textarea" : "input";

  return (
    <div className="space-y-2">
      <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">
        {label}
      </label>
      <InputComponent
        required={required}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-primary/5 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm"
        placeholder={placeholder || `Enter ${label}...`}
      />
      {error && (
        <p className="text-[10px] text-red-500">{error}</p>
      )}
    </div>
  );
}