/**
 * Formatage de dates déterministe pour les Server Components.
 *
 * `Date.prototype.toLocaleString("fr-FR")` sans `timeZone` explicite utilise
 * le fuseau horaire du runtime qui l'exécute. Sur Vercel le serveur tourne
 * en UTC ; dans le navigateur du visiteur c'est son fuseau local. Pour la
 * même Date, ça donne deux chaînes différentes -> mismatch d'hydratation
 * React (le HTML pré-rendu ne correspond pas à ce que le client recalcule).
 *
 * En fixant `timeZone` explicitement, le résultat est identique partout où
 * le code tourne : plus de mismatch possible, sans avoir besoin de
 * suppressHydrationWarning (qui masquerait le symptôme sans l'éliminer).
 */
const DISPLAY_TZ = "Europe/Paris";

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: DISPLAY_TZ,
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: DISPLAY_TZ,
    dateStyle: "short",
  }).format(new Date(iso));
}
