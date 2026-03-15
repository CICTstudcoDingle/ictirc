"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, ArrowRight } from "lucide-react";

export default function PortalAdminLoginPage() {
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
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-12">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900">
          {/* Particle dots */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/20 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
          {/* Subtle grid lines */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-xl text-white">
          <div className="mb-8 inline-flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-2xl">
              <span className="text-2xl font-bold" style={{ color: "#D4AF37" }}>
                CP
              </span>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <p className="font-mono text-sm tracking-widest uppercase text-gray-300">
              Portal Admin
            </p>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            CICT Tech Portal <br />
            <span style={{ color: "#D4AF37" }}>Administration</span>
          </h1>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Manage announcements, events, users, and content for the College
            of Information and Communications Technology (CICT) Student
            Portal.
          </p>

          <div className="flex gap-4 text-sm font-mono text-gray-400">
            <div className="px-4 py-2 bg-black/20 rounded-lg border border-white/10">
              v1.0.0 (Beta)
            </div>
            <div className="px-4 py-2 bg-black/20 rounded-lg border border-white/10">
              Authorized Access Only
            </div>
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
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@isufstcict.com"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#800000] focus:outline-none focus:ring-1 focus:ring-[#800000] transition-colors"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#800000] focus:outline-none focus:ring-1 focus:ring-[#800000] transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#800000] px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-[#6a0000] focus:outline-none focus:ring-2 focus:ring-[#800000] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign in to Dashboard
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 text-center lg:text-left">
            <p className="text-sm text-gray-500">
              Forgot your password?{" "}
              <a
                href="mailto:support@isufstcict.com"
                className="font-medium hover:underline"
                style={{ color: "#800000" }}
              >
                Contact IT Support
              </a>
            </p>
          </div>

          {/* Mobile Footer branding */}
          <div className="lg:hidden mt-8 text-center border-t border-gray-200 pt-8">
            <p className="text-xs text-gray-400">
              ISUFST - College of Information and Computing Technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
