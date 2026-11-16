import Link from "next/link";
import { HubShell } from "@/components/HubShell";
import { getMember } from "@/lib/members";
import { getActiveLicense } from "@/lib/licenses";
import { listRecentSettledPronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { activateLicenseAction } from "./actions";
import { PayForm } from "./PayForm";

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
          <h2>Payer par MTN MoMo</h2>
          <p className="muted">Bénin · SasPay · réseau mtn_bj</p>
          {member ? (
            <PayForm />
          ) : (
            <p className="muted">
              <Link href="/connexion?next=/abonnement">Connecte-toi</Link> pour payer.
            </p>
          )}
        </article>

        <article className="card">
          <h2>Activer un code licence</h2>
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
          <h2>Aide</h2>
          <p className="muted">Si le push MTN n’arrive pas, écris sur Telegram avec ton ID compte.</p>
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
