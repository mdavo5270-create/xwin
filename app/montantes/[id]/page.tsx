import { notFound } from "next/navigation";
import { getMontante } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function MontantePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = getMontante(id);
  if (!m || m.status !== "open") notFound();
  return (
    <main className="wrap">
      <p className="muted">{m.cadence === "weekly" ? "Montante hebdomadaire" : "Montante mensuelle"}</p>
      <h1>{m.title}</h1>
      <section className="card">
        <p>{m.steps} paliers</p>
        <p>
          Pour rejoindre : <strong>{m.entryAmount} {m.currency}</strong>
        </p>
        <p style={{ whiteSpace: "pre-wrap" }}>{m.description}</p>
      </section>
      <p className="muted" style={{ marginTop: "1rem" }}>
        Le paiement en ligne sera branché quand les clés Stripe seront dans Vercel. Aucun montant fictif n’est encaissé ici.
      </p>
    </main>
  );
}
