import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "@/lib/store";
import { newId, setSession } from "@/lib/session";
import type { User } from "@/lib/types";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  businessName: z.string().min(1).max(200),
  phone: z.string().max(40).optional(),
  country: z.string().length(2).optional(),
  defaultCurrency: z.string().min(3).max(3).optional(),
  defaultLocale: z.enum(["fr", "en"]).optional(),
  manualPayInstructions: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 422 });
  }
  const email = parsed.data.email.trim().toLowerCase();
  if (await findUserByEmail(email)) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }
  const user: User = {
    id: newId(),
    email,
    passwordHash: await bcrypt.hash(parsed.data.password, 10),
    businessName: parsed.data.businessName.trim(),
    phone: parsed.data.phone,
    country: (parsed.data.country || "CA").toUpperCase(),
    defaultCurrency: (parsed.data.defaultCurrency || "cad").toLowerCase(),
    defaultLocale: parsed.data.defaultLocale || "en",
    plan: "starter",
    planStatus: "trialing",
    createdAt: new Date().toISOString(),
    manualPayInstructions: parsed.data.manualPayInstructions,
  };
  await createUser(user);
  await setSession(user.id, user.email);
  return NextResponse.json({ success: true, userId: user.id });
}
