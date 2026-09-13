"use server";
import { redirect } from "next/navigation";
import { saveContact } from "@/lib/editorial";

export async function contactAction(form: FormData) {
  await saveContact({
    name: String(form.get("name") ?? "").trim(),
    email: String(form.get("email") ?? "").trim(),
    subject: String(form.get("subject") ?? "").trim(),
    body: String(form.get("body") ?? "").trim(),
  });
  redirect("/contact?ok=1");
}
