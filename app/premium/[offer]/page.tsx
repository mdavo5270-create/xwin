import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";

const COPY: Record<string, { title: string; details: string }> = {
  journalier: { title: "Pack journalier", details: "Durée 24 h. Pronos premium du jour. Paiement off." },
  hebdomadaire: { title: "Pack hebdomadaire", details: "Durée 7 jours. Paiement off." },
  mensuel: { title: "Abonnement mensuel", details: "30 jours, renouvellement à brancher plus tard. Paiement off." },
};

export default async function OfferPage({ params }: { params: Promise<{ offer: string }> }) {
  const member = await getMember();
  const { offer } = await params;
  const o = COPY[offer];
  if (!o) notFound();
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <p><Link href="/premium">← Premium</Link></p>
        <h1>{o.title}</h1>
        <section className="card"><p>{o.details}</p></section>
        <button className="btn off" type="button" disabled style={{ marginTop: "1rem" }}>Acheter maintenant</button>
      </main>
    </PublicChrome>
  );
}
