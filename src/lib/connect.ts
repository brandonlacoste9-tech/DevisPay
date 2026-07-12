/** Optional platform fee in basis points (100 = 1%). Default 0 — leave it free for sellers. */
export function platformFeeCents(depositAmountCents: number): number {
  const bps = Number(process.env.STRIPE_PLATFORM_FEE_BPS || "0");
  if (!Number.isFinite(bps) || bps <= 0) return 0;
  const fee = Math.floor((depositAmountCents * bps) / 10_000);
  // Stripe needs application_fee < amount; leave at least 50 cents for destination if possible
  if (depositAmountCents <= 50) return 0;
  return Math.min(fee, depositAmountCents - 50);
}

export function countryToStripe(country: string): string {
  const c = (country || "CA").toUpperCase();
  if (c === "XX" || c.length !== 2) return "CA";
  return c;
}
