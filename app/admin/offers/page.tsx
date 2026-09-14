"use client";

import { useState } from "react";

interface Strategy {
  id: string;
  name: string;
  description: string;
  type: "daily" | "weekly" | "monthly";
  price: number;
  currency: string;
  maxUsers?: number;
  paymentRules: string;
  termsUrl?: string;
  active: boolean;
}

export default function OffersPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: "1",
      name: "Accès Journalier",
      description: "Accès illimité pour 24 heures",
      type: "daily",
      price: 4.99,
      currency: "EUR",
      paymentRules:
        "Paiement en une seule fois. Accès révoqué après 24h si non renouvelé.",
      termsUrl: "/terms/daily",
      active: true,
    },
    {
      id: "2",
      name: "Abonnement Hebdomadaire",
      description: "Accès illimité pour 7 jours",
      type: "weekly",
      price: 19.99,
      currency: "EUR",
      paymentRules:
        "Paiement hebdomadaire automatique. Annulation possible à tout moment.",
      termsUrl: "/terms/weekly",
      active: true,
    },
    {
      id: "3",
      name: "Abonnement Mensuel",
      description: "Accès illimité pour 30 jours",
      type: "monthly",
      price: 69.99,
      currency: "EUR",
      paymentRules:
        "Paiement mensuel automatique. Annulation possible à tout moment avec effet immédiat.",
      termsUrl: "/terms/monthly",
      active: true,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Strategy>>({
    type: "monthly",
    currency: "EUR",
    active: true,
  });

  const handleEditStart = (strategy: Strategy) => {
    setFormData(strategy);
    setEditingId(strategy.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingId) {
      setStrategies(
        strategies.map((s) => (s.id === editingId ? { ...s, ...formData } : s))
      );
    } else {
      setStrategies([
        ...strategies,
        {
          id: String(Date.now()),
          name: formData.name || "",
          description: formData.description || "",
          type: formData.type || "monthly",
          price: formData.price || 0,
          currency: formData.currency || "EUR",
          paymentRules: formData.paymentRules || "",
          active: formData.active !== false,
        },
      ]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ type: "monthly", currency: "EUR", active: true });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <>
      <h1>Offres & Stratégies</h1>

      {/* Add New Strategy */}
      {!showForm ? (
        <button className="btn" onClick={() => setShowForm(true)} style={{ marginTop: "1.5rem" }}>
          + Nouvelle Stratégie
        </button>
      ) : (
        <div className="card" style={{ maxWidth: "600px", marginTop: "1.5rem" }}>
          <h2>{editingId ? "Modifier la Stratégie" : "Nouvelle Stratégie"}</h2>

          <label>
            Nom de la Stratégie*
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Abonnement Mensuel"
              required
            />
          </label>

          <label>
            Description*
            <input
              type="text"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Accès illimité pour 30 jours"
              required
            />
          </label>

          <label>
            Type de Durée*
            <select
              value={formData.type || "monthly"}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as Strategy["type"] })
              }
            >
              <option value="daily">Journalier</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
            </select>
          </label>

          <label>
            Prix*
            <input
              type="number"
              step="0.01"
              value={formData.price || ""}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              placeholder="99.99"
              required
            />
          </label>

          <label>
            Devise
            <select
              value={formData.currency || "EUR"}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </label>

          <label>
            Limite d'Utilisateurs (optionnel)
            <input
              type="number"
              value={formData.maxUsers || ""}
              onChange={(e) => setFormData({ ...formData, maxUsers: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="Illimité si vide"
            />
          </label>

          <label>
            Règles de Paiement*
            <textarea
              value={formData.paymentRules || ""}
              onChange={(e) => setFormData({ ...formData, paymentRules: e.target.value })}
              placeholder="Décrivez les conditions de paiement, renouvellement automatique, annulation, etc."
              rows={4}
              required
            />
          </label>

          <label>
            URL des Conditions
            <input
              type="url"
              value={formData.termsUrl || ""}
              onChange={(e) => setFormData({ ...formData, termsUrl: e.target.value })}
              placeholder="https://..."
            />
          </label>

          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={formData.active !== false}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              style={{ width: "auto" }}
            />
            <span>Actif</span>
          </label>

          <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem" }}>
            <button className="btn" onClick={handleSave}>
              Sauvegarder
            </button>
            <button className="btn ghost" onClick={resetForm}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* List of Strategies */}
      <div style={{ marginTop: "2rem" }}>
        <h2>Stratégies Actuelles</h2>
        {strategies.length === 0 ? (
          <p className="empty">Aucune stratégie.</p>
        ) : (
          <div className="grid">
            {strategies.map((strategy) => (
              <div key={strategy.id} className="card">
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>{strategy.name}</strong>
                  <div className="muted" style={{ fontSize: "0.85rem" }}>
                    {strategy.description}
                  </div>
                </div>

                <div style={{ marginBottom: "0.5rem" }}>
                  <div className="stat-value">
                    {strategy.price} {strategy.currency}
                  </div>
                  <div className="stat-label">
                    {strategy.type === "daily" && "Journalier"}
                    {strategy.type === "weekly" && "Hebdomadaire"}
                    {strategy.type === "monthly" && "Mensuel"}
                  </div>
                </div>

                <div style={{ marginBottom: "1rem", fontSize: "0.85rem", lineHeight: "1.5" }}>
                  {strategy.paymentRules}
                </div>

                <div style={{ marginBottom: "1rem", display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                  {strategy.active ? (
                    <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", backgroundColor: "var(--bg-alt)", borderRadius: "3px" }}>
                      ✓ Actif
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", backgroundColor: "var(--bg-alt)", borderRadius: "3px", opacity: 0.5 }}>
                      Inactif
                    </span>
                  )}
                  {strategy.maxUsers && (
                    <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", backgroundColor: "var(--bg-alt)", borderRadius: "3px" }}>
                      Max {strategy.maxUsers} users
                    </span>
                  )}
                </div>

                <button
                  className="btn ghost"
                  style={{ width: "100%", fontSize: "0.9rem" }}
                  onClick={() => handleEditStart(strategy)}
                >
                  Modifier
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

