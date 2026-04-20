"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid credentials. Access Denied.");
      setLoading(false);
    } else {
      toast.success("Authentication Successful");
      router.push("/admin");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 bg-primary/5 border border-primary/20 pixel-border"
      >
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-accent mx-auto flex items-center justify-center pixel-border mb-4">
            <span className="text-background font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-tighter">Terminal Access</h1>
          <p className="text-foreground/40 pixel-text text-xs mt-2 uppercase">Admin Authentication Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="pixel-text text-[10px] text-accent block mb-2 uppercase tracking-widest">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent transition-colors font-mono text-sm"
              placeholder="root"
            />
          </div>
          <div>
            <label className="pixel-text text-[10px] text-accent block mb-2 uppercase tracking-widest">Passcode</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent transition-colors font-mono text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent text-background font-bold uppercase tracking-widest pixel-border hover:bg-white transition-colors flex items-center justify-center gap-4"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            <span>{loading ? "Verifying..." : "Authenticate"}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
