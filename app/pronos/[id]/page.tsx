import { notFound } from "next/navigation";
import { sportLabel } from "@/lib/sports";
import { getProno } from "@/lib/store";
import { followAction } from "@/app/pronos/[id]/actions";
import { TopBar } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default async function PronoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProno(id);
  if (!p || p.status === "draft") notFound();
  return (
    <>
      <TopBar title="Prono" back="/pronos" />
      <main className="wrap">
        <p className="muted">{sportLabel(p.sport)} · {p.competition}</p>
        <h1>{p.eventName}</h1>
        {p.kickoff ? <p className="muted">{p.kickoff}</p> : null}
        <section className="card">
          <h2>Notre prono</h2>
          <p style={{ fontSize: "1.2rem", fontWeight: 700 }}>{p.pick}</p>
        </section>
        <section className="card" style={{ marginTop: "0.7rem" }}>
          <h2>Pourquoi</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{p.rationale}</p>
        </section>
        <form action={followAction.bind(null, p.id)} style={{ marginTop: "1rem" }}>
          <button className="btn gold" type="submit">Je suis ce prono · {p.followCount}</button>
        </form>
      </main>
    </>
  );
}
