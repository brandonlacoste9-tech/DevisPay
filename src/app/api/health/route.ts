import { NextResponse } from "next/server";
import { usePostgres, getSql, normalizeDatabaseUrl } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public diagnostics — no secrets. */
export async function GET() {
  const hasDb = usePostgres();
  let dbOk: boolean | null = null;
  let dbError: string | undefined;
  let tables: string[] | undefined;

  if (hasDb) {
    try {
      const sql = getSql();
      await sql`select 1 as ok`;
      const rows = (await sql`
        select tablename from pg_tables where schemaname = 'public' order by 1
      `) as { tablename: string }[];
      tables = rows.map((r) => r.tablename);
      dbOk = true;
    } catch (e) {
      dbOk = false;
      dbError = e instanceof Error ? e.message : "unknown";
    }
  }

  const url = process.env.DATABASE_URL?.trim();
  let host: string | undefined;
  if (url) {
    try {
      host = new URL(normalizeDatabaseUrl(url)).hostname;
    } catch {
      host = "invalid-url";
    }
  }

  return NextResponse.json({
    ok: hasDb ? dbOk === true : true,
    hasDatabaseUrl: hasDb,
    dbOk,
    dbHost: host,
    tables,
    dbError: dbOk === false ? dbError : undefined,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
    hasStripe: Boolean(process.env.STRIPE_SECRET_KEY),
    hasWebhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    hasSessionSecret: Boolean(process.env.SESSION_SECRET),
  });
}
