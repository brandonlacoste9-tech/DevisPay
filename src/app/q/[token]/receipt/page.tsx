"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { money } from "@/lib/money";
import { ShareQuote } from "@/components/ShareQuote";
import { quoteShareText } from "@/lib/share";

type ReceiptPayload = {
  quote: {
    status: string;
    title: string;
    customerName: string;
    customerEmail?: string;
    items: { description: string; quantity: number; unitPriceCents: number }[];
    totalCents: number;
    depositPercent?: number;
    depositAmountCents: number;
    remainingBalanceCents?: number;
    notes?: string;
    lang: string;
    currency: string;
    paidAt?: string;
    paidVia?: string;
    id: string;
    createdAt?: string;
  };
  business: {
    name: string;
    phone?: string;
    email?: string;
    country?: string;
    logoUrl?: string | null;
  };
};

export default function ReceiptPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [data, setData] = useState<ReceiptPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/quotes/${token}`);
      if (!res.ok) {
        setError("Not found");
        return;
      }
      setData(await res.json());
    })();
  }, [token]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4efe6] text-zinc-500">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4efe6] text-zinc-400">
        …
      </div>
    );
  }

  const { quote, business } = data;
  const fr = quote.lang === "fr";
  const cur = quote.currency || "cad";
  const loc = fr ? "fr-CA" : "en-CA";
  const isPaid = quote.status === "paid" || quote.status === "deposit_paid";
  const remaining =
    quote.remainingBalanceCents ??
    Math.max(0, quote.totalCents - quote.depositAmountCents);
  const receiptId = `DP-${quote.id.slice(0, 8).toUpperCase()}`;
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://devispay.com";
  const receiptUrl = `${origin}/q/${token}/receipt`;

  return (
    <div className="min-h-screen bg-[#f4efe6] text-[#1a1612] print:bg-white">
      <div className="mx-auto max-w-md px-4 py-8 print:max-w-none print:px-0 print:py-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href={`/q/${token}`} className="text-sm text-zinc-600 hover:text-zinc-900">
            ← {fr ? "Retour au devis" : "Back to quote"}
          </Link>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="dp-btn-primary !px-4 !py-2 text-xs"
            >
              {fr ? "Imprimer / PDF" : "Print / Save PDF"}
            </button>
            {isPaid && (
              <ShareQuote
                url={receiptUrl}
                title={fr ? "Reçu d'acompte" : "Deposit receipt"}
                text={
                  fr
                    ? `Reçu — ${quote.title}\nAcompte ${money(quote.depositAmountCents, cur, loc)} reçu.\n${receiptUrl}`
                    : quoteShareText({
                        title: `Receipt — ${quote.title}`,
                        depositCents: quote.depositAmountCents,
                        currency: cur,
                        url: receiptUrl,
                      })
                }
              />
            )}
          </div>
        </div>

        <article className="dp-invoice overflow-hidden rounded-[1.4rem] print:rounded-none print:shadow-none">
          <div className="dp-invoice-rule print:h-2" />
          <div className="p-7 sm:p-8">
            {!isPaid && (
              <p className="mb-5 rounded-lg bg-amber-100 px-3 py-2 text-sm text-amber-900">
                {fr
                  ? "Acompte non confirmé — pas un reçu de paiement."
                  : "Deposit not confirmed — not a payment receipt."}
              </p>
            )}

            <header className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {business.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={business.logoUrl}
                    alt=""
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a1612] text-lg font-black text-amber-400">
                    {business.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{business.name}</p>
                  {business.phone && (
                    <p className="text-xs text-[#6b6258]">{business.phone}</p>
                  )}
                </div>
              </div>
              {isPaid ? (
                <span className="dp-stamp">{fr ? "Payé" : "Paid"}</span>
              ) : (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-900">
                  {fr ? "Dû" : "Due"}
                </span>
              )}
            </header>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-800/70">
              {isPaid
                ? fr
                  ? "Reçu d'acompte"
                  : "Deposit receipt"
                : fr
                  ? "Devis"
                  : "Quote"}{" "}
              · {receiptId}
            </p>
            <h1 className="dp-display mt-2 text-2xl">{quote.title}</h1>
            <p className="mt-1 text-sm text-[#6b6258]">
              {fr ? "Pour" : "For"} {quote.customerName}
            </p>

            <ul className="mt-6 space-y-3 border-t border-[#1a1612]/10 pt-5 text-sm">
              {quote.items.map((it, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span>
                    {it.description}
                    <span className="text-[#9a8f82]"> × {it.quantity}</span>
                  </span>
                  <span className="tabular-nums">
                    {money(Math.round(it.quantity * it.unitPriceCents), cur, loc)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2 border-t border-[#1a1612]/10 pt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b6258]">{fr ? "Total du projet" : "Project total"}</span>
                <span className="font-semibold tabular-nums">
                  {money(quote.totalCents, cur, loc)}
                </span>
              </div>
            </div>
          </div>

          <div className="dp-due px-7 py-5 print:break-inside-avoid sm:px-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400/80">
              {isPaid
                ? fr
                  ? "Acompte reçu"
                  : "Deposit received"
                : fr
                  ? "À payer"
                  : "Due now"}
              {quote.depositPercent != null ? ` · ${quote.depositPercent}%` : ""}
            </p>
            <p className="dp-display mt-1 text-3xl tabular-nums">
              {money(quote.depositAmountCents, cur, loc)}
            </p>
            {isPaid && (
              <p className="mt-2 text-xs text-white/70">
                {quote.paidVia === "manual"
                  ? fr
                    ? "Virement / Interac"
                    : "Bank / Interac"
                  : fr
                    ? "Carte"
                    : "Card"}
                {quote.paidAt
                  ? ` · ${new Date(quote.paidAt).toLocaleString(loc)}`
                  : ""}
              </p>
            )}
            {remaining > 0 && (
              <p className="mt-3 text-sm text-white/80">
                {fr ? "Solde restant : " : "Balance left on the job: "}
                <strong className="text-white">{money(remaining, cur, loc)}</strong>
              </p>
            )}
          </div>

          <p className="px-7 py-4 text-center text-[10px] text-[#6b6258] print:px-8">
            {fr
              ? "Pour le dossier du chantier · Pas un compte d'escrow · devispay.com"
              : "For the job folder · Not a bank escrow · devispay.com"}
          </p>
        </article>
      </div>
    </div>
  );
}
