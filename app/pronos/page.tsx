import Link from "next/link";
import { sportLabel } from "@/lib/sports";
import { listPublishedPronos } from "@/lib/store";
import { TabBar, TopBar } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default async function PronosPage() {
  const pronos = await listPublishedPronos();
  return (
    <>
      <TopBar title="Pronos" />
      <main className="wrap">
        {pronos.length === 0 ? (
          <p className="empty">Aucun prono publié.</p>
        ) : (
          <div className="grid">
            {pronos.map((p) => (
              <Link className="card" key={p.id} href={`/pronos/${p.id}`}>
                <div className="muted">{sportLabel(p.sport)} · {p.competition}</div>
                <strong>{p.eventName}</strong>
                <div>Prono : {p.pick}</div>
                <div className="muted">{p.followCount} suivi(s)</div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <TabBar active="pronos" />
    </>
  );
}
