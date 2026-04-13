"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <section className="hidden lg:flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 p-12 text-white">
        <div className="max-w-xl">
          <p className="text-sm font-mono tracking-widest uppercase text-gold">CICT Admin</p>
          <h1 className="mt-4 text-5xl font-bold leading-tight">
            Enrollment and Cashier
            <span className="block text-gold">Management Portal</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Manual cashier posting and receipt issuance for department fee payments.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <form onSubmit={onSubmit} className="panel w-full max-w-md p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-2xl font-bold">Sign in</h2>
            <p className="text-sm text-gray-600 mt-1">Use your Supabase account to continue.</p>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
