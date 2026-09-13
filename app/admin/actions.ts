"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin, loginAdmin, logoutAdmin } from "@/lib/admin-auth";
import { createMontante, createProno } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";

export async function loginAction(form: FormData) {
  const password = String(form.get("password") ?? "");
  const ok = await loginAdmin(password);
  if (!ok) redirect("/admin?err=1");
  redirect("/admin");
}

export async function logoutAction() {
  await logoutAdmin();
  redirect("/admin");
}

export async function createPronoAction(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  await ensureSchema();
  await createProno({
    sport: String(form.get("sport") ?? ""),
    competition: String(form.get("competition") ?? "").trim(),
    eventName: String(form.get("eventName") ?? "").trim(),
    kickoff: String(form.get("kickoff") ?? "").trim(),
    pick: String(form.get("pick") ?? "").trim(),
    rationale: String(form.get("rationale") ?? "").trim(),
    status: "published",
    isPaid: form.get("isPaid") === "on",
  });
  revalidatePath("/");
  revalidatePath("/pronos");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function createMontanteAction(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  await createMontante({
    title: String(form.get("title") ?? "").trim(),
    cadence: form.get("cadence") === "monthly" ? "monthly" : "weekly",
    steps: Number(form.get("steps") ?? 0),
    entryAmount: String(form.get("entryAmount") ?? "").trim(),
    currency: String(form.get("currency") ?? "EUR").trim() || "EUR",
    description: String(form.get("description") ?? "").trim(),
    status: "open",
  });
  revalidatePath("/");
  revalidatePath("/montantes");
  revalidatePath("/admin");
  redirect("/admin");
}
