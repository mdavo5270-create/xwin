import { createProno, listPublishedPronos, listRecentSettledPronos } from "./store";
import { getSettings, setSetting } from "./commerce";
import { matchKey } from "./matches";
import type { Prono } from "./types";

const MIN_PER_SPORT = 10;

const LEAGUES: { id: string; sport: string; competition: string }[] = [
  { id: "4328", sport: "football", competition: "Premier League" },
  { id: "4335", sport: "football", competition: "Ligue 1" },
  { id: "4334", sport: "football", competition: "La Liga" },
  { id: "4332", sport: "football", competition: "Serie A" },
  { id: "4331", sport: "football", competition: "Bundesliga" },
  { id: "4480", sport: "football", competition: "Ligue des champions" },
  { id: "4346", sport: "football", competition: "Ligue 2" },
  { id: "4387", sport: "basketball", competition: "NBA" },
  { id: "4546", sport: "basketball", competition: "EuroLeague" },
  { id: "4464", sport: "tennis", competition: "ATP" },
  { id: "4517", sport: "tennis", competition: "WTA" },
];

const DAY_SPORTS: { api: string; sport: string }[] = [
  { api: "Soccer", sport: "football" },
  { api: "Basketball", sport: "basketball" },
  { api: "Tennis", sport: "tennis" },
  { api: "Ice Hockey", sport: "hockey" },
];

type Raw = {
  sport: string;
  competition: string;
  home: string;
  away: string;
  day: string;
  time: string;
};

export type FeedReport = {
  created: number;
  skipped: number;
  leagues: string[];
  perSport: Record<string, number>;
};

function todayParis() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function weekdayParis() {
  return new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Paris", weekday: "short" }).format(new Date());
}

