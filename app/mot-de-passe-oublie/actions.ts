"use server";

import { redirect } from "next/navigation";
import { requestPasswordReset } from "@/lib/members";

export async function requestResetAction(form: FormData) {
  const email = String(form.get("email") ?? "").trim();
  if (!email) redirect(`/mot-de-passe-oublie?err=${encodeURIComponent("Email requis.")}`);
  const res = await requestPasswordReset(email);
  if (!res.ok) redirect(`/mot-de-passe-oublie?err=${encodeURIComponent(res.error)}`);
  const q = res.sent ? "sent=1" : `sent=1&link=${encodeURIComponent(res.link ?? "")}`;
  redirect(`/mot-de-passe-oublie?${q}`);
}
