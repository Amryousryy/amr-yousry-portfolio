/**
 * Persistent save-state label resolution for the editorial action bar.
 *
 * A pure function so the exact text and tone the user sees in the sticky bar
 * ("Saving…", "Unsaved changes", "Save failed", "Saved at …") is unit-testable
 * without rendering React.
 */

export type SaveStateTone = "muted" | "active" | "warning" | "danger";

export interface SaveStateInput {
  isSaving: boolean;
  hasSaveError: boolean;
  isDirty: boolean;
  lastSaved?: string | null;
}

export interface SaveStateResult {
  label: string;
  tone: SaveStateTone;
}

export function resolveSaveState({
  isSaving,
  hasSaveError,
  isDirty,
  lastSaved,
}: SaveStateInput): SaveStateResult {
  if (isSaving) {
    return { label: "Saving…", tone: "active" };
  }
  if (hasSaveError) {
    return { label: "Save failed", tone: "danger" };
  }
  if (isDirty) {
    return { label: "Unsaved changes", tone: "warning" };
  }
  if (lastSaved) {
    return { label: `Saved at ${lastSaved}`, tone: "muted" };
  }
  return { label: "All changes saved", tone: "muted" };
}