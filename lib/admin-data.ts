import { hasDatabase, sql } from "./db";
import { ensureSchema } from "./schema";

export async function countUsers() {
  if (!hasDatabase()) return 0;
  await ensureSchema();
  const rows = await sql()`select count(*)::int as n from users`;
  return Number(rows[0]?.n ?? 0);
}

export async function listUsers() {
  if (!hasDatabase()) return [];
  await ensureSchema();
  const rows = await sql()`select id, email, name, created_at from users order by created_at desc limit 200`;
  return rows.map((r) => ({
    id: String(r.id),
    email: String(r.email),
    name: String(r.name),
    createdAt: String(r.created_at),
  }));
}
