import { changePasswordAction } from "./actions";

export default async function Page({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const q = await searchParams;
  return (
    <>
      <h1>Sécurité</h1>
      {q.ok ? <p className="card">Mot de passe mis à jour.</p> : null}
      {q.err ? <p className="err">{q.err}</p> : null}
      <form action={changePasswordAction} className="card">
        <label>Nouveau mot de passe (8+)<input name="password" type="password" minLength={8} required /></label>
        <label>Confirmation<input name="confirm" type="password" minLength={8} required /></label>
        <button className="btn" type="submit">Changer</button>
      </form>
    </>
  );
}
