import { randomUUID } from "crypto";
import { hasDatabase, sql } from "./db";
import type { Montante, Prono } from "./types";

type Store = { pronos: Prono[]; montantes: Montante[] };

declare global {
  var __xwinStore: Store | undefined;
}

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
    result: r.result as Prono["result"],
    followCount: Number(r.follow_count ?? 0),
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
  if (!hasDatabase()) {
    return mem()
      .pronos.filter((p) => p.status !== "draft" && (!sport || p.sport === sport))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const rows = sport
    ? await sql()`select * from pronos where status <> 'draft' and sport = ${sport} order by created_at desc`
    : await sql()`select * from pronos where status <> 'draft' order by created_at desc`;
  return rows.map(mapProno);
}

export async function listAllPronos() {
  if (!hasDatabase()) {
    return [...mem().pronos].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const rows = await sql()`select * from pronos order by created_at desc`;
  return rows.map(mapProno);
}

export async function getProno(id: string) {
  if (!hasDatabase()) return mem().pronos.find((p) => p.id === id) ?? null;
  const rows = await sql()`select * from pronos where id = ${id} limit 1`;
  return rows[0] ? mapProno(rows[0] as Record<string, unknown>) : null;
}

export async function createProno(input: Omit<Prono, "id" | "followCount" | "createdAt" | "result">) {
  const row: Prono = {
    ...input,
    id: randomUUID(),
    followCount: 0,
    result: "pending",
    createdAt: new Date().toISOString(),
  };
  if (!hasDatabase()) {
    mem().pronos.unshift(row);
    return row;
  }
  await sql()`
    insert into pronos (id, sport, competition, event_name, kickoff, pick, rationale, status, result, follow_count, created_at)
    values (${row.id}, ${row.sport}, ${row.competition}, ${row.eventName}, ${row.kickoff}, ${row.pick}, ${row.rationale}, ${row.status}, ${row.result}, ${row.followCount}, ${row.createdAt})
  `;
  return row;
}

export async function followProno(id: string) {
  const current = await getProno(id);
  if (!current || current.status === "draft") return null;
  if (!hasDatabase()) {
    current.followCount += 1;
    return current;
  }
  await sql()`update pronos set follow_count = follow_count + 1 where id = ${id}`;
  return getProno(id);
}

export async function settleProno(id: string, result: Prono["result"]) {
  const current = await getProno(id);
  if (!current) return null;
  if (!hasDatabase()) {
    current.result = result;
    current.status = "settled";
    return current;
  }
  await sql()`update pronos set result = ${result}, status = 'settled' where id = ${id}`;
  return getProno(id);
}

export async function listOpenMontantes() {
  if (!hasDatabase()) {
    return mem()
      .montantes.filter((m) => m.status === "open")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const rows = await sql()`select * from montantes where status = 'open' order by created_at desc`;
  return rows.map(mapMontante);
}

export async function listAllMontantes() {
  if (!hasDatabase()) {
    return [...mem().montantes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const rows = await sql()`select * from montantes order by created_at desc`;
  return rows.map(mapMontante);
}

export async function getMontante(id: string) {
  if (!hasDatabase()) return mem().montantes.find((m) => m.id === id) ?? null;
  const rows = await sql()`select * from montantes where id = ${id} limit 1`;
  return rows[0] ? mapMontante(rows[0] as Record<string, unknown>) : null;
}

export async function createMontante(input: Omit<Montante, "id" | "createdAt">) {
  const row: Montante = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  if (!hasDatabase()) {
    mem().montantes.unshift(row);
    return row;
  }
  await sql()`
    insert into montantes (id, title, cadence, steps, entry_amount, currency, description, status, created_at)
    values (${row.id}, ${row.title}, ${row.cadence}, ${row.steps}, ${row.entryAmount}, ${row.currency}, ${row.description}, ${row.status}, ${row.createdAt})
  `;
  return row;
}
