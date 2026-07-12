import { promises as fs } from "fs";
import path from "path";
import type { LineItem, Quote, User } from "./types";
import { isPaidStatus } from "./types";
import { getSql, usePostgres } from "./db";

const DATA = path.join(process.cwd(), "data");

// ─── JSON fallback (local demo only) ─────────────────────────────────────────

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
    defaultLocale: (u.defaultLocale as User["defaultLocale"]) || "en",
    plan: (u.plan as User["plan"]) || "starter",
    planStatus: (u.planStatus as User["planStatus"]) || "trialing",
    createdAt: u.createdAt,
    manualPayInstructions: u.manualPayInstructions as string | undefined,
    stripeAccountId: (u.stripeAccountId as string | undefined) || undefined,
    stripeChargesEnabled: Boolean(u.stripeChargesEnabled),
    stripeDetailsSubmitted: Boolean(u.stripeDetailsSubmitted),
    stripePayoutsEnabled: Boolean(u.stripePayoutsEnabled),
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
    lang: q.lang || "en",
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

// ─── Postgres row mappers ────────────────────────────────────────────────────

type AccountRow = {
  id: string;
  email: string;
  password_hash: string;
  business_name: string;
  phone: string | null;
  country: string;
  default_currency: string;
  default_locale: string;
  plan: string;
  plan_status: string;
  created_at: string | Date;
  manual_pay_instructions: string | null;
  stripe_connect_account_id?: string | null;
  stripe_charges_enabled?: boolean | null;
  stripe_details_submitted?: boolean | null;
  stripe_payouts_enabled?: boolean | null;
};

type QuoteRow = {
  id: string;
  account_id: string;
  public_token: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  title: string;
  notes: string | null;
  currency: string;
  locale: string;
  deposit_type: string;
  deposit_percent: string | number | null;
  deposit_fixed_cents: number | null;
  deposit_amount_cents: number;
  total_cents: number;
  tax_percent: string | number;
  payment_method_preference: string | null;
  manual_pay_instructions: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  paid_at: string | Date | null;
  paid_via: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
};

type ItemRow = {
  id: string;
  quote_id: string;
  position: number;
  description: string;
  quantity: string | number;
  unit_price_cents: number;
};

