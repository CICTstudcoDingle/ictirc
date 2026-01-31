"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button, Input, CircuitBackground } from "@ictirc/ui";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Redirect to dashboard on success
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex">
      {/* BRANDING SIDE (Left - 50%) */}
      <div className="hidden lg:flex flex-1 relative bg-maroon overflow-hidden items-center justify-center p-12">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900">
          <CircuitBackground variant="intense" animated className="opacity-40" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-xl text-white">
          <div className="mb-8 inline-flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-2xl shadow-maroon/50">
              <span className="text-2xl font-bold text-gold">IC</span>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <p className="font-mono text-sm tracking-widest uppercase text-gray-300">
              Admin Portal
            </p>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Research Repository <br />
            <span className="text-gold">Management System</span>
          </h1>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Reviews submissions and manage reports for the College of Information and Communications Technology (CICT).
          </p>

          <div className="flex gap-4 text-sm font-mono text-gray-400">
            <div className="px-4 py-2 bg-black/20 rounded-lg border border-white/10">v1.0.0 (Beta)</div>
            <div className="px-4 py-2 bg-black/20 rounded-lg border border-white/10">Authorized Access Only</div>
          </div>
        </div>
      </div>

      {/* FORM SIDE (Right - 50%) */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-8">

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">
              Please enter your credentials to access the admin dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ictirc.org"
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white"
                  required
                />
              </div>
            </div>

            <Button size="lg" type="submit" className="w-full text-base" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-6 text-center lg:text-left">
            <p className="text-sm text-gray-500">
              Forgot your password? <Link href="#" className="text-maroon hover:underline font-medium">Contact IT Support</Link>
            </p>
          </div>

          {/* Mobile Footer branding */}
          <div className="lg:hidden mt-8 text-center border-t border-gray-200 pt-8">
            <p className="text-xs text-gray-400">ISUFST - College of Information and Computing Technology</p>
          </div>
        </div>
      </div>
    </div>
  );
}
