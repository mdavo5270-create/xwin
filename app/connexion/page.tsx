import Link from "next/link";
import { loginAction } from "@/app/login/actions";

export default async function ConnexionPage({ searchParams }: { searchParams: Promise<{ err?: string; next?: string }> }) {
  const q = await searchParams;
  return (
    <main className="auth">
      <div className="auth-card">
        <p className="muted">XWIN</p>
        <h1>Connexion</h1>
        {q.err ? <p className="err">{q.err}</p> : null}
        <form action={loginAction}>
          <input type="hidden" name="next" value={q.next ?? "/app"} />
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          <label>Mot de passe<input name="password" type="password" required autoComplete="current-password" /></label>
          <button className="btn" type="submit">Se connecter</button>
        </form>
        <p className="muted"><Link href="/mot-de-passe-oublie">Mot de passe oublié ?</Link></p>
        <p className="muted">Pas encore de compte ? <Link href="/inscription">Créer un compte</Link></p>
      </div>
    </main>
  );
}
