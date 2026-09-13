"use server";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/members";
import { ensureSchema } from "@/lib/schema";
import { sql } from "@/lib/db";

export async function updateProfileAction(form: FormData) {
  const member = await getMember();
  if (!member) redirect("/connexion");
  const name = String(form.get("name") ?? "").trim();
  if (!name) redirect("/app/profil");
  await ensureSchema();
  await sql()`update users set name = ${name} where id = ${member.id}`;
  redirect("/app/profil?ok=1");
}
