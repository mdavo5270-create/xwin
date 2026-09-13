import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
export default async function Page() {
  return (
    <PublicChrome member={await getMember()}>
      <main className="wrap"><h1>Remboursement</h1><section className="card"><p>Aucun encaissement actif. Politique à figée avant le premier paiement.</p></section></main>
    </PublicChrome>
  );
}
