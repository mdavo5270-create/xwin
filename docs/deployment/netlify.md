# Netlify

Hébergeur canonique. Vercel n'est plus utilisé.

## Site production

- Team : `mdavo5270` (`6aa82b8df9910906b173268a`)
- Projet : `xxwin` (`8c446911-1839-46b1-8dc4-c091800b85b4`)
- Dashboard : https://app.netlify.com/projects/xxwin
- Git : `mdavo5270-create/xwin`
- Production branch : `main`
- Production : https://xxwin.netlify.app

```
GitHub PR   → Netlify Deploy Preview
GitHub main → Netlify Production (xxwin.netlify.app)
```

## Ancien site à archiver

- `xwin-q9ze` (`830c3c3c-e3ec-40d7-b8e2-8c9c52efff1e`) — ne plus pointer aucun lien vers ce domaine.

## Config repo

Voir `netlify.toml` : `npm run build` + `@netlify/plugin-nextjs` + Node 20.

## Variables

Dashboard Netlify uniquement, jamais Git. Liste : `.env.example`.

Au moment de la migration, le site `xxwin` n'avait **aucune** variable — à remplir avant le trafic réel.

## Crons

Pas de cron Vercel / Netlify Scheduled Functions.
`.github/workflows/cron.yml` appelle :

- `07:00 UTC` → `/api/cron/pronos?secret=`
- `21:00 UTC` → `/api/cron/daily-recap?secret=`

Secrets GitHub Actions : `SITE_URL`, `CRON_SECRET`.
