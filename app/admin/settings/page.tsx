"use client";

import { useState } from "react";

interface Settings {
  siteName: string;
  siteUrl: string;
  currency: string;
  defaultLanguage: string;
  maxFreePronostics: number;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  emailNotifications: boolean;
  maxUploadSize: number;
  databaseBackup: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: "XWIN",
    siteUrl: "https://xwin.app",
    currency: "EUR",
    defaultLanguage: "fr",
    maxFreePronostics: 3,
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true,
    maxUploadSize: 10,
    databaseBackup: "2026-09-14T10:30:00Z",
  });

  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof Settings, value: unknown) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Paramètres sauvegardés:", settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <h1>Paramètres Système</h1>

      {saved && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            borderLeft: "4px solid #4caf50",
            borderRadius: "3px",
          }}
        >
          ✓ Paramètres sauvegardés avec succès
        </div>
      )}

      {/* General Settings */}
      <div className="card" style={{ maxWidth: "600px", marginTop: "1.5rem" }}>
        <h2>Paramètres Généraux</h2>

        {!editMode ? (
          <div style={{ marginTop: "1rem" }}>
            <div style={{ marginBottom: "1rem" }}>
              <label className="muted" style={{ fontSize: "0.85rem" }}>
                Nom du Site
              </label>
              <div style={{ fontWeight: "600", marginTop: "0.25rem" }}>
                {settings.siteName}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="muted" style={{ fontSize: "0.85rem" }}>
                URL du Site
              </label>
              <div style={{ fontWeight: "600", marginTop: "0.25rem" }}>
                {settings.siteUrl}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="muted" style={{ fontSize: "0.85rem" }}>
                Devise par Défaut
              </label>
              <div style={{ fontWeight: "600", marginTop: "0.25rem" }}>
                {settings.currency}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="muted" style={{ fontSize: "0.85rem" }}>
                Langue par Défaut
              </label>
              <div style={{ fontWeight: "600", marginTop: "0.25rem" }}>
                {settings.defaultLanguage === "fr" ? "Français" : settings.defaultLanguage}
              </div>
            </div>

            <button className="btn" onClick={() => setEditMode(true)}>
              Modifier
            </button>
          </div>
        ) : (
          <div style={{ marginTop: "1rem" }}>
            <label>
              Nom du Site
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange("siteName", e.target.value)}
              />
            </label>

            <label>
              URL du Site
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => handleChange("siteUrl", e.target.value)}
              />
            </label>

            <label>
              Devise
              <select
                value={settings.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="XOF">XOF (FCFA)</option>
              </select>
            </label>

            <label>
              Langue
              <select
                value={settings.defaultLanguage}
                onChange={(e) => handleChange("defaultLanguage", e.target.value)}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </label>

            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem" }}>
              <button className="btn" onClick={() => { setEditMode(false); handleSave(); }}>
                ✓ Sauvegarder
              </button>
              <button className="btn ghost" onClick={() => setEditMode(false)}>
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content Settings */}
      <div className="card" style={{ maxWidth: "600px", marginTop: "1.5rem" }}>
        <h2>Configuration du Contenu</h2>

        <div style={{ marginTop: "1rem" }}>
          <label>
            Max Pronostics Gratuits par Jour
            <input
              type="number"
              value={settings.maxFreePronostics}
              onChange={(e) => handleChange("maxFreePronostics", parseInt(e.target.value))}
            />
          </label>

          <label>
            Taille Max d'Upload (MB)
            <input
              type="number"
              value={settings.maxUploadSize}
              onChange={(e) => handleChange("maxUploadSize", parseInt(e.target.value))}
            />
          </label>

          <button className="btn ghost" onClick={handleSave} style={{ marginTop: "1rem" }}>
            Appliquer
          </button>
        </div>
      </div>

      {/* System Settings */}
      <div className="card" style={{ maxWidth: "600px", marginTop: "1.5rem" }}>
        <h2>Système</h2>

        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
              style={{ width: "auto" }}
            />
            <span>Mode Maintenance (désactive l'accès public)</span>
          </label>

          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={settings.allowRegistrations}
              onChange={(e) => handleChange("allowRegistrations", e.target.checked)}
              style={{ width: "auto" }}
            />
            <span>Autoriser les Inscriptions</span>
          </label>

          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleChange("emailNotifications", e.target.checked)}
              style={{ width: "auto" }}
            />
            <span>Notifications par Email Activées</span>
          </label>

          <button className="btn ghost" onClick={handleSave} style={{ marginTop: "1rem" }}>
            Appliquer
          </button>
        </div>
      </div>

      {/* Database & Backup */}
      <div className="card" style={{ maxWidth: "600px", marginTop: "1.5rem" }}>
        <h2>Base de Données</h2>

        <div style={{ marginTop: "1rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label className="muted" style={{ fontSize: "0.85rem" }}>
              Dernier Backup
            </label>
            <div style={{ fontWeight: "600", marginTop: "0.25rem" }}>
              {new Date(settings.databaseBackup).toLocaleString("fr-FR")}
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn ghost" onClick={() => alert("Backup en cours...")}>
              🔄 Créer un Backup
            </button>
            <button
              className="btn ghost"
              onClick={() => alert("Téléchargement du backup...")}
            >
              ⬇️ Télécharger le Dernier
            </button>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "rgba(33, 150, 243, 0.1)",
          borderLeft: "4px solid #2196f3",
          borderRadius: "3px",
          maxWidth: "600px",
        }}
      >
        <p className="muted" style={{ margin: 0 }}>
          🔒 Les variables d'environnement et les secrets (clés API, tokens) restent stockés dans
          Vercel ou votre système d'hébergement pour des raisons de sécurité.
        </p>
      </div>
    </>
  );
}

