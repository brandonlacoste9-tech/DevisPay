import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { findQuoteByToken, upsertQuote } from "@/lib/store";

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
        message: "Set STRIPE_SECRET_KEY on the server.",
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
  if (quote.status === "deposit_paid") {
    return NextResponse.json({ error: "Already paid", code: "PAID" }, { status: 409 });
  }
  if (quote.depositAmountCents < 50) {
    return NextResponse.json({ error: "Deposit too small" }, { status: 400 });
  }

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: quote.customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "cad",
          unit_amount: quote.depositAmountCents,
          product_data: {
            name:
              quote.lang === "fr"
                ? `Acompte ${quote.depositPercent}% — ${quote.title}`
                : `Deposit ${quote.depositPercent}% — ${quote.title}`,
            description:
              quote.lang === "fr"
                ? `Acompte sur devis total ${(quote.totalCents / 100).toFixed(2)} $ CAD`
                : `Deposit on estimate total $${(quote.totalCents / 100).toFixed(2)} CAD`,
          },
        },
      },
    ],
    success_url: `${origin}/q/${quote.publicToken}?paid=1`,
    cancel_url: `${origin}/q/${quote.publicToken}?canceled=1`,
    metadata: {
      quote_id: quote.id,
      public_token: quote.publicToken,
    },
  });

  quote.stripeSessionId = session.id;
  quote.updatedAt = new Date().toISOString();
  await upsertQuote(quote);

  return NextResponse.json({ url: session.url });
}
