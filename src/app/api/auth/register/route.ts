import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { findUserByEmail, listUsers, saveUsers } from "@/lib/store";
import { newId, setSession } from "@/lib/session";
import type { User } from "@/lib/types";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  businessName: z.string().min(1).max(200),
  phone: z.string().max(40).optional(),
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
    createdAt: new Date().toISOString(),
  };
  const users = await listUsers();
  users.push(user);
  await saveUsers(users);
  await setSession(user.id, user.email);
  return NextResponse.json({ success: true, userId: user.id });
}
