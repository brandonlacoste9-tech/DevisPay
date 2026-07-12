"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";

export default function SettingsPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [brandLogoUrl, setBrandLogoUrl] = useState("");
  const [manualPayInstructions, setManualPayInstructions] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/account");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setBusinessName(data.businessName || "");
      setPhone(data.phone || "");
      setBrandLogoUrl(data.brandLogoUrl || "");
      setManualPayInstructions(data.manualPayInstructions || "");
      setEmail(data.email || "");
      setLoading(false);
    })();
  }, [router]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          phone,
          brandLogoUrl,
          manualPayInstructions,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      setMsg("Saved");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="dp-mesh flex min-h-screen items-center justify-center text-zinc-500">
        …
      </div>
    );
  }

  return (
    <div className="dp-mesh min-h-screen text-zinc-100">
      <header className="border-b border-white/5 bg-[#050506]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-white">
            ← Dashboard
          </Link>
          <BrandMark href="/dashboard" size="sm" />
          <span className="w-16" />
        </div>
      </header>

      <form onSubmit={onSave} className="mx-auto max-w-xl space-y-4 px-4 py-10">
        <div>
          <h1 className="dp-display text-2xl font-bold">Business profile</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Shown on pay links and receipts. Logo = public image URL (https).
          </p>
          <p className="mt-2 text-xs text-zinc-600">{email}</p>
        </div>

        <div className="dp-glass space-y-3 rounded-3xl p-5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Business name
            <input
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="dp-field mt-1.5"
            />
          </label>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Phone
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="dp-field mt-1.5"
            />
          </label>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Logo URL (https)
            <input
              value={brandLogoUrl}
              onChange={(e) => setBrandLogoUrl(e.target.value)}
              placeholder="https://…/logo.png"
              className="dp-field mt-1.5"
            />
          </label>
          {brandLogoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brandLogoUrl}
              alt="Logo preview"
              className="h-16 w-16 rounded-xl object-cover ring-1 ring-white/10"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Default bank / Interac instructions
            <textarea
              value={manualPayInstructions}
              onChange={(e) => setManualPayInstructions(e.target.value)}
              rows={3}
              className="dp-field mt-1.5 resize-none"
            />
          </label>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {msg && <p className="text-sm text-emerald-400">{msg}</p>}

        <button
          type="submit"
          disabled={saving}
          className="dp-btn-primary w-full !rounded-2xl disabled:opacity-60"
        >
          {saving ? "…" : "Save profile"}
        </button>
      </form>
    </div>
  );
}
