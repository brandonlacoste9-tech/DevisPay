"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { SiteFooter } from "@/components/SiteFooter";

const FILM = [
  { src: "/photos/kitchen-done.jpg", label: "Remodels" },
  { src: "/photos/plumber-work.jpg", label: "Plumbing" },
  { src: "/photos/carpentry.jpg", label: "Carpentry" },
  { src: "/photos/electrician.jpg", label: "Electrical" },
  { src: "/photos/house.jpg", label: "Homes" },
  { src: "/photos/van.jpg", label: "Service vans" },
  { src: "/photos/kitchen.jpg", label: "Kitchens" },
  { src: "/photos/handshake.jpg", label: "The handshake" },
];

export default function HomePage() {
  const [lang, setLang] = useState<"fr" | "en">("en");
  const fr = lang === "fr";

  const steps = fr
    ? [
        {
          n: "01",
          t: "Créez le devis",
          d: "Lignes, CAD ou USD, acompte % ou fixe. Une minute.",
          img: "/photos/kitchen2.jpg",
        },
        {
          n: "02",
          t: "Envoyez le lien",
          d: "Texto, courriel, WhatsApp. Ils ouvrent une vraie facture.",
          img: "/photos/handshake.jpg",
        },
        {
          n: "03",
          t: "Encaissez, puis commencez",
          d: "Carte, Interac ou virement. Le chantier part payé.",
          img: "/photos/plumber-work.jpg",
        },
      ]
    : [
        {
          n: "01",
          t: "Write the quote",
          d: "Line items, CAD or USD, deposit % or a flat amount. One minute.",
          img: "/photos/kitchen2.jpg",
        },
        {
          n: "02",
          t: "Send one link",
          d: "Text, email, WhatsApp. They open a bill — because it is one.",
          img: "/photos/handshake.jpg",
        },
        {
          n: "03",
          t: "Get paid, then start",
          d: "Card, Interac, or wire. The job starts funded.",
          img: "/photos/plumber-work.jpg",
        },
      ];

  const features = fr
    ? [
        ["CAD & USD", "Devis en dollars canadiens ou américains. Interac au Canada, carte partout."],
        ["Carte + virement", "Stripe Checkout, Interac, ACH ou virement — marqué reçu."],
        ["Comme une facture", "Le client paie un devis. Pas une app. Pas un Venmo."],
        ["FR / EN", "Le chantier parle français ou anglais. Le devis aussi."],
        ["Pas une banque", "Pas d'escrow. L'argent va sur votre Stripe."],
        ["Métiers & services", "Toiture, CVC, photo, ménage, rénos — Canada et États-Unis."],
      ]
    : [
        ["CAD & USD", "Quote in Canadian or US dollars. Interac in Canada, cards everywhere."],
        ["Card + bank", "Stripe Checkout, Interac, ACH, or wire — mark it received."],
        ["Looks like a bill", "They pay a quote. Not an app. Not Venmo."],
        ["EN / FR", "The job site speaks English or French. So does the quote."],
        ["Not a bank", "Not escrow. Money lands on your Stripe."],
        ["Trades & services", "Roofing, HVAC, photo, cleaning, remodels — Canada and the US."],
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

  const film = FILM.map((x) => ({
    ...x,
    label: fr
      ? {
          Remodels: "Rénos",
          Plumbing: "Plomberie",
          Carpentry: "Charpenterie",
          Electrical: "Électricité",
          Homes: "Maisons",
          "Service vans": "Fourgons",
          Kitchens: "Cuisines",
          "The handshake": "La poignée",
        }[x.label] || x.label
      : x.label,
  }));

  return (
    <div className="overflow-x-hidden bg-[#f4efe6] text-zinc-900">
      {/* Hero */}
      <section className="relative min-h-[100svh] overflow-hidden bg-black text-white">
        <video
          className="dp-kenburns absolute inset-0 h-full w-full object-cover opacity-80"
          autoPlay
          muted
          loop
          playsInline
          poster="/photos/kitchen-done.jpg"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

        <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <BrandMark invert />
          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#how" className="transition hover:text-white">
              {fr ? "Comment" : "How it works"}
            </a>
            <a href="#work" className="transition hover:text-white">
              {fr ? "Chantiers" : "The work"}
            </a>
            <a href="#pricing" className="transition hover:text-white">
              {fr ? "Tarifs" : "Pricing"}
            </a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex rounded-full border border-white/20 bg-black/30 p-0.5 text-[11px] font-bold backdrop-blur">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`rounded-full px-2.5 py-1 transition ${
                  !fr ? "bg-white text-black" : "text-white/60 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("fr")}
                className={`rounded-full px-2.5 py-1 transition ${
                  fr ? "bg-white text-black" : "text-white/60 hover:text-white"
                }`}
              >
                FR
              </button>
            </div>
            <Link
              href="/login"
              className="hidden text-sm font-medium text-white/70 transition hover:text-white sm:inline"
            >
              {fr ? "Connexion" : "Log in"}
            </Link>
            <Link href="/register" className="dp-btn-primary !bg-white !px-4 !py-2 !text-black text-xs sm:text-sm">
              {fr ? "Essayer" : "Start free"}
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto grid max-w-6xl items-end gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-8">
          <div className="pb-4">
            <p className="dp-animate-in text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">
              {fr ? "Canada & États-Unis · métiers" : "Canada & the US · trades"}
            </p>
            <h1 className="dp-animate-in dp-delay-1 dp-display mt-5 max-w-xl text-5xl font-semibold text-white sm:text-6xl lg:text-[4.4rem]">
              {fr ? (
                <>
                  L'acompte,{" "}
                  <em className="not-italic text-amber-300">avant</em> le premier clou.
                </>
              ) : (
                <>
                  Get paid{" "}
                  <em className="not-italic text-amber-300">before</em> the first nail.
                </>
              )}
            </h1>
            <p className="dp-animate-in dp-delay-2 mt-6 max-w-md text-lg leading-relaxed text-white/75">
              {fr
                ? "Un devis. Un lien. L'acompte sur votre Stripe. Interac au Canada, carte partout. Vous n'ouvrez pas le fourgon tant que ce n'est pas payé."
                : "One quote. One link. Deposit on your Stripe. Interac in Canada, cards everywhere. The van doesn’t roll until it’s paid."}
            </p>
            <div className="dp-animate-in dp-delay-3 mt-9 flex flex-wrap items-center gap-3">
              <Link href="/register" className="dp-btn-primary !bg-white !text-black">
                {fr ? "Créer mon compte" : "Create free account"}
                <span aria-hidden>→</span>
              </Link>
              <Link href="/q/demo" className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur hover:bg-white/10">
                {fr ? "Ouvrir un devis exemple" : "Open a sample quote"}
              </Link>
            </div>
          </div>

          <div className="dp-animate-in dp-delay-2 relative mx-auto w-full max-w-md lg:translate-y-6">
            <div className="dp-invoice overflow-hidden rounded-[1.5rem] shadow-2xl">
              <div className="dp-invoice-rule" />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800/70">
                      {fr ? "Devis" : "Quote"}
                    </p>
                    <p className="mt-1 text-sm font-semibold">Northline Builds · Toronto</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                    {fr ? "Dû" : "Due"}
                  </span>
                </div>
                <h3 className="dp-display mt-5 text-2xl text-[#1a1612]">
                  {fr ? "Rénovation cuisine — phase 1" : "Kitchen remodel — phase 1"}
                </h3>
                <p className="mt-1 text-sm text-[#6b6258]">
                  {fr ? "Pour" : "For"} Sophie Martin
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-[#1a1612]/10 pt-4 text-sm">
                  {(fr
                    ? [
                        ["Démolition & prep", "1 200 $"],
                        ["Plomberie", "2 800 $"],
                        ["Main-d'œuvre", "3 400 $"],
                      ]
                    : [
                        ["Demo & prep", "$1,200"],
                        ["Plumbing", "$2,800"],
                        ["Labor", "$3,400"],
                      ]
                  ).map(([a, b]) => (
                    <li key={a} className="flex justify-between text-[#3d362f]">
                      <span>{a}</span>
                      <span className="tabular-nums text-[#6b6258]">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="dp-due px-6 py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400/80">
                  {fr ? "À payer maintenant · 30%" : "Due now · 30%"}
                </p>
                <p className="dp-display mt-1 text-3xl font-semibold tabular-nums">
                  {fr ? "2 220 $ CAD" : "$2,220 CAD"}
                </p>
                <div className="dp-btn-primary mt-5 w-full !rounded-2xl !bg-white !py-3.5 !text-black">
                  {fr ? "Payer 2 220 $ CAD" : "Pay $2,220 CAD"}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 -left-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-white shadow-xl sm:-left-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                {fr ? "Payé · carte" : "Paid · card"}
              </p>
              <p className="text-sm font-semibold">{fr ? "Acompte reçu" : "Deposit secured"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Moving filmstrip */}
      <section className="relative z-10 -mt-6 overflow-hidden pb-2 pt-4">
        <div className="dp-film">
          <div className="dp-marquee">
            {[...film, ...film].map((p, i) => (
              <figure key={p.src + i} className="dp-photo relative h-36 w-56 shrink-0 overflow-hidden rounded-2xl sm:h-44 sm:w-72">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.label} />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-xs font-semibold text-white">
                  {p.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
          {fr ? "Comment ça marche" : "How it works"}
        </p>
        <h2 className="dp-display mt-3 max-w-xl text-4xl text-zinc-900 sm:text-5xl">
          {fr ? "Trois gestes. Le chantier part payé." : "Three moves. The job starts paid."}
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <article key={s.n} className="group overflow-hidden rounded-[1.6rem] bg-white shadow-sm ring-1 ring-zinc-900/10">
              <div className="dp-photo h-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt={s.t} />
              </div>
              <div className="p-6">
                <p className="text-[11px] font-bold tracking-[0.2em] text-amber-800">{s.n}</p>
                <h3 className="dp-display mt-2 text-2xl">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{s.d}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-zinc-600">
          {fr ? "Pour " : "For "}
          <Link href="/for/roofing" className="font-semibold text-amber-800 hover:underline">
            {fr ? "couvreurs" : "roofers"}
          </Link>
          {", "}
          <Link href="/for/plumbing" className="font-semibold text-amber-800 hover:underline">
            {fr ? "plombiers" : "plumbers"}
          </Link>
          {", "}
          <Link href="/for/hvac" className="font-semibold text-amber-800 hover:underline">
            HVAC
          </Link>
          {", "}
          <Link href="/for/remodeling" className="font-semibold text-amber-800 hover:underline">
            {fr ? "rénos" : "remodels"}
          </Link>
          {". "}
          <Link href={fr ? "/entrepreneurs" : "/contractors"} className="font-semibold text-amber-800 hover:underline">
            {fr ? "Tous les métiers →" : "All trades →"}
          </Link>
        </p>
      </section>
      <section id="work" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
              {fr ? "Le terrain" : "The work"}
            </p>
            <h2 className="dp-display mt-3 text-4xl sm:text-5xl">
              {fr ? "Fait pour le vrai chantier." : "Built for the real job."}
            </h2>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
          <figure className="dp-photo col-span-2 row-span-2 h-64 rounded-[1.4rem] md:h-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos/kitchen-done.jpg" alt="Finished kitchen" />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {fr ? "Cuisine · Toronto" : "Kitchen · Toronto"}
            </figcaption>
          </figure>
          <figure className="dp-photo h-40 rounded-[1.4rem] md:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos/plumber-work.jpg" alt="Plumber" />
          </figure>
          <figure className="dp-photo h-40 rounded-[1.4rem] md:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos/electrician.jpg" alt="Electrician" />
          </figure>
          <figure className="dp-photo h-40 rounded-[1.4rem] md:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos/carpentry.jpg" alt="Carpentry" />
          </figure>
          <figure className="dp-photo h-40 rounded-[1.4rem] md:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos/van.jpg" alt="Service van" />
          </figure>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <h2 className="dp-display text-3xl sm:text-4xl">
          {fr ? "Tout pour l'acompte. Rien d'autre." : "What you need to get the deposit. Nothing else."}
        </h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([t, d]) => (
            <div key={t} className="rounded-[1.4rem] bg-white p-6 ring-1 ring-zinc-900/10">
              <h3 className="font-bold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
            {fr ? "Tarifs" : "Pricing"}
          </p>
          <h2 className="dp-display mt-3 text-4xl">{fr ? "Simple. Transparent." : "Simple. Transparent."}</h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-[1.5rem] bg-white p-7 ring-1 ${
                p.highlight ? "ring-2 ring-zinc-900" : "ring-zinc-900/10"
              }`}
            >
              {p.highlight && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  {fr ? "Populaire" : "Most popular"}
                </span>
              )}
              <p className="text-sm font-semibold text-zinc-500">{p.name}</p>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="dp-display text-4xl">{p.price}</span>
                <span className="text-sm text-zinc-500">{p.unit}</span>
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-zinc-600">
                {p.feat.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-8 flex w-full justify-center ${p.highlight ? "dp-btn-primary" : "dp-btn-ghost"}`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Close */}
      <section className="relative mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="relative overflow-hidden rounded-[2rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/photos/house.jpg" alt="" className="dp-kenburns h-80 w-full object-cover sm:h-96" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <h2 className="dp-display text-3xl sm:text-5xl">
              {fr ? "Arrêtez de commencer le chantier sans acompte." : "Stop starting jobs unpaid."}
            </h2>
            <Link href="/register" className="dp-btn-primary mt-8 !bg-white !text-black">
              {fr ? "Lancer DevisPay" : "Launch DevisPay"}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-[#f4efe6]">
        <SiteFooter fr={fr} />
      </div>
    </div>
  );
}
