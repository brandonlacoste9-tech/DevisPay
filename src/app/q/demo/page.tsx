"use client";

import Link from "next/link";
import { ShareQuote } from "@/components/ShareQuote";
import { quoteShareText } from "@/lib/share";

export default function DemoQuotePage() {
  const url = "https://devispay.com/q/demo";
  const text = quoteShareText({
    title: "Kitchen remodel — phase 1",
    customerName: "Sophie Martin",
    depositCents: 222000,
    currency: "cad",
    url,
  });

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10">
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
          <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-[9px] tracking-wide text-amber-200">
            Demo
          </span>
        </p>

        <article className="dp-invoice mt-6 overflow-hidden rounded-[1.6rem]">
          <div className="dp-invoice-rule" />
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a1612] text-lg font-black text-amber-400">
                N
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-800/70">
                  Quote
                </p>
                <p className="truncate text-base font-semibold">Northline Builds · Toronto</p>
              </div>
              <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                Due
              </span>
            </div>
            <h1 className="dp-display mt-6 text-[1.65rem] text-[#1a1612]">
              Kitchen remodel — phase 1
            </h1>
            <p className="mt-1 text-sm text-[#6b6258]">For Sophie Martin</p>
            <ul className="mt-6 space-y-3 border-t border-[#1a1612]/10 pt-5 text-sm">
              {[
                ["Demo & prep", "$1,200.00"],
                ["Plumbing", "$2,800.00"],
                ["Labor", "$3,400.00"],
              ].map(([a, b]) => (
                <li key={a} className="flex justify-between">
                  <span>{a}</span>
                  <span className="tabular-nums">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex justify-between border-t border-[#1a1612]/10 pt-5 text-sm">
              <span className="text-[#6b6258]">Project total</span>
              <span className="font-semibold tabular-nums">$7,400.00 CAD</span>
            </div>
          </div>
          <div className="dp-due px-6 py-5 sm:px-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400/80">
              Due now · 30%
            </p>
            <p className="dp-display mt-1 text-3xl font-semibold tabular-nums">$2,220.00 CAD</p>
            <Link
              href="/register"
              className="dp-btn-primary mt-5 flex w-full !rounded-2xl !bg-white !py-3.5 !text-black"
            >
              This is a demo — start yours
            </Link>
            <p className="mt-3 text-center text-[11px] text-white/50">
              Card pay is live on real quotes after you connect Stripe.
            </p>
            <div className="mt-4 flex justify-center">
              <ShareQuote url={url} text={text} title="Kitchen remodel — phase 1" tone="dark" />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
