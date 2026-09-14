import Link from "next/link";
import { listPublishedPronos } from "@/lib/store";
import { groupMatches, scoreLabel } from "@/lib/matches";

export const dynamic = "force-dynamic";

export default async function Page() {
  const groups = groupMatches(await listPublishedPronos());
  return (
    <>
      <h1>Mes pronostics</h1>
      {groups.length === 0 ? <p className="empty">Aucun.</p> : (
        <div className="grid">{groups.map((m) => (
          <Link key={m.key} className="card" href={`/pronostics/m/${m.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
            <strong>{m.eventName}</strong>
            <div className="muted">{scoreLabel(m)}</div>
          </Link>
        ))}</div>
      )}
    </>
  );
}
