import { getMember } from "@/lib/members";
import { redirect } from "next/navigation";
import { updateProfileAction } from "./actions";

export default async function Page({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const m = await getMember();
  if (!m) redirect("/connexion");
  const q = await searchParams;
  return (
    <>
      <h1>Profil</h1>
      {q.ok ? <p className="card">Enregistré.</p> : null}
      <form action={updateProfileAction} className="card">
        <label>Nom<input name="name" defaultValue={m.name} required /></label>
        <label>Email<input value={m.email} disabled /></label>
        <button className="btn" type="submit">Modifier</button>
      </form>
    </>
  );
}
