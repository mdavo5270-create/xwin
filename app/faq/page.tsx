import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";

const Q = [
  ["Comment fonctionne XWIN ?", "L’admin publie match + prono + analyse. Le public voit le gratuit. Le premium reste verrouillé tant que l’offre n’est pas active."],
  ["Comment accéder au premium ?", "Crée un compte puis ouvre /premium. Le paiement est encore coupé."],
  ["Comment sont calculées les stats ?", "Uniquement à partir des pronos soldés en admin."],
  ["Comment contacter XWIN ?", "Page Contact."],
];

export default async function FaqPage() {
  const member = await getMember();
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <h1>FAQ</h1>
        <div className="grid">{Q.map(([q, a]) => (
          <section className="card" key={q}><strong>{q}</strong><p className="muted">{a}</p></section>
        ))}</div>
      </main>
    </PublicChrome>
  );
}
