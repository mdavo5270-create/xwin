"use server";

import { redirect } from "next/navigation";
import { getMember } from "@/lib/members";
import { redeemLicense } from "@/lib/licenses";

export async function activateLicenseAction(formData: FormData) {
  const member = await getMember();
  if (!member) redirect("/connexion?next=/abonnement");
  const code = String(formData.get("code") || "");
  const res = await redeemLicense(member.id, member.publicId || "", code);
  if (!res.ok) redirect(`/abonnement?err=${encodeURIComponent(res.error)}`);
  redirect("/abonnement?ok=1");
}
