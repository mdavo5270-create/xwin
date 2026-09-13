import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";

export default async function AboutPage() {
  const member = await getMember();
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <p className="kicker">Cadre</p>
        <h1>Une cellule d’analyse, pas un bookmaker.</h1>
        <section className="card">
          <h3>Qui publie</h3>
          <p>L’équipe XWIN. Les tickets sortent du back-office, jamais d’un compte anonyme.</p>
        </section>
        <section className="card">
          <h3>Méthode</h3>
          <p>Un événement, un pick, une cote, une mise en unités, un texte. Football en priorité. Les autres sports seulement s’il y a un ticket.</p>
        </section>
        <section className="card">
          <h3>Preuve</h3>
          <p>Le taux de réussite ne compte que les tickets soldés (hit / miss / void). Rien n’est effacé après coup.</p>
        </section>
        <section className="card">
          <h3>Limite</h3>
          <p>18+. Analyse, pas un pari proposé par XWIN. Vous suivez ou non, à votre compte.</p>
        </section>
      </main>
    </PublicChrome>
  );
}
