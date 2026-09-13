import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
export default async function Page() {
  return (
    <PublicChrome member={await getMember()}>
      <main className="wrap"><h1>Mentions légales</h1><section className="card"><p>XWIN — analyses et pronostics. Éditeur à compléter en admin.</p></section></main>
    </PublicChrome>
  );
}
