import { randomUUID } from "crypto";
import { hasDatabase, sql } from "./db";
import { ensureSchema } from "./schema";

export async function listOrders(userId?: string) {
  if (!hasDatabase()) return [];
  await ensureSchema();
  const rows = userId
    ? await sql()`select * from orders where user_id = ${userId} order by created_at desc`
    : await sql()`select * from orders order by created_at desc limit 100`;
  return rows.map((r) => r as Record<string, unknown>);
}

export async function listPayments() {
  if (!hasDatabase()) return [];
  await ensureSchema();
  return (await sql()`select * from payments order by created_at desc limit 100`) as Record<string, unknown>[];
}

export async function listSubscriptions(userId?: string) {
  if (!hasDatabase()) return [];
  await ensureSchema();
  const rows = userId
    ? await sql()`select * from subscriptions where user_id = ${userId} order by created_at desc`
    : await sql()`select * from subscriptions order by created_at desc limit 100`;
  return rows as Record<string, unknown>[];
}

export async function listNotifications(userId: string) {
  if (!hasDatabase()) return [];
  await ensureSchema();
  return (await sql()`select * from notifications where user_id = ${userId} order by created_at desc limit 50`) as Record<string, unknown>[];
}

export async function getSettings() {
  if (!hasDatabase()) return { site_name: "XWIN", currency: "XOF", maintenance: "off" };
  await ensureSchema();
  const rows = await sql()`select key, value from site_settings`;
  const acc: Record<string, string> = { site_name: "XWIN", currency: "XOF", maintenance: "off" };
  for (const r of rows) acc[String((r as Record<string, unknown>).key)] = String((r as Record<string, unknown>).value);
  return acc;
}

export async function setSetting(key: string, value: string) {
  if (!hasDatabase()) return;
  await ensureSchema();
  await sql()`insert into site_settings (key, value) values (${key}, ${value})
    on conflict (key) do update set value = ${value}`;
}

export async function logAdminSession(ok: boolean, note: string) {
  if (!hasDatabase()) return;
  await ensureSchema();
  await sql()`insert into admin_sessions (id, ok, note) values (${randomUUID()}, ${ok}, ${note})`;
}

export async function listAdminSessions() {
  if (!hasDatabase()) return [];
  await ensureSchema();
  return (await sql()`select * from admin_sessions order by created_at desc limit 30`) as Record<string, unknown>[];
}

export async function addWaitlist(email: string, offerId: string | null) {
  if (!hasDatabase()) return;
  await ensureSchema();
  await sql()`insert into waitlist_signups (id, email, offer_id) values (${randomUUID()}, ${email}, ${offerId})`;
}
