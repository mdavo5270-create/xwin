"use client";

import { useState } from "react";

interface Subscriber {
  id: string;
  email: string;
  name: string;
  startDate: string;
  renewalDate: string;
  status: "active" | "paused" | "cancelled";
  totalAmount: number;
}

interface SubscriptionStats {
  active: number;
  paused: number;
  cancelled: number;
  totalRevenue: number;
  avgDuration: number;
}

export default function SubscriptionsPage() {
  // Monthly subscriptions
  const [monthlySubscribers, setMonthlySubscribers] = useState<Subscriber[]>([
    {
      id: "m1",
      email: "john@example.com",
      name: "John Doe",
      startDate: "2026-08-14",
      renewalDate: "2026-10-14",
      status: "active",
      totalAmount: 69.99,
    },
    {
      id: "m2",
      email: "jane@example.com",
      name: "Jane Smith",
      startDate: "2026-07-14",
      renewalDate: "2026-10-14",
      status: "active",
      totalAmount: 139.98,
    },
  ]);

  // Weekly subscriptions
  const [weeklySubscribers, setWeeklySubscribers] = useState<Subscriber[]>([
    {
      id: "w1",
      email: "mike@example.com",
      name: "Mike Johnson",
      startDate: "2026-09-07",
      renewalDate: "2026-09-21",
      status: "active",
      totalAmount: 19.99,
    },
  ]);

  const [selectedTab, setSelectedTab] = useState<"monthly" | "weekly">("monthly");

  const currentSubscribers = selectedTab === "monthly" ? monthlySubscribers : weeklySubscribers;
  const setCurrentSubscribers = selectedTab === "monthly" ? setMonthlySubscribers : setWeeklySubscribers;

  // Calculate stats
  const stats: SubscriptionStats = {
    active: currentSubscribers.filter((s) => s.status === "active").length,
    paused: currentSubscribers.filter((s) => s.status === "paused").length,
    cancelled: currentSubscribers.filter((s) => s.status === "cancelled").length,
    totalRevenue: currentSubscribers.reduce((sum, s) => sum + s.totalAmount, 0),
    avgDuration: 30, // placeholder
  };

  const handleStatusChange = (id: string, newStatus: "active" | "paused" | "cancelled") => {
    setCurrentSubscribers(
      currentSubscribers.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const reserved = currentSubscribers.filter((s) => s.status !== "cancelled").length;

  return (
    <>
      <h1>Abonnements</h1>

      {/* Tabs */}
      <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", borderBottom: "1px solid var(--border)" }}>
        <button
          onClick={() => setSelectedTab("monthly")}
          style={{
            padding: "0.75rem 1.5rem",
            border: "none",
            background: selectedTab === "monthly" ? "var(--bg-alt)" : "transparent",
            cursor: "pointer",
            fontWeight: selectedTab === "monthly" ? "600" : "normal",
            borderBottom: selectedTab === "monthly" ? "2px solid var(--accent)" : "transparent",
            marginBottom: "-1px",
          }}
        >
          📅 Mensuel
        </button>
        <button
          onClick={() => setSelectedTab("weekly")}
          style={{
            padding: "0.75rem 1.5rem",
            border: "none",
            background: selectedTab === "weekly" ? "var(--bg-alt)" : "transparent",
            cursor: "pointer",
            fontWeight: selectedTab === "weekly" ? "600" : "normal",
            borderBottom: selectedTab === "weekly" ? "2px solid var(--accent)" : "transparent",
            marginBottom: "-1px",
          }}
        >
          📆 Hebdomadaire
        </button>
      </div>

      {/* Stats */}
      <div className="grid three" style={{ marginTop: "1.5rem" }}>
        <div className="card">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Abonnés Actifs</div>
        </div>
        <div className="card">
          <div className="stat-value">{stats.totalRevenue.toFixed(2)}</div>
          <div className="stat-label">Revenus Totaux</div>
        </div>
        <div className="card">
          <div className="stat-value">{reserved}</div>
          <div className="stat-label">Réservés (non annulés)</div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid two" style={{ marginTop: "1rem" }}>
        <div className="card">
          <div className="stat-value">{stats.paused}</div>
          <div className="stat-label">En Pause</div>
        </div>
        <div className="card">
          <div className="stat-value">{stats.cancelled}</div>
          <div className="stat-label">Annulés</div>
        </div>
      </div>

      {/* Subscribers List */}
      <div style={{ marginTop: "2rem" }}>
        <h2>
          {selectedTab === "monthly" ? "Abonnés Mensuels" : "Abonnés Hebdomadaires"}
        </h2>

        {currentSubscribers.length === 0 ? (
          <p className="empty">Aucun abonné pour cette période.</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "1rem" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Nom</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Date Début</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Renouvellement</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Montant</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentSubscribers.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.75rem" }}>{sub.name}</td>
                    <td style={{ padding: "0.75rem", fontSize: "0.85rem" }}>{sub.email}</td>
                    <td style={{ padding: "0.75rem", fontSize: "0.85rem" }}>
                      {new Date(sub.startDate).toLocaleDateString("fr-FR")}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.85rem" }}>
                      {new Date(sub.renewalDate).toLocaleDateString("fr-FR")}
                    </td>
                    <td style={{ padding: "0.75rem", fontWeight: "600" }}>
                      {sub.totalAmount}€
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <select
                        value={sub.status}
                        onChange={(e) =>
                          handleStatusChange(
                            sub.id,
                            e.target.value as "active" | "paused" | "cancelled"
                          )
                        }
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.85rem",
                          borderRadius: "3px",
                          border: "1px solid var(--border)",
                          backgroundColor:
                            sub.status === "active"
                              ? "rgba(76, 175, 80, 0.1)"
                              : sub.status === "paused"
                              ? "rgba(255, 193, 7, 0.1)"
                              : "rgba(244, 67, 54, 0.1)",
                        }}
                      >
                        <option value="active">Actif</option>
                        <option value="paused">En Pause</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <button
                        className="btn ghost"
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.25rem 0.5rem",
                        }}
                        onClick={() => alert("Détails de l'abonné: " + sub.name)}
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

