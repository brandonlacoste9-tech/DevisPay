"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordField } from "@/components/PasswordField";
import { AuthSplit } from "@/components/AuthSplit";

const REMEMBER_EMAIL_KEY = "dp_remember_email";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_EMAIL_KEY);
      if (saved) {
        setEmail(saved);
        setRememberMe(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error");
        return;
      }
      try {
        if (rememberMe) {
          localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim().toLowerCase());
        } else {
          localStorage.removeItem(REMEMBER_EMAIL_KEY);
        }
      } catch {
        /* ignore */
      }
      router.push("/dashboard");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthSplit
      photo="/photos/carpentry.jpg"
      caption="Get paid before the first nail."
    >
      <div className="rounded-[1.6rem] bg-white p-8 shadow-sm ring-1 ring-zinc-900/10">
        <h1 className="dp-display text-3xl text-zinc-900">Welcome back</h1>
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
          <PasswordField
            value={password}
            onChange={setPassword}
            placeholder="Password"
            autoComplete="current-password"
          />
          <label className="flex cursor-pointer items-center gap-2.5 px-0.5 py-1 text-sm text-zinc-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-amber-600/40"
            />
            <span>Remember me</span>
            <span className="text-xs text-zinc-500">(30 days)</span>
          </label>
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
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
        <Link href="/register" className="font-semibold text-amber-800 hover:underline">
          Sign up free
        </Link>
      </p>
    </AuthSplit>
  );
}
