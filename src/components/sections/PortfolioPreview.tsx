"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function PortfolioPreview() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setProjects([
          {
            _id: 1,
            title: { en: "Tech Brand Campaign" },
            category: "UGC Ads",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564"
          },
          {
            _id: 2,
            title: { en: "Fashion Brand Reels" },
            category: "Video Editing",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564"
          },
          {
            _id: 3,
            title: { en: "SaaS Product Launch" },
            category: "Content Strategy",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h2 className="text-accent text-sm uppercase tracking-widest mb-4">Featured Work</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold tracking-tighter">Selected Projects</h3>
          </div>
          <Link
            href="/projects"
            className="group flex items-center space-x-4 text-sm font-bold uppercase tracking-[0.2em] border-b border-accent pb-2"
          >
            <span>View All Projects</span>
            <div className="w-8 h-[1px] bg-accent transition-all group-hover:w-16" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {!loading ? (
            projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Link href={['/projects', project._id].join('/')} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border mb-6">
                    <Image
                      src={project.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"}
                      alt={project.title.en}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:blur-[2px] opacity-70 group-hover:opacity-100"
                    />

                    <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-background bg-accent px-6 py-2 font-bold rounded-full">
                        View Project
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-accent font-bold uppercase tracking-widest block mb-2">
                    {project.category}
                  </span>
                  <h4 className="text-2xl font-display font-bold group-hover:text-accent transition-colors">
                    {project.title.en}
                  </h4>
                </Link>
              </motion.div>
            ))
          ) : (
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-surface rounded-xl border border-border mb-6" />
                <div className="h-4 bg-surface w-24 mb-4" />
                <div className="h-8 bg-surface w-full" />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}