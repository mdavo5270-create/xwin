import { runPronoAutomation } from "@/lib/automation";
import { listActionablePronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { getSettings } from "@/lib/commerce";
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
  const settings = await getSettings();
  return (
    <>
      <h1>Automatisation</h1>
      <p className="muted">
        La machine vérifie d’abord ce qui est déjà prévu aujourd’hui. Si un sport actif a moins de 10 tickets,
        elle complète depuis le calendrier officiel. Dimanche football : cible 16. Sports difficiles (esport, MMA, F1…) ignorés.
        Les tickets difficiles (score exact, 2 sec, handicaps tordus) ne sont pas posés.
        On ne copie aucun site concurrent — uniquement calendrier + patterns de nos propres soldes.
        Dernier passage : {settings.feed_day || "jamais"}.
      </p>
      <form action={runNow}><button className="btn" type="submit">Alimenter et solder maintenant</button></form>
      <h2>En attente ({pending.length})</h2>
      {pending.length === 0 ? <p className="empty">Aucun ticket ouvert.</p> : (
        <div className="admin-tiles">
          {pending.map((p) => (
            <article className="admin-tile" key={p.id}>
              <strong>{p.eventName}</strong>
              <div className="muted">{p.sport} · {p.pick} · {p.kickoff || "?"}</div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
