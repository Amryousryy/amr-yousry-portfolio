import { describe, it, expect } from "vitest";
import { resolveSaveState } from "@/lib/projects/save-state";

describe("resolveSaveState", () => {
  it("reports an in-flight save with the active tone first", () => {
    expect(resolveSaveState({ isSaving: true, hasSaveError: true, isDirty: true, lastSaved: "10:00" })).toEqual({
      label: "Saving…",
      tone: "active",
    });
  });

  it("reports a failed save persistently until dismissed", () => {
    expect(resolveSaveState({ isSaving: false, hasSaveError: true, isDirty: true, lastSaved: "10:00" })).toEqual({
      label: "Save failed",
      tone: "danger",
    });
  });

  it("reports unsaved changes while the form diverges from the saved baseline", () => {
    expect(resolveSaveState({ isSaving: false, hasSaveError: false, isDirty: true, lastSaved: "10:00" })).toEqual({
      label: "Unsaved changes",
      tone: "warning",
    });
  });

  it("shows the saved timestamp once clean and previously saved", () => {
    expect(resolveSaveState({ isSaving: false, hasSaveError: false, isDirty: false, lastSaved: "10:32" })).toEqual({
      label: "Saved at 10:32",
      tone: "muted",
    });
  });

  it("falls back to a neutral message when the editor has never saved", () => {
    expect(resolveSaveState({ isSaving: false, hasSaveError: false, isDirty: false, lastSaved: null })).toEqual({
      label: "All changes saved",
      tone: "muted",
    });
  });
});