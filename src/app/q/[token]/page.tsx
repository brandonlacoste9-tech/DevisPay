"use client";

import { use, useEffect, useState } from "react";

type QuotePayload = {
  quote: {
    status: string;
    title: string;
    customerName: string;
    items: { description: string; quantity: number; unitPriceCents: number }[];
    totalCents: number;
    depositPercent: number;
    depositAmountCents: number;
    notes?: string;
    lang: string;
    paidAt?: string;
  };
  business: { name: string; phone?: string; email?: string };
};

function money(cents: number) {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format(cents / 100);
}

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search);
      setJustPaid(q.get("paid") === "1");
    }
    void (async () => {
      const res = await fetch(`/api/quotes/${token}`);
      if (!res.ok) {
        setError("Devis introuvable");
        return;
      }
      setData(await res.json());
    })();
  }, [token]);

  async function pay() {
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
        setError(json.message || json.error || "Paiement indisponible");
        return;
      }
      if (json.url) window.location.href = json.url as string;
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  if (error && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-zinc-400">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-zinc-500">
        …
      </div>
    );
  }

  const { quote, business } = data;
  const isPaid = quote.status === "deposit_paid" || justPaid;

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-lg">
        <p className="text-xs font-black uppercase tracking-widest text-amber-400">
          DevisPay
        </p>
        <h1 className="mt-2 text-2xl font-black">{business.name}</h1>
        {business.phone && (
          <p className="text-sm text-zinc-500">{business.phone}</p>
        )}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-bold">{quote.title}</h2>
          <p className="mt-1 text-sm text-zinc-500">Pour {quote.customerName}</p>

          <ul className="mt-6 space-y-2 border-t border-white/10 pt-4">
            {quote.items.map((it, i) => (
              <li key={i} className="flex justify-between gap-4 text-sm">
                <span className="text-zinc-300">
                  {it.description}{" "}
                  <span className="text-zinc-600">× {it.quantity}</span>
                </span>
                <span className="shrink-0 tabular-nums">
                  {money(Math.round(it.quantity * it.unitPriceCents))}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-1 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Total</span>
              <span className="font-bold">{money(quote.totalCents)}</span>
            </div>
            <div className="flex justify-between text-amber-400">
              <span>Acompte ({quote.depositPercent}%)</span>
              <span className="font-bold">{money(quote.depositAmountCents)}</span>
            </div>
          </div>

          {quote.notes && (
            <p className="mt-4 text-xs text-zinc-500 whitespace-pre-wrap">{quote.notes}</p>
          )}

          {isPaid ? (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center text-sm text-green-300">
              Acompte reçu. Merci!
              {quote.paidAt && (
                <p className="mt-1 text-xs text-green-500/80">
                  {new Date(quote.paidAt).toLocaleString("fr-CA")}
                </p>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={pay}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-60"
            >
              {loading ? "…" : `Payer l'acompte — ${money(quote.depositAmountCents)}`}
            </button>
          )}

          {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
