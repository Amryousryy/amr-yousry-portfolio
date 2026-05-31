"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/lib/api-client";
import { toast } from "sonner";
import { Project } from "@/types";
import ProjectEditor from "@/components/admin/ProjectEditor";

const SAVE_TIMEOUT_MS = 30_000;

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const clearSaveTimeout = useCallback(() => {
    if (saveTimeoutRef.current !== null) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearSaveTimeout();
    };
  }, [clearSaveTimeout]);

  const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await ProjectService.getById(id as string, true);
      if (error) throw new Error(error);
      return data as Project;
    },
    enabled: !!id,
  });

  const resetMutationRef = useRef<() => void>(() => {});

  const mutation = useMutation({
    mutationFn: ({ data }: { data: Partial<Project>; isAutoSave?: boolean }) =>
      ProjectService.update(id as string, data),
    onMutate: () => {
      clearSaveTimeout();
      saveTimeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        saveTimeoutRef.current = null;
        resetMutationRef.current();
        toast.error("Save timed out. Please try again.");
      }, SAVE_TIMEOUT_MS);
    },
    onSuccess: (_, variables) => {
      clearSaveTimeout();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      setLastSaved(new Date().toLocaleTimeString());
      
      if (!variables.isAutoSave) {
        toast.success("Project updated successfully!");
        router.push("/admin");
      }
    },
    onError: (error: Error, variables) => {
      clearSaveTimeout();
      if (!variables.isAutoSave) {
        toast.error(error.message || "Failed to update project");
      } else {
        console.error("Auto-save failed:", error);
      }
    }
  });

  useEffect(() => {
    resetMutationRef.current = () => mutation.reset();
  }, [mutation]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
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
            className="inline-block px-6 py-3 bg-accent text-background text-xs font-bold uppercase tracking-widest mt-4"
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
      />
    </div>
  );
}
