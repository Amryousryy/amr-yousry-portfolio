"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/lib/api-client";
import Image from "next/image";
import { 
  ArrowLeft, 
  Play,
  Loader2, 
  TrendingUp, 
  Zap, 
  ChevronRight,
  MessageSquare,
  Wrench,
  Target,
  Award,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types";
import AuditCTA from "@/components/ui/AuditCTA";
import RelatedProjects from "./RelatedProjects";

interface ProjectDetailClientProps {
  slug: string;
  initialData?: Project;
}

export default function ProjectDetailClient({ slug, initialData }: ProjectDetailClientProps) {
  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await ProjectService.getBySlug(slug);
      if (error) throw new Error(error);
      return data as Project;
    },
    enabled: !!slug,
    initialData,
  });

  if (isLoading && !project) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
        <Loader2 className="animate-spin text-accent mb-4" size={48} />
        <p className="pixel-text text-[10px] uppercase tracking-widest animate-pulse">Decrypting Case Study</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-center px-6">
        <h1 className="text-4xl font-display font-bold mb-4 text-red-500">Archive Not Found</h1>
        <Link href="/projects" className="text-accent underline pixel-text text-sm uppercase">Return to Gallery</Link>
      </div>
    );
  }

  const primaryResult = project.results?.split('\n')[0];

  return (
    <div className="bg-background min-h-screen">
      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] md:hidden w-[calc(100%-3rem)] max-w-sm">
        <motion.a
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          href="https://wa.me/your-number"
          className="flex items-center justify-center space-x-3 w-full py-4 bg-accent text-background font-bold uppercase tracking-widest text-[10px] pixel-border shadow-2xl"
        >
          <MessageSquare size={16} />
          <span>Start Your Transformation</span>
        </motion.a>
      </div>

      {/* Immersive Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/projects" className="flex items-center space-x-3 text-accent mb-12 group w-fit">
              <div className="p-2 border border-accent/30 group-hover:bg-accent group-hover:text-background transition-all">
                <ArrowLeft size={16} />
              </div>
              <span className="pixel-text text-[10px] uppercase tracking-widest">Back to Archive</span>
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
               <span className="px-4 py-1 bg-primary/20 text-foreground/60 pixel-text text-[10px] uppercase tracking-widest">
                 {project.category}
               </span>
               {primaryResult && (
                 <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="px-6 py-2 bg-accent text-background pixel-text text-[12px] font-bold uppercase tracking-[0.2em] pixel-border flex items-center space-x-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                 >
                    <Zap size={14} fill="currentColor" />
                    <span>Result: {primaryResult}</span>
                 </motion.div>
               )}
            </div>
            
            <h1 className="text-6xl md:text-9xl font-display font-bold tracking-tighter uppercase mb-6 leading-[0.85] max-w-5xl">
              {project.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl italic leading-relaxed mb-12">
              {project.shortDescription}
            </p>

            <div className="flex flex-wrap gap-6">
               <a href="#results" className="px-10 py-4 bg-foreground text-background font-bold uppercase tracking-widest text-[10px] pixel-border hover:bg-accent hover:text-background transition-all">
                  View Results
               </a>
               <a href="https://wa.me/your-number" className="px-10 py-4 border border-accent text-accent font-bold uppercase tracking-widest text-[10px] pixel-border hover:bg-accent hover:text-background transition-all flex items-center space-x-3">
                  <MessageSquare size={14} />
                  <span>Talk Strategy</span>
               </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Impact Strip */}
      <section id="results" className="py-24 bg-accent text-background overflow-hidden">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-center">
               <div className="space-y-2">
                  <h3 className="pixel-text text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">Success Metrics</h3>
                  <p className="text-3xl font-display font-bold uppercase tracking-tighter">Impact Generated</p>
               </div>
               {project.results?.split('\n').map((res, i) => (
                  <div key={i} className="space-y-1">
                     <p className="text-5xl md:text-6xl font-display font-bold tracking-tighter leading-none">{res}</p>
                     <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Proven Result</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Case Study Grid */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          <div className="lg:col-span-8 space-y-32">
            
            {/* The Challenge */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="flex items-center space-x-6">
                 <div className="h-px w-16 bg-accent" />
                 <h2 className="pixel-text text-accent text-[12px] font-bold uppercase tracking-[0.4em]">The Challenge</h2>
              </div>
              <div className="text-3xl md:text-4xl font-sans font-light leading-relaxed text-foreground/90 max-w-3xl">
                {project.problem}
              </div>
            </motion.div>

            {/* The Strategy */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="flex items-center space-x-6">
                 <div className="h-px w-16 bg-secondary" />
                 <h2 className="text-accent text-sm font-bold uppercase tracking-widest">The Strategy</h2>
              </div>
              <div className="text-3xl md:text-4xl font-sans font-light leading-relaxed text-foreground/90 max-w-3xl">
                {project.strategy || project.solution}
              </div>
            </motion.div>

            {/* The Process */}
            {(project.execution || project.outcome) && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-10"
              >
                <div className="flex items-center space-x-6">
                   <div className="h-px w-16 bg-accent" />
                   <h2 className="text-accent text-sm font-bold uppercase tracking-widest">The Process</h2>
                </div>
                <div className="text-3xl md:text-4xl font-sans font-light leading-relaxed text-foreground/90 max-w-3xl">
                  {project.execution || project.outcome}
                </div>
              </motion.div>
            )}

            {/* Tools & Stack */}
            {project.tools && project.tools.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="flex items-center space-x-6">
                   <div className="h-px w-16 bg-accent" />
                   <h2 className="text-accent text-sm font-bold uppercase tracking-widest">Tools & Stack</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.tools.map((tool, i) => (
                    <span 
                      key={i} 
                      className="px-5 py-2 bg-primary/10 border border-primary/20 text-foreground/70 text-sm font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Role & Scope */}
            {project.role && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="flex items-center space-x-6">
                   <div className="h-px w-16 bg-accent" />
                   <h2 className="text-accent text-sm font-bold uppercase tracking-widest">Role & Scope</h2>
                </div>
                <div className="p-8 bg-primary/5 border border-primary/10">
                  <p className="text-xl text-foreground/80 leading-relaxed">{project.role}</p>
                </div>
              </motion.div>
            )}

            {/* Content Audit CTA - Mid Page */}
            <AuditCTA />

            {/* Dynamic Sections */}
            {project.sections?.map((section) => (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-16"
              >
                <div className="space-y-8 max-w-3xl">
                  <h3 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tight">{section.title}</h3>
                  <div 
                    className="prose prose-invert prose-xl max-w-none text-foreground/70 leading-relaxed font-light"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>

                {section.media && section.media.length > 0 && (
                  <div className={`grid gap-8 ${
                    section.media.length === 1 ? "grid-cols-1" : 
                    section.media.length === 2 ? "grid-cols-1 md:grid-cols-2" : 
                    "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  }`}>
                    {section.media.map((m, mIdx) => (
                      <div key={mIdx} className="relative aspect-video bg-primary/5 pixel-border overflow-hidden group">
                        {m.type === "image" ? (
                          <Image
                            src={m.url}
                            alt={`${section.title} media`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-accent/5 hover:bg-accent/10 transition-colors">
                             <Play className="text-accent mb-4" size={56} />
                             <span className="pixel-text text-[10px] uppercase tracking-[0.3em] text-accent">Play Proof Clip</span>
                             <Link href={m.url} target="_blank" className="absolute inset-0 z-10" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right Side Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-12">
            <div className="p-8 border border-primary/10 bg-primary/5 space-y-10">
               <div className="space-y-4">
                  <h4 className="text-accent text-xs font-bold uppercase tracking-widest">Client</h4>
                  <p className="text-2xl font-display font-bold uppercase tracking-tighter">{project.clientName || "Confidential"}</p>
               </div>

               <div className="space-y-6">
                  <h4 className="text-accent text-xs font-bold uppercase tracking-widest">Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-background border border-primary/10 text-xs font-medium text-foreground/70">
                        {tag}
                      </span>
                    ))}
                  </div>
               </div>

               {project.year && (
                 <div className="space-y-4">
                    <h4 className="text-accent text-xs font-bold uppercase tracking-widest">Year</h4>
                    <p className="text-lg font-display font-bold">{project.year}</p>
                 </div>
               )}

               <div className="pt-8 border-t border-primary/10 space-y-6">
                  <p className="text-sm text-foreground/50">Want results like these for your brand?</p>
                  <Link
                    href="https://wa.me/your-number"
                    className="flex items-center justify-center w-full py-4 bg-accent text-background font-bold text-xs uppercase tracking-wider hover:bg-accent/90 transition-colors"
                  >
                    <span>Let's Talk</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Assets Masonry */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="py-32 border-t border-primary/10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20">
               <h2 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter">Production <span className="text-accent italic">Gallery</span></h2>
               <p className="text-foreground/40 max-w-xs italic text-sm">Visual evidence of the strategic execution.</p>
            </div>
            
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {project.gallery.map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative group overflow-hidden pixel-border bg-background"
                >
                  <Image
                    src={img}
                    alt={`Gallery ${i}`}
                    width={800}
                    height={600}
                    className="w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      <RelatedProjects currentSlug={slug} category={project.category} />
      
      {/* Global Final CTA */}
      <section className="py-40 bg-background text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[120px] rounded-full -z-10" />
        <div className="container mx-auto px-6 space-y-12">
           <h2 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none">
             Ready to <span className="text-accent italic">Level Up?</span>
           </h2>
           <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <a href="https://wa.me/your-number" className="px-16 py-8 bg-accent text-background font-bold uppercase tracking-[0.3em] text-xs pixel-border hover:scale-110 transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                 Start Your Transformation
              </a>
              <Link href="/projects" className="px-16 py-8 border border-foreground/20 text-foreground/60 font-bold uppercase tracking-[0.3em] text-xs pixel-border hover:bg-foreground hover:text-background transition-all">
                 Back to Gallery
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
