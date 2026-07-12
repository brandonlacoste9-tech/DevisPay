"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CURRENCIES } from "@/lib/money";

type Item = { description: string; quantity: number; unitPrice: number };

export default function NewQuotePage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState("cad");
  const [lang, setLang] = useState<"fr" | "en">("en");
  const [depositType, setDepositType] = useState<"percent" | "fixed">("percent");
  const [depositPercent, setDepositPercent] = useState(30);
  const [depositFixed, setDepositFixed] = useState(500);
  const [paymentPreference, setPaymentPreference] = useState<
    "card_or_manual" | "card_only" | "manual_only"
  >("card_or_manual");
  const [manualPayInstructions, setManualPayInstructions] = useState(
    "Interac e-Transfer to you@email.com — Security answer: DevisPay"
  );
  const [items, setItems] = useState<Item[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [payUrl, setPayUrl] = useState("");

  const total = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
  const deposit =
    depositType === "fixed"
      ? Math.min(total, depositFixed)
      : (total * depositPercent) / 100;

  function updateItem(i: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPayUrl("");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone: customerPhone || undefined,
          title,
          notes: notes || undefined,
          currency,
          lang,
          depositType,
          depositPercent: depositType === "percent" ? depositPercent : undefined,
          depositFixed: depositType === "fixed" ? depositFixed : undefined,
          paymentPreference,
          manualPayInstructions:
            paymentPreference !== "card_only" ? manualPayInstructions : undefined,
          items: items.filter((it) => it.description.trim()),
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setError(data.error || "Error");
        return;
      }
      setPayUrl(data.payUrl as string);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (payUrl) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-4 py-16 text-zinc-100">
        <div className="mx-auto max-w-lg rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
          <h1 className="text-xl font-black text-green-400">Quote ready</h1>
          <p className="mt-3 text-sm text-zinc-300">Send this link to your client:</p>
          <p className="mt-4 break-all rounded-xl bg-black/40 p-3 text-sm text-amber-400">
            {payUrl}
          </p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black"
            onClick={() => void navigator.clipboard.writeText(payUrl)}
          >
            Copy link
          </button>
          <div className="mt-6">
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white">
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white">
            ← Back
          </Link>
          <span className="font-black text-amber-400">New quote</span>
        </div>
      </header>

      <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4 px-4 py-8">
        <input
          required
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer name"
          className={field}
        />
        <input
          required
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="Customer email"
          className={field}
        />
        <input
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="Customer phone"
          className={field}
        />
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Job / project title"
          className={field}
        />

        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-zinc-500">
            Currency
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`${field} mt-1`}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-zinc-900">
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-zinc-500">
            Quote language
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "fr" | "en")}
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
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Line items
          </p>
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                required
                value={it.description}
                onChange={(e) => updateItem(i, { description: e.target.value })}
                placeholder="Description"
                className="col-span-6 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
              />
              <input
                type="number"
                min={0.01}
                step="any"
                value={it.quantity}
                onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
                className="col-span-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
              />
              <input
                type="number"
                min={0}
                step="0.01"
                value={it.unitPrice}
                onChange={(e) => updateItem(i, { unitPrice: Number(e.target.value) })}
                placeholder="Price"
                className="col-span-4 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setItems((p) => [...p, { description: "", quantity: 1, unitPrice: 0 }])
            }
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            + Add line
          </button>
        </div>

        <div className="rounded-xl border border-white/10 p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Deposit
          </p>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={depositType === "percent"}
                onChange={() => setDepositType("percent")}
              />
              Percent
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={depositType === "fixed"}
                onChange={() => setDepositType("fixed")}
              />
              Fixed amount
            </label>
          </div>
          {depositType === "percent" ? (
            <input
              type="number"
              min={1}
              max={100}
              value={depositPercent}
              onChange={(e) => setDepositPercent(Number(e.target.value))}
              className={field}
            />
          ) : (
            <input
              type="number"
              min={0}
              step="0.01"
              value={depositFixed}
              onChange={(e) => setDepositFixed(Number(e.target.value))}
              className={field}
            />
          )}
        </div>

        <div className="rounded-xl border border-white/10 p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            How can they pay?
          </p>
          <select
            value={paymentPreference}
            onChange={(e) =>
              setPaymentPreference(e.target.value as typeof paymentPreference)
            }
            className={field}
          >
            <option value="card_or_manual" className="bg-zinc-900">
              Card or bank / Interac
            </option>
            <option value="card_only" className="bg-zinc-900">
              Card only (Stripe)
            </option>
            <option value="manual_only" className="bg-zinc-900">
              Bank / Interac only
            </option>
          </select>
          {paymentPreference !== "card_only" && (
            <textarea
              value={manualPayInstructions}
              onChange={(e) => setManualPayInstructions(e.target.value)}
              rows={3}
              placeholder="Interac / bank instructions"
              className={field}
            />
          )}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          rows={2}
          className={field}
        />

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
          <p>
            Total:{" "}
            <strong>
              {total.toLocaleString(undefined, {
                style: "currency",
                currency: currency.toUpperCase(),
              })}
            </strong>
          </p>
          <p className="text-amber-400">
            Due now:{" "}
            {deposit.toLocaleString(undefined, {
              style: "currency",
              currency: currency.toUpperCase(),
            })}
          </p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-60"
        >
          {loading ? "…" : "Create quote & get link"}
        </button>
      </form>
    </div>
  );
}
