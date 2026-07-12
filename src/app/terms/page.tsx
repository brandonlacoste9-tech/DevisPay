import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export const metadata = {
  title: "Terms of Service",
  description: "DevisPay terms of service",
};

export default function TermsPage() {
  return (
    <div className="dp-mesh min-h-screen text-zinc-100">
      <header className="border-b border-white/5 px-4 py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <BrandMark />
          <Link href="/" className="text-sm text-zinc-500 hover:text-white">
            Home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 prose-invert">
        <h1 className="dp-display text-3xl font-bold text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: July 12, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-400">
          <section>
            <h2 className="text-lg font-bold text-white">1. Service</h2>
            <p className="mt-2">
              DevisPay (“we”, “us”) provides software to create professional quotes/estimates,
              share payment links, and record deposits. Card payments are processed by{" "}
              <strong className="text-zinc-300">Stripe</strong> (including Stripe Connect). We are
              not a bank, credit union, money transmitter, or escrow agent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">2. Not legal escrow or trust accounts</h2>
            <p className="mt-2">
              DevisPay does <strong className="text-zinc-300">not</strong> provide lawyer trust
              accounts, IOLTA, regulated escrow, or custody of client funds as a fiduciary. Deposits
              go to the business’s own Stripe account (or via manual bank/Interac instructions the
              business provides). You are responsible for compliance with professional rules in your
              jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">3. Accounts</h2>
            <p className="mt-2">
              You must provide accurate business information and keep credentials secure. You are
              responsible for activity under your account and for completing Stripe Connect
              onboarding if you accept card payments.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">4. Payments between you and your clients</h2>
            <p className="mt-2">
              When a client pays a quote deposit, funds are processed by Stripe under your connected
              account (direct charges). Stripe’s fees and payout schedules apply. Manual/Interac
              payments are between you and your client; DevisPay only records status when you mark
              paid.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">5. Our subscription fees</h2>
            <p className="mt-2">
              SaaS plans (Starter, Growth, Business) are billed separately via Stripe. Plan features
              and quote limits are described on the site and may change with notice. Trials may be
              limited.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">6. Acceptable use</h2>
            <p className="mt-2">
              You may not use DevisPay for fraud, illegal goods/services, or to misrepresent
              payment terms. We may suspend accounts that violate these terms or Stripe’s rules.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">7. Data & availability</h2>
            <p className="mt-2">
              We store account and quote data to provide the service. We aim for high availability
              but do not guarantee uninterrupted uptime. See our{" "}
              <Link href="/privacy" className="text-amber-400 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">8. Disclaimer & liability</h2>
            <p className="mt-2">
              The service is provided “as is.” To the maximum extent permitted by law, we are not
              liable for lost profits, indirect damages, or disputes between you and your clients.
              Our total liability for any claim is limited to fees you paid us in the prior 3 months.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">9. Contact</h2>
            <p className="mt-2">
              Questions: use the contact email associated with your DevisPay account operator, or
              visit{" "}
              <a href="https://devispay.com" className="text-amber-400 hover:underline">
                devispay.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
