import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { listOpenMontantes } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function MontantesPage() {
  const member = await getMember();
  const rows = await listOpenMontantes();
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <h1>Montantes</h1>
        <p className="muted">Paliers hebdo ou mensuel, mise d'entrée fixée à l'avance. Encaissement encore désactivé.</p>
        {rows.length === 0 ? (
          <p className="empty">Aucune montante ouverte pour le moment.</p>
        ) : (
          <div className="grid two">
            {rows.map((m) => (
              <Link className="card" key={m.id} href={`/montantes/${m.id}`}>
                <h3>{m.title}</h3>
                <p className="muted">{m.steps} paliers · {m.cadence === "weekly" ? "hebdo" : "mensuel"}</p>
                <p className="muted">Entrée {m.entryAmount} {m.currency}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </PublicChrome>
  );
}
