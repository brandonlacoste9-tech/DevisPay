-- Run once on existing Neon DB (safe if columns already exist)
alter table accounts add column if not exists stripe_connect_account_id text;
alter table accounts add column if not exists stripe_charges_enabled boolean not null default false;
alter table accounts add column if not exists stripe_details_submitted boolean not null default false;
alter table accounts add column if not exists stripe_payouts_enabled boolean not null default false;

create unique index if not exists accounts_stripe_connect_account_id_uidx
  on accounts (stripe_connect_account_id)
  where stripe_connect_account_id is not null;
