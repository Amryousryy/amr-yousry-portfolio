"use client";

import React from "react";

export interface FormFieldProps {
  name: string;
  label: string;
  error?: { message?: string };
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
}

export function FormField({ name, label, error, required, helperText, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-xs font-bold uppercase tracking-widest text-foreground/70"
      >
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      {children}
      {error?.message && (
        <p className="text-[10px] text-red-500">{error.message}</p>
      )}
      {helperText && !error?.message && (
        <p className="text-[10px] text-foreground/40">{helperText}</p>
      )}
    </div>
  );
}

export interface BilingualInputProps {
  name: string;
  label?: string;
  errorEn?: { message?: string };
  errorAr?: { message?: string };
  required?: boolean;
  register: any;
}

export function BilingualInput({ name, label, errorEn, errorAr, required, register }: BilingualInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-widest text-foreground/70">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-foreground/40 mb-1 block">EN</span>
          <input
            {...register(`${name}.en`)}
            className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors text-sm"
            placeholder="English"
          />
          {errorEn?.message && (
            <p className="text-[10px] text-red-500 mt-1">{errorEn.message}</p>
          )}
        </div>
        <div>
          <span className="text-[10px] text-foreground/40 mb-1 block">AR</span>
          <input
            {...register(`${name}.ar`)}
            className="w-full bg-background/50 border border-primary/20 p-3 outline-none focus:border-accent transition-colors text-sm"
            placeholder="العربية"
            dir="rtl"
          />
          {errorAr?.message && (
            <p className="text-[10px] text-red-500 mt-1">{errorAr.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export interface SubmitButtonProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  label?: string;
  loadingLabel?: string;
}

export function SubmitButton({
  isLoading,
  isDisabled,
  label = "Submit",
  loadingLabel = "Saving...",
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || isDisabled}
      className="w-full py-4 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? loadingLabel : label}
    </button>
  );
}