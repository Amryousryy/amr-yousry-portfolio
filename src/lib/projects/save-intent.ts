/**
 * Project save-intent resolution.
 *
 * The action bar drives project status through explicit intents rather than a
 * raw status dropdown. This module is the single source of truth for how an
 * intent maps to the persisted status and whether the readiness gate applies.
 *
 *   save-draft   -> status is forced to "draft" (a draft can never be
 *                   published by accident, and re-saving a draft never
 *                   triggers the readiness gate)
 *   save-changes -> keeps the persisted status (used for projects that are
 *                   ALREADY published; edits persist without re-running the
 *                   full publish gate so fixes never get blocked by unrelated
 *                   recommendations)
 *   publish      -> status is forced to "published" + strict readiness gate
 *
 * The strict readiness gate only belongs to the PUBLISHING action. Saving an
 * already-published project persists the edit directly; warnings and
 * recommended improvements can be addressed at the owner's own pace.
 *
 * The form's internal status field is intentionally ignored here: the only
 * path to publish or unpublish is the explicit action in the sticky bar.
 */

export type ProjectSaveIntent = "save-draft" | "save-changes" | "publish";
export type PersistedProjectStatus = "draft" | "published";

/** Resolves the persisted status a save intent should produce. */
export function resolveSaveStatus(
  currentStatus: PersistedProjectStatus,
  intent: ProjectSaveIntent,
): PersistedProjectStatus {
  switch (intent) {
    case "publish":
      return "published";
    case "save-draft":
      return "draft";
    case "save-changes":
      return currentStatus;
  }
}

/** True when a save must pass the publish-readiness gate before persisting. */
export function shouldRunReadinessCheck(intent: ProjectSaveIntent): boolean {
  return intent === "publish";
}