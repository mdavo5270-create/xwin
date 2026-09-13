# XWIN

Deux portails :

- Public : `/` `/pronos` `/sports/[section]` `/montantes`
- Admin : `/admin` — création des pronos (match, pick, pourquoi) et des montantes (paliers, cadence, prix)

Aucun match fictif n’est préchargé. Le public est vide tant que l’admin n’a rien publié.

## Production — à mettre dans Vercel

1. `ADMIN_SECRET` — mot de passe équipe (12+ caractères)
2. Base persistante (Neon / Vercel Postgres) — **obligatoire** dès que tu publies pour de vrai : le store actuel vit en mémoire serveur et se vide au redeploy.
3. Stripe plus tard pour l’encaissement des montantes.

## Local

```bash
cp .env.example .env.local
# ADMIN_SECRET=change-me-now
npm install
npm run dev
```
