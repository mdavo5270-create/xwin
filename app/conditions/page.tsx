import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
export default async function Page() {
  return (
    <PublicChrome member={await getMember()}>
      <main className="wrap"><h1>Conditions</h1><section className="card"><p>18+. Contenu informatif. XWIN n’accepte pas de mises.</p></section></main>
    </PublicChrome>
  );
}
