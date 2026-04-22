"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface AdminErrorStateProps {
  message?: string;
  onRetry?: () => void;
  title?: string;
}

export default function AdminErrorState({ 
  message = "Something went wrong", 
  onRetry,
  title = "Error" 
}: AdminErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={32} className="text-red-500" />
      </div>
      <h2 className="text-xl font-display font-bold uppercase tracking-tight mb-2">{title}</h2>
      <p className="text-foreground/50 text-sm mb-6 text-center max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-6 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-all"
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}