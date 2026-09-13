/** Chemin public du back-office. Jamais /admin en clair. */
export function adminBase(): string {
  const raw = process.env.ADMIN_PATH || "";
  if (!raw.startsWith("/") || raw === "/" || raw.startsWith("/admin")) return "";
  return raw.replace(/\/+$/, "");
}

export function adminHref(path = ""): string {
  const base = adminBase();
  if (!base) return "/404";
  const rest = path.replace(/^\//, "");
  return rest ? `${base}/${rest}` : base;
}
