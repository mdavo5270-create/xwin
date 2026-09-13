"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { isAdmin, loginAdmin, logoutAdmin } from "@/lib/admin-auth";
import { createMontante, createProno, settleProno } from "@/lib/store";
import { createAnalysis } from "@/lib/editorial";
import { ensureSchema } from "@/lib/schema";
import { sql } from "@/lib/db";
import type { PronoResult } from "@/lib/types";

export async function loginAction(form: FormData) {
  const ok = await loginAdmin(String(form.get("password") ?? ""));
  if (!ok) redirect("/admin?err=1");
  redirect("/admin");
}

export async function logoutAction() {
  await logoutAdmin();
  redirect("/admin");
}

async function log(action: string, resource: string) {
  await ensureSchema();
  await sql()`insert into audit_logs (id, actor, action, resource) values (${randomUUID()}, ${"admin"}, ${action}, ${resource})`;
}

export async function createPronoAction(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  await ensureSchema();
  const created = await createProno({
    sport: String(form.get("sport") ?? ""),
    competition: String(form.get("competition") ?? "").trim(),
    eventName: String(form.get("eventName") ?? "").trim(),
    kickoff: String(form.get("kickoff") ?? "").trim(),
    pick: String(form.get("pick") ?? "").trim(),
    rationale: String(form.get("rationale") ?? "").trim(),
    status: "published",
    isPaid: form.get("isPaid") === "on",
    odd: String(form.get("odd") ?? "").trim(),
    confidence: String(form.get("confidence") ?? "").trim(),
    stakeUnits: String(form.get("stakeUnits") ?? "1").trim() || "1",
  });
  await log("publish_prono", created.id);
  revalidatePath("/");
  revalidatePath("/pronostics");
  revalidatePath("/resultats");
  revalidatePath("/admin/predictions");
  redirect("/admin/predictions");
}

export async function settleAction(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const id = String(form.get("id") ?? "");
  const result = String(form.get("result") ?? "") as PronoResult;
  if (!id || !["hit", "miss", "void"].includes(result)) redirect("/admin/results");
  await settleProno(id, result);
  await log("settle_prono", `${id}:${result}`);
  revalidatePath("/resultats");
  revalidatePath("/admin/results");
  redirect("/admin/results");
}

export async function createAnalysisAction(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  await createAnalysis({
    title: String(form.get("title") ?? "").trim(),
    sport: String(form.get("sport") ?? "").trim(),
    body: String(form.get("body") ?? "").trim(),
    status: "published",
  });
  revalidatePath("/analyses");
  redirect("/admin/analyses");
}

export async function createMontanteAction(form: FormData) {
  if (!(await isAdmin())) redirect("/admin");
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
  redirect("/admin");
}
