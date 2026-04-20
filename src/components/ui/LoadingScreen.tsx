"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
        >
          <div className="relative w-32 h-32 mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              <Image 
                src="/Asset 4.png" 
                alt="Loading Logo" 
                fill 
                className="object-contain"
                priority
              />
            </motion.div>
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border-2 border-accent border-dashed rounded-full opacity-20"
            />
          </div>
          <div className="w-48 h-1 bg-primary/10 relative overflow-hidden pixel-border">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-accent"
            />
          </div>
          <div className="mt-4 pixel-text text-accent text-[10px] tracking-[0.5em] uppercase">
            Initializing System
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
