# DevisPay (global)

**Brand:** DevisPay · **Domain:** [devispay.com](https://devispay.com)

**Pay this quote. Venmo-simple. Not a bank.**

Create a professional quote → share one link → customer pays deposit by **card (Stripe)** or **bank/Interac** (seller marks paid).

Built for **any service business** worldwide. Launch GTM: Canada + trades/freelancers. Cross-sell with [MTLTrades](https://mtltrades.com).

## Product

| | |
|--|--|
| **Seller** | Any service biz that quotes before work |
| **Buyer** | Their customer (free) |
| **Money** | SaaS subscription (planned) + deposit collection |

**Not:** P2P cash app (Zelle/Venmo clone) · licensed escrow · lead marketplace.

## Stack

- Next.js App Router · TypeScript · Tailwind · Zod · Stripe  
- Local JSON (`data/`) for MVP · Postgres schema in `supabase/schema.sql`  
- Deploy: **Vercel** recommended  

## Quick start

```bash
pnpm install
cp .env.example .env.local
# SESSION_SECRET=...
# STRIPE_SECRET_KEY=sk_test_...
pnpm dev
```

1. Register → create quote  
2. Copy `/q/[token]`  
3. Customer pays card **or** seller opens `?seller=1` → Mark paid  

## Features (global MVP)

- Multi-currency (CAD, USD, EUR, GBP, AUD)  
- Deposit **%** or **fixed** amount  
- Card (Stripe Checkout)  
- Manual / Interac instructions + **Mark as paid**  
- FR/EN quote language  
- Venmo-style public pay page  

## Env

```env
NEXT_PUBLIC_SITE_URL=https://devispay.com
SESSION_SECRET=long-random
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Webhook: `POST /api/stripe/webhook` · event `checkout.session.completed`

## Stripe products (SaaS — wire when ready)

| Plan | ~CAD/mo | Entitlement |
|------|---------|-------------|
| Starter | $39 | 15 quotes/mo |
| Growth | $79 | Unlimited |
| Business | $129 | Unlimited + seats |

## Repo

https://github.com/brandonlacoste9-tech/DevisPay
