import { runPronoAutomation } from "@/lib/automation";
import { listActionablePronos } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { getSettings } from "@/lib/commerce";
import { hasDatabase } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function runNow() {
  "use server";
  await runPronoAutomation();
  revalidatePath("/pronostics");
  revalidatePath("/");
}

export default async function AdminAutomationPage() {
  if (!hasDatabase()) {
    return (
      <>
        <h1>Automatisation</h1>
        <p className="empty">Base non configurée sur cet hébergeur.</p>
      </>
    );
  }
  await ensureSchema();
  const pronos = await listActionablePronos();
  const pending = pronos.filter((p) => p.result === "pending");
  const settings = await getSettings();
  return (
    <>
      <h1>Automatisation</h1>
      <p className="muted">Dernier passage : {settings.feed_day || "jamais"}.</p>
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
