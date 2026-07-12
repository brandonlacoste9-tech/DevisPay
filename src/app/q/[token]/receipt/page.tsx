"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { money } from "@/lib/money";

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
      <div className="flex min-h-screen items-center justify-center bg-white text-zinc-500">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-zinc-400">
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

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 print:bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8 print:py-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link href={`/q/${token}`} className="text-sm text-zinc-500 hover:text-zinc-800">
            ← {fr ? "Retour au devis" : "Back to quote"}
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-bold text-white hover:bg-zinc-800"
          >
            {fr ? "Imprimer / PDF" : "Print / Save PDF"}
          </button>
        </div>

        <article className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 print:shadow-none print:ring-0 sm:p-10">
          {!isPaid && (
            <p className="mb-6 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {fr
                ? "Acompte non confirmé — ce document n'est pas un reçu de paiement."
                : "Deposit not confirmed — this is not a payment receipt."}
            </p>
          )}

          <header className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-6">
            <div className="flex items-center gap-3">
              {business.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={business.logoUrl}
                  alt=""
                  className="h-14 w-14 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-900 text-xl font-black text-amber-400">
                  {business.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-lg font-bold">{business.name}</p>
                {business.email && (
                  <p className="text-sm text-zinc-500">{business.email}</p>
                )}
                {business.phone && (
                  <p className="text-sm text-zinc-500">{business.phone}</p>
                )}
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="font-bold uppercase tracking-wider text-zinc-400">
                {isPaid
                  ? fr
                    ? "Reçu d'acompte"
                    : "Deposit receipt"
                  : fr
                    ? "Devis"
                    : "Quote"}
              </p>
              <p className="mt-1 font-mono text-xs text-zinc-500">{receiptId}</p>
            </div>
          </header>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {fr ? "Client" : "Bill to"}
              </p>
              <p className="mt-1 font-semibold">{quote.customerName}</p>
              {quote.customerEmail && (
                <p className="text-sm text-zinc-500">{quote.customerEmail}</p>
              )}
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {fr ? "Projet" : "Project"}
              </p>
              <p className="mt-1 font-semibold">{quote.title}</p>
              {quote.paidAt && (
                <p className="text-sm text-zinc-500">
                  {fr ? "Payé le " : "Paid "}
                  {new Date(quote.paidAt).toLocaleString(loc)}
                </p>
              )}
              {quote.paidVia && (
                <p className="text-sm text-zinc-500">
                  {fr ? "Via " : "Via "}
                  {quote.paidVia === "manual"
                    ? fr
                      ? "virement / Interac"
                      : "bank / Interac"
                    : fr
                      ? "carte"
                      : "card"}
                </p>
              )}
            </div>
          </div>

          <table className="mt-8 w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wider text-zinc-400">
                <th className="pb-2 font-bold">{fr ? "Description" : "Description"}</th>
                <th className="pb-2 text-right font-bold">{fr ? "Qté" : "Qty"}</th>
                <th className="pb-2 text-right font-bold">{fr ? "Montant" : "Amount"}</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((it, i) => (
                <tr key={i} className="border-b border-zinc-50">
                  <td className="py-3">{it.description}</td>
                  <td className="py-3 text-right tabular-nums text-zinc-500">
                    {it.quantity}
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    {money(Math.round(it.quantity * it.unitPriceCents), cur, loc)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 space-y-2 border-t border-zinc-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">{fr ? "Total du projet" : "Project total"}</span>
              <span className="font-semibold tabular-nums">
                {money(quote.totalCents, cur, loc)}
              </span>
            </div>
            <div className="flex justify-between text-base">
              <span className="font-bold">
                {isPaid
                  ? fr
                    ? "Acompte reçu"
                    : "Deposit received"
                  : fr
                    ? "Acompte dû"
                    : "Deposit due"}
                {quote.depositPercent != null ? ` (${quote.depositPercent}%)` : ""}
              </span>
              <span className="font-black tabular-nums">
                {money(quote.depositAmountCents, cur, loc)}
              </span>
            </div>
            {remaining > 0 && (
              <div className="flex justify-between text-zinc-600">
                <span>{fr ? "Solde restant" : "Remaining balance"}</span>
                <span className="tabular-nums">{money(remaining, cur, loc)}</span>
              </div>
            )}
          </div>

          {quote.notes && (
            <p className="mt-6 whitespace-pre-wrap text-xs text-zinc-500">
              {quote.notes}
            </p>
          )}

          <footer className="mt-10 border-t border-zinc-100 pt-4 text-center text-[10px] text-zinc-400">
            {fr
              ? "Document généré par DevisPay · Paiement sur devis · Pas un compte d'escrow bancaire"
              : "Generated by DevisPay · Pay on quote · Not a bank escrow account"}
            {" · "}
            devispay.com
          </footer>
        </article>
      </div>
    </div>
  );
}
