import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getStripe } from "@/lib/stripe";
import { findUserById, updateUser } from "@/lib/store";
import { canAcceptCardPayments } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST — pull latest Connect account status from Stripe */
export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const user = await findUserById(session.userId);
  if (!user?.stripeAccountId) {
    return NextResponse.json({
      ready: false,
      connected: false,
      chargesEnabled: false,
    });
  }

  try {
    const account = await stripe.accounts.retrieve(user.stripeAccountId);
    user.stripeChargesEnabled = Boolean(account.charges_enabled);
    user.stripeDetailsSubmitted = Boolean(account.details_submitted);
    user.stripePayoutsEnabled = Boolean(account.payouts_enabled);
    await updateUser(user);

    return NextResponse.json({
      connected: true,
      chargesEnabled: user.stripeChargesEnabled,
      detailsSubmitted: user.stripeDetailsSubmitted,
      payoutsEnabled: user.stripePayoutsEnabled,
      ready: canAcceptCardPayments(user),
    });
  } catch (err) {
    console.error("[connect refresh]", err);
    return NextResponse.json({ error: "Refresh failed" }, { status: 500 });
  }
}
