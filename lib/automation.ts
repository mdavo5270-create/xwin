import { randomUUID } from "crypto";
import { hasDatabase, sql } from "./db";
import { ensureSchema } from "./schema";
import { listAllPronos, settleProno } from "./store";
import type { Prono } from "./types";

export type AutoReport = {
  at: string;
  published: string[];
  live: string[];
  settled: { id: string; result: string }[];
  skipped: { id: string; reason: string }[];
};

function parseKickoff(value: string): Date | null {
  if (!value?.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function pickImplies(pick: string): "home" | "away" | "draw" | null {
  const p = pick.toLowerCase();
  if (/\b(nul|draw|x)\b/.test(p) || p.includes("match nul")) return "draw";
  if (/\b(2|away|ext[eé]rieur|visiteur)\b/.test(p)) return "away";
  if (/\b(1|home|domicile)\b/.test(p)) return "home";
  return null;
}

async function lookupFinishedScore(eventName: string): Promise<{ home: number; away: number } | null> {
  const cleaned = eventName.replace(/\s+vs\.?\s+/i, " vs ").trim();
  if (!cleaned) return null;
  const url = `https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=${encodeURIComponent(cleaned)}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    event?: Array<{ strStatus?: string; intHomeScore?: string; intAwayScore?: string }>;
  };
  const ev = data.event?.[0];
  if (!ev) return null;
  const status = (ev.strStatus || "").toLowerCase();
  if (status && !/match finished|ft|full.?time|finished/.test(status) && ev.intHomeScore == null) {
    return null;
  }
  if (ev.intHomeScore == null || ev.intAwayScore == null) return null;
  return { home: Number(ev.intHomeScore), away: Number(ev.intAwayScore) };
}

async function audit(action: string, resource: string) {
  if (!hasDatabase()) return;
  await sql()`insert into audit_logs (id, actor, action, resource) values (${randomUUID()}, ${"cron"}, ${action}, ${resource})`;
}

export async function runPronoAutomation(): Promise<AutoReport> {
  await ensureSchema();
  const now = new Date();
  const report: AutoReport = { at: now.toISOString(), published: [], live: [], settled: [], skipped: [] };
  const all = await listAllPronos();

  for (const p of all) {
    const kick = parseKickoff(p.kickoff);

    if (p.status === "draft") {
      if (kick && kick.getTime() - now.getTime() <= 6 * 60 * 60 * 1000 && kick.getTime() > now.getTime() - 30 * 60 * 1000) {
        if (hasDatabase()) {
          await sql()`update pronos set status = 'published' where id = ${p.id}`;
        } else {
          p.status = "published";
        }
        report.published.push(p.id);
        await audit("auto-publish", p.id);
      } else {
        report.skipped.push({ id: p.id, reason: "draft hors fenêtre T-6h" });
      }
      continue;
    }

    if (p.status === "published" && p.result === "pending" && kick && kick.getTime() <= now.getTime()) {
      report.live.push(p.id);
      const elapsed = now.getTime() - kick.getTime();
      if (elapsed < 2 * 60 * 60 * 1000) {
        report.skipped.push({ id: p.id, reason: "match en cours / trop tôt pour solder" });
        continue;
      }
      const implied = pickImplies(p.pick);
      if (!implied) {
        report.skipped.push({ id: p.id, reason: "pick non 1/N/2 — solder manuel" });
        continue;
      }
      try {
        const score = await lookupFinishedScore(p.eventName);
        if (!score) {
          report.skipped.push({ id: p.id, reason: "résultat introuvable (TheSportsDB)" });
          continue;
        }
        const outcome = score.home === score.away ? "draw" : score.home > score.away ? "home" : "away";
        const result = outcome === implied ? "hit" : "miss";
        await settleProno(p.id, result);
        report.settled.push({ id: p.id, result });
        await audit(`auto-settle:${result}`, p.id);
      } catch {
        report.skipped.push({ id: p.id, reason: "erreur API résultats" });
      }
    }
  }

  return report;
}

export function isDue(p: Prono, now = new Date()) {
  const kick = parseKickoff(p.kickoff);
  return Boolean(kick && kick.getTime() <= now.getTime() + 6 * 60 * 60 * 1000);
}
