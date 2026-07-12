import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { findQuoteByToken, upsertQuote } from "@/lib/store";
import { isPaidStatus } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Seller marks deposit received (Interac / bank / cash). */
export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ token: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await ctx.params;
  const quote = await findQuoteByToken(token);
  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (quote.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (isPaidStatus(quote.status)) {
    return NextResponse.json({ success: true, already: true, quote });
  }

  quote.status = "paid";
  quote.paidAt = new Date().toISOString();
  quote.paidVia = "manual";
  quote.updatedAt = new Date().toISOString();
  await upsertQuote(quote);

  return NextResponse.json({ success: true, quote });
}
