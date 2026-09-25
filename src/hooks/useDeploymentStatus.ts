"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectService } from "@/lib/api-client";
import type { DeploymentOutcome, ReconciliationResult } from "@/lib/deployment/lifecycle";
import type { DeploymentState, ProjectDeployment } from "@/types/project";
import {
  DEPLOYMENT_POLL_INTERVAL_MS,
  shouldPollDeployment,
} from "@/lib/projects/deployment-status";

export function deploymentQueryKey(id: string) {
  return ["project", id, "deployment"] as const;
}

type DeploymentStatusView = DeploymentOutcome | ProjectDeployment | null;

interface UseDeploymentStatusOptions {
  enabled?: boolean;
  initialDeployment?: Pick<ProjectDeployment, "state" | "error"> | null;
}

export interface UseDeploymentStatusResult {
  deployment: DeploymentStatusView;
  state?: DeploymentState;
  warning?: string;
  resetForUnpublished?: boolean;
  liveApplied?: boolean;
  isPolling: boolean;
  isRetrying: boolean;
  retry: () => void;
  refetch: () => void;
}

/**
 * Live deployment status for a single project. Polls GET
 * /api/projects/[id]/deployment only while the deployment is in-flight
 * (pending/deploying) and exposes a guarded POST …/deployment/retry action for
 * failed deployments. Publish/unpublish toggles `enabled` to start/stop
 * polling. No Vercel credentials or build details are ever shown here.
 */
export function useDeploymentStatus(
  id?: string | null,
  options: UseDeploymentStatusOptions = {}
): UseDeploymentStatusResult {
  const queryClient = useQueryClient();
  const { enabled = true, initialDeployment = null } = options;
  const projectId = id ?? "";

  const query = useQuery({
    queryKey: deploymentQueryKey(projectId),
    queryFn: async () => {
      const { data, error } = await ProjectService.getDeployment(projectId);
      if (error) throw new Error(error);
      return data as ReconciliationResult | undefined;
    },
    enabled: !!projectId && enabled,
    refetchInterval: (q) =>
      shouldPollDeployment(q.state.data?.deployment?.state) ? DEPLOYMENT_POLL_INTERVAL_MS : false,
    refetchIntervalInBackground: false,
    retry: 1,
  });

  const retryMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await ProjectService.retryDeployment(projectId);
      if (error) throw new Error(error);
      return data as DeploymentOutcome | undefined;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to retry deployment");
    },
  });

  const retry = useCallback(() => {
    if (!projectId || retryMutation.isPending) return;
    retryMutation.mutate(undefined, {
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: deploymentQueryKey(projectId) });
      },
    });
  }, [projectId, retryMutation, queryClient]);

  const refetch = useCallback(() => {
    if (!projectId) return;
    queryClient.invalidateQueries({ queryKey: deploymentQueryKey(projectId) });
  }, [projectId, queryClient]);

  const data = query.data;
  const deployment: DeploymentStatusView = data?.deployment ?? initialDeployment ?? null;
  const state = deployment?.state;
  const isPolling = shouldPollDeployment(state);

  return {
    deployment,
    state,
    warning: data?.warning,
    resetForUnpublished: data?.resetForUnpublished,
    liveApplied: data?.liveApplied,
    isPolling,
    isRetrying: retryMutation.isPending,
    retry,
    refetch,
  };
}