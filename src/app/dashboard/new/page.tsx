"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CURRENCIES } from "@/lib/money";
import { BrandMark } from "@/components/BrandMark";

type Item = { description: string; quantity: number; unitPrice: number };

type PayNowMode = "pct25" | "pct30" | "pct50" | "full" | "custom_pct" | "custom_fixed";

function fmt(amount: number, currency: string) {
  try {
    return amount.toLocaleString(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
    });
  } catch {
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  }
}

const emptyItem = (): Item => ({ description: "", quantity: 1, unitPrice: 0 });

export default function NewQuotePage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState("cad");
  const [lang, setLang] = useState<"fr" | "en">("en");
  const [payNowMode, setPayNowMode] = useState<PayNowMode>("pct30");
  const [customPercent, setCustomPercent] = useState(40);
  const [customFixed, setCustomFixed] = useState(500);
  const [paymentPreference, setPaymentPreference] = useState<
    "card_or_manual" | "card_only" | "manual_only"
  >("card_or_manual");
  const [manualPayInstructions, setManualPayInstructions] = useState(
    "Interac e-Transfer to you@email.com — Security answer: DevisPay"
  );
  const [items, setItems] = useState<Item[]>([emptyItem()]);
  const [showQty, setShowQty] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [payUrl, setPayUrl] = useState("");
  const [quoteToken, setQuoteToken] = useState("");
  const [emailing, setEmailing] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");

  const total = useMemo(
    () =>
      items.reduce(
        (s, it) => s + Math.max(0, it.quantity || 0) * Math.max(0, it.unitPrice || 0),
        0
      ),
    [items]
  );

  const { depositType, depositPercent, depositFixed, deposit } = useMemo(() => {
    if (payNowMode === "full") {
      return {
        depositType: "percent" as const,
        depositPercent: 100,
        depositFixed: undefined as number | undefined,
        deposit: total,
      };
    }
    if (payNowMode === "pct25") {
      return {
        depositType: "percent" as const,
        depositPercent: 25,
        depositFixed: undefined,
        deposit: (total * 25) / 100,
      };
    }
    if (payNowMode === "pct30") {
      return {
        depositType: "percent" as const,
        depositPercent: 30,
        depositFixed: undefined,
        deposit: (total * 30) / 100,
      };
    }
    if (payNowMode === "pct50") {
      return {
        depositType: "percent" as const,
        depositPercent: 50,
        depositFixed: undefined,
        deposit: (total * 50) / 100,
      };
    }
    if (payNowMode === "custom_pct") {
      const p = Math.min(100, Math.max(1, customPercent || 1));
      return {
        depositType: "percent" as const,
        depositPercent: p,
        depositFixed: undefined,
        deposit: (total * p) / 100,
      };
    }
    const fixed = Math.max(0, customFixed || 0);
    return {
      depositType: "fixed" as const,
      depositPercent: undefined as number | undefined,
      depositFixed: fixed,
      deposit: total > 0 ? Math.min(total, fixed) : fixed,
    };
  }, [payNowMode, customPercent, customFixed, total]);

  const remaining = Math.max(0, total - deposit);

  function updateItem(i: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function removeItem(i: number) {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanItems = items
      .map((it) => ({
        description: it.description.trim(),
        quantity: showQty ? Math.max(0.01, it.quantity || 1) : 1,
        unitPrice: Math.max(0, it.unitPrice || 0),
      }))
      .filter((it) => it.description && it.unitPrice > 0);

    if (cleanItems.length === 0) {
      setError("Add at least one charge: what it’s for and the price.");
      return;
    }
    if (deposit <= 0) {
      setError("Choose how much you want paid now (must be more than zero).");
      return;
    }
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
          items: cleanItems,
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
      const token =
        (data.quote?.publicToken as string) ||
        String(data.payUrl || "").split("/q/")[1] ||
        "";
      setQuoteToken(token);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function emailPayLink() {
    if (!quoteToken) return;
    setEmailing(true);
    setEmailMsg("");
    try {
      const res = await fetch(`/api/quotes/${quoteToken}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "pay_link", to: customerEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEmailMsg(data.message || data.error || "Email failed");
        return;
      }
      setEmailMsg(`Sent to ${data.to}`);
    } catch {
      setEmailMsg("Network error");
    } finally {
      setEmailing(false);
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
            Client pays{" "}
            <strong className="text-amber-400">{fmt(deposit, currency)}</strong> to
            start. Send this link:
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
          <button
            type="button"
            disabled={emailing || !quoteToken}
            onClick={() => void emailPayLink()}
            className="dp-btn-ghost mt-3 w-full !rounded-2xl disabled:opacity-50"
          >
            {emailing ? "Sending…" : `Email link to ${customerEmail}`}
          </button>
          {emailMsg && (
            <p className="mt-3 text-sm text-zinc-400">{emailMsg}</p>
          )}
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

  const chip = (mode: PayNowMode, label: string, sub?: string) => {
    const on = payNowMode === mode;
    return (
      <button
        key={mode}
        type="button"
        onClick={() => setPayNowMode(mode)}
        className={`rounded-2xl border px-3 py-3 text-left transition ${
          on
            ? "border-amber-400/50 bg-amber-500/15 ring-1 ring-amber-400/30"
            : "border-white/10 bg-black/20 hover:border-white/20"
        }`}
      >
        <span className={`block text-sm font-bold ${on ? "text-amber-300" : "text-white"}`}>
          {label}
        </span>
        {sub && <span className="mt-0.5 block text-[11px] text-zinc-500">{sub}</span>}
      </button>
    );
  };

  const curLabel = currency.toUpperCase();

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
            Job details → what you charge → how much you want paid now.
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
            placeholder="Customer phone (optional)"
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

        {/* SIMPLE MONEY LINES */}
        <div className="dp-glass space-y-4 rounded-3xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                What are you charging for?
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Name it and set the price. Keep it simple.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowQty((v) => !v)}
              className="shrink-0 text-[11px] font-semibold text-zinc-500 hover:text-amber-400"
            >
              {showQty ? "Hide qty" : "Need qty?"}
            </button>
          </div>

          <div className="space-y-3">
            {items.map((it, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-black/30 p-3 sm:p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-zinc-600">
                    Charge {i + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="text-[11px] font-semibold text-zinc-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  required
                  value={it.description}
                  onChange={(e) => updateItem(i, { description: e.target.value })}
                  placeholder="e.g. Kitchen remodel — phase 1"
                  className="dp-field mt-2"
                />
                <div
                  className={`mt-2 grid gap-2 ${showQty ? "grid-cols-2" : "grid-cols-1"}`}
                >
                  {showQty && (
                    <label className="text-[11px] font-medium text-zinc-500">
                      Quantity
                      <input
                        type="number"
                        min={0.01}
                        step="any"
                        value={it.quantity || ""}
                        onChange={(e) =>
                          updateItem(i, {
                            quantity: e.target.value === "" ? 0 : Number(e.target.value),
                          })
                        }
                        placeholder="1"
                        className="dp-field mt-1"
                      />
                    </label>
                  )}
                  <label className="text-[11px] font-medium text-zinc-500">
                    {showQty ? `Price each (${curLabel})` : `Price (${curLabel})`}
                    <div className="relative mt-1">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-500">
                        $
                      </span>
                      <input
                        required
                        type="number"
                        min={0}
                        step="0.01"
                        value={it.unitPrice || ""}
                        onChange={(e) =>
                          updateItem(i, {
                            unitPrice:
                              e.target.value === "" ? 0 : Number(e.target.value),
                          })
                        }
                        placeholder="0.00"
                        className="dp-field !pl-8"
                      />
                    </div>
                  </label>
                </div>
                {showQty && it.quantity > 0 && it.unitPrice > 0 && (
                  <p className="mt-2 text-right text-xs text-zinc-500">
                    Line total{" "}
                    <strong className="text-zinc-300">
                      {fmt(it.quantity * it.unitPrice, currency)}
                    </strong>
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setItems((p) => [...p, emptyItem()])}
            className="w-full rounded-2xl border border-dashed border-white/15 py-3 text-sm font-bold text-amber-400 transition hover:border-amber-500/40 hover:bg-amber-500/5"
          >
            + Add another charge
          </button>

          <div className="flex items-center justify-between rounded-2xl bg-black/40 px-4 py-3">
            <span className="text-sm text-zinc-500">Project total</span>
            <span className="text-lg font-black tabular-nums text-white">
              {fmt(total, currency)}
            </span>
          </div>
        </div>

        {/* HOW MUCH TO COLLECT */}
        <div className="dp-glass-strong space-y-4 rounded-3xl p-5 ring-1 ring-amber-500/20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-400/90">
              Get paid to start
            </p>
            <h2 className="dp-display mt-1 text-xl font-bold text-white">
              How much do you want paid now?
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              This is what the client pays on the link before you begin.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {chip("pct25", "25%", total > 0 ? fmt((total * 25) / 100, currency) : "of total")}
            {chip("pct30", "30%", total > 0 ? fmt((total * 30) / 100, currency) : "popular")}
            {chip("pct50", "50%", total > 0 ? fmt((total * 50) / 100, currency) : "half")}
            {chip("full", "100% — full amount", total > 0 ? fmt(total, currency) : "pay all")}
            {chip("custom_pct", "Other %", "type your %")}
            {chip("custom_fixed", "Exact $ amount", "type dollars")}
          </div>

          {payNowMode === "custom_pct" && (
            <label className="block text-sm text-zinc-400">
              Percent of total
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={customPercent}
                  onChange={(e) => setCustomPercent(Number(e.target.value))}
                  className="dp-field max-w-[140px]"
                />
                <span className="font-bold text-zinc-500">%</span>
              </div>
            </label>
          )}

          {payNowMode === "custom_fixed" && (
            <label className="block text-sm text-zinc-400">
              Exact amount to collect now ({curLabel})
              <div className="relative mt-1.5 max-w-[200px]">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-500">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={customFixed || ""}
                  onChange={(e) => setCustomFixed(Number(e.target.value))}
                  className="dp-field !pl-8"
                />
              </div>
            </label>
          )}

          <div className="rounded-2xl bg-black/40 px-4 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Project total</span>
              <span className="tabular-nums font-semibold">{fmt(total, currency)}</span>
            </div>
            <div className="mt-2 flex justify-between text-lg">
              <span className="font-bold text-amber-400">They pay now</span>
              <span className="font-black tabular-nums text-amber-400">
                {fmt(deposit, currency)}
              </span>
            </div>
            {remaining > 0.001 && (
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-zinc-500">Left after deposit</span>
                <span className="tabular-nums text-zinc-300">
                  {fmt(remaining, currency)}
                </span>
              </div>
            )}
            {remaining <= 0.001 && total > 0 && (
              <p className="mt-2 text-xs text-emerald-400/90">
                Full project paid up front — nothing left after this payment.
              </p>
            )}
          </div>
        </div>

        <div className="dp-glass space-y-3 rounded-3xl p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            How can they pay that amount?
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {(
              [
                ["card_or_manual", "Card or bank", "Most flexible"],
                ["card_only", "Card only", "Stripe"],
                ["manual_only", "Bank only", "Interac / wire"],
              ] as const
            ).map(([val, label, sub]) => (
              <button
                key={val}
                type="button"
                onClick={() => setPaymentPreference(val)}
                className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${
                  paymentPreference === val
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <span className="font-bold text-white">{label}</span>
                <span className="mt-0.5 block text-[11px] text-zinc-500">{sub}</span>
              </button>
            ))}
          </div>
          {paymentPreference !== "card_only" && (
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Bank / Interac instructions
              <textarea
                value={manualPayInstructions}
                onChange={(e) => setManualPayInstructions(e.target.value)}
                rows={3}
                placeholder="e.g. Interac to billing@yourfirm.com"
                className="dp-field mt-1.5 resize-none font-normal normal-case tracking-normal"
              />
            </label>
          )}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes for the client (optional)"
          rows={2}
          className="dp-field resize-none"
        />

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
          {loading
            ? "…"
            : `Create link · collect ${fmt(deposit, currency)} now`}
        </button>
      </form>
    </div>
  );
}
