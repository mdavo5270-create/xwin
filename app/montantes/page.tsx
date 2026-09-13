import Link from "next/link";
import { listOpenMontantes } from "@/lib/store";
import { TabBar, TopBar } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default async function MontantesPage() {
  const rows = await listOpenMontantes();
  return (
    <>
      <TopBar title="Montantes" />
      <main className="wrap">
        <p className="muted">Hebdo et mensuel. Paiement coupé pour le moment.</p>
        {rows.length === 0 ? (
          <p className="empty">Aucune montante ouverte.</p>
        ) : (
          <div className="grid">
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
      <TabBar active="montantes" />
    </>
  );
}
