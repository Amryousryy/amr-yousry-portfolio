"use client";

import { Loader2, RefreshCw } from "lucide-react";
import type { DeploymentState } from "@/types/project";
import DeploymentStatusBadge from "@/components/admin/DeploymentStatusBadge";
import { deploymentStateLabel } from "@/lib/projects/deployment-status";

interface DeploymentStatusInlineProps {
  state?: DeploymentState | null;
  error?: string;
  isRetrying?: boolean;
  onRetry?: () => void;
}

export default function DeploymentStatusInline({
  state,
  error,
  isRetrying = false,
  onRetry,
}: DeploymentStatusInlineProps) {
  if (!state) return null;

  const label = deploymentStateLabel(state);

  return (
    <div
      className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0"
      role="status"
      aria-live="polite"
      aria-label={`Deployment status: ${label}`}
    >
      <DeploymentStatusBadge state={state} />
      {state === "failed" && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          aria-label="Retry deployment"
          aria-busy={isRetrying}
          title="Retry the build and deployment for this project"
          className="flex items-center gap-1.5 px-2 py-1 border border-red-400/40 text-red-400/90 text-[10px] font-bold uppercase tracking-widest hover:bg-red-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRetrying ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
          <span>Retry</span>
        </button>
      )}
      {state === "failed" && error && (
        <span
          className="text-[10px] text-foreground/40 min-w-0 max-w-[320px] truncate"
          title={error}
        >
          {error}
        </span>
      )}
    </div>
  );
}