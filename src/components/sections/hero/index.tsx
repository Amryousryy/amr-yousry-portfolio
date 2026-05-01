"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PixelButton } from "@/components/ui/pixel-button";
import { heroContent } from "@/content/hero";
import { heroStats } from "@/data/stats";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const flickerVariants = {
    initial: { opacity: 1 },
    animate: {
      opacity: [1, 0.95, 1, 0.98, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
      {/* Refined background scanline effect - lower opacity for better readability */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(30,27,75,0.4)_100%)]" />

      <Container>
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Headline - Larger and more impactful */}
          <motion.div variants={itemVariants} className="mb-6">
            <motion.h1 
              variants={flickerVariants}
              initial="initial"
              animate="animate"
              className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] tracking-tight max-w-5xl mx-auto"
            >
              {heroContent.headline}
            </motion.h1>
          </motion.div>

          {/* Subheadline - Clearer contrast */}
          <motion.p 
            variants={itemVariants}
            className="font-modern text-lg md:text-xl text-text-dim/90 max-w-2xl mx-auto mb-12 antialiased leading-relaxed"
          >
            {heroContent.subheadline}
          </motion.p>

          {/* CTAs - Final Production Hierarchy */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-6 mb-24">
            <PixelButton 
              variant="primary" 
              size="lg" 
              className="shadow-[0_0_20px_rgba(34,211,238,0.25)]"
            >
              {heroContent.ctas.primary.text}
            </PixelButton>
            <PixelButton 
              variant="outline" 
              size="lg"
            >
              {heroContent.ctas.secondary.text}
            </PixelButton>
          </motion.div>

          {/* Stats Bar - Grounded Social Proof */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-8 md:gap-16 border-t border-slate-800/50 pt-12"
          >
            {heroStats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center group">
                <span className="font-pixel text-text-dim text-[10px] tracking-[0.2em] mb-2 group-hover:text-brand-cyan transition-colors">{stat.label}</span>
                <span className="font-pixel text-3xl md:text-4xl text-white">{stat.value}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-pixel text-[10px] text-text-dim tracking-widest uppercase">Scroll to Start</span>
          <div className="w-1 h-8 bg-gradient-to-b from-brand-cyan to-transparent opacity-50" />
        </motion.div>
      </Container>
    </Section>
  );
}
