import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { findQuoteByToken, findUserById, upsertQuote } from "@/lib/store";
import { canAcceptCardPayments, isPaidStatus } from "@/lib/types";
import { platformFeeCents } from "@/lib/connect";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({ token: z.string().min(8) });

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error: "Stripe not configured",
        code: "NO_STRIPE",
        message: "Set STRIPE_SECRET_KEY to enable card payments.",
      },
      { status: 503 }
    );
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid token" }, { status: 422 });
  }

  const quote = await findQuoteByToken(parsed.data.token);
  if (!quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }
  if (isPaidStatus(quote.status)) {
    return NextResponse.json({ error: "Already paid", code: "PAID" }, { status: 409 });
  }
  if (quote.paymentPreference === "manual_only") {
    return NextResponse.json(
      { error: "This quote is bank/Interac only", code: "MANUAL_ONLY" },
      { status: 400 }
    );
  }
  if (quote.depositAmountCents < 50) {
    return NextResponse.json({ error: "Deposit too small for card" }, { status: 400 });
  }

  const seller = await findUserById(quote.userId);
  if (!canAcceptCardPayments(seller)) {
    return NextResponse.json(
      {
        error: "Seller has not connected Stripe yet",
        code: "CONNECT_REQUIRED",
        message:
          "This business must finish Stripe Connect setup before accepting card deposits. Try bank/Interac if offered, or contact them.",
      },
      { status: 403 }
    );
  }

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const currency = quote.currency.toLowerCase();
  const fr = quote.lang === "fr";
  const depositLabel =
    quote.depositType === "percent" && quote.depositPercent != null
      ? fr
        ? `Acompte ${quote.depositPercent}% — ${quote.title}`
        : `Deposit ${quote.depositPercent}% — ${quote.title}`
      : fr
        ? `Acompte — ${quote.title}`
        : `Deposit — ${quote.title}`;
  const totalLabel = `${(quote.totalCents / 100).toFixed(2)} ${currency.toUpperCase()}`;

  const fee = platformFeeCents(quote.depositAmountCents);
  const connectedId = seller!.stripeAccountId!;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: quote.customerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: quote.depositAmountCents,
            product_data: {
              name: depositLabel,
              description: fr
                ? `Acompte sur total ${totalLabel}`
                : `Deposit on total ${totalLabel}`,
            },
          },
        },
      ],
      success_url: `${origin}/q/${quote.publicToken}?paid=1`,
      cancel_url: `${origin}/q/${quote.publicToken}?canceled=1`,
      payment_intent_data: {
        // Money lands on the seller's connected Stripe account (not the platform)
        transfer_data: {
          destination: connectedId,
        },
        ...(fee > 0 ? { application_fee_amount: fee } : {}),
        metadata: {
          type: "deposit",
          quote_id: quote.id,
          public_token: quote.publicToken,
          connected_account: connectedId,
        },
      },
      metadata: {
        type: "deposit",
        quote_id: quote.id,
        public_token: quote.publicToken,
        connected_account: connectedId,
      },
    });

    quote.stripeSessionId = session.id;
    quote.updatedAt = new Date().toISOString();
    await upsertQuote(quote);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout connect]", err);
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json(
      { error: "Checkout failed", message, code: "CHECKOUT_ERROR" },
      { status: 500 }
    );
  }
}
