import Link from "next/link";
import { SPORTS } from "@/lib/sports";
import { SportIcon } from "./SportIcon";

export function SportTiles({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="sport-tiles">
      {SPORTS.map((sport) => {
        const count = counts[sport.slug] ?? 0;
        const active = count > 0;
        const content = (
          <>
            <SportIcon slug={sport.slug} className="sport-tile-mark" />
            <span className="sport-tile-label">{sport.label}</span>
            <span className="sport-tile-count">{active ? `${count} match${count > 1 ? "s" : ""}` : "Aucun match"}</span>
          </>
        );
        return active ? (
          <Link key={sport.slug} className="sport-tile" href={`/sports/${sport.slug}`}>{content}</Link>
        ) : (
          <div key={sport.slug} className="sport-tile disabled" aria-disabled="true">{content}</div>
        );
      })}
    </div>
  );
}
