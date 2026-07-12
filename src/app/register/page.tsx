"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CURRENCIES } from "@/lib/money";
import { BrandMark } from "@/components/BrandMark";

const COUNTRIES = [
  { code: "CA", label: "Canada" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "FR", label: "France" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "OTHER", label: "Other" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("CA");
  const [defaultCurrency, setDefaultCurrency] = useState("cad");
  const [defaultLocale, setDefaultLocale] = useState<"fr" | "en">("en");
  const [manualPayInstructions, setManualPayInstructions] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          email,
          phone: phone || undefined,
          password,
          country: country === "OTHER" ? "XX" : country,
          defaultCurrency,
          defaultLocale,
          manualPayInstructions: manualPayInstructions || undefined,
        }),
      });
      let data: { error?: string; detail?: string } = {};
      try {
        data = await res.json();
      } catch {
        setError(`Server error (${res.status}). Redeploy or check Netlify logs.`);
        return;
      }
      if (!res.ok) {
        setError(data.error || `Error (${res.status})`);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Network error — check connection or try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dp-mesh dp-noise relative min-h-screen px-4 py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 dp-grid opacity-40" />
      <div className="relative z-10 mx-auto w-full max-w-md">
        <BrandMark />
        <div className="dp-glass-strong mt-8 rounded-3xl p-8">
          <h1 className="dp-display text-2xl font-bold text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Any service business. Multi-currency. Card or bank deposit.
          </p>
          <form onSubmit={onSubmit} className="mt-7 space-y-3">
            <input
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Business name"
              className="dp-field"
            />
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="dp-field"
            />
            <div className="grid grid-cols-2 gap-3">
              <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Country
                <select
                  value={country}
                  onChange={(e) => {
                    const c = e.target.value;
                    setCountry(c);
                    if (c === "CA") setDefaultCurrency("cad");
                    else if (c === "US") setDefaultCurrency("usd");
                    else if (c === "GB") setDefaultCurrency("gbp");
                    else if (c === "FR" || c === "DE") setDefaultCurrency("eur");
                    else if (c === "AU") setDefaultCurrency("aud");
                  }}
                  className="dp-field mt-1.5"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-zinc-900">
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Currency
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="dp-field mt-1.5"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-zinc-900">
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Language
              <select
                value={defaultLocale}
                onChange={(e) => setDefaultLocale(e.target.value as "fr" | "en")}
                className="dp-field mt-1.5"
              >
                <option value="en" className="bg-zinc-900">
                  English
                </option>
                <option value="fr" className="bg-zinc-900">
                  Français
                </option>
              </select>
            </label>
            <textarea
              value={manualPayInstructions}
              onChange={(e) => setManualPayInstructions(e.target.value)}
              rows={2}
              placeholder="Default bank / Interac instructions (optional)"
              className="dp-field resize-none"
            />
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (8+)"
              className="dp-field"
              autoComplete="new-password"
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
              {loading ? "…" : "Create free account"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-amber-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
