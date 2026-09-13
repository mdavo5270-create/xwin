import { randomUUID } from "crypto";
import type { Montante, Prono } from "./types";

type Store = { pronos: Prono[]; montantes: Montante[] };

declare global {
  // Isolated per serverless instance until DATABASE_URL is set.
  var __xwinStore: Store | undefined;
}

function empty(): Store {
  return { pronos: [], montantes: [] };
}

function db(): Store {
  if (!globalThis.__xwinStore) globalThis.__xwinStore = empty();
  return globalThis.__xwinStore;
}

export function listPublishedPronos(sport?: string) {
  return db()
    .pronos.filter((p) => p.status !== "draft" && (!sport || p.sport === sport))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listAllPronos() {
  return [...db().pronos].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getProno(id: string) {
  return db().pronos.find((p) => p.id === id) ?? null;
}

export function createProno(input: Omit<Prono, "id" | "followCount" | "createdAt" | "result">) {
  const row: Prono = {
    ...input,
    id: randomUUID(),
    followCount: 0,
    result: "pending",
    createdAt: new Date().toISOString(),
  };
  db().pronos.unshift(row);
  return row;
}

export function followProno(id: string) {
  const row = getProno(id);
  if (!row || row.status === "draft") return null;
  row.followCount += 1;
  return row;
}

export function settleProno(id: string, result: Prono["result"]) {
  const row = getProno(id);
  if (!row) return null;
  row.result = result;
  row.status = "settled";
  return row;
}

export function listOpenMontantes() {
  return db()
    .montantes.filter((m) => m.status === "open")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listAllMontantes() {
  return [...db().montantes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getMontante(id: string) {
  return db().montantes.find((m) => m.id === id) ?? null;
}

export function createMontante(input: Omit<Montante, "id" | "createdAt">) {
  const row: Montante = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  db().montantes.unshift(row);
  return row;
}
