import Link from "next/link";
import type { Prono } from "@/lib/types";
import { sportLabel } from "@/lib/sports";
import { formatDateTime } from "@/lib/format-date";

export function PronoCard({ p, hidePick }: { p: Prono; hidePick?: boolean }) {
  const locked = hidePick || p.isPaid;
  const when = p.kickoff ? formatDateTime(p.kickoff) : formatDateTime(p.createdAt);
  const state =
    p.result === "hit" ? "Gagné" : p.result === "miss" ? "Perdu" : p.result === "void" ? "Annulé" : "En cours";
  return (
    <Link className="card" href={`/pronostics/${p.id}`}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: ".6rem", flexWrap: "wrap" }}>
        <span className="badge">{sportLabel(p.sport)}</span>
        <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "Premium" : "Gratuit"}</span>
      </div>
      <p className="muted" style={{ marginTop: ".55rem" }}>{p.competition || "—"}</p>
      <h3>{p.eventName}</h3>
      <p className="muted">{when} · {state}</p>
      <div className="vs">
        <span>{locked ? "Analyse exclusive" : p.pick}</span>
        {p.odd ? <span>{p.odd}</span> : null}
      </div>
      {p.stakeUnits ? <p className="muted">Mise {p.stakeUnits} u.{p.confidence ? ` · Confiance ${p.confidence}` : ""}</p> : null}
    </Link>
  );
}
