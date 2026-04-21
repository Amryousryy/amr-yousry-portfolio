"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
              <svg width="128" height="128" viewBox="0 0 36 36" fill="none" className="w-full h-full">
                <rect x="2" y="2" width="15" height="15" fill="#01c4cc" />
                <rect x="19" y="2" width="15" height="15" fill="#01c4cc" opacity="0.6" />
                <rect x="2" y="19" width="15" height="15" fill="#01c4cc" opacity="0.6" />
                <rect x="19" y="19" width="15" height="15" fill="#01c4cc" opacity="0.3" />
              </svg>
            </motion.div>
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border-2 border-accent border-dashed rounded-full opacity-20"
            />
          </div>
          <div className="w-48 h-1 bg-surface relative overflow-hidden rounded-full">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-accent"
            />
          </div>
          <div className="mt-4 text-accent text-[10px] uppercase tracking-[0.5em]">
            Initializing
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}