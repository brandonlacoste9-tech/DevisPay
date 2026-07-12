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

type ConnectStatus = {
  connected: boolean;
  chargesEnabled: boolean;
  detailsSubmitted: boolean;
  payoutsEnabled: boolean;
  ready: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connect, setConnect] = useState<ConnectStatus | null>(null);
  const [connectBusy, setConnectBusy] = useState(false);
  const [connectMsg, setConnectMsg] = useState("");

  const loadConnect = useCallback(async () => {
    const res = await fetch("/api/stripe/connect");
    if (res.ok) {
      setConnect(await res.json());
    }
  }, []);

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
    loadConnect();
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search);
      if (q.get("connect") === "return" || q.get("connect") === "refresh") {
        void fetch("/api/stripe/connect/refresh", { method: "POST" }).then(() =>
          loadConnect()
        );
      }
    }
  }, [load, loadConnect]);

  async function startConnect() {
    setConnectBusy(true);
    setConnectMsg("");
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setConnectMsg(data.detail || data.error || "Could not start Connect");
        return;
      }
      if (data.url) window.location.href = data.url as string;
    } catch {
      setConnectMsg("Network error");
    } finally {
      setConnectBusy(false);
    }
  }

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
        {/* Stripe Connect */}
        {connect && !connect.ready && (
          <div className="mb-8 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-400">
              Stripe Connect
            </p>
            <h2 className="dp-display mt-2 text-xl font-bold text-white">
              Connect your own Stripe to get paid
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              Card deposits go to <strong className="text-zinc-200">your</strong>{" "}
              Stripe account — not ours. Complete onboarding once; then every pay
              link is automatic. (Bank payouts still follow Stripe&apos;s schedule.)
            </p>
            <button
              type="button"
              disabled={connectBusy}
              onClick={startConnect}
              className="dp-btn-primary mt-5 !rounded-2xl disabled:opacity-60"
            >
              {connectBusy
                ? "…"
                : connect.connected
                  ? "Continue Stripe setup"
                  : "Connect with Stripe"}
            </button>
            {connectMsg && (
              <p className="mt-3 text-sm text-red-400">{connectMsg}</p>
            )}
          </div>
        )}

        {connect?.ready && (
          <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-5 py-3 text-sm">
            <span className="font-semibold text-emerald-400">✓ Stripe connected</span>
            <span className="text-zinc-500">
              Card deposits go to your account automatically.
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="dp-display text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Create a quote → share link → client pays your Stripe.
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
              Connect Stripe, then create a professional quote in under a minute.
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
