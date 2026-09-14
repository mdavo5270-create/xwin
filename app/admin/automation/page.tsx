import { AdminChrome } from "@/components/AdminChrome";
import { runPronoAutomation } from "@/lib/automation";
import { listActionablePronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

async function runNow() {
  "use server";
  await runPronoAutomation();
  revalidatePath("/admin/automation");
  revalidatePath("/pronostics");
  revalidatePath("/");
}

export default async function AdminAutomationPage() {
  await ensureSchema();
  const pronos = await listActionablePronos();
  const pending = pronos.filter((p) => p.result === "pending");
  return (
    <AdminChrome>
      <h1>Automatisation</h1>
      <p className="muted">
        Publication auto des brouillons dans les 6 h avant le coup d’envoi.
        Solder auto 2 h après le kickoff si le pick est 1 / N / 2 et que TheSportsDB a le score.
      </p>
      <p className="muted">Cron Vercel Hobby : tous les jours à 07:00 UTC. Bouton ci-dessous = tout de suite.</p>
      <form action={runNow}><button className="btn" type="submit">Lancer maintenant</button></form>
      <h2>En attente ({pending.length})</h2>
      {pending.length === 0 ? <p className="empty">Aucun prono à avancer.</p> : (
        <div className="grid">
          {pending.map((p) => (
            <article className="card" key={p.id}>
              <p className="badge">{p.status}</p>
              <h3>{p.eventName}</h3>
              <p className="muted">{p.kickoff || "kickoff non renseigné"} · {p.pick}</p>
            </article>
          ))}
        </div>
      )}
    </AdminChrome>
  );
}
