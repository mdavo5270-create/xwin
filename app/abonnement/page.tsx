import Link from "next/link";
import { HubShell } from "@/components/HubShell";
import { getMember } from "@/lib/members";
import { getActiveLicense } from "@/lib/licenses";
import { listRecentSettledPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { activateLicenseAction } from "./actions";

export const dynamic = "force-dynamic";

const TELEGRAM = "https://t.me/aetuopz";

export default async function AbonnementPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string }>;
}) {
  await ensureSchema();
  const member = await getMember();
  const license = member ? await getActiveLicense(member.id) : null;
  const recents = await listRecentSettledPronos(6);
  const q = await searchParams;

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
          <h2>Activer une licence</h2>
          {q.ok ? <p>Licence activée.</p> : null}
          {q.err ? <p>{q.err}</p> : null}
          {member ? (
            <form action={activateLicenseAction}>
              <label>Code licence<input name="code" placeholder="LIC-A1B2C3" required autoComplete="off" /></label>
              <button className="btn" type="submit">Activer</button>
            </form>
          ) : (
            <p className="muted">Connecte-toi pour taper le code.</p>
          )}
        </article>
        <article className="card">
          <h2>7 jours ou 30 jours</h2>
          <p>Envoie ton ID sur Telegram. Tu reçois un code. Tu le tapes ci-dessus. Paiement in-app désactivé.</p>
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
