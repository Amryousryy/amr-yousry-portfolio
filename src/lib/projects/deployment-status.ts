import type { DeploymentState } from "@/types/project";

export const DEPLOYMENT_POLL_INTERVAL_MS = 4000;

export const DEPLOYMENT_STATE_LABELS: Record<DeploymentState, string> = {
  not_required: "No Deployment Required",
  pending: "Deployment Pending",
  deploying: "Deploying",
  live: "Live",
  failed: "Deployment Failed",
};

export function deploymentStateLabel(state?: DeploymentState | null): string {
  return state ? DEPLOYMENT_STATE_LABELS[state] : "Deployment Status";
}

export function shouldPollDeployment(state?: DeploymentState | null): boolean {
  return state === "pending" || state === "deploying";
}

export function isDeploymentBlockingLive(state?: DeploymentState | null): boolean {
  return state === "pending" || state === "deploying" || state === "failed";
}