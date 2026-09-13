import Link from "next/link";
import { listPublishedPronos } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AppHome() {
  const pronos = (await listPublishedPronos()).slice(0, 5);
  return (
    <>
      <h1>Tableau de bord</h1>
      <section className="card">
        <p>Votre accès</p>
        <p className="muted">Premium : inactif (paiement off).</p>
      </section>
      <h2>Derniers pronostics</h2>
      {pronos.length === 0 ? <p className="empty">Aucun.</p> : (
        <div className="grid">{pronos.map((p) => (
          <Link key={p.id} className="card" href={`/app/pronostics`} style={{ color: "inherit", textDecoration: "none" }}>
            <strong>{p.eventName}</strong>
            <div className="muted">{p.isPaid ? "Premium" : p.pick}</div>
          </Link>
        ))}</div>
      )}
    </>
  );
}
