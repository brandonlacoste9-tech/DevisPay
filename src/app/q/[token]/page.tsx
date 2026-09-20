"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
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
    remainingBalanceCents?: number;
    notes?: string;
    lang: string;
    currency: string;
    paymentPreference: string;
    manualPayInstructions?: string;
    paidAt?: string;
    paidVia?: string;
  };
  business: {
    name: string;
    phone?: string;
    email?: string;
    logoUrl?: string | null;
  };
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
      if (q.get("seller") === "1") {
        void fetch("/api/account")
          .then((r) => {
            if (!r.ok) setSellerMode(false);
          })
          .catch(() => setSellerMode(false));
      }
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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/photos/kitchen.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <p className="relative z-10">{error}</p>
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
  const remaining =
    quote.remainingBalanceCents ??
    Math.max(0, quote.totalCents - quote.depositAmountCents);

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10 text-zinc-900">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/photos/kitchen.jpg"
        alt=""
        className="dp-kenburns pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/55" />
      <div className="relative z-10 mx-auto max-w-md">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.32em] text-white/70">
          Devis<span className="text-amber-300">Pay</span>
        </p>

        <article className="dp-invoice mt-6 overflow-hidden rounded-[1.6rem]">
          <div className="dp-invoice-rule" />
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-3">
              {business.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-black/10"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a1612] text-lg font-black text-amber-400">
                  {business.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-800/70">
                  {fr ? "Devis" : "Quote"}
                </p>
                <p className="truncate text-base font-semibold text-[#1a1612]">
                  {business.name}
                </p>
                {business.phone && (
                  <p className="text-xs text-[#6b6258]">{business.phone}</p>
                )}
              </div>
              {isPaid ? (
                <span className="dp-stamp shrink-0">{fr ? "Payé" : "Paid"}</span>
              ) : (
                <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                  {fr ? "Dû" : "Due"}
                </span>
              )}
            </div>

            <h1 className="dp-display mt-6 text-[1.65rem] font-bold leading-tight text-[#1a1612]">
              {quote.title}
            </h1>
            <p className="mt-1 text-sm text-[#6b6258]">
              {fr ? "Pour" : "For"} {quote.customerName}
            </p>

            <ul className="mt-6 space-y-3 border-t border-[#1a1612]/10 pt-5">
              {quote.items.map((it, i) => (
                <li key={i} className="flex justify-between gap-3 text-sm">
                  <span className="text-[#3d362f]">
                    {it.description}
                    <span className="text-[#9a8f82]"> × {it.quantity}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-[#1a1612]">
                    {money(Math.round(it.quantity * it.unitPriceCents), cur, loc)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2 border-t border-[#1a1612]/10 pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#6b6258]">
                  {fr ? "Total du projet" : "Project total"}
                </span>
                <span className="font-semibold tabular-nums">
                  {money(quote.totalCents, cur, loc)}
                </span>
              </div>
              {remaining > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b6258]">
                    {fr ? "Solde après acompte" : "Balance after deposit"}
                  </span>
                  <span className="tabular-nums text-[#3d362f]">
                    {money(remaining, cur, loc)}
                  </span>
                </div>
              )}
            </div>

            {quote.notes && (
              <p className="mt-4 whitespace-pre-wrap text-xs leading-relaxed text-[#6b6258]">
                {quote.notes}
              </p>
            )}
          </div>

          <div className="dp-due px-6 py-5 sm:px-8">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400/80">
                  {isPaid
                    ? fr
                      ? "Acompte reçu"
                      : "Deposit received"
                    : fr
                      ? "À payer maintenant"
                      : "Due now"}
                  {!isPaid && quote.depositPercent != null
                    ? ` · ${quote.depositPercent}%`
                    : ""}
                </p>
                <p className="dp-display mt-1 text-3xl font-extrabold tabular-nums tracking-tight">
                  {money(quote.depositAmountCents, cur, loc)}
                </p>
              </div>
            </div>

            {isPaid ? (
              <div className="mt-5 space-y-3">
                <p className="text-xs text-zinc-400">
                  {quote.paidVia === "manual"
                    ? fr
                      ? "Confirmé (virement / Interac)"
                      : "Confirmed (bank / Interac)"
                    : fr
                      ? "Payé par carte"
                      : "Paid by card"}
                  {quote.paidAt
                    ? ` · ${new Date(quote.paidAt).toLocaleString(loc)}`
                    : ""}
                </p>
                <Link
                  href={`/q/${token}/receipt`}
                  className="dp-btn-ghost flex w-full !rounded-2xl !border-white/15 !bg-white/5"
                >
                  {fr ? "Voir le reçu" : "View receipt"}
                </Link>
              </div>
            ) : (
              <div className="mt-5 space-y-2.5">
                {allowCard && (
                  <button
                    type="button"
                    onClick={payCard}
                    disabled={loading}
                    className="dp-btn-primary w-full !rounded-2xl !py-3.5 text-base disabled:opacity-60"
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
                      className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 text-xs font-semibold text-zinc-200 transition hover:bg-white/10"
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
                    className="w-full rounded-2xl border border-emerald-400/40 py-3 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/10"
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
        </article>

        <p className="mt-8 text-center text-[10px] tracking-wide text-white/55">
          {fr
            ? "Paiement sécurisé · Pas un compte bancaire d'escrow"
            : "Secure payment · Not a bank escrow account"}
        </p>
      </div>
    </div>
  );
}
