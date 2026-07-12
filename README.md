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
- Deploy: **Netlify** (OpenNext / `@netlify/plugin-nextjs`)  

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

## Deploy on Netlify

1. Site linked to `brandonlacoste9-tech/DevisPay` · branch `main`  
2. Build settings (or use `netlify.toml`):
   - **Build command:** `pnpm run build`  
   - **Publish:** leave default / let Next plugin handle (do **not** set SPA redirects to `index.html`)  
   - Plugin: `@netlify/plugin-nextjs` (auto with our `netlify.toml`)  
3. **Domain:** Site settings → Domain management → Add `devispay.com` + `www`  
4. **Env vars** (Site settings → Environment variables → Production):

```env
NEXT_PUBLIC_SITE_URL=https://devispay.com
SESSION_SECRET=long-random-string
STRIPE_SECRET_KEY=sk_live_or_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

5. Stripe webhook endpoint:  
   `https://devispay.com/api/stripe/webhook`  
   Event: `checkout.session.completed`  
6. Trigger a redeploy after env / domain changes.

### Important (production data)

Local JSON under `data/` is **fine for demo**, but **Netlify Functions are ephemeral** — writes may not stick across instances. For real multi-user production, run `supabase/schema.sql` and wire Postgres (`DATABASE_URL`). Until then, treat Netlify as marketing + light demo.

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
