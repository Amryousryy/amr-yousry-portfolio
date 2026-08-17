"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/lib/api-client";
import { toast } from "sonner";
import { NewProject } from "@/types";
import ProjectEditor from "@/components/admin/ProjectEditor";
import { useSaveWithTimeout } from "@/hooks/useSaveWithTimeout";

export default function NewProjectPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { saveTimeoutConfig, syncResetMutation } = useSaveWithTimeout();

  const mutation = useMutation({
    mutationFn: (data: NewProject) => ProjectService.create(data),
    ...saveTimeoutConfig,
    onSuccess: () => {
      saveTimeoutConfig.onSuccess();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project saved successfully!");
      router.push("/admin");
    },
    onError: (error: Error) => {
      saveTimeoutConfig.onError();
      toast.error(error.message || "Failed to save project");
    }
  });

  useEffect(() => {
    syncResetMutation(() => mutation.reset());
  }, [mutation, syncResetMutation]);

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
