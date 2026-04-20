"use client";

import React from "react";

interface BilingualInputProps {
  label: string;
  value: { en: string; ar: string };
  onChange: (value: { en: string; ar: string }) => void;
  type?: "text" | "textarea";
  required?: boolean;
  rows?: number;
}

export default function BilingualInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  rows = 4
}: BilingualInputProps) {
  const handleChange = (lang: "en" | "ar", val: string) => {
    onChange({ ...value, [lang]: val });
  };

  const InputComponent = type === "textarea" ? "textarea" : "input";

  return (
    <div className="space-y-4">
      <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">
        {label}
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* English Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase text-foreground/40">English</span>
          </div>
          <InputComponent
            required={required}
            value={value.en}
            onChange={(e: any) => handleChange("en", e.target.value)}
            rows={rows}
            className="w-full bg-primary/5 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm"
            placeholder={`Enter ${label} in English...`}
          />
        </div>

        {/* Arabic Input */}
        <div className="space-y-2" dir="rtl">
          <div className="flex justify-between items-center" dir="ltr">
            <span className="text-[10px] font-bold uppercase text-foreground/40">Arabic</span>
          </div>
          <InputComponent
            required={required}
            value={value.ar}
            onChange={(e: any) => handleChange("ar", e.target.value)}
            rows={rows}
            className="w-full bg-primary/5 border border-primary/20 p-4 outline-none focus:border-accent transition-colors text-sm font-sans"
            placeholder={`أدخل ${label} باللغة العربية...`}
          />
        </div>
      </div>
    </div>
  );
}
