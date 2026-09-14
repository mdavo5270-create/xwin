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
        Le cron publie les brouillons dans les 6 h avant le coup d’envoi, puis solde les tickets 1N2
        dès que TheSportsDB a le score. En fin de journée, un second passage écrit le bilan du jour.
        Hobby Vercel = deux crons par jour, pas toutes les 5 heures — le bouton ci-dessous lance le cycle tout de suite.
      </p>
      <form action={runNow}><button className="btn" type="submit">Lancer maintenant</button></form>
      <h2>En attente ({pending.length})</h2>
      {pending.length === 0 ? <p className="empty">Aucun prono à avancer.</p> : (
        <div className="admin-tiles">
          {pending.map((p) => (
            <article className="admin-tile" key={p.id}>
              <strong>{p.eventName}</strong>
              <div className="muted">{p.status} · {p.kickoff || "kickoff non renseigné"} · {p.pick}</div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
