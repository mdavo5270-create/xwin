import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";

const OFFERS = [
  { slug: "journalier", title: "Pack journalier", text: "Pronos premium du jour. Prix à confirmer." },
  { slug: "hebdomadaire", title: "Pack hebdomadaire", text: "7 jours d’accès premium. Prix à confirmer." },
  { slug: "mensuel", title: "Abonnement mensuel", text: "Pronos + montantes du mois. Prix à confirmer." },
];

export default async function PremiumPage() {
  const member = await getMember();
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <h1>Premium</h1>
        <p className="muted">Accès aux pronostics exclusifs. Encaissement désactivé.</p>
        <div className="grid three">
          {OFFERS.map((o) => (
            <Link key={o.slug} className="card" href={`/premium/${o.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
              <h2>{o.title}</h2>
              <p>{o.text}</p>
              <span className="btn off">Choisir</span>
            </Link>
          ))}
        </div>
      </main>
    </PublicChrome>
  );
}
