"use server";
import { redirect } from "next/navigation";
import { registerMember } from "@/lib/members";

export async function registerAction(form: FormData) {
  const first = String(form.get("firstName") ?? "").trim();
  const last = String(form.get("lastName") ?? "").trim();
  const name = `${first} ${last}`.trim() || String(form.get("name") ?? "").trim();
  if (String(form.get("password")) !== String(form.get("confirm"))) {
    redirect(`/connexion?tab=inscription&err=${encodeURIComponent("Les mots de passe ne correspondent pas.")}`);
  }
  const res = await registerMember(name, String(form.get("email") ?? ""), String(form.get("password") ?? ""));
  if (!res.ok) redirect(`/connexion?tab=inscription&err=${encodeURIComponent(res.error)}`);
  redirect("/accueil");
}
