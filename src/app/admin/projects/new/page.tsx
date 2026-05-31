"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/lib/api-client";
import { toast } from "sonner";
import { NewProject } from "@/types";
import ProjectEditor from "@/components/admin/ProjectEditor";

const SAVE_TIMEOUT_MS = 30_000;

export default function NewProjectPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const resetMutationRef = useRef<() => void>(() => {});

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

  const mutation = useMutation({
    mutationFn: (data: NewProject) => ProjectService.create(data),
    onMutate: () => {
      clearSaveTimeout();
      saveTimeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        saveTimeoutRef.current = null;
        resetMutationRef.current();
        toast.error("Save timed out. Please try again.");
      }, SAVE_TIMEOUT_MS);
    },
    onSuccess: () => {
      clearSaveTimeout();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project saved successfully!");
      router.push("/admin");
    },
    onError: (error: Error) => {
      clearSaveTimeout();
      toast.error(error.message || "Failed to save project");
    }
  });

  useEffect(() => {
    resetMutationRef.current = () => mutation.reset();
  }, [mutation]);

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <Link href="/admin" className="flex items-center space-x-2 text-accent group mb-4">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="pixel-text text-[10px] uppercase">Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">New Masterpiece</h1>
        </div>
      </header>

      <ProjectEditor 
        onSave={(data) => mutation.mutate(data as NewProject)} 
        isSaving={mutation.isPending} 
      />
    </div>
  );
}
