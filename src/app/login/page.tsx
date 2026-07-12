"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dp-mesh dp-noise relative flex min-h-screen items-center justify-center px-4 py-16">
      <div className="pointer-events-none absolute inset-0 dp-grid opacity-40" />
      <div className="relative z-10 w-full max-w-md">
        <BrandMark />
        <div className="dp-glass-strong mt-10 rounded-3xl p-8">
          <h1 className="dp-display text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Sign in to send quotes and collect deposits.
          </p>
          <form onSubmit={onSubmit} className="mt-8 space-y-3">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="dp-field"
              autoComplete="email"
            />
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="dp-field"
              autoComplete="current-password"
            />
            {error && (
              <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="dp-btn-primary w-full !rounded-2xl disabled:opacity-60"
            >
              {loading ? "…" : "Log in"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">
          No account?{" "}
          <Link href="/register" className="font-semibold text-amber-400 hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
