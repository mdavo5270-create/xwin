import { cookies } from "next/headers";
import { createHmac } from "crypto";

const COOKIE = "xwin_admin";

function secret() {
  return process.env.ADMIN_SECRET ?? "";
}

export function isAdminConfigured() {
  return secret().length >= 8;
}

function token() {
  return createHmac("sha256", secret()).update("ok").digest("hex");
}

export async function isAdmin() {
  if (!isAdminConfigured()) return false;
  const jar = await cookies();
  return jar.get(COOKIE)?.value === token();
}

export async function loginAdmin(password: string) {
  if (!isAdminConfigured()) return false;
  if (password !== secret()) return false;
  const jar = await cookies();
  jar.set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return true;
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
