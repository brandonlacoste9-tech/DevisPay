import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { findQuoteById, upsertQuote } from "@/lib/store";
import { isPaidStatus } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
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
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