function iso(v: string | Date | null | undefined): string | undefined {
  if (v == null) return undefined;
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

function accountToUser(r: AccountRow): User {
  return normalizeUser({
    id: r.id,
    email: r.email,
    passwordHash: r.password_hash,
    businessName: r.business_name,
    phone: r.phone ?? undefined,
    country: r.country,
    defaultCurrency: r.default_currency,
    defaultLocale: r.default_locale as User["defaultLocale"],
    plan: r.plan as User["plan"],
    planStatus: r.plan_status as User["planStatus"],
    createdAt: iso(r.created_at) || new Date().toISOString(),
    manualPayInstructions: r.manual_pay_instructions ?? undefined,
    stripeAccountId: r.stripe_connect_account_id ?? undefined,
    stripeChargesEnabled: Boolean(r.stripe_charges_enabled),
    stripeDetailsSubmitted: Boolean(r.stripe_details_submitted),
    stripePayoutsEnabled: Boolean(r.stripe_payouts_enabled),
  });
}

function quoteRowToQuote(r: QuoteRow, items: LineItem[]): Quote {
  return normalizeQuote({
    id: r.id,
    userId: r.account_id,
    publicToken: r.public_token,
    status: r.status as Quote["status"],
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    customerPhone: r.customer_phone ?? undefined,
    title: r.title,
    notes: r.notes ?? undefined,
    currency: r.currency,
    items,
    depositType: r.deposit_type as Quote["depositType"],
    depositPercent:
      r.deposit_percent != null ? Number(r.deposit_percent) : undefined,
    depositFixedCents: r.deposit_fixed_cents ?? undefined,
    depositAmountCents: r.deposit_amount_cents,
    totalCents: r.total_cents,
    taxPercent: Number(r.tax_percent),
    lang: (r.locale as Quote["lang"]) || "en",
    paymentPreference:
      (r.payment_method_preference as Quote["paymentPreference"]) ||
      "card_or_manual",
    manualPayInstructions: r.manual_pay_instructions ?? undefined,
    createdAt: iso(r.created_at) || new Date().toISOString(),
    updatedAt: iso(r.updated_at) || new Date().toISOString(),
    paidAt: iso(r.paid_at),
    paidVia: (r.paid_via as Quote["paidVia"]) || undefined,
    stripeSessionId: r.stripe_checkout_session_id ?? undefined,
    stripePaymentIntentId: r.stripe_payment_intent_id ?? undefined,
  });
}

async function loadItems(quoteIds: string[]): Promise<Map<string, LineItem[]>> {
  const map = new Map<string, LineItem[]>();
  if (quoteIds.length === 0) return map;
  const sql = getSql();
  const rows = (await sql`
    select id, quote_id, position, description, quantity, unit_price_cents
    from quote_items
    where quote_id = any(${quoteIds})
    order by position asc
  `) as ItemRow[];
  for (const row of rows) {
    const list = map.get(row.quote_id) || [];
    list.push({
      id: row.id,
      description: row.description,
      quantity: Number(row.quantity),
      unitPriceCents: row.unit_price_cents,
    });
    map.set(row.quote_id, list);
  }
  return map;
}

async function hydrateQuotes(rows: QuoteRow[]): Promise<Quote[]> {
  const items = await loadItems(rows.map((r) => r.id));
  return rows.map((r) => quoteRowToQuote(r, items.get(r.id) || []));
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const e = email.toLowerCase();
  if (!usePostgres()) {
    const users = await readJson<(User & Record<string, unknown>)[]>("users.json", []);
    return users.map(normalizeUser).find((u) => u.email === e);
  }
  const sql = getSql();
  const rows = (await sql`
    select * from accounts where email = ${e} limit 1
  `) as AccountRow[];
  return rows[0] ? accountToUser(rows[0]) : undefined;
}

export async function findUserById(id: string): Promise<User | undefined> {
  if (!usePostgres()) {
    const users = await readJson<(User & Record<string, unknown>)[]>("users.json", []);
    return users.map(normalizeUser).find((u) => u.id === id);
  }
  const sql = getSql();
  const rows = (await sql`
    select * from accounts where id = ${id} limit 1
  `) as AccountRow[];
  return rows[0] ? accountToUser(rows[0]) : undefined;
}

export async function createUser(user: User): Promise<User> {
  if (!usePostgres()) {
    const users = await readJson<User[]>("users.json", []);
    users.push(user);
    await writeJson("users.json", users);
    return user;
  }
  const sql = getSql();
  await sql`
    insert into accounts (
      id, email, password_hash, business_name, phone, country,
      default_currency, default_locale, plan, plan_status,
      created_at, manual_pay_instructions,
      stripe_connect_account_id, stripe_charges_enabled,
      stripe_details_submitted, stripe_payouts_enabled
    ) values (
      ${user.id},
      ${user.email},
      ${user.passwordHash},
      ${user.businessName},
      ${user.phone ?? null},
      ${user.country},
      ${user.defaultCurrency},
      ${user.defaultLocale},
      ${user.plan},
      ${user.planStatus},
      ${user.createdAt},
      ${user.manualPayInstructions ?? null},
      ${user.stripeAccountId ?? null},
      ${user.stripeChargesEnabled ?? false},
      ${user.stripeDetailsSubmitted ?? false},
      ${user.stripePayoutsEnabled ?? false}
    )
  `;
  return user;
}

export async function updateUser(user: User): Promise<User> {
  if (!usePostgres()) {
    const users = await readJson<User[]>("users.json", []);
    const i = users.findIndex((u) => u.id === user.id);
    if (i >= 0) users[i] = user;
    else users.push(user);
    await writeJson("users.json", users);
    return user;
  }
  const sql = getSql();
  await sql`
    update accounts set
      business_name = ${user.businessName},
      phone = ${user.phone ?? null},
      country = ${user.country},
      default_currency = ${user.defaultCurrency},
      default_locale = ${user.defaultLocale},
      plan = ${user.plan},
      plan_status = ${user.planStatus},
      manual_pay_instructions = ${user.manualPayInstructions ?? null},
      stripe_connect_account_id = ${user.stripeAccountId ?? null},
      stripe_charges_enabled = ${user.stripeChargesEnabled ?? false},
      stripe_details_submitted = ${user.stripeDetailsSubmitted ?? false},
      stripe_payouts_enabled = ${user.stripePayoutsEnabled ?? false}
    where id = ${user.id}
  `;
  return user;
}

export async function findUserByStripeAccountId(
  accountId: string
): Promise<User | undefined> {
  if (!usePostgres()) {
    const users = await readJson<(User & Record<string, unknown>)[]>("users.json", []);
    return users.map(normalizeUser).find((u) => u.stripeAccountId === accountId);
  }
  const sql = getSql();
  const rows = (await sql`
    select * from accounts
    where stripe_connect_account_id = ${accountId}
    limit 1
  `) as AccountRow[];
  return rows[0] ? accountToUser(rows[0]) : undefined;
}

/** @deprecated prefer createUser — kept for JSON path compatibility */
export async function listUsers(): Promise<User[]> {
  if (usePostgres()) {
    const sql = getSql();
    const rows = (await sql`select * from accounts order by created_at desc`) as AccountRow[];
    return rows.map(accountToUser);
  }
  const raw = await readJson<(User & Record<string, unknown>)[]>("users.json", []);
  return raw.map(normalizeUser);
}

export async function saveUsers(users: User[]): Promise<void> {
  if (usePostgres()) {
    throw new Error("saveUsers is not supported with DATABASE_URL — use createUser");
  }
  await writeJson("users.json", users);
}

export async function listQuotes(): Promise<Quote[]> {
  if (!usePostgres()) {
    const raw = await readJson<(Quote & Record<string, unknown>)[]>("quotes.json", []);
    return raw.map(normalizeQuote);
  }
  const sql = getSql();
  const rows = (await sql`
    select * from quotes order by created_at desc
  `) as QuoteRow[];
  return hydrateQuotes(rows);
}

export async function listQuotesForUser(userId: string): Promise<Quote[]> {
  if (!usePostgres()) {
    return (await listQuotes()).filter((q) => q.userId === userId);
  }
  const sql = getSql();
  const rows = (await sql`
    select * from quotes
    where account_id = ${userId}
    order by created_at desc
  `) as QuoteRow[];
  return hydrateQuotes(rows);
}

export async function saveQuotes(quotes: Quote[]): Promise<void> {
  if (usePostgres()) {
    throw new Error("saveQuotes is not supported with DATABASE_URL — use upsertQuote");
  }
  await writeJson("quotes.json", quotes);
}

export async function findQuoteById(id: string): Promise<Quote | undefined> {
  if (!usePostgres()) {
    return (await listQuotes()).find((q) => q.id === id);
  }
  const sql = getSql();
  const rows = (await sql`
    select * from quotes where id = ${id} limit 1
  `) as QuoteRow[];
  if (!rows[0]) return undefined;
  const [q] = await hydrateQuotes(rows);
  return q;
}

export async function findQuoteByToken(token: string): Promise<Quote | undefined> {
  if (!usePostgres()) {
    return (await listQuotes()).find((q) => q.publicToken === token);
  }
  const sql = getSql();
  const rows = (await sql`
    select * from quotes where public_token = ${token} limit 1
  `) as QuoteRow[];
  if (!rows[0]) return undefined;
  const [q] = await hydrateQuotes(rows);
  return q;
}

export async function upsertQuote(quote: Quote): Promise<Quote> {
  if (!usePostgres()) {
    const quotes = await listQuotes();
    const i = quotes.findIndex((q) => q.id === quote.id);
    if (i >= 0) quotes[i] = quote;
    else quotes.unshift(quote);
    await saveQuotes(quotes);
    return quote;
  }

  const sql = getSql();
  await sql`
    insert into quotes (
      id, account_id, public_token, status,
      customer_name, customer_email, customer_phone,
      title, notes, currency, locale,
      deposit_type, deposit_percent, deposit_fixed_cents,
      deposit_amount_cents, total_cents, tax_percent,
      payment_method_preference, manual_pay_instructions,
      created_at, updated_at, paid_at, paid_via,
      stripe_checkout_session_id, stripe_payment_intent_id
    ) values (
      ${quote.id},
      ${quote.userId},
      ${quote.publicToken},
      ${quote.status},
      ${quote.customerName},
      ${quote.customerEmail},
      ${quote.customerPhone ?? null},
      ${quote.title},
      ${quote.notes ?? null},
      ${quote.currency},
      ${quote.lang},
      ${quote.depositType},
      ${quote.depositPercent ?? null},
      ${quote.depositFixedCents ?? null},
      ${quote.depositAmountCents},
      ${quote.totalCents},
      ${quote.taxPercent},
      ${quote.paymentPreference},
      ${quote.manualPayInstructions ?? null},
      ${quote.createdAt},
      ${quote.updatedAt},
      ${quote.paidAt ?? null},
      ${quote.paidVia ?? null},
      ${quote.stripeSessionId ?? null},
      ${quote.stripePaymentIntentId ?? null}
    )
    on conflict (id) do update set
      status = excluded.status,
      customer_name = excluded.customer_name,
      customer_email = excluded.customer_email,
      customer_phone = excluded.customer_phone,
      title = excluded.title,
      notes = excluded.notes,
      currency = excluded.currency,
      locale = excluded.locale,
      deposit_type = excluded.deposit_type,
      deposit_percent = excluded.deposit_percent,
      deposit_fixed_cents = excluded.deposit_fixed_cents,
      deposit_amount_cents = excluded.deposit_amount_cents,
      total_cents = excluded.total_cents,
      tax_percent = excluded.tax_percent,
      payment_method_preference = excluded.payment_method_preference,
      manual_pay_instructions = excluded.manual_pay_instructions,
      updated_at = excluded.updated_at,
      paid_at = excluded.paid_at,
      paid_via = excluded.paid_via,
      stripe_checkout_session_id = excluded.stripe_checkout_session_id,
      stripe_payment_intent_id = excluded.stripe_payment_intent_id
  `;

  // Replace line items
  await sql`delete from quote_items where quote_id = ${quote.id}`;
  for (let i = 0; i < quote.items.length; i++) {
    const it = quote.items[i];
    const lineTotal = Math.round(it.quantity * it.unitPriceCents);
    await sql`
      insert into quote_items (
        id, quote_id, position, description, quantity, unit_price_cents, line_total_cents
      ) values (
        ${it.id},
        ${quote.id},
        ${i},
        ${it.description},
        ${it.quantity},
        ${it.unitPriceCents},
        ${lineTotal}
      )
    `;
  }

  return quote;
}

export { money } from "./money";
export { calcQuoteTotals } from "./money";
export { usePostgres } from "./db";
