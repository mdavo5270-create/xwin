import Link from "next/link";
import type { Prono } from "@/lib/types";
import { sportLabel } from "@/lib/sports";
import { formatKickoff, formatDateTime } from "@/lib/format-date";

const MARK: Record<string, string> = {
  football: "⚽",
  tennis: "🎾",
  basketball: "🏀",
  hockey: "🏒",
  esports: "🎮",
};

export function FixtureRow({ p }: { p: Prono }) {
  const when = p.kickoff ? formatKickoff(p.kickoff) : formatDateTime(p.createdAt);
  return (
    <Link className="fix" href={`/pronostics/${p.id}`}>
      <span className="fix-mark" aria-hidden>{MARK[p.sport] ?? "•"}</span>
      <span className="fix-when">{when}</span>
      <span className="fix-main">
        <strong>{p.eventName}</strong>
        <em>{sportLabel(p.sport)} · {p.competition}</em>
      </span>
      <span className={p.isPaid ? "badge pay" : "badge"}>{p.isPaid ? "Premium" : "Gratuit"}</span>
    </Link>
  );
}
