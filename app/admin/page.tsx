import { getDashboardStats } from "@/lib/admin-data";
import { getPerformanceSummary } from "@/lib/store";
import { ensureSchema } from "@/lib/schema";
import { adminHref } from "@/lib/admin-path";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await ensureSchema();
  const [stats, perf] = await Promise.all([getDashboardStats(), getPerformanceSummary()]);
  const cards = [
    [stats.totalUsers, "Utilisateurs inscrits"],
    [stats.totalRegistrations, "Inscriptions aujourd’hui"],
    [stats.dailyVisits, "Visiteurs aujourd’hui"],
    [perf.pending, "Pronos actifs"],
    [perf.settled, "Pronos soldés"],
    [stats.completedSales, "Ventes conclues"],
    [`${stats.minTimeOnSite}s`, "Temps min. sur le site"],
    [`${stats.avgTimeOnSite}s`, "Temps moyen sur le site"],
  ] as const;
  return (
    <>
      <h1>Vue générale</h1>
      <p className="muted">Chiffres réels. Visites et temps de session restent à 0 tant que le compteur de pages n’est pas branché.</p>
      <div className="admin-kpis">
        {cards.map(([value, label]) => (
          <div className="admin-kpi" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="admin-actions">
        <Link className="btn" href={adminHref("predictions/new")}>Nouveau prono</Link>
        <Link className="btn ghost" href={adminHref("predictions")}>Tous les pronos</Link>
        <Link className="btn ghost" href={adminHref("users")}>Utilisateurs</Link>
      </div>
    </>
  );
}