function plusDays(iso: string, n: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

async function getJson(url: string) {
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return null;
  return res.json() as Promise<Record<string, unknown>>;
}

function readEvents(data: Record<string, unknown> | null): Record<string, string>[] {
  const raw = (data?.events || data?.event || []) as Record<string, string>[];
  return Array.isArray(raw) ? raw : [];
}

function splitEventName(strEvent: string) {
  const m = strEvent.split(/\s+vs\.?\s+/i);
  if (m.length >= 2) return { home: m[0].trim(), away: m[1].trim() };
  return { home: strEvent.trim(), away: "" };
}

function fromApi(ev: Record<string, string>, sport: string): Raw | null {
  let home = (ev.strHomeTeam || "").trim();
  let away = (ev.strAwayTeam || "").trim();
  if (!home || !away) {
    const parts = splitEventName(ev.strEvent || ev.strEventAlternate || "");
    home = home || parts.home;
    away = away || parts.away;
  }
  if (!home || !away) return null;
  const day = (ev.dateEvent || "").slice(0, 10);
  if (!day) return null;
  return {
    sport,
    competition: ev.strLeague || "",
    home,
    away,
    day,
    time: (ev.strTime || "15:00:00").slice(0, 8),
  };
}

async function collectFixtures(): Promise<Raw[]> {
  const out: Raw[] = [];
  const seen = new Set<string>();
  const push = (row: Raw | null) => {
    if (!row) return;
    const k = `${row.sport}|${row.home.toLowerCase()}|${row.away.toLowerCase()}|${row.day}`;
    if (seen.has(k)) return;
    seen.add(k);
    out.push(row);
  };

  for (const league of LEAGUES) {
    const next = readEvents(await getJson(`https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${league.id}`));
    for (const ev of next) push(fromApi(ev, league.sport));
    if (league.sport === "tennis") {
      const year = todayParis().slice(0, 4);
      const season = readEvents(await getJson(`https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=${league.id}&s=${year}`));
      for (const ev of season) {
        const row = fromApi(ev, league.sport);
        if (row && row.day >= todayParis()) push(row);
      }
    }
  }

  const start = todayParis();
  for (const spec of DAY_SPORTS) {
    for (let i = 0; i < 10; i++) {
      const day = plusDays(start, i);
      const data = await getJson(`https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${day}&s=${encodeURIComponent(spec.api)}`);
      for (const ev of readEvents(data)) push(fromApi(ev, spec.sport));
    }
  }
  return out.sort((a, b) => `${a.day}${a.time}`.localeCompare(`${b.day}${b.time}`));
}

function countOpenBySport(rows: Prono[]) {
  const acc: Record<string, number> = {};
  for (const p of rows) {
    if (p.result !== "pending") continue;
    acc[p.sport] = (acc[p.sport] ?? 0) + 1;
  }
  return acc;
}

function alreadyHave(existing: Prono[], eventName: string, kickoff: string, sport: string) {
  const fake = { eventName, kickoff, sport, createdAt: kickoff } as Prono;
  const key = matchKey(fake);
  return existing.some((p) => matchKey(p) === key);
}

function easyTickets(sport: string, homeRate: number, overRate: number) {
  if (sport === "tennis") {
    return [{
      pick: "Vainqueur · 1",
      chance: Math.round(homeRate * 100),
      rationale: "Tête de série / joueur listé à gauche. Marché simple, pas de set exact.",
    }];
  }
  if (sport === "basketball" || sport === "hockey") {
    return [{
      pick: "Vainqueur · 1",
      chance: Math.round(homeRate * 100),
      rationale: "Favori domicile. Pas de spread, pas de total tordu.",
    }];
  }
  const tickets = [];
  if (homeRate >= 0.48) {
    tickets.push({
      pick: "1X2 · 1",
      chance: Math.round(homeRate * 100),
      rationale: "1 domicile : marché le plus simple à solder.",
    });
    tickets.push({
      pick: "Double chance · 1X",
      chance: Math.min(92, Math.round(homeRate * 100) + 18),
      rationale: "Filet 1X sur le même match.",
    });
  }
  if (overRate >= 0.48) {
    tickets.push({
      pick: "Plus de 2.5 · Over 2.5",
      chance: Math.round(overRate * 100),
      rationale: "Total 2.5, deuxième marché facile.",
    });
  }
  return tickets;
}

export async function ingestUpcomingFixtures(): Promise<FeedReport> {
  const existing = await listPublishedPronos();
  const settled = await listRecentSettledPronos(80);
  let homeN = 0, homeH = 0, overN = 0, overH = 0;
  for (const p of settled) {
    const pick = (p.pick || "").toLowerCase();
    if (pick.includes("1x2") && pick.includes("1")) { homeN += 1; if (p.result === "hit") homeH += 1; }
    if (pick.includes("2.5")) { overN += 1; if (p.result === "hit") overH += 1; }
  }
  const homeRate = homeN ? homeH / homeN : 0.55;
  const overRate = overN ? overH / overN : 0.52;
  const perSport = countOpenBySport(existing);
  const report: FeedReport = { created: 0, skipped: 0, leagues: [], perSport: { ...perSport } };
  const sunday = weekdayParis() === "Sun";
  const fixtures = await collectFixtures();
  report.leagues = [...new Set(fixtures.map((f) => f.competition).filter(Boolean))].slice(0, 20);

  for (const row of fixtures) {
    const target = sunday && row.sport === "football" ? 16 : MIN_PER_SPORT;
    if ((perSport[row.sport] ?? 0) >= target) continue;
    const eventName = `${row.home} vs ${row.away}`;
    const kickoff = `${row.day}T${row.time}`;
    if (alreadyHave(existing, eventName, kickoff, row.sport)) {
      report.skipped += 1;
      continue;
    }
    const tickets = easyTickets(row.sport, homeRate, overRate);
    if (!tickets.length) { report.skipped += 1; continue; }
    for (const [i, t] of tickets.entries()) {
      await createProno({
        sport: row.sport,
        competition: row.competition || row.sport,
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
      perSport[row.sport] = (perSport[row.sport] ?? 0) + 1;
    }
    existing.push({ eventName, kickoff, sport: row.sport, createdAt: kickoff, result: "pending" } as Prono);
  }
  report.perSport = perSport;
  return report;
}

export async function ensureDailyFeed() {
  const settings = await getSettings();
  const existing = await listPublishedPronos();
  const open = countOpenBySport(existing.filter((p) => p.result === "pending"));
  const need = ["football", "basketball", "tennis", "hockey"].some((s) => (open[s] ?? 0) < MIN_PER_SPORT);
  if (settings.feed_day === todayParis() && !need) return null;
  const report = await ingestUpcomingFixtures();
  await setSetting("feed_day", todayParis());
  await setSetting("feed_last", JSON.stringify(report));
  return report;
}
