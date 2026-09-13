import Link from "next/link";
import { notFound } from "next/navigation";
import { SPORTS, sportLabel } from "@/lib/sports";
import { listPublishedPronos } from "@/lib/store";
import { TabBar, TopBar } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default async function SportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SPORTS.some((s) => s.slug === slug)) notFound();
  const pronos = await listPublishedPronos(slug);
  return (
    <>
      <TopBar title={sportLabel(slug)} back="/" />
      <main className="wrap">
        {pronos.length === 0 ? (
          <p className="empty">Pas encore de prono ici.</p>
        ) : (
          <div className="grid">
            {pronos.map((p) => (
              <Link className="card" key={p.id} href={`/pronos/${p.id}`}>
                <div className="muted">{p.competition}</div>
                <strong>{p.eventName}</strong>
                <div>Prono : {p.pick}</div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <TabBar active="pronos" />
    </>
  );
}
