"use server";

import { redirect } from "next/navigation";
import { registerMember } from "@/lib/members";

export async function registerAction(form: FormData) {
  const res = await registerMember(
    String(form.get("name") ?? ""),
    String(form.get("email") ?? ""),
    String(form.get("password") ?? ""),
  );
  if (!res.ok) redirect(`/register?err=${encodeURIComponent(res.error)}`);
  redirect("/");
}
