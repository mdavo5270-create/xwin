import Link from "next/link";
import { SPORTS } from "@/lib/sports";
import { adminHref } from "@/lib/admin-path";
import type { Prono } from "@/lib/types";

function splitPick(pick?: string) {
  if (!pick) return { market: "", prono: "" };
  const i = pick.indexOf(" · ");
  if (i === -1) return { market: "", prono: pick };
  return { market: pick.slice(0, i), prono: pick.slice(i + 3) };
}

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
  const { market, prono } = splitPick(p?.pick);
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
        <h2>Marché et pronostic</h2>
        <div className="prono-grid">
          <label>Nom du marché
            <input name="market" list="markets" defaultValue={market} required placeholder="1X2, Plus de 2.5, Handicap -1…" />
            <datalist id="markets">
              <option value="1X2" />
              <option value="Double chance" />
              <option value="Plus de 2.5" />
              <option value="Moins de 2.5" />
              <option value="Les deux équipes marquent" />
              <option value="Handicap asiatique" />
              <option value="Score exact" />
              <option value="Vainqueur" />
            </datalist>
          </label>
          <label>Pronostic
            <input name="selection" defaultValue={prono} required placeholder="1, Nul, 2, Oui, Over 2.5…" />
          </label>
          <label>Chance estimée (%)
            <input name="chance" type="number" min="1" max="99" defaultValue={p?.odd?.replace("%", "") || ""} placeholder="58" />
          </label>
        </div>
        <p className="muted">Confiance (étoiles)</p>
        <div className="star-row">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n}>
              <input type="radio" name="confidence" value={String(n)} defaultChecked={String(p?.confidence || "3") === String(n)} />
              <span>{"★".repeat(n)}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="prono-block">
        <h2>Analyse</h2>
        <p className="muted">Le texte que le membre voit après avoir voté.</p>
        <label>
          <textarea name="rationale" rows={8} defaultValue={p?.rationale} required placeholder="Forme, contexte, ce qui pèse pour ce choix." />
        </label>
        <label style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          <input type="checkbox" name="isPaid" defaultChecked={p?.isPaid} style={{ width: "auto" }} /> Ticket premium
        </label>
      </section>

      <details className="prono-block">
        <summary>Paramètres avancés</summary>
        <p className="muted">Unité = taille de mise interne. Pas affiché au public.</p>
        <label>Unités<input name="stakeUnits" defaultValue={p?.stakeUnits || "1"} /></label>
      </details>

      <div className="admin-actions">
        <button className="btn" type="submit">{submitLabel}</button>
        <Link className="btn ghost" href={adminHref("predictions")}>Annuler</Link>
      </div>
    </form>
  );
}
