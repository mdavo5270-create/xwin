import Link from "next/link";
import { getMember } from "@/lib/members";
import { redirect } from "next/navigation";
import { listFavorites } from "@/lib/favorites";

export const dynamic = "force-dynamic";

export default async function Page() {
  const member = await getMember();
  if (!member) redirect("/connexion");
  const rows = await listFavorites(member.id);
  return (
    <>
      <h1>Favoris</h1>
      {rows.length === 0 ? <p className="empty">Aucun favori. Ajoute-les depuis une fiche prono une fois connecté.</p> : (
        <div className="grid">{rows.map((p) => (
          <Link key={p.id} className="card" href={`/pronostics/${p.id}`}>
            <strong>{p.eventName}</strong>
            <div className="muted">{p.competition}</div>
          </Link>
        ))}</div>
      )}
    </>
  );
}
