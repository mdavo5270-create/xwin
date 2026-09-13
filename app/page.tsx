import Link from "next/link";
import { listOpenMontantes, listPublishedPronos } from "@/lib/store";
import { SPORTS } from "@/lib/sports";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSchema();
  const all = await listPublishedPronos();
  const today = all.slice(0, 8);
  const montantes = (await listOpenMontantes()).slice(0, 3);
  return (
    <>
      <h1>Aujourd’hui</h1>
      <p className="muted">Pronos du jour et de la semaine — uniquement ce que l’équipe a publié.</p>
      <div className="tabs">
        {SPORTS.map((s) => (
          <Link key={s.slug} href={`/pronos?sport=${s.slug}`}>{s.label}</Link>
        ))}
      </div>
      <h2>Pronostics</h2>
      {today.length === 0 ? (
        <p className="empty">Aucun prono publié.</p>
      ) : (
        <div className="grid two">
          {today.map((p) => (
            <Link className="card" key={p.id} href={`/pronos/${p.id}`} style={{ color: "inherit", textDecoration: "none" }}>
              <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "Payant" : "Gratuit"}</span>
              <div className="muted" style={{ marginTop: ".35rem" }}>{p.competition}</div>
              <strong>{p.eventName}</strong>
              <div>{p.isPaid ? "Prono réservé aux abonnés" : `Prono : ${p.pick}`}</div>
            </Link>
          ))}
        </div>
      )}
      <h2>Montantes ouvertes</h2>
      {montantes.length === 0 ? (
        <p className="empty">Aucune montante.</p>
      ) : (
        <div className="grid two">
          {montantes.map((m) => (
            <Link className="card" key={m.id} href={`/montantes/${m.id}`} style={{ color: "inherit", textDecoration: "none" }}>
              <strong>{m.title}</strong>
              <div className="muted">{m.steps} paliers · {m.entryAmount} {m.currency}</div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
