export const SPORTS = [
  { slug: "football", label: "Football" },
  { slug: "basketball", label: "Basketball" },
  { slug: "tennis", label: "Tennis" },
  { slug: "rugby", label: "Rugby" },
  { slug: "formula-1", label: "Formule 1" },
  { slug: "mma", label: "MMA" },
  { slug: "volleyball", label: "Volley" },
  { slug: "handball", label: "Handball" },
  { slug: "esport-lol", label: "Esport — LoL" },
  { slug: "esport-cs", label: "Esport — CS" },
  { slug: "esport-valorant", label: "Esport — Valorant" },
  { slug: "esport-dota", label: "Esport — Dota" },
] as const;

export type SportSlug = (typeof SPORTS)[number]["slug"];

export function sportLabel(slug: string) {
  return SPORTS.find((s) => s.slug === slug)?.label ?? slug;
}
