import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession, newId, newToken } from "@/lib/session";
import {
  calcQuoteTotals,
  findUserById,
  listQuotesForUser,
  updateUser,
  upsertQuote,
} from "@/lib/store";
import type { LineItem, Quote } from "@/lib/types";
import { canCreateQuote, monthKey } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
});

const CreateSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  title: z.string().min(1),
  notes: z.string().optional(),
  currency: z.string().min(3).max(3).default("cad"),
  lang: z.enum(["fr", "en"]).default("fr"),
  taxPercent: z.number().min(0).max(100).default(0),
  depositType: z.enum(["percent", "fixed"]).default("percent"),
  depositPercent: z.number().min(1).max(100).optional(),
  depositFixed: z.number().min(0).optional(), // dollars
  paymentPreference: z
    .enum(["card_only", "manual_only", "card_or_manual"])
    .default("card_or_manual"),
  manualPayInstructions: z.string().max(500).optional(),
  items: z.array(ItemSchema).min(1),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const mine = await listQuotesForUser(session.userId);
  return NextResponse.json({ quotes: mine });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = CreateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid", details: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const d = parsed.data;
  const user = await findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  // Reset monthly counter if new month
  const mk = monthKey();
  if (user.quotesMonth !== mk) {
    user.quotesMonth = mk;
    user.quotesThisMonth = 0;
  }
  const gate = canCreateQuote(user, user.quotesThisMonth ?? 0);
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.reason, code: gate.code },
      { status: 402 }
    );
  }

  const items: LineItem[] = d.items.map((it) => ({
    id: newId(),
    description: it.description,
    quantity: it.quantity,
    unitPriceCents: Math.round(it.unitPrice * 100),
  }));

  const depositType = d.depositType;
  const { totalCents, depositAmountCents } = calcQuoteTotals({
    items,
    taxPercent: d.taxPercent,
    depositType,
    depositPercent: d.depositPercent ?? 30,
    depositFixedCents:
      d.depositFixed != null ? Math.round(d.depositFixed * 100) : undefined,
  });

  if (depositAmountCents < 50 && d.paymentPreference !== "manual_only") {
    // Stripe minimum ~$0.50; allow manual-only smaller
    return NextResponse.json(
      { error: "Deposit must be at least 0.50 for card payments" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const quote: Quote = {
    id: newId(),
    userId: session.userId,
    publicToken: newToken(),
    status: "sent",
    customerName: d.customerName.trim(),
    customerEmail: d.customerEmail.trim().toLowerCase(),
    customerPhone: d.customerPhone,
    title: d.title.trim(),
    notes: d.notes,
    currency: d.currency.toLowerCase(),
    items,
    depositType,
    depositPercent: depositType === "percent" ? d.depositPercent ?? 30 : undefined,
    depositFixedCents:
      depositType === "fixed" ? Math.round((d.depositFixed ?? 0) * 100) : undefined,
    depositAmountCents,
    totalCents,
    taxPercent: d.taxPercent,
    lang: d.lang,
    paymentPreference: d.paymentPreference,
    manualPayInstructions:
      d.manualPayInstructions || user?.manualPayInstructions || undefined,
    createdAt: now,
    updatedAt: now,
  };
  await upsertQuote(quote);

  user.quotesThisMonth = (user.quotesThisMonth ?? 0) + 1;
  user.quotesMonth = mk;
  await updateUser(user);

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  return NextResponse.json({
    quote,
    payUrl: `${origin}/q/${quote.publicToken}`,
  });
}
