import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { getStripe } from "@/lib/stripe";
import { findUserById, updateUser } from "@/lib/store";
import { PLANS, type PlanDef } from "@/lib/plans";
import type { PlanId } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  plan: z.enum(["starter", "growth", "business"]),
});

function priceIdEnv(plan: PlanId): string | undefined {
  const map: Record<PlanId, string | undefined> = {
    starter: process.env.STRIPE_PRICE_STARTER,
    growth: process.env.STRIPE_PRICE_GROWTH,
    business: process.env.STRIPE_PRICE_BUSINESS,
  };
  const id = map[plan]?.trim();
  return id || undefined;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 422 });
  }

  const planId = parsed.data.plan as PlanId;
  const plan: PlanDef = PLANS[planId];
  const user = await findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  try {
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.businessName,
        metadata: { devispay_user_id: user.id },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await updateUser(user);
    }

    const fixedPrice = priceIdEnv(planId);
    const lineItems = fixedPrice
      ? [{ price: fixedPrice, quantity: 1 }]
      : [
          {
            price_data: {
              currency: "cad",
              unit_amount: plan.priceCadCents,
              recurring: { interval: "month" as const },
              product_data: {
                name: `DevisPay ${plan.name}`,
                description: plan.blurb,
              },
            },
            quantity: 1,
          },
        ];

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: lineItems,
      success_url: `${origin}/dashboard?billing=success&plan=${planId}`,
      cancel_url: `${origin}/dashboard?billing=cancel`,
      metadata: {
        type: "saas_subscription",
        devispay_user_id: user.id,
        plan: planId,
      },
      subscription_data: {
        metadata: {
          devispay_user_id: user.id,
          plan: planId,
        },
      },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json(
      {
        error: "Checkout failed",
        detail: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    );
  }
}
