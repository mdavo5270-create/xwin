# Sécurité

## Interdit dans Git

- Fichiers `.env` réels
- Clés API, tokens GitHub/Vercel, clés Stripe secrètes
- Certificats, PEM, service accounts

## Contrôles en place dans le dépôt

- `.gitignore` étendu
- `.env.example` sans valeurs secrètes
- Dependabot (`/.github/dependabot.yml`)
- CI avec `permissions: contents: read` uniquement
- Ruleset de branche `main` (PR + pas de force-push)

## Contrôles GitHub natifs à vérifier dans l'UI

Certains réglages (secret scanning avancé, dependency review obligatoire, GitHub Environments avec reviewers) dépendent du plan (Free personnel vs Team/Enterprise) et ne sont pas tous exposés au connecteur.

Activer si disponible :

- Secret scanning + push protection
- Dependabot alerts + security updates
- Private vulnerability reporting
