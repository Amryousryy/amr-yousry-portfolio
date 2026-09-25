"use client";

import type { DeploymentState } from "@/types/project";
import { deploymentStateLabel } from "@/lib/projects/deployment-status";

interface DeploymentStatusBadgeProps {
  state?: DeploymentState | null;
  className?: string;
}

const stateDotClass: Record<DeploymentState, string> = {
  live: "bg-[var(--color-success)] shadow-[var(--shadow-glow-emerald)]",
  deploying: "bg-accent animate-pulse",
  pending: "bg-[var(--color-warning)] animate-pulse",
  failed: "bg-red-400 shadow-[var(--shadow-glow-red)]",
  not_required: "bg-foreground/30",
};

const stateTextClass: Record<DeploymentState, string> = {
  live: "text-[var(--color-success)]/90",
  deploying: "text-accent/90",
  pending: "text-[var(--color-warning)]/90",
  failed: "text-red-400/90",
  not_required: "text-foreground/45",
};

export default function DeploymentStatusBadge({
  state,
  className = "",
}: DeploymentStatusBadgeProps) {
  if (!state) return null;
  const label = deploymentStateLabel(state);
  return (
    <span
      className={`inline-flex items-center gap-1.5 shrink-0 ${className}`}
      aria-label={`Deployment status: ${label}`}
      title={label}
    >
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${stateDotClass[state]}`} />
      <span className={`text-[10px] uppercase tracking-wider ${stateTextClass[state]}`}>
        {label}
      </span>
    </span>
  );
}

interface DeploymentStatusCellProps {
  status?: string | null;
  deployment?: { state?: DeploymentState | null } | null;
}

export function DeploymentStatusCell({ status, deployment }: DeploymentStatusCellProps) {
  if (status !== "published" || !deployment?.state) {
    return <span className="text-foreground/25">—</span>;
  }
  return <DeploymentStatusBadge state={deployment.state} />;
}