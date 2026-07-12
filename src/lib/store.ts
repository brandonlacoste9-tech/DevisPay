import { promises as fs } from "fs";
import path from "path";
import type { Quote, User } from "./types";

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
  const p = path.join(DATA, file);
  await fs.writeFile(p, JSON.stringify(data, null, 2), "utf8");
}

export async function listUsers(): Promise<User[]> {
  return readJson<User[]>("users.json", []);
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
  return readJson<Quote[]>("quotes.json", []);
}

export async function saveQuotes(quotes: Quote[]): Promise<void> {
  await writeJson("quotes.json", quotes);
}

export async function findQuoteById(id: string): Promise<Quote | undefined> {
  const quotes = await listQuotes();
  return quotes.find((q) => q.id === id);
}

export async function findQuoteByToken(token: string): Promise<Quote | undefined> {
  const quotes = await listQuotes();
  return quotes.find((q) => q.publicToken === token);
}

export async function upsertQuote(quote: Quote): Promise<Quote> {
  const quotes = await listQuotes();
  const i = quotes.findIndex((q) => q.id === quote.id);
  if (i >= 0) quotes[i] = quote;
  else quotes.unshift(quote);
  await saveQuotes(quotes);
  return quote;
}

export function money(cents: number, currency = "CAD"): string {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function calcTotals(
  items: { quantity: number; unitPriceCents: number }[],
  depositPercent: number
) {
  const totalCents = items.reduce(
    (s, it) => s + Math.round(it.quantity * it.unitPriceCents),
    0
  );
  const pct = Math.min(100, Math.max(0, depositPercent));
  const depositAmountCents = Math.round((totalCents * pct) / 100);
  return { totalCents, depositAmountCents };
}
