import { countAllPronos } from "@/lib/store";
import { getDashboardStats } from "@/lib/admin-data";
import { ensureSchema } from "@/lib/schema";
import { adminHref } from "@/lib/admin-path";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await ensureSchema();
  const stats = await getDashboardStats();

  return (
    <>
      <h1>Tableau de Bord</h1>

      {/* Main Stats Grid */}
      <div className="grid three" style={{ marginTop: "1.5rem" }}>
        <div className="card">
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Utilisateurs Inscrits</div>
        </div>
        <div className="card">
          <div className="stat-value">{stats.totalRegistrations}</div>
          <div className="stat-label">Inscriptions Aujourd'hui</div>
        </div>
        <div className="card">
          <div className="stat-value">{stats.dailyVisits}</div>
          <div className="stat-label">Visites Aujourd'hui</div>
        </div>
      </div>

      {/* Pronos & Sales Stats */}
      <div className="grid three" style={{ marginTop: "1rem" }}>
        <div className="card">
          <div className="stat-value">{stats.totalPronos}</div>
          <div className="stat-label">Pronostics Actifs</div>
        </div>
        <div className="card">
          <div className="stat-value">{stats.clickedBuy}</div>
          <div className="stat-label">Clics "Acheter"</div>
        </div>
        <div className="card">
          <div className="stat-value">{stats.completedSales}</div>
          <div className="stat-label">Ventes Conclues</div>
        </div>
      </div>

      {/* Time on Site Stats */}
      <div className="grid two" style={{ marginTop: "1rem" }}>
        <div className="card">
          <div className="stat-value">{stats.minTimeOnSite}s</div>
          <div className="stat-label">Temps Min. sur Site</div>
        </div>
        <div className="card">
          <div className="stat-value">{stats.avgTimeOnSite}s</div>
          <div className="stat-label">Temps Moyen sur Site</div>
        </div>
      </div>

      {/* Top Countries */}
      {stats.topCountries.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Utilisateurs par Pays</h2>
          <div className="grid auto">
            {stats.topCountries.map((country) => (
              <div className="card" key={country.country}>
                <div className="stat-value">{country.count}</div>
                <div className="stat-label">{country.country}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link href={adminHref("predictions")} className="btn">
          → Gérer les Pronostics
        </Link>
        <Link href={adminHref("subscriptions")} className="btn ghost">
          → Abonnements
        </Link>
        <Link href={adminHref("users")} className="btn ghost">
          → Utilisateurs
        </Link>
      </div>
    </>
  );
}
