export type Lang = "fr" | "en";

export type PlanId = "starter" | "growth" | "business";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  businessName: string;
  phone?: string;
  country: string; // ISO CA, US, ...
  defaultCurrency: string; // cad, usd, eur
  defaultLocale: Lang;
  plan: PlanId;
  planStatus: "trialing" | "active" | "past_due" | "canceled";
  createdAt: string;
  /** Optional Interac / bank instructions shown on public quotes */
  manualPayInstructions?: string;
};

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
};

export type QuoteStatus = "draft" | "sent" | "paid" | "void" | "expired";

export type DepositType = "percent" | "fixed";
export type PaidVia = "card" | "manual" | "other";
export type PaymentPreference = "card_only" | "manual_only" | "card_or_manual";

export type Quote = {
  id: string;
  userId: string;
  publicToken: string;
  status: QuoteStatus;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  title: string;
  notes?: string;
  currency: string; // iso lowercase cad/usd/eur
  items: LineItem[];
  depositType: DepositType;
  depositPercent?: number;
  depositFixedCents?: number;
  depositAmountCents: number;
  totalCents: number;
  taxPercent: number;
  lang: Lang;
  paymentPreference: PaymentPreference;
  manualPayInstructions?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  paidVia?: PaidVia;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
};

/** Back-compat: old status name */
export function isPaidStatus(status: string): boolean {
  return status === "paid" || status === "deposit_paid";
}
