import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { findUserById } from "@/lib/store";
import { PLANS, monthKey, quoteLimit } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const mk = monthKey();
  const used =
    user.quotesMonth === mk ? user.quotesThisMonth ?? 0 : 0;
  const limit = quoteLimit(user);
  const plan = PLANS[user.plan];

  return NextResponse.json({
    plan: user.plan,
    planName: plan.name,
    planStatus: user.planStatus,
    priceCadCents: plan.priceCadCents,
    quotesUsed: used,
    quotesLimit: limit,
    hasCustomer: Boolean(user.stripeCustomerId),
    hasSubscription: Boolean(user.stripeSubscriptionId),
  });
}
