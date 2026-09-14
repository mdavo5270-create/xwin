import { randomBytes, randomUUID } from "crypto";
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

export type LicenseKey = {
  id: string;
  code: string;
  days: number;
  reservedPublicId: string;
  redeemed: boolean;
  createdAt: string;
};

function makeCode() {
  return `LIC-${randomBytes(3).toString("hex").toUpperCase()}`;
}

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

export async function listLicenseKeys(): Promise<LicenseKey[]> {
  if (!hasDatabase()) return [];
  await ensureSchema();
  const rows = await sql()`
    select id, code, days, reserved_public_id, redeemed_user_id, created_at
    from license_keys
    order by created_at desc
    limit 80
  `;
  return rows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: String(row.id),
      code: String(row.code),
      days: Number(row.days),
      reservedPublicId: String(row.reserved_public_id ?? ""),
      redeemed: Boolean(row.redeemed_user_id),
      createdAt: String(row.created_at),
    };
  });
}

export async function createLicenseKey(days: 7 | 30, reservedPublicId = "") {
  if (!hasDatabase()) return { ok: false as const, error: "Base indisponible." };
  await ensureSchema();
  const code = makeCode();
  const reserved = reservedPublicId.trim().toUpperCase();
  await sql()`
    insert into license_keys (id, code, days, reserved_public_id)
    values (${randomUUID()}, ${code}, ${days}, ${reserved})
  `;
  return { ok: true as const, code };
}

export async function redeemLicense(userId: string, publicId: string, raw: string) {
  if (!hasDatabase()) return { ok: false as const, error: "Base indisponible." };
  await ensureSchema();
  const code = raw.trim().toUpperCase();
  if (!code) return { ok: false as const, error: "Entre le code licence." };
  const rows = await sql()`select id, days, reserved_public_id, redeemed_user_id from license_keys where code = ${code} limit 1`;
  const key = rows[0] as { id: string; days: number; reserved_public_id: string; redeemed_user_id: string | null } | undefined;
  if (!key) return { ok: false as const, error: "Code invalide." };
  if (key.redeemed_user_id) return { ok: false as const, error: "Code déjà utilisé." };
  if (key.reserved_public_id && key.reserved_public_id !== publicId.toUpperCase()) {
    return { ok: false as const, error: "Ce code est réservé à un autre ID." };
  }
  const days = Number(key.days) === 7 ? 7 : 30;
  await sql()`
    insert into licenses (id, user_id, days, starts_at, ends_at, note)
    values (${randomUUID()}, ${userId}, ${days}, now(), now() + (${String(days)} || ' days')::interval, ${code})
  `;
  await sql()`update license_keys set redeemed_user_id = ${userId}, redeemed_at = now() where id = ${key.id}`;
  return { ok: true as const };
}
