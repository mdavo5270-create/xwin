/**
 * Envoi d'email minimal via l'API Resend (simple appel HTTPS, pas de
 * dépendance npm à ajouter). Inactif tant que RESEND_API_KEY n'est pas
 * configurée sur Vercel — dans ce cas `sendMail` renvoie { sent: false }
 * et l'appelant doit prévoir un repli (ex: afficher le lien directement).
 */
export async function sendMail(to: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false as const };
  const from = process.env.MAIL_FROM || "XWIN <onboarding@resend.dev>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, text }),
    });
    return { sent: res.ok };
  } catch {
    return { sent: false as const };
  }
}
