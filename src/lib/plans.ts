import type { PlanId, User } from "./types";

export type PlanDef = {
  id: PlanId;
  name: string;
  priceCadCents: number;
  quotesPerMonth: number | null; // null = unlimited
  blurb: string;
};

export const PLANS: Record<PlanId, PlanDef> = {
  starter: {
    id: "starter",
    name: "Starter",
    priceCadCents: 3900,
    quotesPerMonth: 15,
    blurb: "15 quotes / month — for solo pros testing pay-to-start",
  },
  growth: {
    id: "growth",
    name: "Growth",
    priceCadCents: 7900,
    quotesPerMonth: null,
    blurb: "Unlimited quotes — for active firms",
  },
  business: {
    id: "business",
    name: "Business",
    priceCadCents: 12900,
    quotesPerMonth: null,
    blurb: "Unlimited + priority — multi-seat ready",
  },
};

export function monthKey(d = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Active paid plan or trial counts as usable */
export function planIsUsable(user: User): boolean {
  return (
    user.planStatus === "trialing" ||
    user.planStatus === "active" ||
    user.planStatus === "past_due"
  );
}

export function quoteLimit(user: User): number | null {
  return PLANS[user.plan]?.quotesPerMonth ?? 15;
}

export function canCreateQuote(
  user: User,
  quotesThisMonth: number
): { ok: true } | { ok: false; reason: string; code: string } {
  if (user.planStatus === "canceled") {
    return {
      ok: false,
      code: "PLAN_CANCELED",
      reason: "Your plan is canceled. Reactivate billing to create quotes.",
    };
  }
  const limit = quoteLimit(user);
  if (limit != null && quotesThisMonth >= limit) {
    return {
      ok: false,
      code: "QUOTE_LIMIT",
      reason: `Starter plan allows ${limit} quotes per month. Upgrade to Growth for unlimited.`,
    };
  }
  return { ok: true };
}
