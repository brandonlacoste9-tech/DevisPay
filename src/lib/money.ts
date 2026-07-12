export function money(
  cents: number,
  currency = "CAD",
  locale = "fr-CA"
): string {
  const cur = currency.toUpperCase();
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: cur,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${cur}`;
  }
}

export function calcQuoteTotals(input: {
  items: { quantity: number; unitPriceCents: number }[];
  taxPercent?: number;
  depositType: "percent" | "fixed";
  depositPercent?: number;
  depositFixedCents?: number;
}): { subtotalCents: number; totalCents: number; depositAmountCents: number } {
  const subtotalCents = input.items.reduce(
    (s, it) => s + Math.round(it.quantity * it.unitPriceCents),
    0
  );
  const tax = Math.min(100, Math.max(0, input.taxPercent ?? 0));
  const totalCents = Math.round(subtotalCents * (1 + tax / 100));

  let depositAmountCents = 0;
  if (input.depositType === "fixed") {
    depositAmountCents = Math.min(
      totalCents,
      Math.max(0, input.depositFixedCents ?? 0)
    );
  } else {
    const pct = Math.min(100, Math.max(0, input.depositPercent ?? 30));
    depositAmountCents = Math.round((totalCents * pct) / 100);
  }

  return { subtotalCents, totalCents, depositAmountCents };
}

export const CURRENCIES = [
  { code: "cad", label: "CAD $" },
  { code: "usd", label: "USD $" },
  { code: "eur", label: "EUR €" },
  { code: "gbp", label: "GBP £" },
  { code: "aud", label: "AUD $" },
] as const;
