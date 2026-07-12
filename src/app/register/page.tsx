"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CURRENCIES } from "@/lib/money";

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

  const field =
    "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50";

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-16 text-zinc-100">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-lg font-black text-amber-400">
          DevisPay
        </Link>
        <h1 className="mt-8 text-2xl font-black">Create free account</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Any service business. Multi-currency. Card or bank deposit.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Business name"
            className={field}
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={field}
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (optional)"
            className={field}
          />
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-zinc-500">
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
                className={`${field} mt-1`}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-zinc-900">
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-zinc-500">
              Currency
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className={`${field} mt-1`}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-zinc-900">
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-xs text-zinc-500">
            Preferred language
            <select
              value={defaultLocale}
              onChange={(e) => setDefaultLocale(e.target.value as "fr" | "en")}
              className={`${field} mt-1`}
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
            className={field}
          />
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (8+)"
            className={field}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-60"
          >
            {loading ? "…" : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
