import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";

export default async function AboutPage() {
  const member = await getMember();
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <h1>À propos</h1>
        <section className="card">
          <p>XWIN publie des analyses et des pronostics construits par l’équipe. Ce n’est pas un bookmaker.</p>
          <p className="muted">Le détail biographique de l’expert sera saisi en admin (CMS), pas inventé ici.</p>
        </section>
      </main>
    </PublicChrome>
  );
}
