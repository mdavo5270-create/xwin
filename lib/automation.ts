import { randomUUID } from "crypto";
import { hasDatabase, sql } from "./db";
import { ensureSchema } from "./schema";
import { listActionablePronos, settleProno } from "./store";
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

function decide(pick: string, score: { home: number; away: number }): "hit" | "miss" | null {
  const p = pick.toLowerCase();
  const total = score.home + score.away;
  const over = p.match(/(over|plus)\s*([0-9]+(?:[.,][0-9]+)?)/);
  const under = p.match(/(under|moins)\s*([0-9]+(?:[.,][0-9]+)?)/);
  if (over) return total > Number(over[2].replace(",", ".")) ? "hit" : "miss";
  if (under) return total < Number(under[2].replace(",", ".")) ? "hit" : "miss";
  if (p.includes("btts") && (p.includes("oui") || p.includes("yes"))) return score.home > 0 && score.away > 0 ? "hit" : "miss";
  if (p.includes("btts") && (p.includes("non") || p.includes("no"))) return score.home === 0 || score.away === 0 ? "hit" : "miss";
  const ah = p.match(/ah\s*([+-]?[0-9]+(?:[.,][0-9]+)?)\s*(1|2|home|away)?/);
  if (ah) {
    const line = Number(ah[1].replace(",", "."));
    const side = ah[2] || "1";
    const adj = side === "2" || side === "away" ? score.away + line - score.home : score.home + line - score.away;
    if (adj === 0) return null;
    return adj > 0 ? "hit" : "miss";
  }
  if (/\b(nul|draw|x)\b/.test(p) || p.includes("match nul")) return score.home === score.away ? "hit" : "miss";
  if (/\b(2|away|ext[eé]rieur)\b/.test(p)) return score.away > score.home ? "hit" : "miss";
  if (/\b(1|home|domicile)\b/.test(p) || p === "1") return score.home > score.away ? "hit" : "miss";
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
  if (!ev || ev.intHomeScore == null || ev.intAwayScore == null) return null;
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
  const all = await listActionablePronos();

  for (const p of all) {
    const kick = parseKickoff(p.kickoff);
    if (p.status === "draft") {
      if (kick && kick.getTime() - now.getTime() <= 6 * 60 * 60 * 1000 && kick.getTime() > now.getTime() - 30 * 60 * 1000) {
        if (hasDatabase()) await sql()`update pronos set status = 'published' where id = ${p.id}`;
        else p.status = "published";
        report.published.push(p.id);
        await audit("auto-publish", p.id);
      } else report.skipped.push({ id: p.id, reason: "draft hors fenêtre T-6h" });
      continue;
    }
    if (p.status === "published" && p.result === "pending" && kick && kick.getTime() <= now.getTime()) {
      report.live.push(p.id);
      if (now.getTime() - kick.getTime() < 2 * 60 * 60 * 1000) {
        report.skipped.push({ id: p.id, reason: "match encore trop tôt pour solder" });
        continue;
      }
      try {
        const score = await lookupFinishedScore(p.eventName);
        if (!score) {
          report.skipped.push({ id: p.id, reason: "score introuvable" });
          continue;
        }
        const result = decide(p.pick, score);
        if (!result) {
          report.skipped.push({ id: p.id, reason: "marché non décidable auto" });
          continue;
        }
        await settleProno(p.id, result);
        report.settled.push({ id: p.id, result });
        await audit(`auto-settle:${result}`, p.id);
      } catch {
        report.skipped.push({ id: p.id, reason: "erreur API" });
      }
    }
  }
  return report;
}

export function isDue(p: Prono, now = new Date()) {
  const kick = parseKickoff(p.kickoff);
  return Boolean(kick && kick.getTime() <= now.getTime() + 6 * 60 * 60 * 1000);
}
