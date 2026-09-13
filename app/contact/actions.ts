"use server";
import { redirect } from "next/navigation";
import { saveContact } from "@/lib/editorial";
import { rateLimit } from "@/lib/rate-limit";

export async function contactAction(form: FormData) {
  const limited = await rateLimit("contact", 5, 60 * 60);
  if (!limited.ok) {
    redirect(`/contact?err=${encodeURIComponent("Trop de messages envoyés. Réessaie plus tard.")}`);
  }
  await saveContact({
    name: String(form.get("name") ?? "").trim(),
    email: String(form.get("email") ?? "").trim(),
    subject: String(form.get("subject") ?? "").trim(),
    body: String(form.get("body") ?? "").trim(),
  });
  redirect("/contact?ok=1");
}
