"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [lang, setLang] = useState<"fr" | "en">("en");
  const fr = lang === "fr";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <span className="text-xl font-black text-amber-400">DevisPay</span>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex rounded-lg border border-white/15 p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-md px-2 py-1 ${!fr ? "bg-amber-500 text-black" : "text-zinc-400"}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("fr")}
              className={`rounded-md px-2 py-1 ${fr ? "bg-amber-500 text-black" : "text-zinc-400"}`}
            >
              FR
            </button>
          </div>
          <Link href="/login" className="text-zinc-400 hover:text-white">
            {fr ? "Connexion" : "Log in"}
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-amber-500 px-4 py-2 font-bold text-black hover:bg-amber-400"
          >
            {fr ? "Essayer" : "Start free"}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <p className="text-xs font-black uppercase tracking-widest text-amber-400">
          {fr ? "Payez ce devis · Simple comme Venmo" : "Pay this quote · Venmo-simple"}
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
          {fr ? (
            <>
              Encaissez l&apos;acompte <span className="text-amber-400">avant</span> de
              commencer.
            </>
          ) : (
            <>
              Get paid to <span className="text-amber-400">start</span>.
            </>
          )}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-zinc-400">
          {fr
            ? "Devis pro → un lien → acompte par carte ou virement. Pour tout service dans le monde : métiers, créatifs, maison, consultants. Pas une banque. Juste l'acompte, clairement."
            : "Professional quote → one link → deposit by card or bank. For any service worldwide: trades, creative, home, consulting. Not a bank. Just deposit, done."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
          >
            {fr ? "Créer mon compte" : "Create free account"}
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-zinc-300 hover:border-white/30"
          >
            {fr ? "J'ai un compte" : "I have an account"}
          </Link>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-3">
          {(fr
            ? [
                ["1. Devis", "Lignes, devise, % ou montant fixe d'acompte."],
                ["2. Lien", "Texto, courriel, WhatsApp — un URL."],
                ["3. Payé", "Carte (Stripe) ou marquer Interac/virement reçu."],
              ]
            : [
                ["1. Quote", "Line items, any currency, % or fixed deposit."],
                ["2. Link", "Text, email, WhatsApp — one URL."],
                ["3. Paid", "Card (Stripe) or mark bank/Interac received."],
              ]
          ).map(([t, d]) => (
            <li
              key={t}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="font-bold text-amber-400">{t}</p>
              <p className="mt-2 text-sm text-zinc-400">{d}</p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-zinc-500">
          {fr
            ? "Métiers · photo · design · ménage · coaching · et plus."
            : "Trades · photo · design · cleaning · coaching · and more."}
        </p>

        <section className="mt-16 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8">
          <h2 className="text-2xl font-black">
            {fr ? "Tarifs (mensuel)" : "Pricing (monthly)"}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {(fr
              ? [
                  ["Starter", "39 $ CAD", "15 devis / mois"],
                  ["Growth", "79 $ CAD", "Devis illimités"],
                  ["Business", "129 $ CAD", "Illimité + sièges"],
                ]
              : [
                  ["Starter", "$39 CAD", "15 quotes / mo"],
                  ["Growth", "$79 CAD", "Unlimited quotes"],
                  ["Business", "$129 CAD", "Unlimited + seats"],
                ]
            ).map(([n, p, f]) => (
              <div
                key={n}
                className="rounded-2xl border border-white/10 bg-black/40 p-5"
              >
                <p className="font-bold">{n}</p>
                <p className="mt-2 text-2xl font-black text-amber-400">{p}</p>
                <p className="mt-1 text-sm text-zinc-500">{f}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            {fr
              ? "Pas un compte d'escrow bancaire. Un lien de paiement sur un vrai devis — simple, mondial (Stripe)."
              : "Not a bank escrow account. A pay link on a real quote — simple, global (Stripe)."}
          </p>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} DevisPay · Global · Built for service businesses
      </footer>
    </div>
  );
}
