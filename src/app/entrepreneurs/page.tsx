import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { SiteFooter } from "@/components/SiteFooter";
import { TRADES } from "@/lib/seo-trades";

export const metadata: Metadata = {
  title: "Logiciel d’acompte pour entrepreneurs — Canada",
  description:
    "DevisPay : devis, lien, acompte par carte ou Interac. Pour couvreurs, plombiers, CVC et rénos au Canada.",
  alternates: {
    canonical: "https://devispay.com/entrepreneurs",
    languages: { "fr-CA": "https://devispay.com/entrepreneurs", "en-CA": "https://devispay.com/contractors" },
  },
  openGraph: {
    locale: "fr_CA",
    title: "Acompte avant le chantier — DevisPay",
    description: "Devis clair. Un lien. L’acompte sur votre Stripe.",
    url: "https://devispay.com/entrepreneurs",
  },
};

export default function EntrepreneursPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "fr-CA",
    mainEntity: [
      {
        "@type": "Question",
        name: "Comment un entrepreneur encaisse un acompte au Canada ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vous créez le devis dans DevisPay, vous envoyez le lien par texto. Le client paie par carte ou Interac. Vous commencez quand c’est reçu.",
        },
      },
      {
        "@type": "Question",
        name: "Est-ce un compte en fidéicommis ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Non. L’argent va sur votre Stripe. L’Interac, vous le marquez reçu.",
        },
      },
    ],
  };

  return (
    <div className="bg-[#f4efe6] text-zinc-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <BrandMark />
        <Link href="/register" className="dp-btn-primary !px-4 !py-2 text-xs">
          Essayer
        </Link>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-800">
          Canada · FR / EN
        </p>
        <h1 className="dp-display mt-3 max-w-3xl text-4xl sm:text-6xl">
          L’acompte, avant le premier clou.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-600">
          Un devis. Un lien. Carte ou Interac. Le fourgon ne part pas tant que
          ce n’est pas payé.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRADES.map((t) => (
            <Link
              key={t.slug}
              href={`/for/${t.slug}`}
              className="overflow-hidden rounded-[1.4rem] bg-white ring-1 ring-zinc-900/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.photo} alt={t.nameFr} className="h-40 w-full object-cover" />
              <div className="p-5">
                <h2 className="dp-display text-2xl">{t.nameFr}</h2>
                <p className="mt-2 text-sm text-zinc-600">{t.h1}</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-10 text-sm text-zinc-500">
          In English:{" "}
          <Link href="/contractors" className="font-semibold text-amber-800 hover:underline">
            contractor deposit software
          </Link>
          .
        </p>
      </main>
      <SiteFooter fr />
    </div>
  );
}
