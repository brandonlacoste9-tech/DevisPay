import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  findQuoteById,
  findUserById,
  findUserByStripeAccountId,
  updateUser,
  upsertQuote,
} from "@/lib/store";
import { isPaidStatus, type PlanId, type User } from "@/lib/types";
import { isEmailConfigured, sendReceiptEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function applySubscription(user: User, sub: Stripe.Subscription) {
  const plan = (sub.metadata?.plan || "starter") as PlanId;
  if (plan === "starter" || plan === "growth" || plan === "business") {
    user.plan = plan;
  }
  const status = sub.status;
  if (status === "active" || status === "trialing") {
    user.planStatus = status === "trialing" ? "trialing" : "active";
  } else if (status === "past_due") {
    user.planStatus = "past_due";
  } else if (
    status === "canceled" ||
    status === "unpaid" ||
    status === "incomplete_expired"
  ) {
    user.planStatus = "canceled";
  }
  user.stripeSubscriptionId = sub.id;
  if (typeof sub.customer === "string") {
    user.stripeCustomerId = sub.customer;
  }
  await updateUser(user);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const raw = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("[devispay webhook]", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // SaaS plan checkout
      if (
        session.metadata?.type === "saas_subscription" ||
        session.mode === "subscription"
      ) {
        const userId = session.metadata?.devispay_user_id;
        const plan = session.metadata?.plan as PlanId | undefined;
        if (userId) {
          const user = await findUserById(userId);
          if (user) {
            if (plan === "starter" || plan === "growth" || plan === "business") {
              user.plan = plan;
            }
            user.planStatus = "active";
            if (typeof session.customer === "string") {
              user.stripeCustomerId = session.customer;
            }
            if (typeof session.subscription === "string") {
              user.stripeSubscriptionId = session.subscription;
            }
            await updateUser(user);
          }
        }
      }

      // Quote deposit
      if (session.metadata?.type === "deposit" || session.metadata?.quote_id) {
        const quoteId = session.metadata?.quote_id;
        if (quoteId) {
          const quote = await findQuoteById(quoteId);
          if (quote && !isPaidStatus(quote.status)) {
            quote.status = "paid";
            quote.paidAt = new Date().toISOString();
            quote.paidVia = "card";
            quote.stripeSessionId = session.id;
            quote.stripePaymentIntentId =
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id;
            quote.updatedAt = new Date().toISOString();
            await upsertQuote(quote);

            if (isEmailConfigured()) {
              const business = await findUserById(quote.userId);
              if (business) {
                const mailed = await sendReceiptEmail({ quote, business });
                if (!mailed.ok) {
                  console.error("[webhook receipt email]", mailed.error);
                }
              }
            }
          }
        }
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.created"
    ) {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.devispay_user_id;
      if (userId) {
        const user = await findUserById(userId);
        if (user) await applySubscription(user, sub);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.devispay_user_id;
      if (userId) {
        const user = await findUserById(userId);
        if (user) {
          user.planStatus = "canceled";
          user.plan = "starter";
          user.stripeSubscriptionId = undefined;
          await updateUser(user);
        }
      }
    }

    if (event.type === "account.updated") {
      const account = event.data.object as Stripe.Account;
      const user = await findUserByStripeAccountId(account.id);
      if (user) {
        user.stripeChargesEnabled = Boolean(account.charges_enabled);
        user.stripeDetailsSubmitted = Boolean(account.details_submitted);
        user.stripePayoutsEnabled = Boolean(account.payouts_enabled);
        await updateUser(user);
      }
    }
  } catch (err) {
    console.error("[devispay webhook handler]", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
