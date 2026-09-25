"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminLoadingSpinner from "@/components/admin/AdminLoadingSpinner";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/lib/api-client";
import { toast } from "sonner";
import { Project } from "@/types";
import ProjectEditor from "@/components/admin/ProjectEditor";
import { useSaveWithTimeout } from "@/hooks/useSaveWithTimeout";

interface SaveEventHandlers {
  markSaved: () => void;
  markFailed: (message: string) => void;
}

export default function EditProjectPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const saveEventsRef = useRef<SaveEventHandlers | null>(null);
  const { saveTimeoutConfig, syncResetMutation } = useSaveWithTimeout();

  const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await ProjectService.getById(id as string, true);
      if (error) throw new Error(error);
      return data as Project;
    },
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: ({ data }: { data: Partial<Project>; isAutoSave?: boolean }) => {
      return ProjectService.update(id as string, data);
    },
    ...saveTimeoutConfig,
    onSuccess: (_, variables) => {
      saveTimeoutConfig.onSuccess();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["project", id, "deployment"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
      setLastSaved(new Date().toLocaleTimeString());
      // Stay in the editor: release the unsaved-changes guard and clear the
      // action-bar error state so the saved baseline is immediately clean.
      saveEventsRef.current?.markSaved();

      if (!variables.isAutoSave) {
        toast.success("Project updated successfully!");
      }
    },
    onError: (error: Error, variables) => {
      saveTimeoutConfig.onError();
      saveEventsRef.current?.markFailed(error.message || "Failed to update project");
      if (!variables.isAutoSave) {
        toast.error(error.message || "Failed to update project");
      } else {
        console.error("Auto-save failed:", error);
      }
    }
  });

  useEffect(() => {
    syncResetMutation(() => mutation.reset());
  }, [mutation, syncResetMutation]);

  if (isLoading) {
    return <AdminLoadingSpinner />;
  }

  if (isError || !project) {
    return (
      <div className="space-y-6">
        <header className="mb-12">
          <Link href="/admin" className="flex items-center space-x-2 text-accent group mb-4">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="pixel-text text-[10px] uppercase">Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">Edit Project</h1>
        </header>
        <div className="border border-red-500/30 bg-red-500/10 p-8 text-center space-y-3">
          <p className="text-lg font-bold text-red-400 uppercase tracking-wider">Project Not Found</p>
          <p className="text-sm text-foreground/60">
            {(error as Error)?.message || "The project could not be loaded. It may have been deleted or you may not have permission to view it."}
          </p>
          <Link
            href="/admin/projects"
            className="inline-block px-6 py-3 bg-accent text-on-accent text-xs font-bold uppercase tracking-widest mt-4"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <Link href="/admin" className="flex items-center space-x-2 text-accent group mb-4">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="pixel-text text-[10px] uppercase">Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">Edit Project</h1>
        </div>
      </header>

      <ProjectEditor 
        initialData={project}
        onSave={(data, options) => mutation.mutate({ data: data as Partial<Project>, isAutoSave: options?.isAutoSave })} 
        isSaving={mutation.isPending}
        lastSaved={lastSaved}
        registerSaveEvents={(handlers) => {
          saveEventsRef.current = handlers;
        }}
      />
    </div>
  );
}
