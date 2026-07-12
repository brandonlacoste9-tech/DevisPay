import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/store";
import { setSession } from "@/lib/session";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid" }, { status: 422 });
    }
    const user = await findUserByEmail(parsed.data.email.trim().toLowerCase());
    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    await setSession(user.id, user.email, {
      remember: parsed.data.rememberMe !== false,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json(
      { error: "Server error — check DATABASE_URL on Netlify" },
      { status: 500 }
    );
  }
}
