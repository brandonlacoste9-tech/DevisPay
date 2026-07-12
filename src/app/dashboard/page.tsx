"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { money } from "@/lib/money";

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

  const load = useCallback(async () => {
    const res = await fetch("/api/quotes");
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setQuotes(data.quotes || []);
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-black text-amber-400">
            DevisPay
          </Link>
          <div className="flex gap-3 text-sm">
            <Link
              href="/dashboard/new"
              className="rounded-lg bg-amber-500 px-4 py-2 font-bold text-black hover:bg-amber-400"
            >
              + New quote
            </Link>
            <button onClick={logout} className="text-zinc-500 hover:text-white">
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-black">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Create a quote → share link → get deposit (card or mark Interac paid).
        </p>

        {quotes.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-white/15 p-10 text-center">
            <p className="text-zinc-400">No quotes yet.</p>
            <Link
              href="/dashboard/new"
              className="mt-4 inline-block text-sm font-bold text-amber-400 hover:underline"
            >
              Create your first quote →
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {quotes.map((q) => {
              const paid = q.status === "paid" || q.status === "deposit_paid";
              return (
                <li
                  key={q.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold">
                      {q.customerName}{" "}
                      <span className="font-normal text-zinc-500">· {q.title}</span>
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Total {money(q.totalCents, q.currency || "cad")} · Due{" "}
                      {money(q.depositAmountCents, q.currency || "cad")} ·{" "}
                      <span className={paid ? "text-green-400" : "text-amber-400/80"}>
                        {statusLabel[q.status] || q.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`/q/${q.publicToken}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold hover:border-white/30"
                    >
                      View
                    </a>
                    <a
                      href={`/q/${q.publicToken}?seller=1`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold hover:border-white/30"
                    >
                      Mark paid
                    </a>
                    <button
                      type="button"
                      onClick={() => copyLink(q.publicToken)}
                      className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-black hover:bg-amber-400"
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
