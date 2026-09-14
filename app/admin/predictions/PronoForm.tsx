"use client";

import { useMemo, useState } from "react";
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

type Ticket = { market: string; selection: string; chance: string; confidence: string; rationale: string; paid: boolean };

function emptyTicket(): Ticket {
  return { market: "", selection: "", chance: "", confidence: "3", rationale: "", paid: false };
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
  const first = splitPick(p?.pick);
  const editing = Boolean(p?.id);
  const initial = useMemo<Ticket[]>(() => [{
    market: first.market,
    selection: first.prono,
    chance: p?.odd?.replace("%", "") || "",
    confidence: p?.confidence || "3",
    rationale: p?.rationale || "",
    paid: Boolean(p?.isPaid),
  }], [first.market, first.prono, p?.odd, p?.confidence, p?.rationale, p?.isPaid]);
  const [tickets, setTickets] = useState<Ticket[]>(initial);

  function update(i: number, patch: Partial<Ticket>) {
    setTickets((rows) => rows.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  return (
    <form action={action} className="prono-form">
      {editing ? <input type="hidden" name="id" value={p!.id} /> : null}

      <section className="prono-block">
        <h2>Match</h2>
        <p className="muted">Une seule fois. Tous les tickets ci-dessous partagent ce match.</p>
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

      {tickets.map((t, i) => (
        <section className="prono-block" key={i}>
          <h2>Ticket {i + 1}</h2>
          <div className="prono-grid">
            <label>Nom du marché
              <input name="market" list="markets" value={t.market} onChange={(e) => update(i, { market: e.target.value })} required placeholder="1X2, Plus de 2.5…" />
            </label>
            <label>Pronostic
              <input name="selection" value={t.selection} onChange={(e) => update(i, { selection: e.target.value })} required placeholder="1, Nul, Over 2.5…" />
            </label>
            <label>Chance estimée (%)
              <input name="chance" type="number" min="1" max="99" value={t.chance} onChange={(e) => update(i, { chance: e.target.value })} placeholder="58" />
            </label>
          </div>
          <p className="muted">Confiance</p>
          <div className="star-row">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n}>
                <input type="radio" name={`confidence_${i}`} value={String(n)} checked={t.confidence === String(n)} onChange={() => update(i, { confidence: String(n) })} />
                <span>{"★".repeat(n)}</span>
              </label>
            ))}
            <input type="hidden" name="confidence" value={t.confidence} />
          </div>
          <label>Analyse de ce ticket
            <textarea name="rationale" rows={4} value={t.rationale} onChange={(e) => update(i, { rationale: e.target.value })} required placeholder="Pourquoi ce choix." />
          </label>
          <label style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
            <input type="checkbox" checked={t.paid} onChange={(e) => update(i, { paid: e.target.checked })} style={{ width: "auto" }} />
            Ticket premium
          </label>
          {t.paid ? <input type="hidden" name="paid" value={String(i)} /> : <input type="hidden" name="paid" value="" />}
          {!editing && tickets.length > 1 ? (
            <button className="btn ghost" type="button" onClick={() => setTickets((rows) => rows.filter((_, idx) => idx !== i))}>Retirer ce ticket</button>
          ) : null}
        </section>
      ))}

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

      {!editing ? (
        <div className="admin-actions">
          <button className="btn ghost" type="button" onClick={() => setTickets((rows) => [...rows, emptyTicket()])}>Ajouter un ticket</button>
        </div>
      ) : null}

      <details className="prono-block">
        <summary>Paramètres avancés</summary>
        <label>Unités (tous les tickets)<input name="stakeUnits" defaultValue={p?.stakeUnits || "1"} /></label>
      </details>

      <div className="admin-actions">
        <button className="btn" type="submit">{submitLabel}</button>
        <Link className="btn ghost" href={adminHref("predictions")}>Annuler</Link>
      </div>
    </form>
  );
}
