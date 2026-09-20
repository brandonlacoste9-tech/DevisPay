import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { SiteFooter } from "@/components/SiteFooter";
import { TRADES } from "@/lib/seo-trades";

export const metadata: Metadata = {
  title: "Contractor deposit software for Canada and the US",
  description:
    "DevisPay is how trades collect a deposit before the job starts. Quote, one link, card or Interac. Roofing, HVAC, plumbing, remodels.",
  alternates: { canonical: "https://devispay.com/contractors" },
  openGraph: {
    title: "Contractor deposit software — DevisPay",
    description:
      "Get paid to start. Quote → link → deposit. Canada and the US.",
    url: "https://devispay.com/contractors",
  },
};

export default function ContractorsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do contractors collect a deposit in Canada?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Send a DevisPay quote with a due-now amount. The customer pays by card or Interac e-Transfer. You start when the deposit is in.",
        },
      },
      {
        "@type": "Question",
        name: "Is DevisPay a bank or escrow?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Money goes to your Stripe. Interac you mark received. Not a trust account.",
        },
      },
      {
        "@type": "Question",
        name: "Does it work in the United States?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. USD quotes and card deposits. Same product as Canada.",
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
          Start free
        </Link>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-800">
          Canada & the US
        </p>
        <h1 className="dp-display mt-3 max-w-3xl text-4xl sm:text-6xl">
          Contractor deposit software. The van doesn’t roll until it’s paid.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-600">
          Write the quote. Text the link. Take 30% by card or Interac. Print the
          receipt for the job folder. That’s DevisPay.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRADES.map((t) => (
            <Link
              key={t.slug}
              href={`/for/${t.slug}`}
              className="dp-photo overflow-hidden rounded-[1.4rem] bg-white ring-1 ring-zinc-900/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.photo} alt={t.name} className="h-40 w-full object-cover" />
              <div className="p-5">
                <h2 className="dp-display text-2xl">{t.name}</h2>
                <p className="mt-2 text-sm text-zinc-600">{t.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-10 text-sm text-zinc-500">
          En français :{" "}
          <Link href="/entrepreneurs" className="font-semibold text-amber-800 hover:underline">
            logiciel d’acompte pour entrepreneurs
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
