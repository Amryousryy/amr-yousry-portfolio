"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ProjectCard } from "./project-card";
import type { Project } from "@/types/project-static";

interface ProjectsCardsProps {
  projects: Project[];
}

export default function ProjectsCards({ projects }: ProjectsCardsProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </>
  );
}
