import Link from "next/link";

export function SiteFooter({ fr = false }: { fr?: boolean }) {
  return (
    <footer className="relative z-10 border-t border-zinc-900/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
        <p className="text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} DevisPay · devispay.com ·{" "}
          {fr ? "Métiers et services · Canada & États-Unis" : "Trades and services · Canada & the US"}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-600">
          <Link href="/contractors" className="hover:text-zinc-900">
            {fr ? "Métiers" : "For contractors"}
          </Link>
          <Link href="/entrepreneurs" className="hover:text-zinc-900">
            FR
          </Link>
          <Link href="/terms" className="hover:text-zinc-900">
            {fr ? "Conditions" : "Terms"}
          </Link>
          <Link href="/privacy" className="hover:text-zinc-400">
            {fr ? "Confidentialité" : "Privacy"}
          </Link>
          <Link href="/login" className="hover:text-zinc-400">
            {fr ? "Connexion" : "Log in"}
          </Link>
          <Link href="/register" className="hover:text-zinc-400">
            {fr ? "S'inscrire" : "Sign up"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
