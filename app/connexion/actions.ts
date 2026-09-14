"use server";

import { redirect } from "next/navigation";
import { loginMember } from "@/lib/members";

export async function loginAction(form: FormData) {
  const next = String(form.get("next") ?? "/accueil") || "/accueil";
  const res = await loginMember(String(form.get("email") ?? ""), String(form.get("password") ?? ""));
  if (!res.ok) redirect(`/connexion?err=${encodeURIComponent(res.error)}`);
  redirect(next.startsWith("/") ? next : "/accueil");
}
