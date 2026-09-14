import Link from "next/link";
import { getMember } from "@/lib/members";
import { listPublishedPronos } from "@/lib/store";
import { groupMatches } from "@/lib/matches";
import { ensureSchema } from "@/lib/schema";
import "../hub.css";

export const dynamic = "force-dynamic";

export default async function AccueilPage() {
  await ensureSchema();
  const member = await getMember();
  const all = await listPublishedPronos();
  const open = groupMatches(all.filter((p) => p.result === "pending"));
  const now = Date.now();
  const live = open.filter((m) => {
    const t = new Date(m.kickoff).getTime();
    return Number.isFinite(t) && t <= now && now - t < 3 * 60 * 60 * 1000;
  }).length;
  const soon = open.length;
  const foot = open.filter((m) => m.sport === "football").length;
  const esport = open.filter((m) => m.sport.startsWith("esport")).length;
  const name = member?.name || "Invité";

  return (
    <div className="hub">
      <header className="hub-top">
        <div className="hub-ava" aria-hidden>☺</div>
        <div className="hub-who">
          <strong>{name}</strong>
          <span>{member ? "Profil personnel" : "Pas encore connecté"}</span>
        </div>
        <Link className="hub-ico" href="/contact" aria-label="Messages">✉</Link>
        <Link className="hub-ico" href={member ? "/app/settings" : "/connexion"} aria-label="Réglages">
          ⚙{!member ? <i className="hub-dot" /> : null}
        </Link>
      </header>

      <div className="hub-money">
        <div className="hub-bal">0 F</div>
        <button className="hub-dep" type="button" disabled title="Paiement pas encore activé">+ Déposer</button>
      </div>

      <nav className="hub-tabs">
        <Link className="on" href="/accueil">Populaires</Link>
        <Link href="/pronostics">Sports</Link>
        <Link href="/pronostics">Pronos</Link>
        <Link href="/premium">Offres</Link>
        <Link href="/service">Autre</Link>
      </nav>

      <div className="hub-list">
        <Link className="hub-row" href="/sports/football">
          <span className="hub-mark">⚽</span>
          <span><strong>Football</strong><em>{foot} match{foot > 1 ? "s" : ""} ouvert{foot > 1 ? "s" : ""}</em></span>
        </Link>
        <Link className="hub-row" href="/pronostics">
          <span className="hub-mark">⏱</span>
          <span><strong>En direct</strong><em>{live ? `${live} événement${live > 1 ? "s" : ""} en cours` : "Aucun événement en cours"}</em></span>
        </Link>
        <Link className="hub-row" href="/pronostics">
          <span className="hub-mark">📅</span>
          <span><strong>Avant-match</strong><em>{soon} match{soon > 1 ? "s" : ""} à venir</em></span>
        </Link>
        <Link className="hub-row" href="/sports/esport-lol">
          <span className="hub-mark">🎮</span>
          <span><strong>E-sport</strong><em>{esport ? `${esport} tickets` : "LoL, CS, Valorant"}</em></span>
        </Link>
        <Link className="hub-row" href="/montantes">
          <span className="hub-mark">↑</span>
          <span><strong>Montantes</strong><em>Paliers à cadence fixe</em></span>
        </Link>
        <Link className="hub-row" href="/premium">
          <span className="hub-mark">★</span>
          <span><strong>Premium</strong><em>Programme club — paiement off</em></span>
        </Link>
        <Link className="hub-row" href="/service">
          <span className="hub-mark">⚙</span>
          <span><strong>Service</strong><em>Méthodes à part</em></span>
        </Link>
      </div>

      <nav className="hub-bar">
        <Link className="on" href="/accueil">Populaire</Link>
        <Link href={member ? "/app" : "/connexion"}>Favoris</Link>
        <Link href="/pronostics"><span className="hub-pill">🎫</span>Pronos</Link>
        <Link href="/resultats">Historique</Link>
        <Link href={member ? "/app" : "/connexion"}>Menu</Link>
      </nav>
    </div>
  );
}
