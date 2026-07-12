import { NextRequest, NextResponse } from "next/server";
import { findQuoteByToken, findUserById } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ token: string }> }
) {
  const { token } = await ctx.params;
  const quote = await findQuoteByToken(token);
  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const user = await findUserById(quote.userId);
  return NextResponse.json({
    quote: {
      id: quote.id,
      status: quote.status,
      title: quote.title,
      customerName: quote.customerName,
      items: quote.items,
      totalCents: quote.totalCents,
      depositPercent: quote.depositPercent,
      depositAmountCents: quote.depositAmountCents,
      notes: quote.notes,
      lang: quote.lang,
      currency: quote.currency,
      paidAt: quote.paidAt,
    },
    business: {
      name: user?.businessName || "Entrepreneur",
      phone: user?.phone,
      email: user?.email,
    },
  });
}
