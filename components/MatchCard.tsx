import Link from "next/link";
import { sportLabel } from "@/lib/sports";
import { formatKickoff, formatDateTime } from "@/lib/format-date";
import { scoreLabel, type MatchGroup } from "@/lib/matches";
import { SportIcon } from "./SportIcon";

export function MatchCard({ m }: { m: MatchGroup }) {
  const when = m.kickoff ? formatKickoff(m.kickoff) : formatDateTime(m.kickoff);
  return (
    <Link className="fix" href={`/pronostics/m/${m.slug}`}>
      <SportIcon slug={m.sport} className="fix-mark" />
      <span className="fix-when">{when}</span>
      <span className="fix-main">
        <strong>{m.eventName}</strong>
        <em>{sportLabel(m.sport)} · {m.competition}</em>
      </span>
      <span className="badge">{scoreLabel(m)}</span>
    </Link>
  );
}
