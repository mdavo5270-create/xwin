import { HubShell } from "@/components/HubShell";
import { getMember } from "@/lib/members";

export const dynamic = "force-dynamic";

export default async function PremiumPage() {
  const member = await getMember();
  return (
    <HubShell member={member} tab="/premium">
      <div className="hub-body">
        <h1>Autre</h1>
        <p className="empty">Chapitre suivant. Rien à afficher ici pour l’instant.</p>
      </div>
    </HubShell>
  );
}
