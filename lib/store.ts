import { randomUUID } from "crypto";
import { hasDatabase, sql } from "./db";
import type { Montante, Prono } from "./types";
import { computePerformance } from "./performance";

type Store = { pronos: Prono[]; montantes: Montante[] };
declare global { var __xwinStore: Store | undefined; }
function mem(): Store {
  if (!globalThis.__xwinStore) globalThis.__xwinStore = { pronos: [], montantes: [] };
  return globalThis.__xwinStore;
}
function mapProno(r: Record<string, unknown>): Prono {
  return {
    id: String(r.id),
    sport: String(r.sport),
    competition: String(r.competition),
    eventName: String(r.event_name),
    kickoff: String(r.kickoff ?? ""),
    pick: String(r.pick),
    rationale: String(r.rationale),
    status: r.status as Prono["status"],
    result: (r.result as Prono["result"]) ?? "pending",
    followCount: Number(r.follow_count ?? 0),
    isPaid: Boolean(r.is_paid),
    odd: String(r.odd ?? ""),
    confidence: String(r.confidence ?? ""),
    stakeUnits: String(r.stake_units ?? "1"),
    createdAt: new Date(String(r.created_at)).toISOString(),
  };
}
function mapMontante(r: Record<string, unknown>): Montante {
  return {
    id: String(r.id),
    title: String(r.title),
    cadence: r.cadence as Montante["cadence"],
    steps: Number(r.steps),
    entryAmount: String(r.entry_amount),
    currency: String(r.currency),
    description: String(r.description),
    status: r.status as Montante["status"],
    createdAt: new Date(String(r.created_at)).toISOString(),
  };
}
export async function listPublishedPronos(sport?: string) {
  if (!hasDatabase()) return mem().pronos.filter((p) => p.status !== "draft" && (!sport || p.sport === sport));
  const rows = sport
    ? await sql()`select * from pronos where status <> 'draft' and sport = ${sport} order by created_at desc`
    : await sql()`select * from pronos where status <> 'draft' order by created_at desc`;
  return rows.map(mapProno);
}
export async function listPublishedPronosPage(opts: { sport?: string; limit: number; offset: number }) {
  const { sport, limit, offset } = opts;
  if (!hasDatabase()) {
    const rows = mem().pronos.filter((p) => p.status !== "draft" && (!sport || p.sport === sport));
    return { rows: rows.slice(offset, offset + limit), total: rows.length };
  }
  const rows = sport
    ? await sql()`
        select *, count(*) over() as total_count from pronos
        where status <> 'draft' and sport = ${sport}
        order by created_at desc limit ${limit} offset ${offset}`
    : await sql()`
        select *, count(*) over() as total_count from pronos
        where status <> 'draft'
        order by created_at desc limit ${limit} offset ${offset}`;
  const total = rows.length ? Number(rows[0].total_count) : 0;
  return { rows: rows.map((r) => mapProno(r as Record<string, unknown>)), total };
}
export async function listRecentSettledPronos(limit: number) {
  if (!hasDatabase()) {
    return mem()
      .pronos.filter((p) => p.status !== "draft" && (p.result === "hit" || p.result === "miss"))
      .slice(0, limit);
  }
  const rows = await sql()`
    select * from pronos where status <> 'draft' and result in ('hit', 'miss')
    order by created_at desc limit ${limit}`;
  return rows.map((r) => mapProno(r as Record<string, unknown>));
}
export async function countOpenPronosBySport() {
  if (!hasDatabase()) {
    const acc: Record<string, number> = {};
    for (const p of mem().pronos) {
      if (p.status === "draft" || p.result !== "pending") continue;
      acc[p.sport] = (acc[p.sport] ?? 0) + 1;
    }
    return acc;
  }
  const rows = await sql()`
    select sport, count(*)::int as n from pronos
    where status <> 'draft' and result = 'pending'
    group by sport`;
  const acc: Record<string, number> = {};
  for (const r of rows) acc[String((r as Record<string, unknown>).sport)] = Number((r as Record<string, unknown>).n);
  return acc;
}
export async function getPerformanceSummary(sport?: string) {
  if (!hasDatabase()) {
    const rows = mem().pronos.filter((p) => p.status !== "draft" && (!sport || p.sport === sport));
    return computePerformance(rows);
  }
  const rows = sport
    ? await sql()`
        select
          count(*)::int as published,
          count(*) filter (where result in ('hit','miss'))::int as settled,
          count(*) filter (where result = 'hit')::int as hits,
          count(*) filter (where result = 'miss')::int as miss,
          count(*) filter (where result = 'void')::int as voids,
          count(*) filter (where result = 'pending')::int as pending,
          avg(replace(odd, ',', '.')::numeric) filter (
            where result in ('hit','miss') and odd ~ '^[0-9]+([.,][0-9]+)?$'
          ) as avg_odd
        from pronos where status <> 'draft' and sport = ${sport}`
    : await sql()`
        select
          count(*)::int as published,
          count(*) filter (where result in ('hit','miss'))::int as settled,
          count(*) filter (where result = 'hit')::int as hits,
          count(*) filter (where result = 'miss')::int as miss,
          count(*) filter (where result = 'void')::int as voids,
          count(*) filter (where result = 'pending')::int as pending,
          avg(replace(odd, ',', '.')::numeric) filter (
            where result in ('hit','miss') and odd ~ '^[0-9]+([.,][0-9]+)?$'
          ) as avg_odd
        from pronos where status <> 'draft'`;
  const r = rows[0] as Record<string, unknown>;
  const settled = Number(r.settled);
  const hits = Number(r.hits);
  return {
    published: Number(r.published),
    settled,
    hits,
    miss: Number(r.miss),
    voids: Number(r.voids),
    pending: Number(r.pending),
    rate: settled ? Math.round((hits / settled) * 1000) / 10 : null,
    avgOdd: r.avg_odd != null ? Math.round(Number(r.avg_odd) * 100) / 100 : null,
    sampleOk: settled >= 30,
  };
}
export async function listAllPronos() {
  if (!hasDatabase()) return [...mem().pronos];
  return (await sql()`select * from pronos order by created_at desc`).map(mapProno);
}
export async function getProno(id: string) {
  if (!hasDatabase()) return mem().pronos.find((p) => p.id === id) ?? null;
  const rows = await sql()`select * from pronos where id = ${id} limit 1`;
  return rows[0] ? mapProno(rows[0] as Record<string, unknown>) : null;
}
export async function createProno(input: Omit<Prono, "id" | "followCount" | "createdAt" | "result">) {
  const row: Prono = { ...input, id: randomUUID(), followCount: 0, result: "pending", createdAt: new Date().toISOString() };
  if (!hasDatabase()) { mem().pronos.unshift(row); return row; }
  await sql()`
    insert into pronos (id, sport, competition, event_name, kickoff, pick, rationale, status, result, follow_count, created_at, is_paid, odd, confidence, stake_units)
    values (${row.id}, ${row.sport}, ${row.competition}, ${row.eventName}, ${row.kickoff}, ${row.pick}, ${row.rationale}, ${row.status}, ${row.result}, ${row.followCount}, ${row.createdAt}, ${row.isPaid}, ${row.odd}, ${row.confidence}, ${row.stakeUnits})
  `;
  return row;
}
export async function settleProno(id: string, result: Prono["result"]) {
  const current = await getProno(id);
  if (!current) return null;
  if (!hasDatabase()) {
    current.result = result;
    current.status = result === "pending" ? "published" : "settled";
    return current;
  }
  const status = result === "pending" ? "published" : "settled";
  await sql()`update pronos set result = ${result}, status = ${status} where id = ${id}`;
  return getProno(id);
}
export async function followProno(id: string) {
  const current = await getProno(id);
  if (!current || current.status === "draft") return null;
  if (!hasDatabase()) { current.followCount += 1; return current; }
  await sql()`update pronos set follow_count = follow_count + 1 where id = ${id}`;
  return getProno(id);
}
export async function listOpenMontantes() {
  if (!hasDatabase()) return mem().montantes.filter((m) => m.status === "open");
  return (await sql()`select * from montantes where status = 'open' order by created_at desc`).map(mapMontante);
}
export async function listAllMontantes() {
  if (!hasDatabase()) return [...mem().montantes];
  return (await sql()`select * from montantes order by created_at desc`).map(mapMontante);
}
export async function getMontante(id: string) {
  if (!hasDatabase()) return mem().montantes.find((m) => m.id === id) ?? null;
  const rows = await sql()`select * from montantes where id = ${id} limit 1`;
  return rows[0] ? mapMontante(rows[0] as Record<string, unknown>) : null;
}
export async function createMontante(input: Omit<Montante, "id" | "createdAt">) {
  const row: Montante = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
  if (!hasDatabase()) { mem().montantes.unshift(row); return row; }
  await sql()`
    insert into montantes (id, title, cadence, steps, entry_amount, currency, description, status, created_at)
    values (${row.id}, ${row.title}, ${row.cadence}, ${row.steps}, ${row.entryAmount}, ${row.currency}, ${row.description}, ${row.status}, ${row.createdAt})
  `;
  return row;
}
