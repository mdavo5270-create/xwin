import Link from "next/link";
import { HubShell } from "@/components/HubShell";
import { getMember } from "@/lib/members";
import { getActiveLicense } from "@/lib/licenses";
import { listRecentSettledPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

const TELEGRAM = "https://t.me/aetuopz";

export default async function AbonnementPage() {
  await ensureSchema();
  const member = await getMember();
  const license = member ? await getActiveLicense(member.id) : null;
  const recents = await listRecentSettledPronos(6);

  return (
    <HubShell member={member} tab="/abonnement">
      <div className="hub-body">
        <h1>Abonnement</h1>
        <article className="card">
          <p className="muted">Sous réserve de licence. Aucun match ici.</p>
          {member ? (
            <>
              <p><strong>ID compte</strong><br />{member.publicId || "—"}</p>
              <p><strong>Licence</strong><br />{license ? `Active jusqu’au ${new Date(license.endsAt).toLocaleDateString("fr-FR")}` : "Aucune licence active"}</p>
            </>
          ) : (
            <p>Crée un compte pour obtenir un ID. <Link href="/inscription">Inscription</Link></p>
          )}
        </article>
        <article className="card">
          <h2>7 jours ou 30 jours</h2>
          <p>Envoie ton ID sur Telegram. On active la licence à la main. Paiement in-app désactivé.</p>
          <a className="btn" href={TELEGRAM} target="_blank" rel="noreferrer">Ouvrir Telegram</a>
        </article>
        <h2>Derniers résultats</h2>
        {recents.length === 0 ? <p className="empty">Aucun résultat publié.</p> : recents.map((p) => (
          <article className="card" key={p.id}>
            <strong>{p.eventName}</strong>
            <p className="muted">{p.result === "hit" ? "Validé" : "Non validé"} · {p.sport}</p>
          </article>
        ))}
      </div>
    </HubShell>
  );
}
