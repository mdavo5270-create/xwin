import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { getMontante } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function MontantePage({ params }: { params: Promise<{ id: string }> }) {
  const member = await getMember();
  const { id } = await params;
  const m = await getMontante(id);
  if (!m || m.status !== "open") notFound();
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <p><Link href="/montantes">← Montantes</Link></p>
        <h1>{m.title}</h1>
        <section className="card">
          <p>{m.steps} paliers · {m.cadence === "weekly" ? "hebdo" : "mensuel"}</p>
          <p>Entrée : {m.entryAmount} {m.currency}</p>
          <p style={{ whiteSpace: "pre-wrap" }}>{m.description}</p>
        </section>
        <button className="btn off" type="button" disabled style={{ marginTop: "1rem" }}>Paiement off</button>
      </main>
    </PublicChrome>
  );
}
