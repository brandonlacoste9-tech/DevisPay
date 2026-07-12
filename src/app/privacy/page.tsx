import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export const metadata = {
  title: "Privacy Policy",
  description: "DevisPay privacy policy",
};

export default function PrivacyPage() {
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
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="dp-display text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: July 12, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-400">
          <section>
            <h2 className="text-lg font-bold text-white">1. Who we are</h2>
            <p className="mt-2">
              DevisPay operates devispay.com — software for quotes and deposit collection. This
              policy explains what we collect and how we use it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">2. Data we collect</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Account data: email, password hash, business name, phone, country, preferences</li>
              <li>Quote data: client name/email/phone, line items, amounts, status, payment timestamps</li>
              <li>Stripe Connect identifiers and payment-related metadata (not full card numbers)</li>
              <li>Technical logs: IP, user agent, error logs for security and reliability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">3. How we use data</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Provide quotes, pay links, receipts, and email notifications</li>
              <li>Authenticate sessions and enforce plan limits</li>
              <li>Process SaaS subscriptions and Connect onboarding via Stripe</li>
              <li>Improve reliability and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">4. Processors</h2>
            <p className="mt-2">
              We use third parties that process data on our behalf, including:{" "}
              <strong className="text-zinc-300">Stripe</strong> (payments & Connect),{" "}
              <strong className="text-zinc-300">Neon</strong> (database),{" "}
              <strong className="text-zinc-300">Netlify</strong> (hosting),{" "}
              <strong className="text-zinc-300">Resend</strong> (transactional email). Each has its
              own privacy policy. Card data is handled by Stripe — we do not store full card numbers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">5. Emails</h2>
            <p className="mt-2">
              We send transactional emails (pay links, deposit receipts) to addresses you provide.
              We do not sell email lists.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">6. Retention</h2>
            <p className="mt-2">
              We retain account and quote records while your account is active and as needed for
              legal, tax, or dispute purposes. You may request deletion subject to legal holds.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">7. Your choices</h2>
            <p className="mt-2">
              You can update profile data in the dashboard, disconnect Stripe via Stripe, and request
              account deletion by contacting us. Cookies: we use an HTTP-only session cookie for
              login.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">8. Security</h2>
            <p className="mt-2">
              We use industry-standard practices (HTTPS, hashed passwords, scoped secrets). No method
              of transmission is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">9. Contact</h2>
            <p className="mt-2">
              Privacy questions: contact the operator of devispay.com. See also{" "}
              <Link href="/terms" className="text-amber-400 hover:underline">
                Terms of Service
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
