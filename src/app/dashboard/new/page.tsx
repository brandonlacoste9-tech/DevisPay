"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Item = { description: string; quantity: number; unitPrice: number };

export default function NewQuotePage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [depositPercent, setDepositPercent] = useState(30);
  const [items, setItems] = useState<Item[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [payUrl, setPayUrl] = useState("");

  const total = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
  const deposit = (total * depositPercent) / 100;

  function updateItem(i: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPayUrl("");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone: customerPhone || undefined,
          title,
          notes: notes || undefined,
          depositPercent,
          lang: "fr",
          items: items.filter((it) => it.description.trim()),
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setError(data.error || "Erreur");
        return;
      }
      setPayUrl(data.payUrl as string);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  if (payUrl) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-4 py-16 text-zinc-100">
        <div className="mx-auto max-w-lg rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
          <h1 className="text-xl font-black text-green-400">Devis créé</h1>
          <p className="mt-3 text-sm text-zinc-300">Envoyez ce lien à votre client:</p>
          <p className="mt-4 break-all rounded-xl bg-black/40 p-3 text-sm text-amber-400">
            {payUrl}
          </p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black"
            onClick={() => void navigator.clipboard.writeText(payUrl)}
          >
            Copier le lien
          </button>
          <div className="mt-6">
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white">
              ← Tableau de bord
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white">
            ← Retour
          </Link>
          <span className="font-black text-amber-400">Nouveau devis</span>
        </div>
      </header>

      <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4 px-4 py-8">
        <input
          required
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Nom du client"
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-500/50"
        />
        <input
          required
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="Courriel client"
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-500/50"
        />
        <input
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="Téléphone client"
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-500/50"
        />
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du chantier (ex: Toiture asphalte)"
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-500/50"
        />

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Lignes</p>
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                required
                value={it.description}
                onChange={(e) => updateItem(i, { description: e.target.value })}
                placeholder="Description"
                className="col-span-6 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
              />
              <input
                type="number"
                min={0.01}
                step="any"
                value={it.quantity}
                onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
                className="col-span-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
              />
              <input
                type="number"
                min={0}
                step="0.01"
                value={it.unitPrice}
                onChange={(e) => updateItem(i, { unitPrice: Number(e.target.value) })}
                placeholder="$"
                className="col-span-4 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setItems((p) => [...p, { description: "", quantity: 1, unitPrice: 0 }])
            }
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            + Ajouter une ligne
          </button>
        </div>

        <label className="block text-sm text-zinc-400">
          Acompte %{""}
          <input
            type="number"
            min={1}
            max={100}
            value={depositPercent}
            onChange={(e) => setDepositPercent(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
          />
        </label>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optionnel)"
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none"
        />

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
          <p>
            Total:{" "}
            <strong className="text-white">
              {total.toLocaleString("fr-CA", { style: "currency", currency: "CAD" })}
            </strong>
          </p>
          <p className="text-amber-400">
            Acompte ({depositPercent}%):{" "}
            {deposit.toLocaleString("fr-CA", { style: "currency", currency: "CAD" })}
          </p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-60"
        >
          {loading ? "…" : "Créer le devis & obtenir le lien"}
        </button>
      </form>
    </div>
  );
}
