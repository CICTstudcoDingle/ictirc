"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button, Input, CircuitBackground } from "@ictirc/ui";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("ISUFST - CICT");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate ISUFST email
    if (!email.endsWith("@isufst.edu.ph")) {
      setError("Please use your ISUFST email address (@isufst.edu.ph)");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          affiliation,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600">
              We&apos;ve sent a verification link to <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Click the link in the email to verify your account and complete registration.
          </p>
          <Link href="/login">
            <Button className="w-full">Return to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full relative">
      {/* BRANDING SIDE (Left - 50%) */}
      <div className="hidden lg:flex w-1/2 fixed inset-y-0 left-0 bg-maroon items-center justify-center overflow-hidden z-10">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 z-0">
          <CircuitBackground variant="intense" animated className="opacity-40" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-xl text-white p-12 w-full">
          <div className="mb-8 inline-flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-2xl shadow-maroon/50">
              <span className="text-2xl font-bold text-gold">IC</span>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <p className="font-mono text-sm tracking-widest uppercase text-gray-300">
              Author Portal
            </p>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Research Repository <br />
            <span className="text-gold">Author Dashboard</span>
          </h1>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Submit and manage your research papers for the College of Information and Computing Technology (CICT).
          </p>

          <div className="flex gap-4 text-sm font-mono text-gray-400">
            <div className="px-4 py-2 bg-black/20 rounded-lg border border-white/10">v1.0.0 (Beta)</div>
            <div className="px-4 py-2 bg-black/20 rounded-lg border border-white/10">ISUFST Authors</div>
          </div>
        </div>
      </div>

      {/* FORM SIDE (Right - 50%) - Added ml-auto and z-20 for proper stacking */}
      <div className="flex-1 lg:ml-[50%] flex items-center justify-center bg-gray-50 min-h-screen p-4 sm:p-12 lg:p-24 relative z-20">
        <div className="w-full max-w-md space-y-8 bg-white/50 backdrop-blur-sm lg:bg-transparent p-6 rounded-xl lg:p-0">

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-2 text-gray-600">
              Join the CICT research community and start submitting your papers.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Input
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Dela Cruz"
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="author@isufst.edu.ph"
                  className="bg-white"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Must be an ISUFST email address</p>
              </div>
              <div>
                <Input
                  label="Affiliation"
                  type="text"
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  placeholder="ISUFST - CICT"
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
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>
            </div>

            <Button size="lg" type="submit" className="w-full text-base" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-6 text-center lg:text-left">
            <p className="text-sm text-gray-500">
              Already have an account? <Link href="/login" className="text-maroon hover:underline font-medium">Sign in here</Link>
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
