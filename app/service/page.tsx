import Link from "next/link";
import { HubShell } from "@/components/HubShell";
import { LicenseLock } from "@/components/LicenseLock";
import { getMember } from "@/lib/members";
import { getActiveLicense } from "@/lib/licenses";
import { listOffers } from "@/lib/offers";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function ServicePage() {
  await ensureSchema();
  const member = await getMember();
  const license = member ? await getActiveLicense(member.id) : null;
  const rows = await listOffers("service", true);
  return (
    <HubShell member={member} tab="/service">
      <div className="hub-body">
        <h1>Stratégie</h1>
        <p className="muted">Documents liés au compte. Pas de partage.</p>
        {!license ? <LicenseLock title="Documents verrouillés" /> : null}
        {rows.length === 0 ? <p className="empty">Aucun document publié.</p> : rows.map((s) => (
          <Link className="hub-row" key={s.id} href={license ? `/service/${s.id}` : "/abonnement"}>
            <span><strong>{s.title}</strong><em>{license ? `${s.price} ${s.currency}` : "Licence requise"}</em></span>
          </Link>
        ))}
      </div>
    </HubShell>
  );
}
