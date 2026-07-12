import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getStripe } from "@/lib/stripe";
import { findUserById, updateUser } from "@/lib/store";
import { countryToStripe } from "@/lib/connect";
import { canAcceptCardPayments } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function siteOrigin(req: NextRequest) {
  return (
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  );
}

/** GET — current Connect status for logged-in seller */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    connected: Boolean(user.stripeAccountId),
    chargesEnabled: Boolean(user.stripeChargesEnabled),
    detailsSubmitted: Boolean(user.stripeDetailsSubmitted),
    payoutsEnabled: Boolean(user.stripePayoutsEnabled),
    ready: canAcceptCardPayments(user),
    accountId: user.stripeAccountId
      ? `${user.stripeAccountId.slice(0, 8)}…`
      : null,
  });
}

/** POST — create Express account (if needed) + Account Link for onboarding */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured", code: "NO_STRIPE" },
      { status: 503 }
    );
  }

  const user = await findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    let accountId = user.stripeAccountId;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: countryToStripe(user.country),
        email: user.email,
        business_profile: {
          name: user.businessName,
          product_description:
            "Professional service deposits collected via DevisPay quote links",
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          devispay_user_id: user.id,
        },
      });
      accountId = account.id;
      user.stripeAccountId = accountId;
      user.stripeChargesEnabled = Boolean(account.charges_enabled);
      user.stripeDetailsSubmitted = Boolean(account.details_submitted);
      user.stripePayoutsEnabled = Boolean(account.payouts_enabled);
      await updateUser(user);
    }

    const origin = siteOrigin(req);
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/dashboard?connect=refresh`,
      return_url: `${origin}/dashboard?connect=return`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: link.url, accountId: accountId.slice(0, 8) + "…" });
  } catch (err) {
    console.error("[stripe connect]", err);
    const message = err instanceof Error ? err.message : "Connect failed";
    return NextResponse.json(
      {
        error: "Could not start Stripe Connect",
        detail: message,
        hint: "Enable Connect in Stripe Dashboard → Settings → Connect",
      },
      { status: 500 }
    );
  }
}
