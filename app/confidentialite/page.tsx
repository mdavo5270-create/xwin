import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
export default async function Page() {
  return (
    <PublicChrome member={await getMember()}>
      <main className="wrap"><h1>Confidentialité</h1><section className="card"><p>Compte : email, nom, hash mot de passe. Pas de vente de données.</p></section></main>
    </PublicChrome>
  );
}
