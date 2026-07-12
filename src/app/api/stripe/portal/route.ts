import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getStripe } from "@/lib/stripe";
import { findUserById } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Stripe Customer Billing Portal */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const user = await findUserById(session.userId);
  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing customer yet — subscribe to a plan first" },
      { status: 400 }
    );
  }

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${origin}/dashboard`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (err) {
    console.error("[portal]", err);
    return NextResponse.json(
      {
        error: "Could not open billing portal",
        detail: err instanceof Error ? err.message : "unknown",
        hint: "Enable Customer portal in Stripe Dashboard → Settings → Billing",
      },
      { status: 500 }
    );
  }
}
