import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";

const Q = [
  ["Comment fonctionne XWIN ?", "L’admin publie match + prono + analyse. Le public voit le gratuit. Le premium reste verrouillé tant que l’offre n’est pas active."],
  ["Comment accéder aux pronostics premium ?", "Compte + page Premium. Paiement encore coupé."],
  ["Comment acheter une offre ?", "Boutons désactivés jusqu’à l’activation du paiement."],
  ["Comment fonctionne un abonnement ?", "Durée affichée sur /premium. Renouvellement à brancher plus tard."],
  ["Comment consulter ses achats ?", "Espace membre → Achats. Vide tant qu’aucun paiement n’existe."],
  ["Que signifie le niveau de confiance ?", "Note /10 saisie par l’équipe à la publication."],
  ["Comment sont calculées les statistiques ?", "Hits / (hits + misses) sur les pronos soldés. Void exclus. Seuil de lecture : 30 soldés."],
  ["Comment contacter XWIN ?", "Page Contact. Le message est enregistré en base."],
];

export default async function FaqPage() {
  return (
    <PublicChrome member={await getMember()}>
      <main className="wrap">
        <h1>FAQ</h1>
        <div className="grid">{Q.map(([q, a]) => (
          <section className="card" key={q}><strong>{q}</strong><p className="muted">{a}</p></section>
        ))}</div>
      </main>
    </PublicChrome>
  );
}
