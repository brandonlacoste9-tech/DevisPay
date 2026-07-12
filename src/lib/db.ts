import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let sql: NeonQueryFunction<false, false> | null = null;

/** Normalize Neon URLs for serverless HTTP driver. */
export function normalizeDatabaseUrl(raw: string): string {
  let url = raw.trim().replace(/^["']|["']$/g, "");
  // channel_binding can break some serverless clients
  url = url
    .replace(/([?&])channel_binding=require&?/g, "$1")
    .replace(/[?&]$/, "")
    .replace(/\?&/, "?");
  return url;
}

/** True when DATABASE_URL is set (Neon / Postgres). */
export function usePostgres(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getSql() {
  if (!usePostgres()) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!sql) {
    sql = neon(normalizeDatabaseUrl(process.env.DATABASE_URL!));
  }
  return sql;
}
