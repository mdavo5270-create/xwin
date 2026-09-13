"use server";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/members";
import { ensureSchema } from "@/lib/schema";
import { sql } from "@/lib/db";
import { randomBytes, scryptSync } from "crypto";

export async function changePasswordAction(form: FormData) {
  const member = await getMember();
  if (!member) redirect("/connexion");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (password.length < 8 || password !== confirm) {
    redirect(`/app/securite?err=${encodeURIComponent("Mots de passe invalides.")}`);
  }
  await ensureSchema();
  const salt = randomBytes(16).toString("hex");
  const hash = `${salt}:${scryptSync(password, salt, 32).toString("hex")}`;
  await sql()`update users set password_hash = ${hash} where id = ${member.id}`;
  redirect("/app/securite?ok=1");
}
