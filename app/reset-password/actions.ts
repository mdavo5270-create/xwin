"use server";

import { redirect } from "next/navigation";
import { resetPassword } from "@/lib/members";

export async function resetAction(form: FormData) {
  const token = String(form.get("token") ?? "");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (password !== confirm) {
    redirect(`/reset-password?token=${encodeURIComponent(token)}&err=${encodeURIComponent("Les mots de passe ne correspondent pas.")}`);
  }
  const res = await resetPassword(token, password);
  if (!res.ok) {
    redirect(`/reset-password?token=${encodeURIComponent(token)}&err=${encodeURIComponent(res.error)}`);
  }
  redirect("/reset-password?done=1");
}
