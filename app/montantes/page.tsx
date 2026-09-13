import Link from "next/link";
import { listOpenMontantes } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function MontantesPage() {
  const rows = listOpenMontantes();
  return (
    <main className="wrap">
      <h1>Montantes</h1>
      <p className="muted">Hebdo et mensuel. Les paliers et le montant sont ceux publiés par l’équipe.</p>
      {rows.length === 0 ? (
        <p className="empty">Aucune montante ouverte.</p>
      ) : (
        <div className="grid cards">
          {rows.map((m) => (
            <Link className="card" key={m.id} href={`/montantes/${m.id}`}>
              <strong>{m.title}</strong>
              <div className="muted">
                {m.cadence === "weekly" ? "Chaque semaine" : "Chaque mois"} · {m.steps} paliers
              </div>
              <div>
                Entrée : {m.entryAmount} {m.currency}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
