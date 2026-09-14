import { notFound, redirect } from "next/navigation";
import { HubShell } from "@/components/HubShell";
import { getMember } from "@/lib/members";
import { getActiveLicense } from "@/lib/licenses";
import { getOffer } from "@/lib/offers";
import { ensureSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function StrategyDocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await ensureSchema();
  const member = await getMember();
  if (!member) redirect("/connexion?next=/service");
  const license = await getActiveLicense(member.id);
  if (!license) redirect("/abonnement");
  const doc = await getOffer(id);
  if (!doc || doc.type !== "service") notFound();
  const mark = `Document destiné au compte ${member.publicId}. Ne pas partager.`;
  return (
    <HubShell member={member} tab="/service">
      <div className="hub-body">
        <h1>{doc.title}</h1>
        <p className="muted">{mark}</p>
        <article className="card" style={{ userSelect: "none" }}>
          <p>{doc.description || "Document stratégie."}</p>
        </article>
        <a className="btn" href={`/service/${doc.id}/fichier`} download>
          Télécharger (marqué {member.publicId})
        </a>
      </div>
    </HubShell>
  );
}
