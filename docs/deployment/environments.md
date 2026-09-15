# Environnements

| Nom | Usage | Source | Secrets |
| --- | --- | --- | --- |
| Development | Machine locale | `.env.local` (non committé) | Dev uniquement |
| Preview / Staging | Deploy preview Netlify (PR / branches) | Dashboard Netlify — contexte Deploy Preview | Variables Preview |
| Production | Branche `main` | Site Netlify `xxwin` | Variables Production uniquement |

Règle : ne jamais réutiliser les credentials de production en développement ou preview.

Les variables Stripe, base de données et tokens d'auth vont dans le dashboard Netlify (`xxwin`) et dans GitHub Actions (crons), pas dans ce dépôt.
