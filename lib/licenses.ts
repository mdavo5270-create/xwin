import { randomUUID } from "crypto";
import { hasDatabase, sql } from "./db";
import { ensureSchema } from "./schema";

export type License = {
  id: string;
  userId: string;
  publicId: string;
  email: string;
  name: string;
  days: number;
  startsAt: string;
  endsAt: string;
  note: string;
};

export async function getActiveLicense(userId: string) {
  if (!hasDatabase() || !userId) return null;
  await ensureSchema();
  const rows = await sql()`
    select id, user_id, days, starts_at, ends_at, note
    from licenses
    where user_id = ${userId} and ends_at > now()
    order by ends_at desc
    limit 1
  `;
  const r = rows[0] as Record<string, unknown> | undefined;
  if (!r) return null;
  return {
    id: String(r.id),
    userId: String(r.user_id),
    days: Number(r.days),
    startsAt: String(r.starts_at),
    endsAt: String(r.ends_at),
    note: String(r.note ?? ""),
  };
}

export async function listLicenses(): Promise<License[]> {
  if (!hasDatabase()) return [];
  await ensureSchema();
  const rows = await sql()`
    select l.id, l.user_id, l.days, l.starts_at, l.ends_at, l.note,
           u.public_id, u.email, u.name
    from licenses l
    join users u on u.id = l.user_id
    order by l.ends_at desc
    limit 80
  `;
  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: String(row.id),
      userId: String(row.user_id),
      publicId: String(row.public_id ?? ""),
      email: String(row.email),
      name: String(row.name),
      days: Number(row.days),
      startsAt: String(row.starts_at),
      endsAt: String(row.ends_at),
      note: String(row.note ?? ""),
    };
  });
}

export async function grantLicense(publicId: string, days: 7 | 30, note = "") {
  if (!hasDatabase()) return { ok: false as const, error: "Base indisponible." };
  await ensureSchema();
  const code = publicId.trim().toUpperCase();
  const users = await sql()`select id from users where public_id = ${code} limit 1`;
  const user = users[0] as { id: string } | undefined;
  if (!user) return { ok: false as const, error: "ID compte introuvable." };
  await sql()`
    insert into licenses (id, user_id, days, starts_at, ends_at, note)
    values (${randomUUID()}, ${user.id}, ${days}, now(), now() + (${days} || ' days')::interval, ${note})
  `;
  return { ok: true as const };
}
