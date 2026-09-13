import Link from "next/link";
import { SPORTS } from "@/lib/sports";
import { listOpenMontantes, listPublishedPronos } from "@/lib/store";
import { TabBar } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const pronos = (await listPublishedPronos()).slice(0, 5);
  const montantes = (await listOpenMontantes()).slice(0, 2);
  return (
    <>
      <section className="hero">
        <p className="muted" style={{ color: "#c9e6e2" }}>Bonjour</p>
        <h1>XWIN</h1>
        <p style={{ color: "#d7ece9", fontSize: "0.92rem" }}>
          Pronos publiés par l’équipe. Tu décides si tu suis.
        </p>
      </section>
      <main className="wrap">
        <div className="chips">
          {SPORTS.map((s) => (
            <Link key={s.slug} className="chip" href={`/sports/${s.slug}`}>
              {s.label}
            </Link>
          ))}
        </div>
        <h2>En avant</h2>
        {pronos.length === 0 ? (
          <p className="empty">Aucun prono publié pour l’instant.</p>
        ) : (
          <div className="grid">
            {pronos.map((p) => (
              <Link className="card" key={p.id} href={`/pronos/${p.id}`}>
                <div className="muted">{p.competition}</div>
                <strong>{p.eventName}</strong>
                <div style={{ marginTop: "0.35rem" }}>Prono : {p.pick}</div>
              </Link>
            ))}
          </div>
        )}
        <h2 style={{ marginTop: "1.1rem" }}>Montantes</h2>
        {montantes.length === 0 ? (
          <p className="empty">Aucune montante ouverte.</p>
        ) : (
          <div className="grid">
            {montantes.map((m) => (
              <Link className="card" key={m.id} href={`/montantes/${m.id}`}>
                <strong>{m.title}</strong>
                <div className="muted">
                  {m.cadence === "weekly" ? "Hebdo" : "Mensuel"} · {m.steps} paliers
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <TabBar active="home" />
    </>
  );
}
