import { listPublishedPronos } from "@/lib/store";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function Page() {
  const rows = await listPublishedPronos();
  return (
    <>
      <h1>Mes pronostics</h1>
      {rows.length === 0 ? <p className="empty">Aucun.</p> : (
        <div className="grid">{rows.map((p) => (
          <Link key={p.id} className="card" href={`/pronostics/${p.id}`} style={{ color: "inherit", textDecoration: "none" }}>
            <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "🔒 Premium" : "Gratuit"}</span>
            <strong>{p.eventName}</strong>
            <div>{p.isPaid ? "Accès premium requis" : p.pick}</div>
          </Link>
        ))}</div>
      )}
    </>
  );
}
