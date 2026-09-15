import { cookies } from "next/headers";
import { createHash, createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";
import { hasDatabase, sql } from "./db";
import { ensureSchema } from "./schema";
import { safeCompareEqualLength } from "./safe-compare";
import { rateLimit } from "./rate-limit";
import { sendMail } from "./mailer";
import { makePublicId } from "./public-id";
import { SITE_URL } from "./site";
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

async function ensurePublicId(userId: string, current?: string | null) {
  if (current) return current;
  if (!hasDatabase()) return makePublicId();
  const code = makePublicId();
  await sql()`update users set public_id = ${code} where id = ${userId} and (public_id is null or public_id = '')`;
  const rows = await sql()`select public_id from users where id = ${userId} limit 1`;
  return String((rows[0] as { public_id?: string } | undefined)?.public_id || code);
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
  const publicId = makePublicId();
  await sql()`
    insert into users (id, email, name, password_hash, public_id)
    values (${id}, ${clean}, ${name.trim()}, ${hashPassword(password)}, ${publicId})
  `;
  await setMemberCookie({ id, email: clean, name: name.trim(), publicId });
  return { ok: true as const };
}

export async function loginMember(email: string, password: string) {
  const limited = await rateLimit("member-login", 8, 10 * 60);
  if (!limited.ok) {
    return { ok: false as const, error: "Trop de tentatives. Réessaie dans quelques minutes." };
  }
  await ensureSchema();
  const clean = email.trim().toLowerCase();
  const rows = await sql()`select id, email, name, password_hash, public_id from users where email = ${clean} limit 1`;
  const row = rows[0] as { id: string; email: string; name: string; password_hash: string; public_id?: string } | undefined;
  if (!row || !checkPassword(password, row.password_hash)) {
    return { ok: false as const, error: "Email ou mot de passe incorrect." };
  }
  const publicId = await ensurePublicId(row.id, row.public_id);
  await setMemberCookie({ id: row.id, email: row.email, name: row.name, publicId });
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

export async function requestPasswordReset(email: string) {
  const limited = await rateLimit("password-reset", 5, 60 * 60);
  if (!limited.ok) {
    return { ok: false as const, error: "Trop de tentatives. Réessaie dans quelques minutes." };
  }
  await ensureSchema();
  const clean = email.trim().toLowerCase();
  const rows = await sql()`select id from users where email = ${clean} limit 1`;
  const row = rows[0] as { id: string } | undefined;
  if (!row) return { ok: true as const, sent: false as const, link: undefined };

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await sql()`
    insert into password_resets (id, user_id, token_hash, expires_at)
    values (${randomUUID()}, ${row.id}, ${tokenHash}, now() + interval '1 hour')
  `;
  const base = SITE_URL;
  const link = `${base}/reset-password?token=${token}`;
  const mail = await sendMail(clean, "Réinitialise ton mot de passe XWIN", `Lien valable 1 heure : ${link}`);
  return { ok: true as const, sent: mail.sent, link: mail.sent ? undefined : link };
}

export async function resetPassword(token: string, password: string) {
  if (!token) return { ok: false as const, error: "Lien invalide ou expiré." };
  if (!password || password.length < 8) {
    return { ok: false as const, error: "Mot de passe trop court (8 caractères minimum)." };
  }
  await ensureSchema();
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const rows = await sql()`
    select id, user_id from password_resets
    where token_hash = ${tokenHash} and used = false and expires_at > now()
    limit 1
  `;
  const row = rows[0] as { id: string; user_id: string } | undefined;
  if (!row) return { ok: false as const, error: "Lien invalide ou expiré." };
  await sql()`update users set password_hash = ${hashPassword(password)} where id = ${row.user_id}`;
  await sql()`update password_resets set used = true where id = ${row.id}`;
  return { ok: true as const };
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
    let publicId = String(data.publicId || "");
    if (!publicId && hasDatabase()) {
      await ensureSchema();
      publicId = await ensurePublicId(data.id);
    }
    return { id: data.id, email: data.email, name: data.name, publicId };
  } catch {
    return null;
  }
}
