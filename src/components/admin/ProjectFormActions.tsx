"use client";

import {
  Loader2,
  Save,
  Clock,
  Send,
  Eye,
  EyeOff,
  Globe,
  AlertTriangle,
} from "lucide-react";
import type { SaveStateResult } from "@/lib/projects/save-state";
import type { DeploymentState } from "@/types/project";
import DeploymentStatusInline from "@/components/admin/DeploymentStatusInline";

interface ProjectFormActionsProps {
  isEditMode: boolean;
  isPublished: boolean;
  pending: boolean;
  saveState: SaveStateResult;
  onSaveDraft: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onPreview: () => void;
  onViewLive: () => void;
  deployment?: { state?: DeploymentState | null; error?: string } | null;
  deploymentRetrying?: boolean;
  onRetryDeployment?: () => void;
  canViewLive?: boolean;
}

const saveStateTextColor: Record<SaveStateResult["tone"], string> = {
  muted: "text-foreground/35",
  active: "text-accent",
  warning: "text-[var(--color-warning)]",
  danger: "text-red-400",
};

export default function ProjectFormActions({
  isEditMode,
  isPublished,
  pending,
  saveState,
  onSaveDraft,
  onPublish,
  onUnpublish,
  onPreview,
  onViewLive,
  deployment,
  deploymentRetrying = false,
  onRetryDeployment,
  canViewLive = true,
}: ProjectFormActionsProps) {
  const saveStateIcon = saveState.tone === "active" ? (
    <Loader2 className="animate-spin" size={11} />
  ) : saveState.tone === "warning" || saveState.tone === "danger" ? (
    <AlertTriangle size={11} />
  ) : (
    <Clock size={11} />
  );

  const secondaryBtn =
    "flex flex-wrap items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 border border-primary/20 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:border-accent/40 hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-primary/15 -mx-6 px-6 -mt-6 mb-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <span
            className={`font-pixel text-[9px] sm:text-[10px] uppercase tracking-widest px-2 py-1 ${
              isPublished ? "text-emerald-300 bg-emerald-400/10 border border-emerald-400/30" : "text-foreground/70 bg-primary/15 border border-primary/25"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </span>
          <span className={`text-[11px] flex items-center gap-1.5 ${saveStateTextColor[saveState.tone]}`}>
            {saveStateIcon}
            {saveState.label}
          </span>
          {isPublished && deployment?.state && (
            <DeploymentStatusInline
              state={deployment.state}
              error={deployment.error}
              isRetrying={deploymentRetrying}
              onRetry={
                onRetryDeployment && deployment.state === "failed"
                  ? onRetryDeployment
                  : undefined
              }
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onPreview}
            disabled={pending || !isEditMode}
            title={isEditMode ? "Open the current saved project in a new tab" : "Save the project before previewing"}
            aria-label="Preview project"
            className={secondaryBtn}
          >
            <Eye size={13} />
            <span className="hidden sm:inline">Preview</span>
          </button>

          {isPublished ? (
            <>
              <button
                type="button"
                onClick={onViewLive}
                disabled={pending || !canViewLive}
                title={canViewLive ? "Open the live published page in a new tab" : "Deployment is still in progress. The live link becomes available once the build completes."}
                aria-label="View live project"
                className={secondaryBtn}
              >
                <Globe size={13} />
                <span className="hidden sm:inline">View Live</span>
              </button>
              <button
                type="button"
                onClick={onUnpublish}
                disabled={pending}
                title="Move this project back to draft (hidden from the public site)"
                aria-label="Unpublish project"
                className={`${secondaryBtn} hover:!border-yellow-400/40 hover:!text-yellow-400`}
              >
                <EyeOff size={13} />
                <span className="hidden sm:inline">Unpublish</span>
              </button>
              <button
                type="button"
                onClick={onSaveDraft}
                disabled={pending}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-accent text-on-accent text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save size={13} />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onPublish}
                disabled={pending}
                title="Publish this project so it becomes publicly visible"
                aria-label="Publish project"
                className={`${secondaryBtn} hover:!border-emerald-400/40 hover:!text-emerald-400`}
              >
                <Send size={13} />
                <span className="hidden sm:inline">Publish</span>
              </button>
              <button
                type="button"
                onClick={onSaveDraft}
                disabled={pending}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-accent text-on-accent text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save size={13} />
                <span>Save Draft</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}