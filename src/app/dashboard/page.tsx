"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type QuoteRow = {
  id: string;
  title: string;
  customerName: string;
  status: string;
  totalCents: number;
  depositAmountCents: number;
  publicToken: string;
  createdAt: string;
};

function money(cents: number) {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format(cents / 100);
}

export default function DashboardPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [error, setError] = useState("");
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
    draft: "Brouillon",
    sent: "Envoyé",
    deposit_paid: "Acompte payé",
    expired: "Expiré",
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
              + Nouveau devis
            </Link>
            <button onClick={logout} className="text-zinc-500 hover:text-white">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-black">Tableau de bord</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Créez un devis, copiez le lien, encaissez l&apos;acompte.
        </p>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {quotes.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-white/15 p-10 text-center">
            <p className="text-zinc-400">Aucun devis pour l&apos;instant.</p>
            <Link
              href="/dashboard/new"
              className="mt-4 inline-block text-sm font-bold text-amber-400 hover:underline"
            >
              Créer mon premier devis →
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {quotes.map((q) => (
              <li
                key={q.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold">
                    {q.customerName}{" "}
                    <span className="text-zinc-500 font-normal">· {q.title}</span>
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Total {money(q.totalCents)} · Acompte {money(q.depositAmountCents)} ·{" "}
                    <span
                      className={
                        q.status === "deposit_paid" ? "text-green-400" : "text-amber-400/80"
                      }
                    >
                      {statusLabel[q.status] || q.status}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/q/${q.publicToken}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold hover:border-white/30"
                  >
                    Voir
                  </a>
                  <button
                    type="button"
                    onClick={() => copyLink(q.publicToken)}
                    className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-black hover:bg-amber-400"
                  >
                    {copied === q.publicToken ? "Copié!" : "Copier le lien"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
