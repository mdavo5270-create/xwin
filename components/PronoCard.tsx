import Link from "next/link";
import type { Prono } from "@/lib/types";
import { sportLabel } from "@/lib/sports";
import { formatDateTime } from "@/lib/format-date";

export function PronoCard({ p }: { p: Prono; hidePick?: boolean }) {
  const when = p.kickoff ? formatDateTime(p.kickoff) : formatDateTime(p.createdAt);
  return (
    <Link className="card" href={`/pronostics/${p.id}`}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: ".6rem" }}>
        <span className="badge">{sportLabel(p.sport)}</span>
        <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "Premium" : "Gratuit"}</span>
      </div>
      <p className="muted" style={{ marginTop: ".7rem" }}>{p.competition || "—"}</p>
      <h3 style={{ fontFamily: "var(--font-display), Syne, sans-serif", fontSize: "1.35rem" }}>{p.eventName}</h3>
      <p className="muted">{when}</p>
    </Link>
  );
}
