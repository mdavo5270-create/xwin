// Source unique pour l'URL publique du site.
// Utilise NEXT_PUBLIC_SITE_URL si défini (recommandé en prod),
// sinon retombe sur le domaine Netlify actuel — plus aucune trace
// des anciens déploiements (Vercel, xwin-q9ze) codée en dur.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xxwin.netlify.app";
