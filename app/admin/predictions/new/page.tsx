import { SPORTS } from "@/lib/sports";
import { createPronoAction } from "@/app/admin/actions";

export default function Page() {
  return (
    <>
      <h1>Ajouter/Modifier un Pronostic</h1>
      <p className="muted">
        Remplissez tous les champs requis. Le formulaire ne peut être modifié qu'avant publication. Après, seul le résultat peut être changé.
      </p>

      <form action={createPronoAction} className="card" style={{ maxWidth: "800px" }}>
        {/* Section Sport & Compétition */}
        <fieldset style={{ marginBottom: "1.5rem" }}>
          <legend style={{ fontWeight: "600", marginBottom: "1rem" }}>Sport & Compétition</legend>

          <label>
            Sport*
            <select name="sport" required>
              <option value="">-- Sélectionner --</option>
              {SPORTS.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Ligue/Compétition*
            <input name="competition" placeholder="Ex: Ligue 1, Premier League" required />
          </label>

          <label>
            Nom de l'Événement*
            <input name="eventName" placeholder="Ex: Paris SG vs Marseille" required />
          </label>

          <label>
            Coup d'Envoi
            <input name="kickoff" type="datetime-local" placeholder="2026-09-20T18:00" />
          </label>
        </fieldset>

        {/* Section Adversaires */}
        <fieldset style={{ marginBottom: "1.5rem" }}>
          <legend style={{ fontWeight: "600", marginBottom: "1rem" }}>Adversaires/Participants</legend>

          <label>
            Joueur/Équipe 1
            <input name="player1" placeholder="Ex: Paris SG" />
          </label>

          <label>
            Joueur/Équipe 2
            <input name="player2" placeholder="Ex: Marseille" />
          </label>
        </fieldset>

        {/* Section Pronostic */}
        <fieldset style={{ marginBottom: "1.5rem" }}>
          <legend style={{ fontWeight: "600", marginBottom: "1rem" }}>Détails du Pronostic</legend>

          <label>
            Pronostic*
            <input name="pick" placeholder="Ex: 1X2=1, Both Score, Over 2.5" required />
          </label>

          <label>
            Cote à Publication*
            <input name="odd" type="number" step="0.01" placeholder="1.85" required />
          </label>

          <label>
            Confiance /10
            <input name="confidence" type="number" min="1" max="10" placeholder="7" />
          </label>

          <label>
            Unités de Mise
            <input name="stakeUnits" type="number" min="0.1" step="0.1" defaultValue="1" />
          </label>

          <label>
            Score Attendu (optionnel)
            <input name="expectedScore" placeholder="Ex: 2-1" />
          </label>
        </fieldset>

        {/* Section Paramètres Avancés */}
        <fieldset style={{ marginBottom: "1.5rem" }}>
          <legend style={{ fontWeight: "600", marginBottom: "1rem" }}>Paramètres Avancés</legend>

          <label>
            Handicap (optionnel)
            <input name="handicap" placeholder="Ex: -1, +1.5" />
          </label>

          <label>
            Politique Appliquée
            <select name="policy">
              <option value="">Aucune</option>
              <option value="push">Push</option>
              <option value="parlay">Parlay</option>
              <option value="hedge">Hedge</option>
            </select>
          </label>

          <label>
            Total (optionnel)
            <input name="total" placeholder="Ex: 2.5, 3.5" type="number" step="0.5" />
          </label>
        </fieldset>

        {/* Section Description */}
        <fieldset style={{ marginBottom: "1.5rem" }}>
          <legend style={{ fontWeight: "600", marginBottom: "1rem" }}>Analyse & Description</legend>

          <label>
            Pourquoi ce Pronostic?*
            <textarea
              name="rationale"
              placeholder="Expliquez votre raisonnement, les facteurs clés, les stats, les news pertinentes..."
              rows={6}
              required
            />
          </label>
        </fieldset>

        {/* Options */}
        <fieldset style={{ marginBottom: "1.5rem" }}>
          <legend style={{ fontWeight: "600", marginBottom: "1rem" }}>Options</legend>

          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input type="checkbox" name="isPaid" style={{ width: "auto" }} />
            <span>Premium (Accès payant)</span>
          </label>
        </fieldset>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
          <button className="btn" type="submit">
            Publier le Pronostic
          </button>
          <button className="btn ghost" type="reset">
            Réinitialiser
          </button>
        </div>
      </form>
    </>
  );
}
