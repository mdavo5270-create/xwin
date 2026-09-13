import Link from "next/link";
import type { Prono } from "@/lib/types";
import { sportLabel } from "@/lib/sports";
import { formatDateTime } from "@/lib/format-date";

export function PronoTile({ p }: { p: Prono; hidePick?: boolean }) {
  const when = p.kickoff ? formatDateTime(p.kickoff) : formatDateTime(p.createdAt);
  return (
    <Link className="tile" href={`/pronostics/${p.id}`}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: ".4rem" }}>
        <span className="badge">{sportLabel(p.sport)}</span>
        <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "Premium" : "Gratuit"}</span>
      </div>
      <p className="muted">{p.competition}</p>
      <h3>{p.eventName}</h3>
      <p className="muted">{when}</p>
    </Link>
  );
}

export function PronoRail({ title, items }: { title: string; items: Prono[]; hidePaidPick?: boolean }) {
  if (items.length === 0) return null;
  return (
    <section className="rail">
      <h2 className="rail-title">{title}</h2>
      <div className="rail-track">
        {items.map((p) => <PronoTile key={p.id} p={p} />)}
      </div>
    </section>
  );
}
