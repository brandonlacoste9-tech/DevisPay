import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { findUserById, updateUser } from "@/lib/store";
import { canAcceptCardPayments } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    businessName: user.businessName,
    email: user.email,
    phone: user.phone || "",
    country: user.country,
    defaultCurrency: user.defaultCurrency,
    defaultLocale: user.defaultLocale,
    brandLogoUrl: user.brandLogoUrl || "",
    manualPayInstructions: user.manualPayInstructions || "",
    stripeReady: canAcceptCardPayments(user),
  });
}

const PatchSchema = z.object({
  businessName: z.string().min(1).max(200).optional(),
  phone: z.string().max(40).optional(),
  brandLogoUrl: z
    .string()
    .max(500)
    .optional()
    .refine(
      (v) => !v || v === "" || /^https?:\/\//i.test(v),
      "Logo must be an http(s) URL"
    ),
  manualPayInstructions: z.string().max(500).optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const parsed = PatchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid", details: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const d = parsed.data;
  if (d.businessName != null) user.businessName = d.businessName.trim();
  if (d.phone != null) user.phone = d.phone.trim() || undefined;
  if (d.brandLogoUrl != null) {
    user.brandLogoUrl = d.brandLogoUrl.trim() || undefined;
  }
  if (d.manualPayInstructions != null) {
    user.manualPayInstructions = d.manualPayInstructions.trim() || undefined;
  }
  await updateUser(user);
  return NextResponse.json({ success: true });
}
