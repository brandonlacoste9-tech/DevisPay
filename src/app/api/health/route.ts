import { NextResponse } from "next/server";
import { usePostgres, getSql, normalizeDatabaseUrl } from "@/lib/db";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function publicOk(ok: boolean, dbOk: boolean | null) {
  return NextResponse.json({ ok, dbOk });
}

/** Public: { ok, dbOk } only. Full diagnostics require a logged-in session. */
export async function GET() {
  const hasDb = usePostgres();
  let dbOk: boolean | null = null;
  let dbError: string | undefined;
  let tables: string[] | undefined;

  if (hasDb) {
    try {
      const sql = getSql();
      await sql`select 1 as ok`;
      dbOk = true;
    } catch (e) {
      dbOk = false;
      dbError = e instanceof Error ? e.message : "unknown";
    }
  }

  const session = await getSession();
  if (!session) {
    return publicOk(hasDb ? dbOk === true : true, dbOk);
  }

  if (hasDb && dbOk) {
    try {
      const sql = getSql();
      const rows = (await sql`
        select tablename from pg_tables where schemaname = 'public' order by 1
      `) as { tablename: string }[];
      tables = rows.map((r) => r.tablename);
    } catch {
      /* ignore table list */
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
    hasEmail: Boolean(process.env.RESEND_API_KEY),
    emailFrom: process.env.EMAIL_FROM || null,
  });
}
