"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/lib/api-client";
import Image from "next/image";
import { ArrowLeft, Play, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Project } from "@/types";

export default function ProjectDetailsPage() {
  const { id } = useParams();

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await ProjectService.getById(id as string);
      if (error) throw new Error(error);
      return data as Project;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-center px-6">
        <h1 className="text-4xl font-display font-bold mb-4 text-red-500">Project Not Found</h1>
        <Link href="/projects" className="text-accent underline pixel-text text-sm">Return to Gallery</Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title.en}
          fill
          className="object-cover opacity-50 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
          <Link href="/projects" className="flex items-center space-x-2 text-accent mb-8 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            <span className="pixel-text text-xs">Back to Gallery</span>
          </Link>
          <span className="pixel-text text-accent text-sm mb-4 uppercase">{project.category}</span>
          <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter mb-4">{project.title.en}</h1>
        </div>
      </section>

      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="pixel-text text-accent text-xs mb-6 underline uppercase">Overview</h2>
              <p className="text-2xl md:text-3xl font-sans leading-relaxed text-foreground/80">
                {project.shortDescription?.en}
              </p>
            </div>

            {project.image && (
              <div className="relative aspect-video bg-primary/10 pixel-border flex items-center justify-center group cursor-pointer overflow-hidden">
                <Image
                  src={project.image}
                  alt="Video Cover"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors" />
                <div className="relative w-24 h-24 bg-accent rounded-full flex items-center justify-center pixel-border group-hover:scale-110 transition-transform">       
                  <Play className="text-background fill-background ml-1" size={32} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {project.problem?.en && (
                <div className="p-8 bg-primary/5 border-l-4 border-accent">
                  <h3 className="pixel-text text-accent text-xs mb-4 uppercase">The Problem</h3>
                  <p className="text-foreground/70">{project.problem?.en}</p>
                </div>
              )}
              {project.solution?.en && (
                <div className="p-8 bg-primary/5 border-l-4 border-secondary">
                  <h3 className="pixel-text text-secondary text-xs mb-4 uppercase">The Solution</h3>
                  <p className="text-foreground/70">{project.solution?.en}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-12">
            {project.results?.en && (
              <div className="p-10 bg-accent text-background pixel-border">
                <h3 className="pixel-text text-xs mb-6 font-bold uppercase">The Results</h3>
                <p className="text-3xl font-display font-bold leading-tight">
                  {project.results?.en}
                </p>
              </div>
            )}

            <div className="p-10 border border-primary/20 space-y-6">
              <h3 className="pixel-text text-accent text-xs uppercase">Project Scope</h3>
              <ul className="space-y-4 font-bold uppercase tracking-widest text-sm">
                <li>- {project.category}</li>
                <li>- Strategic Content</li>
                <li>- Performance Editing</li>
                <li>- High-Converting Visuals</li>
              </ul>
            </div>

            <Link
              href="/#contact"
              className="block text-center py-6 bg-primary text-white font-bold uppercase tracking-widest pixel-border hover:bg-secondary transition-colors"
            >
              Get Similar Results
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
