import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { safeCompare, safeCompareEqualLength } from "./safe-compare";
import { rateLimit } from "./rate-limit";

const COOKIE = "xwin_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12h

function secret() {
  return process.env.ADMIN_SECRET ?? "";
}

export function isAdminConfigured() {
  return secret().length >= 8;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export async function isAdmin() {
  if (!isAdminConfigured()) return false;
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return false;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig || !safeCompareEqualLength(sign(payload), sig)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof data?.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function loginAdmin(password: string) {
  if (!isAdminConfigured()) return false;
  // 5 tentatives / 5 min / IP : suffisant pour un vrai admin qui se trompe,
  // beaucoup trop lent pour du brute force. On échoue "silencieusement"
  // (même résultat qu'un mauvais mot de passe) pour ne pas donner
  // d'information distincte à un attaquant.
  const limited = await rateLimit("admin-login", 5, 5 * 60);
  if (!limited.ok) return false;
  if (!safeCompare(password, secret())) return false;
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + MAX_AGE_SECONDS * 1000 })
  ).toString("base64url");
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return true;
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
