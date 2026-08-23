"use client";

import { motion } from "framer-motion";
import { PixelButton } from "@/components/ui/pixel-button";
import { CheckCircle2 } from "lucide-react";

interface SuccessStateProps {
  onReset: () => void;
}

export default function SuccessState({ onReset }: SuccessStateProps) {
  return (
    <div className="lg:col-span-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl mx-auto text-center space-y-8 py-14 sm:py-20 bg-panel border-2 border-accent/30 pixel-shadow p-5 sm:p-8 md:p-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto border-2 border-accent/20"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <div className="space-y-4">
          <h3 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter text-strong" style={{ textWrap: 'balance' }}>MISSION ACCEPTED!</h3>
          <div className="h-[2px] w-24 bg-brand-cyan mx-auto" />
          <p className="font-modern text-text-dim uppercase tracking-[0.2em] text-[10px] max-w-sm mx-auto leading-relaxed">
            Mission link opened in WhatsApp. I&apos;ll respond to your coordinates within 24 hours.
          </p>
        </div>
        <PixelButton
          variant="outline"
          className="px-10 py-4 text-xs tracking-widest"
          onClick={onReset}
        >
          Return to Base
        </PixelButton>
      </motion.div>
    </div>
  );
}
