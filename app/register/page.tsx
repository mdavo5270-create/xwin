import Link from "next/link";
import { registerAction } from "./actions";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string }>;
}) {
  const q = await searchParams;
  return (
    <main className="auth">
      <div className="auth-card">
        <p className="eyebrow">XWIN</p>
        <h1>Créer un compte</h1>
        <p className="muted">Email + mot de passe. Les données vont dans Neon.</p>
        {q.err ? <p className="err">{q.err}</p> : null}
        <form action={registerAction}>
          <label>Nom<input name="name" required autoComplete="name" /></label>
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          <label>Mot de passe (8+)<input name="password" type="password" minLength={8} required autoComplete="new-password" /></label>
          <button className="btn" type="submit">Créer le compte</button>
        </form>
        <p className="muted">
          Déjà inscrit ? <Link href="/login">Connexion</Link>
        </p>
      </div>
    </main>
  );
}
