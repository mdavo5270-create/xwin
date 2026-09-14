import Link from "next/link";
import { SPORTS } from "@/lib/sports";
import { adminHref } from "@/lib/admin-path";
import type { Prono } from "@/lib/types";

export function PronoForm({
  action,
  p,
  submitLabel,
}: {
  action: (form: FormData) => Promise<void>;
  p?: Prono;
  submitLabel: string;
}) {
  const parts = (p?.eventName || "").split(/\s+vs\.?\s+/i);
  const home = parts[0] || "";
  const away = parts[1] || "";
  const kick = p?.kickoff ? new Date(p.kickoff) : null;
  const dateVal = kick && !Number.isNaN(kick.getTime()) ? kick.toISOString().slice(0, 10) : "";
  const timeVal = kick && !Number.isNaN(kick.getTime()) ? kick.toISOString().slice(11, 16) : "";
  return (
    <form action={action} className="prono-form">
      {p ? <input type="hidden" name="id" value={p.id} /> : null}

      <section className="prono-block">
        <h2>Match</h2>
        <div className="prono-grid">
          <label>Sport
            <select name="sport" defaultValue={p?.sport || ""} required>
              <option value="">Choisir</option>
              {SPORTS.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}
            </select>
          </label>
          <label>Compétition
            <input name="competition" defaultValue={p?.competition} placeholder="Ligue 1, ATP, NBA…" required />
          </label>
          <label>Équipe / joueur 1
            <input name="home" defaultValue={home} placeholder="Domicile" required />
          </label>
          <label>Équipe / joueur 2
            <input name="away" defaultValue={away} placeholder="Extérieur" required />
          </label>
          <label>Date du coup d’envoi
            <input name="kickoffDate" type="date" defaultValue={dateVal} required />
          </label>
          <label>Heure
            <input name="kickoffTime" type="time" defaultValue={timeVal} required />
          </label>
        </div>
      </section>

      <section className="prono-block">
        <h2>Marché</h2>
        <p className="muted">Le « pick », c’est simplement le choix publié : 1, nul ou 2 — ou un autre marché.</p>
        <label>Catégorie
          <select name="market" defaultValue="1x2">
            <option value="1x2">Résultat du match (1 / Nul / 2)</option>
            <option value="over">Total de buts / points</option>
            <option value="btts">Les deux équipes marquent</option>
            <option value="ah">Handicap</option>
          </select>
        </label>
        <fieldset className="prono-picks">
          <legend>Choix</legend>
          <label><input type="radio" name="selection" value="1" defaultChecked={!p || p.pick === "1"} /> 1 — domicile</label>
          <label><input type="radio" name="selection" value="N" defaultChecked={p?.pick === "N" || p?.pick === "X"} /> Nul</label>
          <label><input type="radio" name="selection" value="2" defaultChecked={p?.pick === "2"} /> 2 — extérieur</label>
          <label><input type="radio" name="selection" value="Over" /> Plus de</label>
          <label><input type="radio" name="selection" value="Under" /> Moins de</label>
          <label><input type="radio" name="selection" value="BTTS-Oui" /> BTTS oui</label>
          <label><input type="radio" name="selection" value="BTTS-Non" /> BTTS non</label>
        </fieldset>
        <div className="prono-grid">
          <label>Ligne (total ou handicap)
            <input name="line" placeholder="2.5 ou -1" />
          </label>
          <label>Chance estimée (%)
            <input name="chance" type="number" min="1" max="99" defaultValue={p?.odd?.replace("%", "") || ""} placeholder="58" />
          </label>
        </div>
        <p className="muted">Confiance (étoiles)</p>
        <div className="star-row">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n}>
              <input type="radio" name="confidence" value={String(n)} defaultChecked={(p?.confidence || "3") === String(n) || n === 3} />
              <span>{"★".repeat(n)}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="prono-block">
        <h2>Analyse</h2>
        <p className="muted">Le texte que le membre voit après avoir voté : pourquoi ce choix, en quelques phrases.</p>
        <label>
          <textarea name="rationale" rows={8} defaultValue={p?.rationale} required placeholder="Forme, contexte, ce qui pèse pour ce choix." />
        </label>
        <label style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          <input type="checkbox" name="isPaid" defaultChecked={p?.isPaid} style={{ width: "auto" }} /> Ticket premium
        </label>
      </section>

      <details className="prono-block">
        <summary>Paramètres avancés</summary>
        <p className="muted">Unité = taille de mise interne (0.5, 1, 2). Pas affiché au public tant que tu ne le décides pas.</p>
        <label>Unités<input name="stakeUnits" defaultValue={p?.stakeUnits || "1"} /></label>
      </details>

      <div className="admin-actions">
        <button className="btn" type="submit">{submitLabel}</button>
        <Link className="btn ghost" href={adminHref("predictions")}>Annuler</Link>
      </div>
    </form>
  );
}
