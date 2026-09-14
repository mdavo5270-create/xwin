import { createProno, listPublishedPronos } from "./store";
import { matchKey } from "./matches";
import type { Prono } from "./types";

const LEAGUES: { id: string; sport: string; competition: string }[] = [
  { id: "4328", sport: "football", competition: "Premier League" },
  { id: "4335", sport: "football", competition: "Ligue 1" },
  { id: "4334", sport: "football", competition: "La Liga" },
  { id: "4332", sport: "football", competition: "Serie A" },
  { id: "4331", sport: "football", competition: "Bundesliga" },
  { id: "4480", sport: "football", competition: "Ligue des champions" },
];

type NextEvent = {
  strHomeTeam?: string;
  strAwayTeam?: string;
  strLeague?: string;
  dateEvent?: string;
  strTime?: string;
};

export type FeedReport = { created: number; skipped: number; leagues: string[] };

async function nextEvents(leagueId: string): Promise<NextEvent[]> {
  const url = `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${leagueId}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return [];
  const data = (await res.json()) as { events?: NextEvent[] };
  return data.events ?? [];
}

function alreadyHave(existing: Prono[], eventName: string, kickoff: string, sport: string) {
  const fake = { eventName, kickoff, sport, createdAt: kickoff } as Prono;
  const key = matchKey(fake);
  return existing.some((p) => matchKey(p) === key);
}

export async function ingestUpcomingFixtures(limit = 10): Promise<FeedReport> {
  const existing = await listPublishedPronos();
  const report: FeedReport = { created: 0, skipped: 0, leagues: [] };
  const seen = new Set<string>();

  for (const league of LEAGUES) {
    if (report.created >= limit * 2) break;
    let events: NextEvent[] = [];
    try {
      events = await nextEvents(league.id);
    } catch {
      continue;
    }
    report.leagues.push(league.competition);
    for (const ev of events.slice(0, 4)) {
      const home = (ev.strHomeTeam || "").trim();
      const away = (ev.strAwayTeam || "").trim();
      if (!home || !away) continue;
      const eventName = `${home} vs ${away}`;
      const day = ev.dateEvent || "";
      const time = (ev.strTime || "15:00:00").slice(0, 8);
      const kickoff = day ? `${day}T${time}` : "";
      const stamp = `${league.sport}|${eventName.toLowerCase()}|${day}`;
      if (seen.has(stamp) || alreadyHave(existing, eventName, kickoff, league.sport)) {
        report.skipped += 1;
        continue;
      }
      seen.add(stamp);
      const base = {
        sport: league.sport,
        competition: ev.strLeague || league.competition,
        eventName,
        kickoff,
        status: "published" as const,
        isPaid: false,
        odd: "",
        confidence: "3",
        stakeUnits: "1",
      };
      await createProno({
        ...base,
        pick: "1X2 · 1",
        rationale: `Ticket généré automatiquement (${league.competition}). Avantage domicile comme base. Tu peux le modifier dans l’admin.`,
      });
      await createProno({
        ...base,
        pick: "Plus de 2.5 · Over 2.5",
        rationale: `Ticket généré automatiquement (${league.competition}). Total 2.5 comme second marché du même match.`,
      });
      report.created += 2;
      existing.push({ ...base, id: stamp, pick: "1X2 · 1", rationale: "", result: "pending", followCount: 0, createdAt: kickoff } as Prono);
      if (report.created >= limit * 2) break;
    }
  }
  return report;
}
