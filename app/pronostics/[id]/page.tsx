import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { sportLabel } from "@/lib/sports";
import { getProno } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PronosticDetail({ params }: { params: Promise<{ id: string }> }) {
  const member = await getMember();
  const { id } = await params;
  const p = await getProno(id);
  if (!p || p.status === "draft") notFound();
  const locked = p.isPaid;
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <p><Link href="/pronostics">← Pronostics</Link></p>
        <p className="muted">{sportLabel(p.sport)} · {p.competition}</p>
        <h1>{p.eventName}</h1>
        <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "Premium" : "Gratuit"}</span>
        {p.kickoff ? <p className="muted">{p.kickoff}</p> : null}
        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>Pronostic</h2>
          {locked ? (
            <>
              <p>🔒 Pronostic Premium. Débloquez l’analyse complète.</p>
              <Link className="btn" href="/premium">Voir Premium</Link>
            </>
          ) : <p style={{ fontWeight: 700, fontSize: "1.15rem" }}>{p.pick}</p>}
        </section>
        <section className="card" style={{ marginTop: ".7rem" }}>
          <h2>Analyse</h2>
          {locked ? <p className="muted">Contenu réservé. Paiement encore désactivé.</p> : <p style={{ whiteSpace: "pre-wrap" }}>{p.rationale}</p>}
        </section>
        <p className="muted">Statut : {p.status} · Résultat : {p.result}</p>
      </main>
    </PublicChrome>
  );
}
