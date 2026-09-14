# XWIN

Bureau d'analyse sportive — pronostics, montantes, historique public des résultats.

## Portails

- **Public** — `/` `/pronostics` `/montantes` `/premium` `/resultats` `/analyses`
  `/connexion` `/inscription` `/mot-de-passe-oublie`
- **Membre** (`xwin_member`, cookie signé) — `/app` : favoris, abonnement, profil,
  notifications
- **Admin** — jamais à `/admin` en clair (toujours 404). Chemin réel défini par
  `ADMIN_PATH` (ex: `/backoffice-x7f2`) : création des pronos (match, pick,
  pourquoi, cote, confiance) et des montantes (paliers, cadence, prix)

Aucun match fictif n'est préchargé. Le public est vide tant que l'admin n'a rien publié.

## Production — variables à mettre dans Vercel

Voir `.env.example` pour le détail de chaque variable. Au minimum :

1. `ADMIN_SECRET` — mot de passe équipe (12+ caractères)
2. `DATABASE_URL` — base persistante (Neon / Vercel Postgres), **obligatoire**
   dès que tu publies pour de vrai : le store en mémoire se vide au redeploy
3. `ADMIN_PATH` — chemin secret du back-office
4. `NEXT_PUBLIC_SITE_URL` — domaine réel (sitemap, robots.txt, liens email)
5. `RESEND_API_KEY` — optionnel, active l'envoi réel des emails de
   réinitialisation de mot de passe (sinon le lien s'affiche directement)
6. Stripe plus tard pour l'encaissement des montantes

## Local

```bash
cp .env.example .env.local
# ADMIN_SECRET=change-me-now
npm install
npm run dev
```

## Vérifier avant de pousser

```bash
npm run typecheck
npm run build
```
