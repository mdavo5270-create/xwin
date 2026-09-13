# Environnements

| Nom | Usage | Source | Secrets |
| --- | --- | --- | --- |
| Development | Machine locale | `.env.local` (non committé) | Dev uniquement |
| Preview / Staging | Chaque Pull Request | Vercel Preview | Variables Preview |
| Production | Branche `main` | Vercel Production | Variables Production uniquement |

Règle : ne jamais réutiliser les credentials de production en développement ou preview.

Les variables Stripe, base de données et tokens d'auth iront dans le dashboard Vercel (et GitHub Environments plus tard), pas dans ce dépôt.
