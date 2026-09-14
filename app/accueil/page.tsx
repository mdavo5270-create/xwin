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
  const comps = [...new Map(open.map((m) => [m.competition || m.sport, m])).values()].slice(0, 4);
  const now = Date.now();
  const live = open.filter((m) => {
    const t = new Date(m.kickoff).getTime();
    return Number.isFinite(t) && t <= now && now - t < 3 * 60 * 60 * 1000;
  }).length;
  const name = member?.name || "Invité";

  return (
    <div className="hub">
      <header className="hub-top">
        <div className="hub-ava" aria-hidden>☺</div>
        <div className="hub-who">
          <strong>{name}</strong>
          <span>Profil personnel</span>
        </div>
        <Link className="hub-ico" href="/contact" aria-label="Messages">✉</Link>
        <Link className="hub-ico" href={member ? "/app/settings" : "/connexion"} aria-label="Réglages">⚙</Link>
      </header>

      <nav className="hub-tabs">
        <Link className="on" href="/accueil">Marche</Link>
        <Link href="/pronostics">Sports</Link>
        <Link href="/montantes">Montante</Link>
        <Link href="/service">Stratégie</Link>
        <Link href="/premium">Autre</Link>
      </nav>

      <div className="hub-list">
        {comps.map((m) => (
          <Link className="hub-row" key={m.key} href={`/sports/${m.sport}`}>
            <span className="hub-mark">●</span>
            <span><strong>{m.competition || m.sport}</strong></span>
          </Link>
        ))}
        <Link className="hub-row" href="/pronostics">
          <span className="hub-mark">⏱</span>
          <span>
            <strong>EN DIRECT</strong>
            <em>{live ? `${live} événement${live > 1 ? "s" : ""} en cours` : "Les événements en cours"}</em>
          </span>
        </Link>
        <Link className="hub-row" href="/pronostics">
          <span className="hub-mark">📅</span>
          <span>
            <strong>Avant-match</strong>
            <em>Les événements à venir</em>
          </span>
        </Link>
        <Link className="hub-row" href="/sports/esport-lol">
          <span className="hub-mark">🎮</span>
          <span>
            <strong>E-sport</strong>
            <em>LoL, CS, Valorant, Dota</em>
          </span>
        </Link>
        <Link className="hub-row" href="/pronostics">
          <span className="hub-mark">🏆</span>
          <span><strong>Plus de sports</strong></span>
        </Link>
        <Link className="hub-row" href="/resultats">
          <span className="hub-mark">↓</span>
          <span><strong>Résultats</strong></span>
        </Link>
      </div>
    </div>
  );
}
