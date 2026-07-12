"use client";

import { use, useEffect, useState } from "react";
import { money } from "@/lib/money";

type QuotePayload = {
  quote: {
    status: string;
    title: string;
    customerName: string;
    items: { description: string; quantity: number; unitPriceCents: number }[];
    totalCents: number;
    depositPercent?: number;
    depositAmountCents: number;
    notes?: string;
    lang: string;
    currency: string;
    paymentPreference: string;
    manualPayInstructions?: string;
    paidAt?: string;
    paidVia?: string;
  };
  business: { name: string; phone?: string; email?: string };
};

export default function PublicQuotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [data, setData] = useState<QuotePayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [justPaid, setJustPaid] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [sellerMode, setSellerMode] = useState(false);
  const [marking, setMarking] = useState(false);

  async function load() {
    const res = await fetch(`/api/quotes/${token}`);
    if (!res.ok) {
      setError("Quote not found");
      return;
    }
    setData(await res.json());
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search);
      setJustPaid(q.get("paid") === "1");
      setSellerMode(q.get("seller") === "1");
    }
    void load();
  }, [token]);

  async function payCard() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || json.error || "Card pay unavailable");
        return;
      }
      if (json.url) window.location.href = json.url as string;
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function markPaid() {
    setMarking(true);
    setError("");
    try {
      const res = await fetch(`/api/quotes/${token}/mark-paid`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Login as the seller to mark paid");
        return;
      }
      setJustPaid(true);
      await load();
    } catch {
      setError("Network error");
    } finally {
      setMarking(false);
    }
  }

  if (error && !data) {
    return (
      <div className="dp-mesh flex min-h-screen items-center justify-center text-zinc-500">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dp-mesh flex min-h-screen items-center justify-center text-zinc-600">
        <div className="h-8 w-8 animate-pulse rounded-full bg-amber-500/20" />
      </div>
    );
  }

  const { quote, business } = data;
  const fr = quote.lang === "fr";
  const cur = quote.currency || "cad";
  const loc = fr ? "fr-CA" : "en-CA";
  const isPaid =
    quote.status === "paid" || quote.status === "deposit_paid" || justPaid;
  const allowCard =
    quote.paymentPreference === "card_only" ||
    quote.paymentPreference === "card_or_manual";
  const allowManual =
    quote.paymentPreference === "manual_only" ||
    quote.paymentPreference === "card_or_manual";

  return (
    <div className="dp-mesh dp-noise relative min-h-screen px-4 py-10 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 dp-grid opacity-40" />
      <div className="relative z-10 mx-auto max-w-md">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-600">
          Devis<span className="text-amber-500/70">Pay</span>
        </p>

        <div className="dp-glass-strong mt-6 overflow-hidden rounded-[1.75rem] p-1">
          <div className="rounded-[1.5rem] bg-[#0a0a0c]/90 p-6 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-400">{business.name}</p>
                <h1
                  className="dp-display mt-1 text-2xl font-bold leading-tight text-white"
                >
                  {quote.title}
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  {fr ? "Pour" : "For"} {quote.customerName}
                </p>
              </div>
              {!isPaid && (
                <span className="shrink-0 rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-bold text-amber-300 ring-1 ring-amber-500/20">
                  {fr ? "Dû" : "Due"}
                </span>
              )}
            </div>

            <ul className="mt-6 space-y-3 border-t border-white/8 pt-5">
              {quote.items.map((it, i) => (
                <li key={i} className="flex justify-between gap-3 text-sm">
                  <span className="text-zinc-300">
                    {it.description}
                    <span className="text-zinc-600"> × {it.quantity}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-zinc-200">
                    {money(Math.round(it.quantity * it.unitPriceCents), cur, loc)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2 border-t border-white/8 pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Total</span>
                <span className="font-semibold tabular-nums">
                  {money(quote.totalCents, cur, loc)}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-bold text-amber-400">
                  {fr ? "À payer maintenant" : "Due now"}
                  {quote.depositPercent != null
                    ? ` (${quote.depositPercent}%)`
                    : ""}
                </span>
                <span className="font-black tabular-nums text-amber-400">
                  {money(quote.depositAmountCents, cur, loc)}
                </span>
              </div>
            </div>

            {quote.notes && (
              <p className="mt-4 whitespace-pre-wrap text-xs leading-relaxed text-zinc-500">
                {quote.notes}
              </p>
            )}

            {isPaid ? (
              <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 py-7 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-xl text-emerald-400">
                  ✓
                </div>
                <p className="mt-3 text-lg font-black text-emerald-400">
                  {fr ? "Payé" : "Paid"}
                </p>
                <p className="mt-1 text-xs text-emerald-500/80">
                  {quote.paidVia === "manual"
                    ? fr
                      ? "Confirmé (virement / Interac)"
                      : "Confirmed (bank / Interac)"
                    : fr
                      ? "Carte"
                      : "Card"}
                  {quote.paidAt
                    ? ` · ${new Date(quote.paidAt).toLocaleString(loc)}`
                    : ""}
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-3">
                {allowCard && (
                  <button
                    type="button"
                    onClick={payCard}
                    disabled={loading}
                    className="dp-btn-primary w-full !rounded-2xl !py-4 text-base disabled:opacity-60"
                  >
                    {loading
                      ? "…"
                      : fr
                        ? `Payer ${money(quote.depositAmountCents, cur, loc)}`
                        : `Pay ${money(quote.depositAmountCents, cur, loc)}`}
                  </button>
                )}

                {allowManual && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowManual((v) => !v)}
                      className="dp-btn-ghost w-full !rounded-2xl"
                    >
                      {fr
                        ? "Payer autrement (Interac / virement)"
                        : "Pay another way (bank / Interac)"}
                    </button>
                    {showManual && (
                      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
                        {quote.manualPayInstructions ||
                          (fr
                            ? "Contactez l'entreprise pour les instructions de virement."
                            : "Contact the business for bank transfer instructions.")}
                        <p className="mt-3 text-xs text-zinc-500">
                          {fr ? "Montant exact : " : "Exact amount: "}
                          <strong className="text-amber-400">
                            {money(quote.depositAmountCents, cur, loc)}
                          </strong>
                        </p>
                      </div>
                    )}
                  </>
                )}

                {sellerMode && (
                  <button
                    type="button"
                    onClick={markPaid}
                    disabled={marking}
                    className="w-full rounded-2xl border border-emerald-500/40 py-3 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/10"
                  >
                    {marking
                      ? "…"
                      : fr
                        ? "Marquer acompte reçu (vendeur)"
                        : "Mark deposit received (seller)"}
                  </button>
                )}
              </div>
            )}

            {error && (
              <p className="mt-4 text-center text-sm text-red-400">{error}</p>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] tracking-wide text-zinc-600">
          {fr
            ? "Paiement sécurisé · Pas un compte bancaire d'escrow"
            : "Secure payment · Not a bank escrow account"}
        </p>
      </div>
    </div>
  );
}
