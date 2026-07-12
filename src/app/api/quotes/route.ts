import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession, newId, newToken } from "@/lib/session";
import { calcTotals, listQuotes, upsertQuote } from "@/lib/store";
import type { LineItem, Quote } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(), // dollars
});

const CreateSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  title: z.string().min(1),
  notes: z.string().optional(),
  depositPercent: z.number().min(1).max(100).default(30),
  lang: z.enum(["fr", "en"]).default("fr"),
  items: z.array(ItemSchema).min(1),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const all = await listQuotes();
  const mine = all.filter((q) => q.userId === session.userId);
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
  const items: LineItem[] = d.items.map((it) => ({
    id: newId(),
    description: it.description,
    quantity: it.quantity,
    unitPriceCents: Math.round(it.unitPrice * 100),
  }));
  const { totalCents, depositAmountCents } = calcTotals(
    items,
    d.depositPercent
  );
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
    currency: "cad",
    items,
    depositPercent: d.depositPercent,
    depositAmountCents,
    totalCents,
    lang: d.lang,
    createdAt: now,
    updatedAt: now,
  };
  await upsertQuote(quote);
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";
  return NextResponse.json({
    quote,
    payUrl: `${origin}/q/${quote.publicToken}`,
  });
}
