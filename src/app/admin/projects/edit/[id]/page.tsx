"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/lib/api-client";
import { toast } from "sonner";
import { Project } from "@/types";
import ProjectEditor from "@/components/admin/ProjectEditor";

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await ProjectService.getById(id as string);
      if (error) throw new Error(error);
      return data as Project;
    },
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: ({ data, isAutoSave }: { data: Partial<Project>; isAutoSave?: boolean }) => 
      ProjectService.update(id as string, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      
      if (!variables.isAutoSave) {
        toast.success("Project updated successfully!");
        router.push("/admin");
      }
    },
    onError: (error: Error, variables) => {
      if (!variables.isAutoSave) {
        toast.error(error.message || "Failed to update project");
      } else {
        console.error("Auto-save failed:", error);
      }
    }
  });

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
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
      />
    </div>
  );
}
