export type Lang = "fr" | "en";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  businessName: string;
  phone?: string;
  createdAt: string;
};

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
};

export type QuoteStatus = "draft" | "sent" | "deposit_paid" | "expired";

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
  currency: "cad";
  items: LineItem[];
  /** 0–100 */
  depositPercent: number;
  /** cents */
  depositAmountCents: number;
  totalCents: number;
  lang: Lang;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
};
