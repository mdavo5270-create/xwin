# Vercel

## Objectif

```
GitHub PR  → Vercel Preview
GitHub main → Vercel Production
```

## État actuel

Le connecteur Vercel est authentifié mais **aucune team Vercel** n'est disponible (`list_teams` → liste vide).  
`create_git_project` exige un `teamId`. L'association GitHub ↔ Vercel n'a donc **pas pu être créée automatiquement**.

## À faire manuellement (une fois une team Hobby/Pro existante)

1. Créer ou sélectionner une team Vercel.
2. Importer `mdavo5270-create/xwin`.
3. Production branch = `main`.
4. Activer les Preview Deployments sur les PRs.
5. Définir les env vars par environnement (Preview vs Production).

## Free tier — limites à surveiller

- Bandwidth et build minutes du plan Hobby
- Cold starts / limites serverless
- Protection des déploiements selon le plan

Passer Pro quand le trafic, les previews concurrentes ou les exigences de sécurité dépassent Hobby.
