import { runPronoAutomation } from "@/lib/automation";
import { listActionablePronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

async function runNow() {
  "use server";
  await runPronoAutomation();
  revalidatePath("/pronostics");
  revalidatePath("/");
}

export default async function AdminAutomationPage() {
  await ensureSchema();
  const pronos = await listActionablePronos();
  const pending = pronos.filter((p) => p.result === "pending");
  return (
    <>
      <h1>Automatisation</h1>
      <p className="muted">
        Chaque matin le cron importe le calendrier (PL, Ligue 1, Liga, Serie A, Bundesliga, C1),
        pose 2 tickets par match (1X2 domicile + plus de 2.5), puis le soir solde les scores.
        Tu n’as pas à alimenter à la main. Le bouton lance le cycle tout de suite.
      </p>
      <form action={runNow}><button className="btn" type="submit">Alimenter et solder maintenant</button></form>
      <h2>En attente ({pending.length})</h2>
      {pending.length === 0 ? <p className="empty">Aucun ticket ouvert — lance le cycle pour importer le calendrier.</p> : (
        <div className="admin-tiles">
          {pending.map((p) => (
            <article className="admin-tile" key={p.id}>
              <strong>{p.eventName}</strong>
              <div className="muted">{p.pick} · {p.kickoff || "heure ?"}</div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
