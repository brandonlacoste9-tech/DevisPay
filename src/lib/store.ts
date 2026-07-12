import { promises as fs } from "fs";
import path from "path";
import type { Quote, User } from "./types";
import { isPaidStatus } from "./types";

const DATA = path.join(process.cwd(), "data");

async function ensure() {
  await fs.mkdir(DATA, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensure();
  const p = path.join(DATA, file);
  try {
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensure();
  await fs.writeFile(path.join(DATA, file), JSON.stringify(data, null, 2), "utf8");
}

function normalizeUser(u: User & Record<string, unknown>): User {
  return {
    id: u.id,
    email: u.email,
    passwordHash: u.passwordHash,
    businessName: u.businessName,
    phone: u.phone,
    country: (u.country as string) || "CA",
    defaultCurrency: (u.defaultCurrency as string) || "cad",
    defaultLocale: (u.defaultLocale as User["defaultLocale"]) || "fr",
    plan: (u.plan as User["plan"]) || "starter",
    planStatus: (u.planStatus as User["planStatus"]) || "trialing",
    createdAt: u.createdAt,
    manualPayInstructions: u.manualPayInstructions as string | undefined,
  };
}

function normalizeQuote(q: Quote & Record<string, unknown>): Quote {
  const statusRaw = String(q.status);
  const status =
    statusRaw === "deposit_paid" ? "paid" : (statusRaw as Quote["status"]);
  return {
    id: q.id,
    userId: q.userId,
    publicToken: q.publicToken,
    status: isPaidStatus(status) ? "paid" : status,
    customerName: q.customerName,
    customerEmail: q.customerEmail,
    customerPhone: q.customerPhone,
    title: q.title,
    notes: q.notes,
    currency: (q.currency as string) || "cad",
    items: q.items || [],
    depositType: (q.depositType as Quote["depositType"]) || "percent",
    depositPercent: q.depositPercent ?? 30,
    depositFixedCents: q.depositFixedCents,
    depositAmountCents: q.depositAmountCents,
    totalCents: q.totalCents,
    taxPercent: q.taxPercent ?? 0,
    lang: q.lang || "fr",
    paymentPreference:
      (q.paymentPreference as Quote["paymentPreference"]) || "card_or_manual",
    manualPayInstructions: q.manualPayInstructions,
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
    paidAt: q.paidAt,
    paidVia: q.paidVia,
    stripeSessionId: q.stripeSessionId,
    stripePaymentIntentId: q.stripePaymentIntentId,
  };
}

export async function listUsers(): Promise<User[]> {
  const raw = await readJson<(User & Record<string, unknown>)[]>("users.json", []);
  return raw.map(normalizeUser);
}

export async function saveUsers(users: User[]): Promise<void> {
  await writeJson("users.json", users);
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const users = await listUsers();
  return users.find((u) => u.email === email.toLowerCase());
}

export async function findUserById(id: string): Promise<User | undefined> {
  const users = await listUsers();
  return users.find((u) => u.id === id);
}

export async function listQuotes(): Promise<Quote[]> {
  const raw = await readJson<(Quote & Record<string, unknown>)[]>("quotes.json", []);
  return raw.map(normalizeQuote);
}

export async function saveQuotes(quotes: Quote[]): Promise<void> {
  await writeJson("quotes.json", quotes);
}

export async function findQuoteById(id: string): Promise<Quote | undefined> {
  return (await listQuotes()).find((q) => q.id === id);
}

export async function findQuoteByToken(token: string): Promise<Quote | undefined> {
  return (await listQuotes()).find((q) => q.publicToken === token);
}

export async function upsertQuote(quote: Quote): Promise<Quote> {
  const quotes = await listQuotes();
  const i = quotes.findIndex((q) => q.id === quote.id);
  if (i >= 0) quotes[i] = quote;
  else quotes.unshift(quote);
  await saveQuotes(quotes);
  return quote;
}

export { money } from "./money";
export { calcQuoteTotals } from "./money";
