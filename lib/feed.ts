import { createProno, listPublishedPronos, listRecentSettledPronos } from "./store";
import { getSettings, setSetting } from "./commerce";
import { matchKey } from "./matches";
import type { Prono } from "./types";

const MIN_PER_SPORT = 10;
const HARD_SPORTS = new Set([
  "rugby", "hockey", "formula-1", "mma", "volleyball", "handball",
  "esport-lol", "esport-cs", "esport-valorant", "esport-dota",
]);

const LEAGUES: { id: string; sport: string; competition: string }[] = [
  { id: "4328", sport: "football", competition: "Premier League" },
  { id: "4335", sport: "football", competition: "Ligue 1" },
  { id: "4334", sport: "football", competition: "La Liga" },
  { id: "4332", sport: "football", competition: "Serie A" },
  { id: "4331", sport: "football", competition: "Bundesliga" },
  { id: "4480", sport: "football", competition: "Ligue des champions" },
  { id: "4346", sport: "football", competition: "Ligue 2" },
  { id: "4337", sport: "football", competition: "Eredivisie" },
  { id: "4358", sport: "football", competition: "Primeira Liga" },
  { id: "4387", sport: "basketball", competition: "NBA" },
  { id: "4546", sport: "basketball", competition: "EuroLeague" },
];

type NextEvent = {
  strHomeTeam?: string;
  strAwayTeam?: string;
  strLeague?: string;
  dateEvent?: string;
  strTime?: string;
};

export type FeedReport = {
  created: number;
  skipped: number;
  leagues: string[];
  perSport: Record<string, number>;
};

async function nextEvents(leagueId: string): Promise<NextEvent[]> {
  const url = `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${leagueId}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return [];
  const data = (await res.json()) as { events?: NextEvent[] };
  return data.events ?? [];
}

function todayParis() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function weekdayParis() {
  return new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Paris", weekday: "short" }).format(new Date());
}

function countTodayBySport(rows: Prono[]) {
  const day = todayParis();
  const acc: Record<string, number> = {};
  for (const p of rows) {
    const d = (p.kickoff || p.createdAt || "").slice(0, 10);
    if (d !== day) continue;
    if (HARD_SPORTS.has(p.sport)) continue;
    acc[p.sport] = (acc[p.sport] ?? 0) + 1;
  }
  return acc;
}

function alreadyHave(existing: Prono[], eventName: string, kickoff: string, sport: string) {
  const fake = { eventName, kickoff, sport, createdAt: kickoff } as Prono;
  const key = matchKey(fake);
  return existing.some((p) => matchKey(p) === key);
}

type Pattern = { homeWin: number; over: number; sample: number };

function patternsFromHistory(settled: Prono[]): Pattern {
  let home = 0, homeHit = 0, over = 0, overHit = 0;
  for (const p of settled) {
    const pick = (p.pick || "").toLowerCase();
    if (pick.includes("1x2") && (pick.endsWith("· 1") || pick.endsWith(" 1"))) {
      home += 1;
      if (p.result === "hit") homeHit += 1;
    }
    if (pick.includes("2.5")) {
      over += 1;
      if (p.result === "hit") overHit += 1;
    }
  }
  return {
    homeWin: home ? homeHit / home : 0.55,
    over: over ? overHit / over : 0.52,
    sample: settled.length,
  };
}

function easyTickets(sport: string, pattern: Pattern) {
  if (sport === "basketball") {
    return [{
      pick: "Vainqueur · 1",
      chance: Math.round(pattern.homeWin * 100),
      rationale: "Base interne : favori domicile NBA/Euro. Marché simple, pas de total compliqué.",
    }];
  }
  const tickets = [];
  if (pattern.homeWin >= 0.48) {
    tickets.push({
      pick: "1X2 · 1",
      chance: Math.round(pattern.homeWin * 100),
      rationale: "Pattern interne XWIN : le 1 domicile reste le marché le plus simple à solder. On ne joue pas le 2 ni le score exact.",
    });
    tickets.push({
      pick: "Double chance · 1X",
      chance: Math.min(92, Math.round(pattern.homeWin * 100) + 18),
      rationale: "Filet 1X. On évite le match ouvert. Ticket de sécurité du même match.",
    });
  }
  if (pattern.over >= 0.48) {
    tickets.push({
      pick: "Plus de 2.5 · Over 2.5",
      chance: Math.round(pattern.over * 100),
      rationale: "Second marché facile : total 2.5. Si notre historique interne tombe sous 48 %, ce ticket n’est plus posé.",
    });
  }
  return tickets;
}

export async function ingestUpcomingFixtures(): Promise<FeedReport> {
  const existing = await listPublishedPronos();
  const settled = await listRecentSettledPronos(80);
  const pattern = patternsFromHistory(settled);
  const perSport = countTodayBySport(existing);
  const report: FeedReport = { created: 0, skipped: 0, leagues: [], perSport: { ...perSport } };
  const sunday = weekdayParis() === "Sun";
  const seen = new Set<string>();

  for (const league of LEAGUES) {
    if (HARD_SPORTS.has(league.sport)) continue;
    const have = perSport[league.sport] ?? 0;
    const target = sunday && league.sport === "football" ? 16 : MIN_PER_SPORT;
    if (have >= target) continue;
    let events: NextEvent[] = [];
    try {
      events = await nextEvents(league.id);
    } catch {
      continue;
    }
    if (!events.length) continue;
    report.leagues.push(league.competition);
    for (const ev of events) {
      if ((perSport[league.sport] ?? 0) >= target) break;
      const home = (ev.strHomeTeam || "").trim();
      const away = (ev.strAwayTeam || "").trim();
      if (!home || !away) continue;
      const eventName = `${home} vs ${away}`;
      const day = ev.dateEvent || todayParis();
      const time = (ev.strTime || "15:00:00").slice(0, 8);
      const kickoff = `${day}T${time}`;
      const stamp = `${league.sport}|${eventName.toLowerCase()}|${day}`;
      if (seen.has(stamp) || alreadyHave(existing, eventName, kickoff, league.sport)) {
        report.skipped += 1;
        continue;
      }
      seen.add(stamp);
      const tickets = easyTickets(league.sport, pattern);
      if (!tickets.length) {
        report.skipped += 1;
        continue;
      }
      for (const [i, t] of tickets.entries()) {
        await createProno({
          sport: league.sport,
          competition: ev.strLeague || league.competition,
          eventName,
          kickoff,
          status: "published",
          pick: t.pick,
          rationale: t.rationale,
          isPaid: i >= 2,
          odd: `${t.chance}%`,
          confidence: t.chance >= 70 ? "4" : "3",
          stakeUnits: "1",
        });
        report.created += 1;
        perSport[league.sport] = (perSport[league.sport] ?? 0) + 1;
      }
      existing.push({ eventName, kickoff, sport: league.sport, createdAt: kickoff } as Prono);
    }
  }
  report.perSport = perSport;
  return report;
}

export async function ensureDailyFeed() {
  const settings = await getSettings();
  const day = todayParis();
  if (settings.feed_day === day) return null;
  const report = await ingestUpcomingFixtures();
  await setSetting("feed_day", day);
  await setSetting("feed_last", JSON.stringify(report));
  return report;
}
