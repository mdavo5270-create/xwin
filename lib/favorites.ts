import { sql } from "./db";
import { ensureSchema } from "./schema";
import { getProno } from "./store";
import type { Prono } from "./types";

export async function toggleFavorite(userId: string, pronoId: string) {
  await ensureSchema();
  const existing = await sql()`select 1 from favorites where user_id = ${userId} and prono_id = ${pronoId} limit 1`;
  if (existing.length) {
    await sql()`delete from favorites where user_id = ${userId} and prono_id = ${pronoId}`;
    return false;
  }
  await sql()`insert into favorites (user_id, prono_id) values (${userId}, ${pronoId})`;
  return true;
}

export async function listFavorites(userId: string): Promise<Prono[]> {
  await ensureSchema();
  const rows = await sql()`select prono_id from favorites where user_id = ${userId} order by created_at desc`;
  const out: Prono[] = [];
  for (const r of rows) {
    const p = await getProno(String(r.prono_id));
    if (p) out.push(p);
  }
  return out;
}
