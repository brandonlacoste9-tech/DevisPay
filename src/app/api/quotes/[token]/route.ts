import { NextRequest, NextResponse } from "next/server";
import { findQuoteByToken, findUserById } from "@/lib/store";
import { isPaidStatus } from "@/lib/types";

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
      status: isPaidStatus(quote.status) ? "paid" : quote.status,
      title: quote.title,
      customerName: quote.customerName,
      items: quote.items,
      totalCents: quote.totalCents,
      depositType: quote.depositType,
      depositPercent: quote.depositPercent,
      depositAmountCents: quote.depositAmountCents,
      taxPercent: quote.taxPercent,
      notes: quote.notes,
      lang: quote.lang,
      currency: quote.currency,
      paymentPreference: quote.paymentPreference,
      manualPayInstructions: quote.manualPayInstructions,
      paidAt: quote.paidAt,
      paidVia: quote.paidVia,
    },
    business: {
      name: user?.businessName || "Business",
      phone: user?.phone,
      email: user?.email,
      country: user?.country,
    },
  });
}
