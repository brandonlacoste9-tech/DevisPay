import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "dp_session";
/** Stay signed in (Remember me) */
const MAX_AGE_REMEMBER = 60 * 60 * 24 * 30; // 30 days
/** Default session without Remember me */
const MAX_AGE_SESSION = 60 * 60 * 24; // 1 day

function secret() {
  return process.env.SESSION_SECRET || "devispay-dev-secret-change-me";
}

export type Session = { userId: string; email: string; exp: number };

function sign(body: string) {
  return createHmac("sha256", secret()).update(body).digest("base64url");
}

export function encodeSession(
  userId: string,
  email: string,
  maxAgeSeconds: number = MAX_AGE_SESSION
): string {
  const payload: Session = {
    userId,
    email,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function decodeSession(token?: string): Session | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const s = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Session;
    if (s.exp < Math.floor(Date.now() / 1000)) return null;
    return s;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  return decodeSession(jar.get(COOKIE)?.value);
}

export async function setSession(
  userId: string,
  email: string,
  options?: { remember?: boolean }
) {
  const maxAge = options?.remember ? MAX_AGE_REMEMBER : MAX_AGE_SESSION;
  const jar = await cookies();
  jar.set(COOKIE, encodeSession(userId, email, maxAge), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export function newId() {
  return randomBytes(12).toString("hex");
}

export function newToken() {
  return randomBytes(18).toString("base64url");
}
