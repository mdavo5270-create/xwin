"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { isAdmin, loginAdmin, logoutAdmin } from "@/lib/admin-auth";
import { createProno, settleProno, updateProno } from "@/lib/store";
import { createOffer, updateOffer } from "@/lib/offers";
import { createAnalysis } from "@/lib/editorial";
import { ensureSchema } from "@/lib/schema";
import { sql } from "@/lib/db";
import type { PronoResult } from "@/lib/types";
import { adminHref } from "@/lib/admin-path";
import { logAdminSession, setSetting } from "@/lib/commerce";
import type { OfferType } from "@/lib/offers";
import { runPronoAutomation } from "@/lib/automation";

export async function loginAction(form: FormData) {
  const ok = await loginAdmin(String(form.get("password") ?? ""));
  await logAdminSession(ok, ok ? "login" : "login_failed");
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
function buildPick(form: FormData) {
  const market = String(form.get("market") ?? "").trim();
  const sel = String(form.get("selection") ?? "").trim();
  if (market && sel) return `${market} · ${sel}`;
  return sel || market;
}
function pronoFromForm(form: FormData) {
  const home = String(form.get("home") ?? "").trim();
  const away = String(form.get("away") ?? "").trim();
  const eventName = home && away ? `${home} vs ${away}` : String(form.get("eventName") ?? "").trim();
  const date = String(form.get("kickoffDate") ?? "").trim();
  const time = String(form.get("kickoffTime") ?? "").trim();
  const kickoff = date && time ? `${date}T${time}:00` : String(form.get("kickoff") ?? "").trim();
  const chance = String(form.get("chance") ?? "").trim();
  return {
    sport: String(form.get("sport") ?? ""),
    competition: String(form.get("competition") ?? "").trim(),
    eventName,
    kickoff,
    pick: buildPick(form),
    rationale: String(form.get("rationale") ?? "").trim(),
    isPaid: form.get("isPaid") === "on",
    odd: chance ? `${chance}%` : "",
    confidence: String(form.get("confidence") ?? "3").trim(),
    stakeUnits: String(form.get("stakeUnits") ?? "1").trim() || "1",
  };
}
function offerFromForm(form: FormData) {
  const type = String(form.get("type") ?? "abonnement") as OfferType;
  return {
    type: (["montante", "abonnement", "service"] as const).includes(type) ? type : "abonnement",
    title: String(form.get("title") ?? "").trim(),
    description: String(form.get("description") ?? "").trim(),
    price: String(form.get("price") ?? "").trim(),
    currency: String(form.get("currency") ?? "XOF").trim() || "XOF",
    period: String(form.get("period") ?? "").trim(),
    cadence: String(form.get("cadence") ?? "").trim(),
    steps: Number(form.get("steps") ?? 0) || 0,
    active: form.get("active") === "on",
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
export async function runAutoSettleAction() {
  if (!(await isAdmin())) redirect(adminHref());
  await runPronoAutomation();
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
export async function createOfferAction(form: FormData) {
  if (!(await isAdmin())) redirect(adminHref());
  await ensureSchema();
  const created = await createOffer(offerFromForm(form));
  await log("create_offer", created.id);
  revalidatePath("/premium");
  revalidatePath("/service");
  revalidatePath("/montantes");
  redirect(adminHref("offers"));
}
export async function updateOfferAction(form: FormData) {
  if (!(await isAdmin())) redirect(adminHref());
  const id = String(form.get("id") ?? "");
  if (!id) redirect(adminHref("offers"));
  await updateOffer(id, offerFromForm(form));
  await log("update_offer", id);
  revalidatePath("/premium");
  revalidatePath("/service");
  revalidatePath("/montantes");
  redirect(adminHref("offers"));
}
export async function saveSettingsAction(form: FormData) {
  if (!(await isAdmin())) redirect(adminHref());
  await setSetting("site_name", String(form.get("site_name") ?? "XWIN"));
  await setSetting("currency", String(form.get("currency") ?? "XOF"));
  await setSetting("maintenance", String(form.get("maintenance") ?? "off"));
  await log("save_settings", "site_settings");
  redirect(adminHref("settings"));
}
