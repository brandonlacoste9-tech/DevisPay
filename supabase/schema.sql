-- DevisPay schema (Neon / Postgres)
-- Run in Neon SQL Editor once after creating the project.

create extension if not exists "pgcrypto";

create table if not exists accounts (
  id text primary key,
  created_at timestamptz not null default now(),
  email text not null unique,
  password_hash text not null,
  business_name text not null,
  phone text,
  country text not null default 'CA',
  default_currency text not null default 'cad',
  default_locale text not null default 'en',
  plan text not null default 'starter'
    check (plan in ('starter','growth','business')),
  plan_status text not null default 'trialing'
    check (plan_status in ('trialing','active','past_due','canceled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  quotes_this_month int not null default 0,
  quotes_month text,
  brand_logo_url text,
  manual_pay_instructions text
);

create table if not exists quotes (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  account_id text not null references accounts(id) on delete cascade,
  public_token text not null unique,
  status text not null default 'draft'
    check (status in ('draft','sent','paid','void','expired')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  title text not null,
  notes text,
  currency text not null default 'cad',
  locale text not null default 'en',
  deposit_type text not null default 'percent'
    check (deposit_type in ('percent','fixed')),
  deposit_percent numeric(5,2),
  deposit_fixed_cents int,
  deposit_amount_cents int not null,
  total_cents int not null,
  tax_percent numeric(5,2) not null default 0,
  payment_method_preference text default 'card_or_manual'
    check (payment_method_preference in ('card_only','manual_only','card_or_manual')),
  manual_pay_instructions text,
  paid_at timestamptz,
  paid_via text check (paid_via is null or paid_via in ('card','manual','other')),
  stripe_checkout_session_id text,
  stripe_payment_intent_id text
);

create table if not exists quote_items (
  id text primary key,
  quote_id text not null references quotes(id) on delete cascade,
  position int not null default 0,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit_price_cents int not null,
  line_total_cents int not null
);

create index if not exists quotes_account_id_idx on quotes(account_id);
create index if not exists quotes_public_token_idx on quotes(public_token);
create index if not exists quotes_status_idx on quotes(status);
create index if not exists quote_items_quote_id_idx on quote_items(quote_id);
