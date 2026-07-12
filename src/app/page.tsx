"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export default function HomePage() {
  const [lang, setLang] = useState<"fr" | "en">("en");
  const fr = lang === "fr";

  const steps = fr
    ? [
        {
          n: "01",
          t: "Créez le devis",
          d: "Lignes, devise, acompte % ou fixe. Pro en 60 secondes.",
        },
        {
          n: "02",
          t: "Partagez le lien",
          d: "Texto, courriel, WhatsApp. Un URL. Zéro friction.",
        },
        {
          n: "03",
          t: "Encaissez",
          d: "Carte via Stripe, ou Interac / virement — marqué reçu.",
        },
      ]
    : [
        {
          n: "01",
          t: "Craft the quote",
          d: "Line items, any currency, % or fixed deposit. Pro in 60s.",
        },
        {
          n: "02",
          t: "Share one link",
          d: "Text, email, WhatsApp. One URL. Zero friction.",
        },
        {
          n: "03",
          t: "Get paid",
          d: "Card via Stripe, or bank / Interac — mark received.",
        },
      ];

  const features = fr
    ? [
        ["Multi-devises", "CAD, USD, EUR, GBP, AUD — un moteur mondial."],
        ["Carte + virement", "Stripe Checkout ou instructions Interac / bank."],
        ["Page type Venmo", "Le client paie en un geste. Vous, calme."],
        ["FR / EN", "Devis bilingues. Votre marché, pas le nôtre."],
        ["Pas d'escrow", "Pas une banque. Un lien de paiement clair."],
        ["Prêt SaaS", "Plans Starter → Business. Scale clean."],
      ]
    : [
        ["Multi-currency", "CAD, USD, EUR, GBP, AUD — one global engine."],
        ["Card + bank", "Stripe Checkout or Interac / wire instructions."],
        ["Venmo-style page", "Client pays in one tap. You stay calm."],
        ["FR / EN", "Bilingual quotes. Your market, not ours."],
        ["Not escrow", "Not a bank. A clear pay-on-quote link."],
        ["SaaS-ready", "Starter → Business plans. Scale clean."],
      ];

  const plans = fr
    ? [
        {
          name: "Starter",
          price: "39 $",
          unit: "CAD / mois",
          feat: ["15 devis / mois", "Carte + manuel", "Lien public"],
          cta: "Commencer",
          highlight: false,
        },
        {
          name: "Growth",
          price: "79 $",
          unit: "CAD / mois",
          feat: ["Devis illimités", "Tout Starter", "Priorité produit"],
          cta: "Choisir Growth",
          highlight: true,
        },
        {
          name: "Business",
          price: "129 $",
          unit: "CAD / mois",
          feat: ["Illimité + sièges", "Support dédié", "Roadmap early"],
          cta: "Contacter",
          highlight: false,
        },
      ]
    : [
        {
          name: "Starter",
          price: "$39",
          unit: "CAD / mo",
          feat: ["15 quotes / mo", "Card + manual", "Public pay link"],
          cta: "Start free",
          highlight: false,
        },
        {
          name: "Growth",
          price: "$79",
          unit: "CAD / mo",
          feat: ["Unlimited quotes", "Everything in Starter", "Product priority"],
          cta: "Choose Growth",
          highlight: true,
        },
        {
          name: "Business",
          price: "$129",
          unit: "CAD / mo",
          feat: ["Unlimited + seats", "Dedicated support", "Early roadmap"],
          cta: "Talk to us",
          highlight: false,
        },
      ];

  return (
    <div className="dp-mesh dp-noise relative min-h-screen overflow-x-hidden text-zinc-100">
      <div className="pointer-events-none absolute inset-0 dp-grid opacity-60" />

      {/* Nav */}
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a href="#how" className="transition hover:text-white">
            {fr ? "Comment" : "How it works"}
          </a>
          <a href="#features" className="transition hover:text-white">
            {fr ? "Fonctions" : "Product"}
          </a>
          <a href="#pricing" className="transition hover:text-white">
            {fr ? "Tarifs" : "Pricing"}
          </a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex rounded-full border border-white/10 bg-black/40 p-0.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-full px-2.5 py-1 transition ${
                !fr ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("fr")}
              className={`rounded-full px-2.5 py-1 transition ${
                fr ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              FR
            </button>
          </div>
          <Link
            href="/login"
            className="hidden text-sm font-medium text-zinc-400 transition hover:text-white sm:inline"
          >
            {fr ? "Connexion" : "Log in"}
          </Link>
          <Link href="/register" className="dp-btn-primary !px-4 !py-2 text-xs sm:text-sm">
            {fr ? "Essayer" : "Start free"}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-16">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="dp-animate-in inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-300/90">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              {fr ? "Payez ce devis · Simple" : "Pay this quote · Venmo-simple"}
            </div>

            <h1 className="dp-animate-in dp-delay-1 dp-display mt-6 max-w-xl text-5xl font-extrabold text-white sm:text-6xl lg:text-[4.25rem]">
              {fr ? (
                <>
                  L&apos;acompte,{" "}
                  <span className="dp-shimmer-text">avant</span> de commencer.
                </>
              ) : (
                <>
                  Get paid to{" "}
                  <span className="dp-shimmer-text">start</span>.
                </>
              )}
            </h1>

            <p className="dp-animate-in dp-delay-2 mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">
              {fr
                ? "Devis pro → un lien → acompte par carte ou virement. Pour tout service dans le monde. Pas une banque. Juste l'argent qui arrive avant le travail."
                : "Professional quote → one link → deposit by card or bank. For any service business on earth. Not a bank. Just the money before the work."}
            </p>

            <div className="dp-animate-in dp-delay-3 mt-9 flex flex-wrap items-center gap-3">
              <Link href="/register" className="dp-btn-primary">
                {fr ? "Créer mon compte" : "Create free account"}
                <span aria-hidden>→</span>
              </Link>
              <Link href="/login" className="dp-btn-ghost">
                {fr ? "J'ai un compte" : "I have an account"}
              </Link>
            </div>

            <div className="dp-animate-in dp-delay-4 mt-10 flex flex-wrap items-center gap-6 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] text-emerald-400">
                  ✓
                </span>
                {fr ? "Sans carte pour démarrer" : "No card to start"}
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] text-emerald-400">
                  ✓
                </span>
                Stripe · Interac · multi-currency
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] text-emerald-400">
                  ✓
                </span>
                {fr ? "FR & EN natifs" : "Native FR & EN"}
              </div>
            </div>
          </div>

          {/* Product mock */}
          <div className="dp-animate-in dp-delay-2 relative mx-auto w-full max-w-md">
            <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-amber-500/20 via-transparent to-indigo-500/15 blur-2xl" />
            <div className="dp-glass-strong relative overflow-hidden rounded-[1.75rem] p-1">
              <div className="rounded-[1.5rem] bg-[#0a0a0c] p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                      DevisPay
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">Atelier Nord · Montréal</p>
                  </div>
                  <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-bold text-amber-300">
                    {fr ? "Dû maintenant" : "Due now"}
                  </span>
                </div>

                <h3 className="dp-display mt-5 text-2xl font-bold text-white">
                  {fr ? "Rénovation cuisine — phase 1" : "Kitchen remodel — phase 1"}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  {fr ? "Pour" : "For"} Sophie Martin
                </p>

                <ul className="mt-6 space-y-3 border-t border-white/8 pt-5 text-sm">
                  {(fr
                    ? [
                        ["Démolition & prep", "1 200 $"],
                        ["Plomberie rough-in", "2 800 $"],
                        ["Main-d'œuvre", "3 400 $"],
                      ]
                    : [
                        ["Demo & prep", "$1,200"],
                        ["Plumbing rough-in", "$2,800"],
                        ["Labor", "$3,400"],
                      ]
                  ).map(([a, b]) => (
                    <li key={a} className="flex justify-between text-zinc-300">
                      <span>{a}</span>
                      <span className="tabular-nums text-zinc-400">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 space-y-2 border-t border-white/8 pt-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Total</span>
                    <span className="font-semibold tabular-nums">
                      {fr ? "7 400 $ CAD" : "$7,400 CAD"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-amber-400">
                      {fr ? "Acompte 30%" : "Deposit 30%"}
                    </span>
                    <span className="font-black tabular-nums text-amber-400">
                      {fr ? "2 220 $ CAD" : "$2,220 CAD"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="dp-btn-primary mt-7 w-full !rounded-2xl !py-3.5"
                >
                  {fr ? "Payer 2 220 $ CAD" : "Pay $2,220 CAD"}
                </button>
                <button
                  type="button"
                  className="mt-2 w-full rounded-2xl border border-white/10 py-3 text-xs font-semibold text-zinc-400"
                >
                  {fr ? "Interac / virement" : "Bank / Interac instead"}
                </button>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-2 rounded-2xl border border-white/10 bg-zinc-950/90 px-4 py-3 shadow-2xl backdrop-blur sm:-left-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {fr ? "Payé · carte" : "Paid · card"}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {fr ? "Acompte reçu" : "Deposit secured"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Logo strip */}
      <section className="relative z-10 border-y border-white/5 bg-black/20 py-8">
        <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
          {fr
            ? "Pour les entreprises de service qui facturent avec confiance"
            : "Built for service businesses that bill with confidence"}
        </p>
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 text-sm font-semibold text-zinc-600">
          {(fr
            ? ["Métiers", "Photo", "Design", "Ménage", "Coaching", "Consulting"]
            : ["Trades", "Photo", "Design", "Cleaning", "Coaching", "Consulting"]
          ).map((x) => (
            <span key={x} className="tracking-wide">
              {x}
            </span>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="relative z-10 mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400/90">
            {fr ? "Comment ça marche" : "How it works"}
          </p>
          <h2 className="dp-display mt-3 text-3xl font-bold text-white sm:text-4xl">
            {fr ? "Trois étapes. Zéro drame." : "Three steps. Zero drama."}
          </h2>
        </div>
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="dp-glass group rounded-3xl p-7 transition hover:border-amber-500/25"
            >
              <span className="dp-display text-4xl font-bold text-white/10 transition group-hover:text-amber-400/30">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features bento */}
      <section id="features" className="relative z-10 mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400/90">
            {fr ? "Produit" : "Product"}
          </p>
          <h2 className="dp-display mt-3 text-3xl font-bold text-white sm:text-4xl">
            {fr
              ? "Tout ce qu'il faut. Rien de plus."
              : "Everything you need. Nothing you don't."}
          </h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([t, d], i) => (
            <div
              key={t}
              className={`dp-glass rounded-3xl p-6 ${
                i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
                <span className="text-sm font-black">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="font-bold text-white">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 mx-auto max-w-6xl px-5 pb-28 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400/90">
            {fr ? "Tarifs" : "Pricing"}
          </p>
          <h2 className="dp-display mt-3 text-3xl font-bold text-white sm:text-4xl">
            {fr ? "Simple. Transparent." : "Simple. Transparent."}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500">
            {fr
              ? "Commencez gratuitement. Passez en plan quand vous scalez."
              : "Start free. Upgrade when you're scaling."}
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl p-7 ${
                p.highlight
                  ? "dp-glass-strong ring-1 ring-amber-400/30"
                  : "dp-glass"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                  {fr ? "Populaire" : "Most popular"}
                </span>
              )}
              <p className="text-sm font-semibold text-zinc-400">{p.name}</p>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="dp-display text-4xl font-extrabold text-white">
                  {p.price}
                </span>
                <span className="text-sm text-zinc-500">{p.unit}</span>
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-zinc-400">
                {p.feat.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-amber-400">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-8 flex w-full justify-center ${
                  p.highlight ? "dp-btn-primary" : "dp-btn-ghost"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-zinc-600">
          {fr
            ? "Pas un compte d'escrow bancaire. Un lien de paiement sur un vrai devis — simple, mondial."
            : "Not a bank escrow account. A pay link on a real quote — simple, global."}
        </p>
      </section>

      {/* CTA band */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/15 via-[#0c0c0e] to-indigo-500/10 px-8 py-14 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,185,66,0.15),transparent_55%)]" />
          <h2 className="dp-display relative text-3xl font-bold text-white sm:text-4xl">
            {fr
              ? "Arrêtez de commencer sans acompte."
              : "Stop starting work unpaid."}
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-zinc-400">
            {fr
              ? "Le premier devis payé change tout. Créez le vôtre en une minute."
              : "Your first paid quote changes everything. Create yours in a minute."}
          </p>
          <Link href="/register" className="dp-btn-primary relative mt-8 inline-flex">
            {fr ? "Lancer DevisPay" : "Launch DevisPay"}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
          <BrandMark size="sm" />
          <p className="text-center text-xs text-zinc-600">
            © {new Date().getFullYear()} DevisPay · devispay.com ·{" "}
            {fr ? "Pour les entreprises de service" : "For service businesses"}
          </p>
          <div className="flex gap-4 text-xs text-zinc-600">
            <Link href="/login" className="hover:text-zinc-400">
              {fr ? "Connexion" : "Log in"}
            </Link>
            <Link href="/register" className="hover:text-zinc-400">
              {fr ? "S'inscrire" : "Sign up"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
