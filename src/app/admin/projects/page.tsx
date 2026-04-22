"use client";

import React from "react";
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

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  
  const { data: projects, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
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
        {projects?.data?.map((project: Project) => (
          <div 
            key={project._id}
            className="group bg-primary/5 border border-primary/10 p-6 flex flex-col md:flex-row items-center gap-8 hover:border-accent/50 transition-all"
          >
            {/* Thumbnail */}
            <div className="relative w-full md:w-48 aspect-video bg-background overflow-hidden pixel-border">
              <Image 
                src={project.image} 
                alt={project.title.en} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500" 
              />
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

            {/* Info */}
            <div className="flex-1 space-y-2 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h3 className="text-xl font-display font-bold uppercase tracking-tight">{project.title.en}</h3>
                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-accent font-bold uppercase tracking-widest w-fit mx-auto md:mx-0">
                  {project.category}
                </span>
              </div>
              <p className="text-sm text-foreground/50 line-clamp-1 italic">{project.shortDescription.en}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                {project.tags?.map(tag => (
                  <span key={tag} className="text-[8px] text-foreground/40 uppercase tracking-tighter border border-primary/10 px-1">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
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
                onClick={() => handleDelete(project._id, project.title.en)}
                className="p-3 bg-primary/10 hover:bg-red-500 hover:text-white transition-all pixel-border"
                title="Delete Project"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {(!projects?.data || projects.data.length === 0) && (
          <div className="text-center py-32 bg-primary/5 border border-primary/10 border-dashed">
            <FolderKanban size={48} className="mx-auto text-foreground/20 mb-4" />
            <p className="text-foreground/40 uppercase tracking-widest text-xs">No projects found in the vault.</p>
          </div>
        )}
      </div>
    </div>
  );
}
