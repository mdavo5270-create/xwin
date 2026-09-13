"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin, loginAdmin, logoutAdmin } from "@/lib/admin-auth";
import { createMontante, createProno } from "@/lib/store";

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
  createProno({
    sport: String(form.get("sport") ?? ""),
    competition: String(form.get("competition") ?? "").trim(),
    eventName: String(form.get("eventName") ?? "").trim(),
    kickoff: String(form.get("kickoff") ?? "").trim(),
    pick: String(form.get("pick") ?? "").trim(),
    rationale: String(form.get("rationale") ?? "").trim(),
    status: "published",
  });
  revalidatePath("/");
  revalidatePath("/pronos");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function createMontanteAction(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  createMontante({
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
