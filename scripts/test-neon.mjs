import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { resolve } from "path";

// load .env.local
try {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
} catch {
  /* ignore */
}

let url = process.env.DATABASE_URL;
if (!url) {
  console.error("No DATABASE_URL");
  process.exit(1);
}
// strip params that break some serverless clients
url = url
  .replace(/[?&]channel_binding=require/g, "")
  .replace(/\?&/, "?")
  .replace(/\?$/, "");

console.log("host:", url.split("@")[1]?.split("/")[0]);
const sql = neon(url);
try {
  console.log(await sql`select 1 as ok`);
  console.log(await sql`select tablename from pg_tables where schemaname='public'`);
  const id = "probe" + Date.now();
  const email = `probe${Date.now()}@test.com`;
  await sql`
    insert into accounts (
      id, email, password_hash, business_name, country,
      default_currency, default_locale, plan, plan_status, created_at
    ) values (
      ${id}, ${email}, 'x', 'Probe', 'CA',
      'cad', 'en', 'starter', 'trialing', ${new Date().toISOString()}
    )
  `;
  console.log("insert ok", id);
} catch (e) {
  console.error("FAIL", e);
  process.exit(1);
}
