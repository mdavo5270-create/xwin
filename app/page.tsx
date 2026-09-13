import Link from "next/link";
import { SPORTS } from "@/lib/sports";
import { listOpenMontantes, listPublishedPronos } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const pronos = (await listPublishedPronos()).slice(0, 6);
  const montantes = (await listOpenMontantes()).slice(0, 3);
  return (
    <main className="wrap">
      <p className="muted" style={{ letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.75rem" }}>
        Portail public
      </p>
      <h1>Pronos & montantes</h1>
      <p className="muted">
        Rien n’est inventé ici. Un prono ou une montante n’apparaît qu’après publication côté admin.
      </p>
      <div className="chips" style={{ margin: "1rem 0 1.5rem" }}>
        {SPORTS.map((s) => (
          <Link key={s.slug} className="chip" href={`/sports/${s.slug}`}>
            {s.label}
          </Link>
        ))}
      </div>
      <h2>Derniers pronos</h2>
      {pronos.length === 0 ? (
        <p className="empty">Aucun prono publié pour le moment.</p>
      ) : (
        <div className="grid cards">
          {pronos.map((p) => (
            <Link className="card" key={p.id} href={`/pronos/${p.id}`}>
              <div className="muted">{p.competition}</div>
              <strong>{p.eventName}</strong>
              <div style={{ marginTop: "0.4rem" }}>Prono : {p.pick}</div>
            </Link>
          ))}
        </div>
      )}
      <h2 style={{ marginTop: "1.5rem" }}>Montantes ouvertes</h2>
      {montantes.length === 0 ? (
        <p className="empty">Aucune montante ouverte.</p>
      ) : (
        <div className="grid cards">
          {montantes.map((m) => (
            <Link className="card" key={m.id} href={`/montantes/${m.id}`}>
              <strong>{m.title}</strong>
              <div className="muted">
                {m.cadence === "weekly" ? "Hebdomadaire" : "Mensuelle"} · {m.steps} paliers · {m.entryAmount} {m.currency}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
