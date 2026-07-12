import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import {
  findQuoteByToken,
  findUserById,
} from "@/lib/store";
import {
  isEmailConfigured,
  sendPayLinkEmail,
  sendReceiptEmail,
} from "@/lib/email";
import { isPaidStatus } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  type: z.enum(["pay_link", "receipt"]).default("pay_link"),
  to: z.string().email().optional(),
});

/** Seller sends pay link or receipt email (auth required). */
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ token: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json(
      {
        error: "Email not configured",
        code: "NO_EMAIL",
        message:
          "Add RESEND_API_KEY (and optional EMAIL_FROM) in Netlify env, then redeploy.",
      },
      { status: 503 }
    );
  }

  const { token } = await ctx.params;
  const quote = await findQuoteByToken(token);
  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (quote.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const business = await findUserById(session.userId);
  if (!business) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 422 });
  }

  const type = parsed.data.type;
  if (type === "receipt" && !isPaidStatus(quote.status)) {
    return NextResponse.json(
      { error: "Quote is not paid yet", code: "NOT_PAID" },
      { status: 400 }
    );
  }

  const result =
    type === "receipt"
      ? await sendReceiptEmail({
          quote,
          business,
          to: parsed.data.to,
        })
      : await sendPayLinkEmail({
          quote,
          business,
          to: parsed.data.to,
        });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({
    success: true,
    type,
    to: parsed.data.to || quote.customerEmail,
  });
}

export async function GET() {
  return NextResponse.json({
    configured: isEmailConfigured(),
  });
}
