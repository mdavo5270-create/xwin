import { cookies } from "next/headers";
import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";
import { sql } from "./db";
import { ensureSchema } from "./schema";
import { safeCompareEqualLength } from "./safe-compare";
import { rateLimit } from "./rate-limit";
import type { Member } from "./types";

const COOKIE = "xwin_member";

function secret() {
  return process.env.AUTH_SECRET || process.env.ADMIN_SECRET || "";
}

function hashPassword(password: string, salt?: string) {
  const s = salt ?? randomBytes(16).toString("hex");
  const hash = scryptSync(password, s, 32).toString("hex");
  return `${s}:${hash}`;
}

function checkPassword(password: string, stored: string) {
  const [s, hash] = stored.split(":");
  if (!s || !hash) return false;
  const next = scryptSync(password, s, 32);
  const prev = Buffer.from(hash, "hex");
  if (prev.length !== next.length) return false;
  return timingSafeEqual(prev, next);
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export async function registerMember(name: string, email: string, password: string) {
  const limited = await rateLimit("register", 5, 60 * 60);
  if (!limited.ok) {
    return { ok: false as const, error: "Trop de tentatives. Réessaie dans quelques minutes." };
  }
  await ensureSchema();
  const clean = email.trim().toLowerCase();
  if (!clean || !password || password.length < 8 || !name.trim()) {
    return { ok: false as const, error: "Nom, email et mot de passe (8+) requis." };
  }
  const existing = await sql()`select id from users where email = ${clean} limit 1`;
  if (existing.length) return { ok: false as const, error: "Cet email a déjà un compte." };
  const id = randomUUID();
  await sql()`
    insert into users (id, email, name, password_hash)
    values (${id}, ${clean}, ${name.trim()}, ${hashPassword(password)})
  `;
  await setMemberCookie({ id, email: clean, name: name.trim() });
  return { ok: true as const };
}

export async function loginMember(email: string, password: string) {
  const limited = await rateLimit("member-login", 8, 10 * 60);
  if (!limited.ok) {
    return { ok: false as const, error: "Trop de tentatives. Réessaie dans quelques minutes." };
  }
  await ensureSchema();
  const clean = email.trim().toLowerCase();
  const rows = await sql()`select id, email, name, password_hash from users where email = ${clean} limit 1`;
  const row = rows[0] as { id: string; email: string; name: string; password_hash: string } | undefined;
  if (!row || !checkPassword(password, row.password_hash)) {
    return { ok: false as const, error: "Email ou mot de passe incorrect." };
  }
  await setMemberCookie({ id: row.id, email: row.email, name: row.name });
  return { ok: true as const };
}

async function setMemberCookie(member: Member) {
  const payload = Buffer.from(JSON.stringify({ ...member, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 })).toString("base64url");
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function logoutMember() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getMember(): Promise<Member | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw || !secret()) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig || !safeCompareEqualLength(sign(payload), sig)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!data?.id || data.exp < Date.now()) return null;
    return { id: data.id, email: data.email, name: data.name };
  } catch {
    return null;
  }
}
