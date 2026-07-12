import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let sql: NeonQueryFunction<false, false> | null = null;

/** True when DATABASE_URL is set (Neon / Postgres). */
export function usePostgres(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getSql() {
  if (!usePostgres()) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!sql) {
    sql = neon(process.env.DATABASE_URL!);
  }
  return sql;
}
