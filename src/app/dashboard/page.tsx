"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { money } from "@/lib/money";
import { BrandMark } from "@/components/BrandMark";

type QuoteRow = {
  id: string;
  title: string;
  customerName: string;
  status: string;
  totalCents: number;
  depositAmountCents: number;
  publicToken: string;
  currency: string;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/quotes");
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setQuotes(data.quotes || []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  function copyLink(token: string) {
    const url = `${window.location.origin}/q/${token}`;
    void navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  const statusLabel: Record<string, string> = {
    draft: "Draft",
    sent: "Sent",
    paid: "Paid",
    deposit_paid: "Paid",
    expired: "Expired",
    void: "Void",
  };

  const paidCount = quotes.filter(
    (q) => q.status === "paid" || q.status === "deposit_paid"
  ).length;

  return (
    <div className="dp-mesh min-h-screen text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#050506]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandMark href="/dashboard" size="sm" />
          <div className="flex items-center gap-3">
            <Link href="/dashboard/new" className="dp-btn-primary !px-4 !py-2 text-xs">
              + New quote
            </Link>
            <button
              type="button"
              onClick={logout}
              className="text-sm text-zinc-500 transition hover:text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="dp-display text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Create a quote → share link → collect deposit.
            </p>
          </div>
          {!loading && quotes.length > 0 && (
            <div className="flex gap-4 text-sm">
              <div className="dp-glass rounded-2xl px-4 py-2">
                <span className="text-zinc-500">Quotes</span>{" "}
                <strong className="text-white">{quotes.length}</strong>
              </div>
              <div className="dp-glass rounded-2xl px-4 py-2">
                <span className="text-zinc-500">Paid</span>{" "}
                <strong className="text-emerald-400">{paidCount}</strong>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="mt-16 text-center text-sm text-zinc-600">Loading…</div>
        ) : quotes.length === 0 ? (
          <div className="dp-glass mt-12 rounded-3xl border-dashed p-14 text-center">
            <p className="dp-display text-xl font-bold text-white">No quotes yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
              Your first paid deposit is one link away. Create a professional quote
              in under a minute.
            </p>
            <Link
              href="/dashboard/new"
              className="dp-btn-primary mt-8 inline-flex"
            >
              Create your first quote →
            </Link>
          </div>
        ) : (
          <ul className="mt-10 space-y-3">
            {quotes.map((q) => {
              const paid = q.status === "paid" || q.status === "deposit_paid";
              return (
                <li
                  key={q.id}
                  className="dp-glass flex flex-col gap-4 rounded-2xl p-5 transition hover:border-white/15 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-white">
                      {q.customerName}{" "}
                      <span className="font-normal text-zinc-500">· {q.title}</span>
                    </p>
                    <p className="mt-1.5 text-xs text-zinc-500">
                      Total {money(q.totalCents, q.currency || "cad")} · Due{" "}
                      {money(q.depositAmountCents, q.currency || "cad")} ·{" "}
                      <span
                        className={
                          paid
                            ? "font-semibold text-emerald-400"
                            : "font-semibold text-amber-400/90"
                        }
                      >
                        {statusLabel[q.status] || q.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`/q/${q.publicToken}`}
                      target="_blank"
                      rel="noreferrer"
                      className="dp-btn-ghost !px-3 !py-2 text-xs"
                    >
                      View
                    </a>
                    <a
                      href={`/q/${q.publicToken}?seller=1`}
                      target="_blank"
                      rel="noreferrer"
                      className="dp-btn-ghost !px-3 !py-2 text-xs"
                    >
                      Mark paid
                    </a>
                    <button
                      type="button"
                      onClick={() => copyLink(q.publicToken)}
                      className="dp-btn-primary !px-3 !py-2 text-xs"
                    >
                      {copied === q.publicToken ? "Copied!" : "Copy link"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
