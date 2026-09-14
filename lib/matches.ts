import type { Prono } from "./types";

export type MatchGroup = {
  key: string;
  slug: string;
  sport: string;
  competition: string;
  eventName: string;
  kickoff: string;
  tickets: Prono[];
  hits: number;
  miss: number;
  voids: number;
  pending: number;
};

export function matchKey(p: Prono) {
  const day = (p.kickoff || p.createdAt || "").slice(0, 10);
  return `${p.sport}|${p.eventName.trim().toLowerCase()}|${day}`;
}

export function matchSlug(p: Prono) {
  return Buffer.from(matchKey(p)).toString("base64url");
}

export function groupMatches(rows: Prono[]): MatchGroup[] {
  const map = new Map<string, MatchGroup>();
  for (const p of rows) {
    const key = matchKey(p);
    const cur = map.get(key);
    if (cur) {
      cur.tickets.push(p);
      if (p.result === "hit") cur.hits += 1;
      else if (p.result === "miss") cur.miss += 1;
      else if (p.result === "void") cur.voids += 1;
      else cur.pending += 1;
    } else {
      map.set(key, {
        key,
        slug: matchSlug(p),
        sport: p.sport,
        competition: p.competition,
        eventName: p.eventName,
        kickoff: p.kickoff || p.createdAt,
        tickets: [p],
        hits: p.result === "hit" ? 1 : 0,
        miss: p.result === "miss" ? 1 : 0,
        voids: p.result === "void" ? 1 : 0,
        pending: p.result === "pending" ? 1 : 0,
      });
    }
  }
  return [...map.values()].sort((a, b) => (b.kickoff || "").localeCompare(a.kickoff || ""));
}

export function scoreLabel(m: MatchGroup) {
  const decided = m.hits + m.miss;
  if (m.pending > 0) return `${m.tickets.length} ticket${m.tickets.length > 1 ? "s" : ""}`;
  if (decided === 0) return `${m.tickets.length} ticket${m.tickets.length > 1 ? "s" : ""}`;
  return `${m.hits}/${decided} gagnants`;
}
