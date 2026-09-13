import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
export default async function Page() {
  return (
    <PublicChrome member={await getMember()}>
      <main className="wrap"><h1>Jeu responsable</h1><section className="card"><p>18+. XWIN n’est pas un opérateur de paris. Si tu joues ailleurs, fixe des limites.</p></section></main>
    </PublicChrome>
  );
}
