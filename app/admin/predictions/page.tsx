import Link from "next/link";
import { listAllPronosPage } from "@/lib/store";
import { adminHref } from "@/lib/admin-path";
import { groupMatches, scoreLabel } from "@/lib/matches";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { rows, total } = await listAllPronosPage({ limit: 200, offset: 0 });
  const groups = groupMatches(rows);
  return (
    <>
      <h1>Pronostics</h1>
      <div className="admin-actions">
        <Link className="btn" href={adminHref("predictions/new")}>Nouveau match / ticket</Link>
      </div>
      <p className="muted">{total} tickets · {groups.length} matchs. Mêmes équipes + même date = même fiche.</p>
      {groups.length === 0 ? <p className="empty">Aucun.</p> : groups.map((m) => (
        <section key={m.key} className="prono-block">
          <h2>{m.eventName}</h2>
          <p className="muted">{m.competition} · {scoreLabel(m)}</p>
          <div className="admin-tiles">
            {m.tickets.map((p) => (
              <Link className="admin-tile" key={p.id} href={adminHref(`predictions/${p.id}`)}>
                <strong>{p.pick}</strong>
                <div className="muted">{p.isPaid ? "Premium" : "Gratuit"} · {p.result}</div>
              </Link>
            ))}
          </div>
          <div className="admin-actions">
            <Link className="btn ghost" href={`${adminHref("predictions/new")}?sport=${encodeURIComponent(m.sport)}&competition=${encodeURIComponent(m.competition)}&home=${encodeURIComponent(m.eventName.split(/\s+vs\.?\s+/i)[0] || "")}&away=${encodeURIComponent(m.eventName.split(/\s+vs\.?\s+/i)[1] || "")}&kickoff=${encodeURIComponent(m.kickoff)}`}>Ajouter un ticket</Link>
          </div>
        </section>
      ))}
    </>
  );
}
