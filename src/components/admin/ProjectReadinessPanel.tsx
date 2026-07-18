"use client";

import { AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import type { ReadinessResult, ReadinessIssue } from "@/lib/validation/project-readiness";

interface Props {
  result: ReadinessResult;
  onClose?: () => void;
}

function severityIcon(severity: ReadinessIssue["severity"]) {
  switch (severity) {
    case "blocking": return <AlertCircle size={14} className="text-[var(--color-danger)] shrink-0 mt-0.5" />;
    case "warning": return <AlertTriangle size={14} className="text-[var(--color-warning)] shrink-0 mt-0.5" />;
    case "info": return <Info size={14} className="text-foreground/40 shrink-0 mt-0.5" />;
  }
}

function severityBorder(severity: ReadinessIssue["severity"]) {
  switch (severity) {
    case "blocking": return "border-l-[var(--color-danger)]/50";
    case "warning": return "border-l-[var(--color-warning)]/50";
    case "info": return "border-l-foreground/20";
  }
}

export default function ProjectReadinessPanel({ result, onClose }: Props) {
  if (result.issues.length === 0) return null;

  const blocking = result.issues.filter(i => i.severity === "blocking");
  const warnings = result.issues.filter(i => i.severity === "warning");

  return (
    <div className="border border-primary/10 bg-primary/5 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {result.isPublishReady ? (
            <AlertTriangle size={16} className="text-[var(--color-warning)]" />
          ) : (
            <AlertCircle size={16} className="text-[var(--color-danger)]" />
          )}
          <span className={`text-xs font-bold uppercase tracking-wider ${result.isPublishReady ? "text-[var(--color-warning)]" : "text-[var(--color-danger)]"}`}>
            {result.isPublishReady ? "Publish Ready" : "Needs Attention"}
          </span>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="text-foreground/30 hover:text-foreground/60">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex gap-4 text-[10px] text-foreground/60">
        {blocking.length > 0 && (
          <span className="text-[var(--color-danger-light)]">{blocking.length} blocking</span>
        )}
        {warnings.length > 0 && (
          <span className="text-[var(--color-warning)]">{warnings.length} warning{warnings.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      <div className="space-y-1 max-h-48 overflow-y-auto">
        {result.issues.map((issue, idx) => (
          <div key={idx} className={`flex items-start gap-2 text-[10px] py-1 pl-2 border-l-2 ${severityBorder(issue.severity)}`}>
            {severityIcon(issue.severity)}
            <div>
              <span className="text-foreground/90">{issue.message}</span>
              <span className="text-foreground/30 ml-1">({issue.field})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
