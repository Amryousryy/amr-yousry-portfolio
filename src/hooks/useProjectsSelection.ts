"use client";

import { useCallback, useState } from "react";

export function useProjectsSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const allSelected = ids.length > 0 && ids.every((id) => prev.has(id));
      if (allSelected) {
        return new Set();
      }
      return new Set(ids);
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const removeByIds = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        next.delete(id);
      }
      return next;
    });
  }, []);

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    isSelected: (id: string) => selectedIds.has(id),
    isAllSelected: (ids: string[]) => ids.length > 0 && ids.every((id) => selectedIds.has(id)),
    isIndeterminate: (ids: string[]) => {
      const selected = ids.filter((id) => selectedIds.has(id));
      return selected.length > 0 && selected.length < ids.length;
    },
    toggleRow,
    toggleAll,
    clearSelection,
    removeByIds,
    selectedArray: Array.from(selectedIds),
  };
}
