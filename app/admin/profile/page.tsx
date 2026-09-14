"use client";

import { useState } from "react";
import Link from "next/link";
import { adminHref } from "@/lib/admin-path";

type AdminType = "super" | "moderator" | "analyst";

interface AdminProfile {
  name: string;
  email: string;
  adminType: AdminType;
  lastLogin: string;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile>({
    name: "Admin Utilisateur",
    email: "admin@xwin.local",
    adminType: "super",
    lastLogin: new Date().toISOString(),
  });

  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  const handleProfileChange = (field: keyof AdminProfile, value: unknown) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    // TODO: appel API pour sauvegarder
    console.log("Profil sauvegardé:", profile);
    setEditMode(false);
    alert("Profil mis à jour avec succès");
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      alert("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    if (passwords.new.length < 8) {
      alert("Le mot de passe doit faire au moins 8 caractères");
      return;
    }
    // TODO: appel API pour changer le mot de passe
    console.log("Mot de passe changé");
    setShowPasswordForm(false);
    setPasswords({ current: "", new: "", confirm: "" });
    alert("Mot de passe changé avec succès");
  };

  return (
    <>
      <h1>Profil Admin</h1>

      {/* Profile Info */}
      <div className="card" style={{ maxWidth: "600px", marginTop: "1.5rem" }}>
        <h2>Informations de Profil</h2>

        {!editMode ? (
          <div style={{ marginTop: "1rem" }}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted)" }}>
                Nom Complet
              </label>
              <div style={{ fontWeight: "600", marginTop: "0.25rem" }}>{profile.name}</div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted)" }}>
                Email
              </label>
              <div style={{ fontWeight: "600", marginTop: "0.25rem" }}>{profile.email}</div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted)" }}>
                Type d'Admin
              </label>
              <div style={{ fontWeight: "600", marginTop: "0.25rem" }}>
                {profile.adminType === "super" && "Super Administrateur"}
                {profile.adminType === "moderator" && "Modérateur"}
                {profile.adminType === "analyst" && "Analyste"}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "var(--muted)" }}>
                Dernière Connexion
              </label>
              <div style={{ fontWeight: "600", marginTop: "0.25rem" }}>
                {new Date(profile.lastLogin).toLocaleString("fr-FR")}
              </div>
            </div>

            <button className="btn" onClick={() => setEditMode(true)}>
              Modifier Profil
            </button>
          </div>
        ) : (
          <div style={{ marginTop: "1rem" }}>
            <label>
              Nom Complet
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
              />
            </label>

            <label>
              Type d'Admin
              <select
                value={profile.adminType}
                onChange={(e) => handleProfileChange("adminType", e.target.value as AdminType)}
              >
                <option value="super">Super Administrateur</option>
                <option value="moderator">Modérateur</option>
                <option value="analyst">Analyste</option>
              </select>
            </label>

            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem" }}>
              <button className="btn" onClick={handleSaveProfile}>
                ✓ Sauvegarder
              </button>
              <button className="btn ghost" onClick={() => setEditMode(false)}>
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Security Section */}
      <div className="card" style={{ maxWidth: "600px", marginTop: "1.5rem" }}>
        <h2>Sécurité</h2>

        {!showPasswordForm ? (
          <div style={{ marginTop: "1rem" }}>
            <p className="muted">Modifiez votre mot de passe pour sécuriser votre compte.</p>
            <button className="btn" onClick={() => setShowPasswordForm(true)} style={{ marginTop: "1rem" }}>
              Changer le Mot de Passe
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleChangePassword();
            }}
            style={{ marginTop: "1rem" }}
          >
            <label>
              Mot de passe actuel
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                required
              />
            </label>

            <label>
              Nouveau mot de passe
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                required
              />
            </label>

            <label>
              Confirmer le nouveau mot de passe
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                required
              />
            </label>

            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem" }}>
              <button className="btn" type="submit">
                ✓ Changer
              </button>
              <button className="btn ghost" type="button" onClick={() => setShowPasswordForm(false)}>
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Other Options */}
      <div className="card" style={{ maxWidth: "600px", marginTop: "1.5rem" }}>
        <h2>Autres Options</h2>
        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href={adminHref("settings")} className="btn ghost">
            → Paramètres Système
          </Link>
          <Link href={adminHref()} className="btn ghost">
            ← Retour au Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
