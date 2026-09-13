import Link from "next/link";
import type { Prono } from "@/lib/types";
import { sportLabel } from "@/lib/sports";
import { formatDateTime } from "@/lib/format-date";

export function PronoTile({ p, hidePick }: { p: Prono; hidePick?: boolean }) {
  const locked = hidePick || p.isPaid;
  const when = p.kickoff ? formatDateTime(p.kickoff) : formatDateTime(p.createdAt);
  return (
    <Link className="tile" href={`/pronostics/${p.id}`}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: ".4rem" }}>
        <span className="badge">{sportLabel(p.sport)}</span>
        <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "Offre" : "Public"}</span>
      </div>
      <p className="muted">{p.competition}</p>
      <h3>{p.eventName}</h3>
      <p className="muted">{when}</p>
      <div className="vs">
        <span>{locked ? "Compte requis" : p.pick}</span>
        {!locked && p.odd ? <span>{p.odd}</span> : null}
      </div>
    </Link>
  );
}

export function PronoRail({ title, items, hidePaidPick }: { title: string; items: Prono[]; hidePaidPick?: boolean }) {
  if (items.length === 0) return null;
  return (
    <section className="rail">
      <h2 className="rail-title">{title}</h2>
      <div className="rail-track">
        {items.map((p) => (
          <PronoTile key={p.id} p={p} hidePick={hidePaidPick} />
        ))}
      </div>
    </section>
  );
}
