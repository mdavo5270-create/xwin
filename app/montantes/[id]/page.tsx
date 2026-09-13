import { notFound } from "next/navigation";
import { getMontante } from "@/lib/store";
import { TopBar } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default async function MontantePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = await getMontante(id);
  if (!m || m.status !== "open") notFound();
  return (
    <>
      <TopBar title="Montante" back="/montantes" />
      <main className="wrap">
        <p className="muted">{m.cadence === "weekly" ? "Hebdomadaire" : "Mensuelle"}</p>
        <h1>{m.title}</h1>
        <section className="card">
          <p>{m.steps} paliers</p>
          <p>
            Pour rejoindre : <strong>{m.entryAmount} {m.currency}</strong>
          </p>
          <p style={{ whiteSpace: "pre-wrap" }}>{m.description}</p>
        </section>
        <button className="btn off" type="button" disabled style={{ marginTop: "1rem" }}>
          Paiement bientôt
        </button>
      </main>
    </>
  );
}
