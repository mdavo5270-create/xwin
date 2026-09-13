# Coût et scalabilité

## Démarrage (budget minimal)

- GitHub Free (dépôt privé) : issues, PRs, Actions dans les quotas mensuels
- GitHub Actions : minutes gratuites du plan ; CI volontairement légère
- Vercel Hobby : previews + production pour un trafic faible

Gratuit ≠ bricolé : mêmes conventions de branche, secrets et environnements qu'en production.

## Quand monter de palier

- Actions : files d'attente, minutes épuisées → plus de runners ou plan Team
- Vercel : bandwidth, builds, besoin de protection SSO / IP
- Base de données et files : services managés dédiés hors free tier
- Conformité UK (paiements, AML/KYC si applicable) : infra et logging renforcés

Le monorepo n'empêche pas d'extraire l'API ou l'infra plus tard.
