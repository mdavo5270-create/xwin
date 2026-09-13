"use server";
import { redirect } from "next/navigation";
import { registerMember } from "@/lib/members";

export async function registerAction(form: FormData) {
  if (form.get("terms") !== "on") redirect(`/inscription?err=${encodeURIComponent("Accepte les conditions.")}`);
  if (String(form.get("password")) !== String(form.get("confirm"))) {
    redirect(`/inscription?err=${encodeURIComponent("Les mots de passe ne correspondent pas.")}`);
  }
  const res = await registerMember(String(form.get("name") ?? ""), String(form.get("email") ?? ""), String(form.get("password") ?? ""));
  if (!res.ok) redirect(`/inscription?err=${encodeURIComponent(res.error)}`);
  redirect("/app");
}
