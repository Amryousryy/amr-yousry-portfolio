"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const clearError = () => { if (error) setError(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("Invalid credentials. Please check your email and passcode, then try again.");
        setLoading(false);
      } else if (res?.ok) {
        window.location.href = callbackUrl;
      }
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
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

      {error && (
        <p className="text-red-500 pixel-text text-[10px] mb-6 uppercase tracking-widest text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="pixel-text text-[10px] text-accent block mb-2 uppercase tracking-widest">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError(); }}
            className="w-full bg-background border border-primary/20 p-4 outline-none focus:border-accent transition-colors font-mono text-sm"
            placeholder="admin@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="pixel-text text-[10px] text-accent block mb-2 uppercase tracking-widest">Passcode</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError(); }}
              className="w-full bg-background border border-primary/20 p-4 pr-12 outline-none focus:border-accent transition-colors font-mono text-sm"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide passcode" : "Show passcode"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-accent transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-accent text-background font-bold uppercase tracking-widest pixel-border hover:bg-white transition-colors flex items-center justify-center gap-4"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          <span>{loading ? "AUTHENTICATING..." : "Authenticate"}</span>
        </button>
      </form>
    </motion.div>
  );
}

function LoginFormWithSuspense() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md p-10 bg-primary/5 border border-primary/20 pixel-border flex items-center justify-center">
        <Loader2 className="animate-spin" size={24} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background p-6">
      <LoginFormWithSuspense />
    </div>
  );
}