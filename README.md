# DevisPay

**Estimate → deposit in one link** for Canadian trades.

Create a professional quote, send a public link, collect the deposit by card (Stripe) before the job starts.

## Stack

- Next.js App Router + TypeScript + Tailwind
- Local JSON store (`data/`) for MVP — Postgres schema in `supabase/schema.sql`
- Stripe Checkout (deposit) + webhook
- Deploy: Vercel (or Netlify)

## Quick start

```bash
pnpm install
cp .env.example .env.local
# set SESSION_SECRET and STRIPE_SECRET_KEY
pnpm dev
```

Open http://localhost:3000

## Flow

1. Register contractor → `/register`
2. Create quote → `/dashboard/new`
3. Copy public link → `/q/[token]`
4. Customer pays deposit → Stripe
5. Webhook marks `deposit_paid`

## Stripe webhook

Endpoint: `https://YOUR_DOMAIN/api/stripe/webhook`  
Event: `checkout.session.completed`

## Pricing (planned SaaS)

| Plan | CAD/mo | Quotes |
|------|--------|--------|
| Solo | $39 | 15/mo |
| Crew | $79 | Unlimited |
| Pro | $129 | Unlimited + seats |

MVP ships deposit collection; subscription gating is next.

## Different from MTLTrades

| MTLTrades | DevisPay |
|-----------|----------|
| Sell homeowner leads | Collect job deposits |
| Marketplace | Ops tool for one contractor |

## License

Private — all rights reserved.
