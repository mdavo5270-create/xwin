import { NextResponse } from "next/server";
import { createAnalysis } from "@/lib/editorial";
import { getPerformanceSummary, listRecentSettledPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET || process.env.ADMIN_SECRET || "";
  if (!secret) return false;
  const header = req.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const url = new URL(req.url);
  const q = url.searchParams.get("secret") || "";
  return bearer === secret || q === secret;
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await ensureSchema();
  const [s, recent] = await Promise.all([getPerformanceSummary(), listRecentSettledPronos(12)]);
  const lines = recent.map((p) => `- ${p.eventName} · ${p.pick} · ${p.result} · cote ${p.odd || "—"}`).join("\n");
  const body = `Bilan auto du jour.\n\nPubliés ${s.published} · Soldés ${s.settled} · Hit ${s.hits} · Miss ${s.miss} · Taux ${s.rate ?? "—"}%.\n\nDerniers tickets :\n${lines || "aucun ticket soldé"}`;
  await createAnalysis({
    title: `Bilan ${new Date().toISOString().slice(0, 10)}`,
    sport: "",
    body,
    status: "published",
  });
  return NextResponse.json({ ok: true, settled: s.settled });
}

export async function POST(req: Request) {
  return GET(req);
}
