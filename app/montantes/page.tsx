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
        <p className="muted">Paliers hebdo / mensuel. Paiement coupé.</p>
        {rows.length === 0 ? (
          <p className="empty">Aucune montante ouverte.</p>
        ) : (
          <div className="grid two">
            {rows.map((m) => (
              <Link className="card" key={m.id} href={`/montantes/${m.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                <strong>{m.title}</strong>
                <div className="muted">{m.steps} paliers · {m.entryAmount} {m.currency}</div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </PublicChrome>
  );
}
