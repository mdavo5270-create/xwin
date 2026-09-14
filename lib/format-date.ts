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

export function formatKickoff(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: DISPLAY_TZ,
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
