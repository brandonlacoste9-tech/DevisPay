import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { SiteFooter } from "@/components/SiteFooter";
import { TRADES, tradeBySlug } from "@/lib/seo-trades";

export function generateStaticParams() {
  return TRADES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = tradeBySlug(slug);
  if (!t) return {};
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `https://devispay.com/for/${t.slug}` },
    openGraph: {
      title: t.title,
      description: t.description,
      url: `https://devispay.com/for/${t.slug}`,
      images: [{ url: t.photo, width: 1200, height: 800 }],
    },
  };
}

export default async function TradePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = tradeBySlug(slug);
  if (!t) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DevisPay",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "39.00", priceCurrency: "CAD" },
    url: `https://devispay.com/for/${t.slug}`,
    description: t.description,
    audience: t.name,
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do I collect a deposit for ${t.job}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Write the quote in DevisPay, set 25–50% due now, text the link. They pay by card or Interac. You start when it’s in.",
        },
      },
      {
        "@type": "Question",
        name: "Does it work in Canada?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. CAD and Interac, plus cards. USD quotes for US jobs.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <BrandMark />
        <Link href="/register" className="dp-btn-primary !px-4 !py-2 text-xs">
          Start free
        </Link>
      </header>

      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.photo} alt={t.name} className="h-[48vh] w-full object-cover sm:h-[56vh]" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-5 pb-10 sm:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
              DevisPay · {t.name} · Canada & the US
            </p>
            <h1 className="dp-display mt-3 max-w-3xl text-4xl text-white sm:text-6xl">
              {t.h1}
            </h1>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        {t.body.map((p) => (
          <p key={p} className="mt-4 text-lg leading-relaxed text-zinc-700">
            {p}
          </p>
        ))}
        <p className="mt-6 text-sm text-zinc-500">
          People search: {t.queries.join(" · ")}
        </p>
        <Link href="/register" className="dp-btn-primary mt-10 inline-flex">
          Create a {t.job} quote →
        </Link>
        <p className="mt-10 text-sm">
          Also for{" "}
          {TRADES.filter((x) => x.slug !== t.slug).map((x, i, a) => (
            <span key={x.slug}>
              <Link href={`/for/${x.slug}`} className="font-semibold text-amber-800 hover:underline">
                {x.name.toLowerCase()}
              </Link>
              {i < a.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
