"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CURRENCIES } from "@/lib/money";
import { BrandMark } from "@/components/BrandMark";

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
      <div className="dp-mesh flex min-h-screen items-center justify-center px-4 py-16">
        <div className="dp-glass-strong w-full max-w-lg rounded-3xl p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-2xl text-emerald-400 ring-1 ring-emerald-500/30">
            ✓
          </div>
          <h1 className="dp-display mt-5 text-2xl font-bold text-white">
            Quote ready
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Send this link to your client — they pay the deposit in one tap.
          </p>
          <p className="mt-6 break-all rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm font-medium text-amber-300">
            {payUrl}
          </p>
          <button
            type="button"
            className="dp-btn-primary mt-5 w-full !rounded-2xl"
            onClick={() => void navigator.clipboard.writeText(payUrl)}
          >
            Copy link
          </button>
          <Link
            href="/dashboard"
            className="mt-6 inline-block text-sm text-zinc-500 hover:text-white"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dp-mesh min-h-screen text-zinc-100">
      <header className="border-b border-white/5 bg-[#050506]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-white">
            ← Back
          </Link>
          <BrandMark href="/dashboard" size="sm" />
          <span className="w-12" />
        </div>
      </header>

      <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-5 px-4 py-10">
        <div>
          <h1 className="dp-display text-2xl font-bold text-white">New quote</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Professional. Shareable. Payable.
          </p>
        </div>

        <div className="dp-glass space-y-3 rounded-3xl p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Client
          </p>
          <input
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer name"
            className="dp-field"
          />
          <input
            required
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="Customer email"
            className="dp-field"
          />
          <input
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Customer phone"
            className="dp-field"
          />
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job / project title"
            className="dp-field"
          />
        </div>

        <div className="dp-glass grid grid-cols-2 gap-3 rounded-3xl p-5">
          <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Currency
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="dp-field mt-1.5"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-zinc-900">
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Language
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "fr" | "en")}
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
        </div>

        <div className="dp-glass space-y-3 rounded-3xl p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Line items
          </p>
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                required
                value={it.description}
                onChange={(e) => updateItem(i, { description: e.target.value })}
                placeholder="Description"
                className="dp-field col-span-6 !py-2"
              />
              <input
                type="number"
                min={0.01}
                step="any"
                value={it.quantity}
                onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
                className="dp-field col-span-2 !px-2 !py-2"
              />
              <input
                type="number"
                min={0}
                step="0.01"
                value={it.unitPrice}
                onChange={(e) => updateItem(i, { unitPrice: Number(e.target.value) })}
                placeholder="Price"
                className="dp-field col-span-4 !py-2"
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

        <div className="dp-glass space-y-3 rounded-3xl p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Deposit
          </p>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2 text-zinc-300">
              <input
                type="radio"
                checked={depositType === "percent"}
                onChange={() => setDepositType("percent")}
              />
              Percent
            </label>
            <label className="flex items-center gap-2 text-zinc-300">
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
              className="dp-field"
            />
          ) : (
            <input
              type="number"
              min={0}
              step="0.01"
              value={depositFixed}
              onChange={(e) => setDepositFixed(Number(e.target.value))}
              className="dp-field"
            />
          )}
        </div>

        <div className="dp-glass space-y-3 rounded-3xl p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            How can they pay?
          </p>
          <select
            value={paymentPreference}
            onChange={(e) =>
              setPaymentPreference(e.target.value as typeof paymentPreference)
            }
            className="dp-field"
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
              className="dp-field resize-none"
            />
          )}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          rows={2}
          className="dp-field resize-none"
        />

        <div className="dp-glass-strong rounded-3xl p-5">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Total</span>
            <strong className="tabular-nums text-white">
              {total.toLocaleString(undefined, {
                style: "currency",
                currency: currency.toUpperCase(),
              })}
            </strong>
          </div>
          <div className="mt-2 flex justify-between text-lg">
            <span className="font-bold text-amber-400">Due now</span>
            <span className="font-black tabular-nums text-amber-400">
              {deposit.toLocaleString(undefined, {
                style: "currency",
                currency: currency.toUpperCase(),
              })}
            </span>
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="dp-btn-primary w-full !rounded-2xl !py-3.5 disabled:opacity-60"
        >
          {loading ? "…" : "Create quote & get link"}
        </button>
      </form>
    </div>
  );
}
