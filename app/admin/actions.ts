"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { isAdmin, loginAdmin, logoutAdmin } from "@/lib/admin-auth";
import { createMontante, createProno, settleProno, updateMontante, updateProno } from "@/lib/store";
import { createAnalysis } from "@/lib/editorial";
import { ensureSchema } from "@/lib/schema";
import { sql } from "@/lib/db";
import type { PronoResult } from "@/lib/types";
import { adminHref } from "@/lib/admin-path";

export async function loginAction(form: FormData) {
  const ok = await loginAdmin(String(form.get("password") ?? ""));
  if (!ok) redirect(`${adminHref()}?err=1`);
  redirect(adminHref());
}
export async function logoutAction() {
  await logoutAdmin();
  redirect(adminHref());
}
async function log(action: string, resource: string) {
  await ensureSchema();
  await sql()`insert into audit_logs (id, actor, action, resource) values (${randomUUID()}, ${"admin"}, ${action}, ${resource})`;
}
function pronoFromForm(form: FormData) {
  return {
    sport: String(form.get("sport") ?? ""),
    competition: String(form.get("competition") ?? "").trim(),
    eventName: String(form.get("eventName") ?? "").trim(),
    kickoff: String(form.get("kickoff") ?? "").trim(),
    pick: String(form.get("pick") ?? "").trim(),
    rationale: String(form.get("rationale") ?? "").trim(),
    isPaid: form.get("isPaid") === "on",
    odd: String(form.get("odd") ?? "").trim(),
    confidence: String(form.get("confidence") ?? "").trim(),
    stakeUnits: String(form.get("stakeUnits") ?? "1").trim() || "1",
  };
}
export async function createPronoAction(form: FormData) {
  if (!(await isAdmin())) redirect(adminHref());
  await ensureSchema();
  const created = await createProno({ ...pronoFromForm(form), status: "published" });
  await log("publish_prono", created.id);
  revalidatePath("/");
  revalidatePath("/pronostics");
  redirect(adminHref("predictions"));
}
export async function updatePronoAction(form: FormData) {
  if (!(await isAdmin())) redirect(adminHref());
  const id = String(form.get("id") ?? "");
  if (!id) redirect(adminHref("predictions"));
  await updateProno(id, pronoFromForm(form));
  await log("update_prono", id);
  revalidatePath("/");
  revalidatePath("/pronostics");
  redirect(adminHref("predictions"));
}
export async function settleAction(form: FormData) {
  if (!(await isAdmin())) redirect(adminHref());
  const id = String(form.get("id") ?? "");
  const result = String(form.get("result") ?? "") as PronoResult;
  if (!id || !["hit", "miss", "void"].includes(result)) redirect(adminHref("results"));
  await settleProno(id, result);
  await log("settle_prono", `${id}:${result}`);
  revalidatePath("/resultats");
  redirect(adminHref("results"));
}
export async function createAnalysisAction(form: FormData) {
  if (!(await isAdmin())) redirect(adminHref());
  await createAnalysis({
    title: String(form.get("title") ?? "").trim(),
    sport: String(form.get("sport") ?? "").trim(),
    body: String(form.get("body") ?? "").trim(),
    status: "published",
  });
  revalidatePath("/analyses");
  redirect(adminHref("analyses"));
}
export async function createMontanteAction(form: FormData) {
  if (!(await isAdmin())) redirect(adminHref());
  await createMontante({
    title: String(form.get("title") ?? "").trim(),
    cadence: form.get("cadence") === "monthly" ? "monthly" : "weekly",
    steps: Number(form.get("steps") ?? 0),
    entryAmount: String(form.get("entryAmount") ?? "").trim(),
    currency: String(form.get("currency") ?? "XOF").trim() || "XOF",
    description: String(form.get("description") ?? "").trim(),
    status: "open",
  });
  revalidatePath("/montantes");
  redirect(adminHref("offers"));
}
export async function updateMontanteAction(form: FormData) {
  if (!(await isAdmin())) redirect(adminHref());
  const id = String(form.get("id") ?? "");
  if (!id) redirect(adminHref("offers"));
  await updateMontante(id, {
    title: String(form.get("title") ?? "").trim(),
    cadence: form.get("cadence") === "monthly" ? "monthly" : "weekly",
    steps: Number(form.get("steps") ?? 0),
    entryAmount: String(form.get("entryAmount") ?? "").trim(),
    currency: String(form.get("currency") ?? "XOF").trim() || "XOF",
    description: String(form.get("description") ?? "").trim(),
    status: form.get("status") === "closed" ? "closed" : "open",
  });
  revalidatePath("/montantes");
  redirect(adminHref("offers"));
}
