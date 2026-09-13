import Link from "next/link";
import { listAllPronos } from "@/lib/store";
import { adminHref } from "@/lib/admin-path";
export const dynamic = "force-dynamic";
export default async function Page() {
  const rows = await listAllPronos();
  return (
    <>
      <h1>Pronostics</h1>
      <p><Link className="btn" href={adminHref("predictions/new")}>+ Nouveau</Link></p>
      {rows.length === 0 ? <p className="empty">Aucun.</p> : (
        <div className="grid">{rows.map((p) => (
          <div className="card" key={p.id}>
            <strong>{p.eventName}</strong>
            <div className="muted">{p.sport} · {p.isPaid ? "premium" : "gratuit"} · {p.status}</div>
          </div>
        ))}</div>
      )}
    </>
  );
}
