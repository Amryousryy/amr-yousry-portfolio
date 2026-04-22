"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/lib/api-client";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Star,
  ArrowLeft,
  FolderKanban
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Project } from "@/types";
import AdminLoadingSkeleton from "@/components/admin/AdminLoadingSkeleton";
import AdminErrorState from "@/components/admin/AdminErrorState";
import AdminEmptyState from "@/components/admin/AdminEmptyState";

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  
  const { data: projects, isLoading, isError, refetch } = useQuery({
    queryKey: ["projects", "admin"],
    queryFn: () => ProjectService.getAll(true),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete project");
    }
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  // Safe data extraction
  const projectsData = Array.isArray(projects?.data) ? projects.data : [];

  if (isLoading) {
    return <AdminLoadingSkeleton />;
  }

  if (isError) {
    return <AdminErrorState message="Failed to load projects" onRetry={() => refetch()} />;
  }

  if (projectsData.length === 0) {
    return (
      <div className="space-y-12">
        <header className="flex justify-between items-center">
          <div>
            <Link href="/admin" className="flex items-center space-x-2 text-accent group mb-4">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="pixel-text text-[10px] uppercase">Dashboard</span>
            </Link>
            <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">Project Vault</h1>
          </div>
        </header>
        <AdminEmptyState 
          title="No Projects Yet"
          description="Start building your portfolio by adding your first project."
          actionLabel="Add Project"
          actionHref="/admin/projects/new"
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-center">
        <div>
          <Link href="/admin" className="flex items-center space-x-2 text-accent group mb-4">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="pixel-text text-[10px] uppercase">Dashboard</span>
          </Link>
          <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">Project Vault</h1>
        </div>
        <Link 
          href="/admin/projects/new"
          className="flex items-center space-x-3 px-8 py-4 bg-accent text-background font-bold uppercase tracking-widest text-xs pixel-border hover:scale-105 transition-all"
        >
          <Plus size={18} />
          <span>New Project</span>
        </Link>
      </header> 

      <div className="grid grid-cols-1 gap-6">
        {projectsData.map((project: Project) => (
          <div 
            key={project._id}
            className="group bg-primary/5 border border-primary/10 p-6 flex flex-col md:flex-row items-center gap-8 hover:border-accent/50 transition-all"
          >
            <div className="relative w-full md:w-48 aspect-video bg-background overflow-hidden pixel-border">
              {project.image && (
                <Image 
                  src={project.image} 
                  alt={project.title?.en || "Project"} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              )}
              <div className="absolute top-2 right-2 flex space-x-2">
                {project.featured && (
                  <div className="p-1 bg-yellow-500 text-background rounded-sm">
                    <Star size={12} fill="currentColor" />
                  </div>
                )}
                <div className={`p-1 rounded-sm ${project.status === 'published' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-background'}`}>
                  {project.status === 'published' ? <Eye size={12} /> : <EyeOff size={12} />}
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h3 className="text-xl font-display font-bold uppercase tracking-tight">
                  {project.title?.en || "Untitled"}
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-accent font-bold uppercase tracking-widest w-fit mx-auto md:mx-0">
                  {project.category || "Uncategorized"}
                </span>
              </div>
              <p className="text-sm text-foreground/50 line-clamp-1 italic">
                {project.shortDescription?.en || "No description"}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                {Array.isArray(project.tags) && project.tags.map((tag: string) => (
                  <span key={tag} className="text-[8px] text-foreground/40 uppercase tracking-tighter border border-primary/10 px-1">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                href={`/projects/${project.slug}`} 
                target="_blank"
                className="p-3 bg-primary/10 hover:bg-accent hover:text-background transition-all pixel-border"
                title="View Live"
              >
                <ExternalLink size={18} />
              </Link>
              <Link 
                href={`/admin/projects/edit/${project._id}`}
                className="p-3 bg-primary/10 hover:bg-accent hover:text-background transition-all pixel-border"
                title="Edit Project"
              >
                <Edit2 size={18} />
              </Link>
              <button 
                onClick={() => handleDelete(project._id, project.title?.en || "this project")}
                className="p-3 bg-primary/10 hover:bg-red-500 hover:text-white transition-all pixel-border"
                title="Delete Project"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}