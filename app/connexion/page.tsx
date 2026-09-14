import Link from "next/link";
import { loginAction } from "./actions";
import { registerAction } from "@/app/inscription/actions";
import "../gate.css";

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string; next?: string; tab?: string }>;
}) {
  const q = await searchParams;
  const signup = q.tab === "inscription";
  return (
    <main className="gate">
      <div className="gate-auth">
        <h1>Xwin</h1>
        <p className="gate-tag">Xwin - Votre partenaire de confiance</p>
        <div className="gate-switch">
          <Link className={!signup ? "on" : ""} href="/connexion">Connexion</Link>
          <Link className={signup ? "on" : ""} href="/connexion?tab=inscription">Inscription</Link>
        </div>
        {q.err ? <p className="err">{q.err}</p> : null}
        {signup ? (
          <form action={registerAction}>
            <label className="gate-field"><input name="firstName" required placeholder="Prénom" autoComplete="given-name" /></label>
            <label className="gate-field"><input name="lastName" required placeholder="Nom" autoComplete="family-name" /></label>
            <label className="gate-field"><input name="email" type="email" required placeholder="Adresse email" autoComplete="email" /></label>
            <label className="gate-field"><input name="password" type="password" minLength={8} required placeholder="Mot de passe" /></label>
            <label className="gate-field"><input name="confirm" type="password" minLength={8} required placeholder="Confirmer mot de passe" /></label>
            <button className="gate-cta" type="submit">S'inscrire</button>
          </form>
        ) : (
          <form action={loginAction}>
            <input type="hidden" name="next" value={q.next ?? "/accueil"} />
            <label className="gate-field"><input name="email" type="email" required placeholder="Email" autoComplete="email" /></label>
            <label className="gate-field"><input name="password" type="password" required placeholder="Mot de passe" autoComplete="current-password" /></label>
            <button className="gate-cta" type="submit">Se Connecter</button>
          </form>
        )}
        <p className="gate-foot">
          {signup ? (
            <>Déjà un compte ? <Link href="/connexion">Se connecter</Link></>
          ) : (
            <>Pas encore de compte ? <Link href="/connexion?tab=inscription">Créer un compte</Link></>
          )}
        </p>
        <p className="gate-legal">
          En continuant, vous acceptez les <Link href="/conditions">Conditions d'utilisation</Link> et la <Link href="/confidentialite">Politique de confidentialité</Link>
        </p>
      </div>
    </main>
  );
}
