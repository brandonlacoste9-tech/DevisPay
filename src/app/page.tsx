import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <span className="text-xl font-black text-amber-400">DevisPay</span>
        <div className="flex gap-3 text-sm">
          <Link href="/login" className="text-zinc-400 hover:text-white">
            Connexion
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-amber-500 px-4 py-2 font-bold text-black hover:bg-amber-400"
          >
            Essayer
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <p className="text-xs font-black uppercase tracking-widest text-amber-400">
          Devis → acompte en un lien
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
          Faites payer l&apos;acompte{" "}
          <span className="text-amber-400">avant</span> le chantier.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-zinc-400">
          Créez un devis clair, envoyez un lien. Votre client paie l&apos;acompte par carte
          (Stripe). Vous achetez le matériel l&apos;esprit tranquille.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-black hover:bg-amber-400"
          >
            Créer mon compte gratuit
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-zinc-300 hover:border-white/30"
          >
            J&apos;ai déjà un compte
          </Link>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            ["1. Devis", "Lignes, total, % d'acompte en 2 minutes."],
            ["2. Lien", "Texto, courriel ou WhatsApp — un seul URL."],
            ["3. Payé", "Stripe encaisse. Statut « acompte reçu »."],
          ].map(([t, d]) => (
            <li
              key={t}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="font-bold text-amber-400">{t}</p>
              <p className="mt-2 text-sm text-zinc-400">{d}</p>
            </li>
          ))}
        </ul>

        <section className="mt-20 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8">
          <h2 className="text-2xl font-black">Tarifs (CAD / mois)</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Solo", "39 $", "15 devis / mois"],
              ["Crew", "79 $", "Devis illimités"],
              ["Pro", "129 $", "Illimité + équipe"],
            ].map(([n, p, f]) => (
              <div
                key={n}
                className="rounded-2xl border border-white/10 bg-black/40 p-5"
              >
                <p className="font-bold">{n}</p>
                <p className="mt-2 text-2xl font-black text-amber-400">{p}</p>
                <p className="mt-1 text-sm text-zinc-500">{f}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Abonnements Stripe à brancher. MVP: créez des devis et encaisser des acomptes
            dès que STRIPE_SECRET_KEY est défini.
          </p>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} DevisPay · Canada
      </footer>
    </div>
  );
}
