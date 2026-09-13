import type { Prono } from "./types";

export function computePerformance(rows: Prono[]) {
  const settled = rows.filter((p) => p.result === "hit" || p.result === "miss");
  const hits = settled.filter((p) => p.result === "hit").length;
  const miss = settled.filter((p) => p.result === "miss").length;
  const voids = rows.filter((p) => p.result === "void").length;
  const pending = rows.filter((p) => p.result === "pending").length;
  const rate = settled.length ? Math.round((hits / settled.length) * 1000) / 10 : null;
  const odds = settled
    .map((p) => Number(p.odd.replace(",", ".")))
    .filter((n) => Number.isFinite(n) && n > 1);
  const avgOdd = odds.length
    ? Math.round((odds.reduce((a, b) => a + b, 0) / odds.length) * 100) / 100
    : null;
  return {
    published: rows.length,
    settled: settled.length,
    hits,
    miss,
    voids,
    pending,
    rate,
    avgOdd,
    sampleOk: settled.length >= 30,
  };
}
